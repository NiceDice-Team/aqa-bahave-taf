/**
 * Validates that all endpoints used in adapters exist in the generated API_ENDPOINTS.
 *
 * This script:
 * 1. Parses the generated api-endpoints.ts file
 * 2. Scans all adapter files for endpoint references
 * 3. Cross-references: ensures all used endpoints exist in the generated schema
 * 4. Reports mismatches with context
 * 5. Exits with code 1 if critical mismatches found
 *
 * Usage:
 *   npx ts-node scripts/validate-endpoints.ts
 *   npx ts-node scripts/validate-endpoints.ts --verbose
 */
/* eslint-disable no-console */
import * as fs from 'fs';
import * as path from 'path';

interface ValidationResult {
  valid: boolean;
  generatedEndpoints: Set<string>;
  usedEndpoints: Map<string, string[]>; // endpoint => [files that use it]
  missingEndpoints: Map<string, string[]>;
  unusedEndpoints: string[];
  errors: string[];
}

const verbose = process.argv.includes('--verbose');
const projectRoot = path.resolve(__dirname, '..');
const ENDPOINTS_FILE = path.join(projectRoot, 'constants', 'api-endpoints.ts');
const ADAPTERS_DIR = path.join(projectRoot, 'adapters');

// ─────────────────────────────────────────────────────────────────────────────
// Recursively find adapter files
// ─────────────────────────────────────────────────────────────────────────────
function findAdapterFiles(dir: string): string[] {
  const files: string[] = [];

  function walk(currentDir: string): void {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith('.adapter.ts')) {
        files.push(fullPath);
      }
    }
  }

  if (fs.existsSync(dir)) {
    walk(dir);
  }
  return files;
}

// ─────────────────────────────────────────────────────────────────────────────
// Parse generated endpoints
// ─────────────────────────────────────────────────────────────────────────────
function parseGeneratedEndpoints(filePath: string): Set<string> {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Generated endpoints file not found: ${filePath}`);
    console.error(`   Run: npm run generate:endpoints`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const endpoints = new Set<string>();

  // Match patterns like:
  //   ENDPOINT_NAME: '/path' or
  //   ENDPOINT_NAME: (param: type) => `/path`
  const pattern = /^\s*([A-Z_0-9]+):\s*(?:\(|\S)/gm;
  let match;

  while ((match = pattern.exec(content)) !== null) {
    endpoints.add(match[1]);
  }

  return endpoints;
}

// ─────────────────────────────────────────────────────────────────────────────
// Parse adapter files for endpoint usage
// ─────────────────────────────────────────────────────────────────────────────
function parseAdapterEndpoints(filePath: string): { endpoints: string[]; rawRefs: string[] } {
  const content = fs.readFileSync(filePath, 'utf-8');
  const endpoints: string[] = [];
  const rawRefs: string[] = [];

  // 1. Match ENDPOINTS.* references (manual constants)
  //    e.g., ENDPOINTS.AUTH.LOGIN, ENDPOINTS.CART.ADD
  const endpointsPattern = /ENDPOINTS\.([A-Z_]+)\.([A-Z_0-9]+)/g;
  let match;

  while ((match = endpointsPattern.exec(content)) !== null) {
    const ref = `${match[1]}.${match[2]}`;
    rawRefs.push(ref);
  }

  // 2. Match API_ENDPOINTS.* references (generated)
  //    e.g., API_ENDPOINTS.GET_API_PRODUCTS_ID, API_ENDPOINTS.POST_API_AUTH_LOGIN
  const apiEndpointsPattern = /API_ENDPOINTS\.([A-Z_0-9]+)/g;

  while ((match = apiEndpointsPattern.exec(content)) !== null) {
    endpoints.push(match[1]);
  }

  // 3. Match inline endpoint strings (hard-coded paths)
  //    e.g., '/api/auth/guest', '/api/cart/items'
  const inlinePattern = /'(\/[a-z0-9/_\-${}]*)'|"(\/[a-z0-9/_\-${}]*)"|`(\/[a-z0-9/_\-${}]*)`/g;

  while ((match = inlinePattern.exec(content)) !== null) {
    const inlinePath = match[1] || match[2] || match[3];
    if (inlinePath && inlinePath.includes('api')) {
      rawRefs.push(`[inline] ${inlinePath}`);
    }
  }

  return { endpoints, rawRefs };
}

// ─────────────────────────────────────────────────────────────────────────────
// Get all adapter files
// ─────────────────────────────────────────────────────────────────────────────
function getAdapterFiles(): string[] {
  return findAdapterFiles(ADAPTERS_DIR);
}

// ─────────────────────────────────────────────────────────────────────────────
// Main validation
// ─────────────────────────────────────────────────────────────────────────────
function validateEndpoints(): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    generatedEndpoints: new Set(),
    usedEndpoints: new Map(),
    missingEndpoints: new Map(),
    unusedEndpoints: [],
    errors: [],
  };

  // Parse generated endpoints
  console.log(`📋 Parsing generated endpoints from ${path.relative(projectRoot, ENDPOINTS_FILE)}...`);
  result.generatedEndpoints = parseGeneratedEndpoints(ENDPOINTS_FILE);
  console.log(`   ✅ Found ${result.generatedEndpoints.size} endpoints\n`);

  if (result.generatedEndpoints.size === 0) {
    result.errors.push('No endpoints found in generated file. Schema may be empty.');
    result.valid = false;
    return result;
  }

  // Parse adapter files
  console.log(`🔍 Scanning adapter files...`);
  const adapterFiles = getAdapterFiles();
  console.log(`   Found ${adapterFiles.length} adapter files\n`);

  for (const adapterFile of adapterFiles) {
    const fileName = path.relative(projectRoot, adapterFile);
    if (verbose) console.log(`   Parsing ${fileName}...`);

    try {
      const { endpoints, rawRefs } = parseAdapterEndpoints(adapterFile);

      // Track used endpoints
      for (const endpoint of endpoints) {
        if (!result.usedEndpoints.has(endpoint)) {
          result.usedEndpoints.set(endpoint, []);
        }
        result.usedEndpoints.get(endpoint)!.push(fileName);
      }

      // Report inline/manual endpoints (for awareness)
      if (verbose && rawRefs.length > 0) {
        console.log(`      ⚠️  Manual references: ${rawRefs.slice(0, 3).join(', ')}`);
      }
    } catch (err) {
      result.errors.push(`Error parsing ${fileName}: ${String(err)}`);
    }
  }

  // Cross-reference: find missing endpoints
  console.log(`\n✔️  Cross-referencing endpoints...`);
  for (const [endpoint, files] of result.usedEndpoints) {
    if (!result.generatedEndpoints.has(endpoint)) {
      result.missingEndpoints.set(endpoint, files);
      result.valid = false;
    }
  }

  // Find unused endpoints
  for (const endpoint of result.generatedEndpoints) {
    if (!result.usedEndpoints.has(endpoint)) {
      result.unusedEndpoints.push(endpoint);
    }
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Report results
// ─────────────────────────────────────────────────────────────────────────────
function reportResults(result: ValidationResult): void {
  console.log('\n' + '═'.repeat(80));
  console.log('API CONTRACT VALIDATION REPORT');
  console.log('═'.repeat(80) + '\n');

  // Summary
  console.log('📊 SUMMARY');
  console.log(`   Generated endpoints:  ${result.generatedEndpoints.size}`);
  console.log(`   Used endpoints:       ${result.usedEndpoints.size}`);
  console.log(`   Unused endpoints:     ${result.unusedEndpoints.length}`);
  console.log(`   Missing endpoints:    ${result.missingEndpoints.size}`);
  console.log(`   Errors:               ${result.errors.length}\n`);

  // Errors
  if (result.errors.length > 0) {
    console.log('❌ ERRORS');
    for (const error of result.errors) {
      console.log(`   ${error}`);
    }
    console.log('');
  }

  // Missing endpoints (CRITICAL)
  if (result.missingEndpoints.size > 0) {
    console.log('❌ CRITICAL: Missing Endpoints');
    console.log('   These endpoints are used in adapters but NOT found in generated schema:');
    for (const [endpoint, files] of result.missingEndpoints) {
      console.log(`\n   • ${endpoint}`);
      for (const file of files) {
        console.log(`     └─ used in: ${file}`);
      }
    }
    console.log('\n   ACTION: Run `npm run generate:endpoints` to refresh the schema, or update adapters.');
    console.log('');
  }

  // Unused endpoints (WARNING)
  if (result.unusedEndpoints.length > 0 && verbose) {
    console.log('⚠️  UNUSED ENDPOINTS (Not used in adapters)');
    const sample = result.unusedEndpoints.slice(0, 10);
    for (const endpoint of sample) {
      console.log(`   • ${endpoint}`);
    }
    if (result.unusedEndpoints.length > 10) {
      console.log(`   ... and ${result.unusedEndpoints.length - 10} more`);
    }
    console.log('');
  }

  // Status
  console.log(result.valid ? '✅ VALIDATION PASSED' : '❌ VALIDATION FAILED');
  console.log('═'.repeat(80) + '\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  try {
    const result = validateEndpoints();
    reportResults(result);

    if (!result.valid) {
      console.error('⛔ Contract validation failed. Fix issues above and try again.');
      process.exit(1);
    }

    console.log('✨ All checks passed. API contract is valid.');
    process.exit(0);
  } catch (err) {
    console.error('💥 Unexpected error during validation:', err);
    process.exit(1);
  }
}

void main();
