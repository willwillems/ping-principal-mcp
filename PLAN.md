# Ping Principal MCP - Project Plan

## Overview
Build an MCP server that allows AI agents to ask questions to humans via native macOS dialogs, similar to `ask-human-mcp` but using macOS native UI instead of markdown files.

## Core Requirements

### ✅ Project Setup
- [x] TypeScript project with modern ES modules
- [x] Simple `npx` command setup
- [x] Keep repo structure minimal
- [x] Install dependencies

### 🎯 Core Features

#### Dialog Types to Support
- [x] **Text Input Dialog** - Open-ended questions with text input
- [x] **Yes/No Dialog** - Simple confirmation dialogs
- [x] **Multiple Choice Dialog** - Choose from predefined options
- [x] **Info Dialog** - Display information with OK button
- [x] **Notification** - Show system notifications

#### MCP Tools to Implement
- [x] `ask_human` - Main tool with different dialog types
- [x] `notify_human` - Show notifications
- [x] All dialog types integrated into single `ask_human` tool

### 🔧 Technical Implementation

#### Dependencies
- [x] `@modelcontextprotocol/sdk` - MCP protocol implementation
- [x] `@7c/osascript` - AppleScript execution for native dialogs
- [x] TypeScript + Node.js 18+

#### Core Components
- [x] `DialogManager` - Handle different dialog types
- [x] `MCPServer` - Main server implementation
- [x] `Types` - TypeScript interfaces for dialog options
- [x] `CLI` - Command-line interface with options

#### Dialog Features
- [x] Timeout handling (default 5 minutes)
- [x] Proper error handling for cancelled dialogs
- [x] AppleScript text escaping
- [x] Default values for inputs
- [x] Different dialog types with proper formatting

### 📋 CLI Options
- [x] `--timeout` - Set dialog timeout (default: 300s)
- [x] `--port` - HTTP mode port (placeholder)
- [x] `--host` - HTTP mode host (placeholder)
- [x] `--help` - Show help information
- [x] `--version` - Show version

### 🧪 Dialog Types Implementation

#### Text Input Dialog
```typescript
interface TextInputOptions {
  question: string;
  defaultValue?: string;
  placeholder?: string;
  timeout?: number;
}
```

#### Multiple Choice Dialog
```typescript
interface MultipleChoiceOptions {
  question: string;
  choices: string[];
  defaultChoice?: number;
  timeout?: number;
}
```

#### Confirmation Dialog
```typescript
interface ConfirmOptions {
  question: string;
  defaultAnswer?: boolean;
  timeout?: number;
}
```

### 🔒 Error Handling
- [x] Graceful handling of cancelled dialogs
- [x] Timeout errors with clear messages
- [x] TypeScript input validation
- [x] macOS platform checks

### 📦 Distribution
- [x] Build to `dist/` directory
- [x] Executable bin script with shebang
- [x] NPM package ready for `npx` usage
- [x] README with usage examples

### 🎨 User Experience
- [x] Clear, friendly dialog messages
- [x] Consistent styling across dialog types
- [x] Proper app name in notifications
- [x] Non-blocking notifications

## File Structure
```
ping-principal-mcp/
├── src/
│   ├── index.ts          # Main entry point & CLI
│   ├── server.ts         # MCP server implementation
│   ├── dialogs.ts        # Dialog manager & AppleScript wrappers
│   └── types.ts          # TypeScript interfaces
├── dist/                 # Compiled JavaScript
├── package.json
├── tsconfig.json
├── README.md
├── PLAN.md
└── LICENSE
```

## Usage Examples

### Basic Text Input
```javascript
const answer = await ask_human({
  type: "text",
  question: "What database should I use for this project?",
  context: "Building a chat app with 1000+ concurrent users"
});
```

### Multiple Choice
```javascript
const choice = await ask_human({
  type: "choice",
  question: "Which authentication method should I implement?",
  choices: ["OAuth2", "JWT", "Session-based", "API Keys"],
  context: "User management system"
});
```

### Confirmation
```javascript
const confirmed = await ask_human({
  type: "confirm",
  question: "Should I delete the old migration files?",
  context: "Database cleanup process"
});
```

## Success Criteria
- [x] Works with `npx ping-principal-mcp`
- [x] Integrates with Claude Desktop & Cursor (configuration ready)
- [x] All dialog types working properly
- [x] Graceful error handling
- [x] Clear documentation (README, help, examples)
- [x] TypeScript compilation without errors
- [x] Proper macOS permissions handling

## Next Steps
1. Install dependencies
2. Create type definitions
3. Implement dialog manager
4. Build MCP server
5. Create CLI interface
6. Test with MCP clients
7. Write documentation
