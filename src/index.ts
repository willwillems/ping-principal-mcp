#!/usr/bin/env node

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import MCPServer from './server.js';
import { CLIOptions } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function parseArgs(args: string[]): CLIOptions {
  const options: CLIOptions = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--version':
      case '-v':
        options.version = true;
        break;
      case '--timeout':
      case '-t':
        if (i + 1 < args.length) {
          options.timeout = parseInt(args[++i], 10);
          if (isNaN(options.timeout) || options.timeout <= 0) {
            throw new Error('Timeout must be a positive number');
          }
        } else {
          throw new Error('--timeout requires a value');
        }
        break;
      case '--port':
      case '-p':
        if (i + 1 < args.length) {
          options.port = parseInt(args[++i], 10);
          if (isNaN(options.port) || options.port <= 0 || options.port > 65535) {
            throw new Error('Port must be a valid number between 1-65535');
          }
        } else {
          throw new Error('--port requires a value');
        }
        break;
      case '--host':
      case '-H':
        if (i + 1 < args.length) {
          options.host = args[++i];
        } else {
          throw new Error('--host requires a value');
        }
        break;
      default:
        if (arg.startsWith('-')) {
          throw new Error(`Unknown option: ${arg}`);
        }
        break;
    }
  }
  
  return options;
}

function showHelp(): void {
  console.log(`
ping-principal-mcp - Ask humans questions via native macOS dialogs

USAGE:
  npx ping-principal-mcp [OPTIONS]

OPTIONS:
  -h, --help           Show this help message
  -v, --version        Show version number
  -t, --timeout SEC    Set dialog timeout in seconds (default: 300)
  -p, --port PORT      Run in HTTP mode on specified port
  -H, --host HOST      Host to bind to in HTTP mode (default: localhost)

EXAMPLES:
  npx ping-principal-mcp
  npx ping-principal-mcp --timeout 600
  npx ping-principal-mcp --port 3000 --host 0.0.0.0

MCP CLIENT CONFIGURATION:

Claude Desktop (~/.claude_desktop_config.json):
{
  "mcpServers": {
    "ping-principal": {
      "command": "npx",
      "args": ["ping-principal-mcp"]
    }
  }
}

Cursor (.cursor/mcp.json):
{
  "mcpServers": {
    "ping-principal": {
      "command": "npx",
      "args": ["ping-principal-mcp"]
    }
  }
}

DIALOG TYPES:
  text     - Text input dialog
  choice   - Multiple choice dialog
  confirm  - Yes/No confirmation dialog
  info     - Information dialog

FOR MORE INFO:
  https://github.com/willwillems/ping-principal-mcp
`);
}

function showVersion(): void {
  try {
    const packagePath = join(__dirname, '../package.json');
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
    console.log(`ping-principal-mcp v${packageJson.version}`);
  } catch (error) {
    console.log('ping-principal-mcp v1.0.0');
  }
}

async function main(): Promise<void> {
  try {
    const options = parseArgs(process.argv.slice(2));
    
    if (options.help) {
      showHelp();
      return;
    }
    
    if (options.version) {
      showVersion();
      return;
    }
    
    // Check if we're on macOS
    if (process.platform !== 'darwin') {
      console.error('Error: ping-principal-mcp only works on macOS');
      process.exit(1);
    }
    
    console.error('Starting ping-principal-mcp server...');
    
    if (options.port) {
      console.error(`HTTP mode not yet implemented. Use stdio mode for now.`);
      process.exit(1);
    }
    
    const server = new MCPServer();
    await server.run();
    
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`Fatal error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
