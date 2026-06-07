#!/usr/bin/env node
/**
 * API Contract Monitor – MCP Server
 *
 * Exposes three tools for AI agents and Copilot to check API contract health:
 *   - check_endpoint_availability  – probe a single endpoint on the live API
 *   - get_live_schema_version      – fetch version/hash of live OpenAPI schema
 *   - compare_schemas              – diff live schema vs generated api-endpoints.ts
 *
 * Usage (stdio transport – default for VS Code MCP):
 *   npx ts-node scripts/contract-mcp-server.ts
 *
 * Registration:
 *   .vscode/mcp.json — see project root
 */
/* eslint-disable no-console */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import the shared monitoring logic
// We use a dynamic require to avoid ts-node ES module issues
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { contractMonitor } = require('../helpers/contract-monitor') as typeof import('../helpers/contract-monitor');

// ─────────────────────────────────────────────────────────────────────────────
// Server setup
// ─────────────────────────────────────────────────────────────────────────────

const server = new McpServer({
  name: 'api-contract-monitor',
  version: '1.0.0',
});

// ─────────────────────────────────────────────────────────────────────────────
// Tool: check_endpoint_availability
// ─────────────────────────────────────────────────────────────────────────────

server.registerTool(
  'check_endpoint_availability',
  {
    description:
      'Check if a specific API endpoint is reachable on the live API. ' +
      'Sends an OPTIONS probe — no sensitive data is transmitted. ' +
      'Returns whether the endpoint responds with a non-5xx status.',
    inputSchema: {
      endpoint: z.string().describe('API path, e.g. /api/products/ or /api/users/token/'),
      method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).describe('HTTP method to verify for'),
    },
  },
  async ({ endpoint, method }) => {
    try {
      const result = await contractMonitor.checkEndpointAvailability(endpoint, method);
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ error: String(err), endpoint, method }),
          },
        ],
        isError: true,
      };
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Tool: get_live_schema_version
// ─────────────────────────────────────────────────────────────────────────────

server.registerTool(
  'get_live_schema_version',
  {
    description:
      'Fetch the current live OpenAPI schema version info. ' +
      'Returns a timestamp, a content hash, and the total number of endpoints ' +
      'currently exposed by the API.',
    inputSchema: {},
  },
  async () => {
    try {
      const version = await contractMonitor.getLiveSchemaVersion();
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(version, null, 2),
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ error: String(err) }),
          },
        ],
        isError: true,
      };
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Tool: compare_schemas
// ─────────────────────────────────────────────────────────────────────────────

server.registerTool(
  'compare_schemas',
  {
    description:
      'Compare the live API schema against the generated constants/api-endpoints.ts file. ' +
      'Returns a diff report with endpoints added (in live but not in generated file) ' +
      'and endpoints removed (in generated file but not in live schema). ' +
      'Use this to detect contract drift after API changes.',
    inputSchema: {},
  },
  async () => {
    try {
      const diff = await contractMonitor.compareSchemas();
      const summary = diff.matches
        ? '✅ Schemas match — no drift detected.'
        : `⚠️ Schema drift detected!\n` +
          `  Added in live (not in generated): ${diff.added.length}\n` +
          `  Removed from live (still in generated): ${diff.removed.length}\n` +
          `  Run: npm run generate:endpoints to sync`;

      return {
        content: [
          {
            type: 'text' as const,
            text: `${summary}\n\n${JSON.stringify(diff, null, 2)}`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ error: String(err) }),
          },
        ],
        isError: true,
      };
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Start
// ─────────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('API Contract Monitor MCP server running on stdio');
}

main().catch((err) => {
  console.error('MCP server fatal error:', err);
  process.exit(1);
});
