# Ping Principal MCP

An MCP server that enables AI agents to request human input through native macOS dialogs. Provides a structured way for AI systems to ask clarifying questions rather than making assumptions.

## Overview

This tool implements the Model Context Protocol (MCP) to facilitate human-AI interaction through system dialogs. When an AI agent encounters uncertainty, it can invoke dialog tools to gather information from the user before proceeding.

## Features

- **Native macOS Dialogs** - No files, no fuss, just clean system dialogs
- **Multiple Dialog Types** - Text input, multiple choice, yes/no, info, notifications
- **Zero Configuration** - Works out of the box with `npx`
- **MCP Standard** - Compatible with Claude Desktop, Cursor, and other MCP clients
- **Timeout Handling** - Dialogs don't hang forever
- **macOS Only** - Uses native AppleScript for authentic system integration

## Installation & Usage

### Quick Start
```bash
npx ping-principal-mcp
```

This will start the server and wait for MCP connections.

### MCP Client Configuration

#### Claude Desktop
Add to `~/.claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "ping-principal": {
      "command": "npx",
      "args": ["ping-principal-mcp"]
    }
  }
}
```

#### Cursor
Add to `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "ping-principal": {
      "command": "npx", 
      "args": ["ping-principal-mcp"]
    }
  }
}
```

## Dialog Types

### Text Input
Ask open-ended questions with text responses:
```javascript
await ask_human({
  type: "text",
  question: "What's the database connection string?",
  context: "Setting up production environment",
  defaultValue: "postgresql://localhost:5432/mydb"
});
```

### Multiple Choice  
Present options for the human to choose from:
```javascript
await ask_human({
  type: "choice", 
  question: "Which authentication method should I implement?",
  choices: ["OAuth2", "JWT", "Session-based", "API Keys"],
  context: "Building user authentication system"
});
```

### Yes/No Confirmation
Get confirmation before taking actions:
```javascript
await ask_human({
  type: "confirm",
  question: "Should I delete the old migration files?",
  context: "Database cleanup process",
  defaultAnswer: false
});
```

### Information Display
Show information that needs acknowledgment:
```javascript
await ask_human({
  type: "info",
  question: "Migration completed successfully! 47 records updated.",
  context: "Database migration finished"
});
```

### Notifications
Send system notifications:
```javascript
await notify_human({
  message: "Build completed successfully",
  title: "Development Server",
  subtitle: "Ready for testing",
  sound: true
});
```

## CLI Options

```bash
npx ping-principal-mcp [OPTIONS]

OPTIONS:
  -h, --help           Show help message
  -v, --version        Show version number  
  -t, --timeout SEC    Set dialog timeout in seconds (default: 300)
  -p, --port PORT      Run in HTTP mode (not yet implemented)
  -H, --host HOST      Host for HTTP mode (not yet implemented)
```

## Examples

### Development Workflow
```bash
# Start the MCP server
npx ping-principal-mcp

# Now your AI can ask questions like:
# "Should I use TypeScript strict mode for this project?"
# "What's the API endpoint for user authentication?"  
# "Should I add error handling for this edge case?"
```

### With Custom Timeout
```bash
npx ping-principal-mcp --timeout 600  # 10 minute timeout
```

## How It Works

1. **AI gets stuck** → calls `ask_human()` tool
2. **Native dialog appears** → clean macOS system dialog  
3. **Human responds** → types answer or makes selection
4. **AI continues** → uses the human response to proceed

No files to manage, no polling, no complexity. Just direct human-AI communication through the OS.

## Requirements

- **macOS only** (uses AppleScript for native dialogs)
- **Node.js 18+** 
- **MCP client** (Claude Desktop, Cursor, etc.)

## Dialog Timeout

Dialogs automatically timeout after 5 minutes (300 seconds) by default. You can customize this:

- **Per dialog:** Set `timeout` parameter in tool calls
- **Globally:** Use `--timeout` CLI option
- **Result:** Timed out dialogs return a cancellation response

## Error Handling

- **User cancels:** Returns cancellation status instead of error
- **Timeout:** Graceful timeout with clear messaging  
- **AppleScript errors:** Proper error reporting to AI
- **Invalid input:** Validation and sanitization

## Development

### From Source
```bash
git clone https://github.com/willwillems/ping-principal-mcp.git
cd ping-principal-mcp
npm install
npm run build
npm start
```

### Project Structure
```
ping-principal-mcp/
├── src/
│   ├── index.ts          # CLI and main entry
│   ├── server.ts         # MCP server implementation  
│   ├── dialogs.ts        # Dialog manager & AppleScript
│   └── types.ts          # TypeScript interfaces
├── dist/                 # Compiled JavaScript
└── package.json
```

### Building
```bash
npm run build    # Compile TypeScript
npm run dev      # Watch mode
```

## Troubleshooting

### "Permission denied" or dialogs not showing
- Check macOS privacy settings
- Grant terminal access to display dialogs
- Try running from Terminal.app vs integrated terminals

### "Module not found" errors  
- Make sure you're on macOS
- Check Node.js version (needs 18+)
- Try `npm install` in the project directory

### MCP client not connecting
- Verify the configuration file syntax
- Check that the file path is correct
- Restart your MCP client after configuration changes

## Contributing

Contributions welcome! Please feel free to submit issues and pull requests.

## License

MIT - see [LICENSE](LICENSE) file for details.
