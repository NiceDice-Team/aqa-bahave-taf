/**
 * Runtime API contract monitor.
 *
 * Fetches the live OpenAPI schema and compares it against the generated
 * api-endpoints.ts to detect contract drift during test runs.
 *
 * Usage (in test setup):
 *   import { contractMonitor } from '../helpers/contract-monitor';
 *   const report = await contractMonitor.compareSchemas();
 *   if (!report.matches) console.warn('Schema drift detected', report);
 */
import https from 'https';
import http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { config } from '../config/environment';

export interface EndpointAvailability {
  endpoint: string;
  method: string;
  available: boolean;
  statusCode: number;
  error?: string;
}

export interface SchemaVersion {
  timestamp: string;
  hash: string;
  endpointCount: number;
  source: string;
}

export interface SchemaDiff {
  matches: boolean;
  added: string[]; // in live schema but NOT in generated file
  removed: string[]; // in generated file but NOT in live schema
  generatedCount: number;
  liveCount: number;
  checkedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

interface OpenApiPath {
  [method: string]: { operationId?: string; tags?: string[] };
}

function fetchJson<T>(url: string): Promise<T> {
  const client = url.startsWith('https') ? https : http;
  return new Promise((resolve, reject) => {
    const req = client.get(url, { timeout: 10000 }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (d: Buffer) => chunks.push(d));
      res.on('end', () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString()) as T);
        } catch (e) {
          reject(new Error(`Failed to parse JSON from ${url}: ${String(e)}`));
        }
      });
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request to ${url} timed out`));
    });
  });
}

function toConstName(method: string, urlPath: string): string {
  const cleanPath = urlPath
    .replace(/[{}]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase();
  return `${method.toUpperCase()}_${cleanPath}`;
}

function simpleHash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(16);
}

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'];

function extractEndpointsFromSchema(paths: Record<string, OpenApiPath>): Set<string> {
  const endpoints = new Set<string>();
  for (const [urlPath, ops] of Object.entries(paths)) {
    for (const method of Object.keys(ops).filter((m) => HTTP_METHODS.includes(m))) {
      endpoints.add(toConstName(method, urlPath));
    }
  }
  return endpoints;
}

function extractEndpointsFromGeneratedFile(filePath: string): Set<string> {
  if (!fs.existsSync(filePath)) return new Set();
  const content = fs.readFileSync(filePath, 'utf-8');
  const endpoints = new Set<string>();
  const pattern = /^\s*([A-Z_0-9]+):\s*(?:\(|\S)/gm;
  let match;
  while ((match = pattern.exec(content)) !== null) {
    endpoints.add(match[1]);
  }
  return endpoints;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

const schemaUrl = `${config.apiBaseUrl.replace(/\/$/, '')}/api/schema/`;
const generatedFile = path.resolve(__dirname, '../constants/api-endpoints.ts');

export const contractMonitor = {
  /**
   * Check if a specific endpoint is reachable on the live API.
   * Does a lightweight OPTIONS/HEAD probe — does not send sensitive data.
   */
  async checkEndpointAvailability(endpoint: string, method: string): Promise<EndpointAvailability> {
    const url = `${config.apiBaseUrl.replace(/\/$/, '')}${endpoint}`;
    const client = url.startsWith('https') ? https : http;

    return new Promise((resolve) => {
      const req = client.request(url, { method: 'OPTIONS', timeout: 5000 }, (res) => {
        resolve({
          endpoint,
          method: method.toUpperCase(),
          available: (res.statusCode ?? 0) < 500,
          statusCode: res.statusCode ?? 0,
        });
        res.resume();
      });
      req.on('error', (err) => {
        resolve({
          endpoint,
          method: method.toUpperCase(),
          available: false,
          statusCode: 0,
          error: err.message,
        });
      });
      req.on('timeout', () => {
        req.destroy();
        resolve({
          endpoint,
          method: method.toUpperCase(),
          available: false,
          statusCode: 0,
          error: 'Request timed out',
        });
      });
      req.end();
    });
  },

  /**
   * Fetch the live OpenAPI schema version info (fast — just counts paths).
   */
  async getLiveSchemaVersion(): Promise<SchemaVersion> {
    const schema = await fetchJson<{ paths: Record<string, OpenApiPath> }>(schemaUrl);
    const endpointCount = extractEndpointsFromSchema(schema.paths).size;
    const hash = simpleHash(JSON.stringify(Object.keys(schema.paths).sort()));
    return {
      timestamp: new Date().toISOString(),
      hash,
      endpointCount,
      source: schemaUrl,
    };
  },

  /**
   * Compare live schema endpoints against the generated api-endpoints.ts.
   * Returns a diff report — does NOT throw on drift.
   */
  async compareSchemas(): Promise<SchemaDiff> {
    const schema = await fetchJson<{ paths: Record<string, OpenApiPath> }>(schemaUrl);
    const liveEndpoints = extractEndpointsFromSchema(schema.paths);
    const generatedEndpoints = extractEndpointsFromGeneratedFile(generatedFile);

    const added: string[] = [];
    const removed: string[] = [];

    for (const ep of liveEndpoints) {
      if (!generatedEndpoints.has(ep)) added.push(ep);
    }
    for (const ep of generatedEndpoints) {
      if (!liveEndpoints.has(ep)) removed.push(ep);
    }

    return {
      matches: added.length === 0 && removed.length === 0,
      added,
      removed,
      generatedCount: generatedEndpoints.size,
      liveCount: liveEndpoints.size,
      checkedAt: new Date().toISOString(),
    };
  },
};
