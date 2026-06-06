/**
 * Fetches the OpenAPI schema from the staging API and generates a typed
 * endpoints constant file at constants/endpoints.ts.
 *
 * Usage:
 *   npx ts-node scripts/generate-endpoints.ts
 */
/* eslint-disable no-console */
import https from 'https';
import http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const API_BASE_URL = process.env.API_BASE_URL?.replace(/\/$/, '') ?? 'https://bgshop.work.gd';
const SCHEMA_URL = `${API_BASE_URL}/api/schema/`;
const OUT_FILE = path.resolve(__dirname, '../constants/api-endpoints.ts');

interface OpenApiSchema {
  paths: Record<string, Record<string, { operationId?: string; tags?: string[] }>>;
}

function fetchSchema(url: string): Promise<OpenApiSchema> {
  const client = url.startsWith('https') ? https : http;
  return new Promise((resolve, reject) => {
    client
      .get(url, (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (d: Buffer) => chunks.push(d));
        res.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString()) as OpenApiSchema));
        res.on('error', reject);
      })
      .on('error', reject);
  });
}

function toConstName(str: string): string {
  return str
    .replace(/[{}]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase();
}

function groupByTag(schema: OpenApiSchema): Record<string, Record<string, string>> {
  const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'];
  const groups: Record<string, Record<string, string>> = {};

  for (const [urlPath, operations] of Object.entries(schema.paths)) {
    for (const [method, op] of Object.entries(operations)) {
      if (!HTTP_METHODS.includes(method)) continue;

      const tag = (op.tags?.[0] ?? 'General').replace(/\s+/g, '_').toUpperCase();
      const name = `${method.toUpperCase()}_${toConstName(urlPath)}`;

      if (!groups[tag]) groups[tag] = {};
      // Store as function if path has params, else plain string
      const hasParam = urlPath.includes('{');
      if (hasParam) {
        const paramName = urlPath.match(/\{(\w+)\}/)?.[1] ?? 'id';
        groups[tag][name] =
          `(${paramName}: string | number) => \`${urlPath.replace(/\{(\w+)\}/, `\${${paramName}}`)}\``;
      } else {
        groups[tag][name] = `'${urlPath}'`;
      }
    }
  }
  return groups;
}

async function main(): Promise<void> {
  console.log(`Fetching schema from ${SCHEMA_URL}...`);
  const schema = await fetchSchema(SCHEMA_URL);
  const paths = Object.keys(schema.paths);
  console.log(`Found ${paths.length} paths\n`);

  // Print all endpoints to console
  const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'];
  for (const [urlPath, ops] of Object.entries(schema.paths).sort()) {
    for (const method of Object.keys(ops).filter((m) => HTTP_METHODS.includes(m))) {
      console.log(`${method.toUpperCase().padEnd(8)} ${urlPath}`);
    }
  }

  // Generate grouped endpoints constant
  const groups = groupByTag(schema);
  const lines: string[] = [
    '// AUTO-GENERATED from OpenAPI schema — do not edit manually',
    `// Source: ${SCHEMA_URL}`,
    `// Generated: ${new Date().toISOString()}`,
    '',
    'export const API_ENDPOINTS = {',
  ];

  for (const [tag, endpoints] of Object.entries(groups).sort()) {
    lines.push(`  // ${tag}`);
    for (const [name, value] of Object.entries(endpoints).sort()) {
      lines.push(`  ${name}: ${value},`);
    }
    lines.push('');
  }
  lines.push('} as const;');

  fs.writeFileSync(OUT_FILE, lines.join('\n'));
  console.log(`\nWritten to constants/api-endpoints.ts`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
