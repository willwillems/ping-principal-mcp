import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import DialogManager from './dialogs.js';
class MCPServer {
    server;
    dialogManager;
    constructor() {
        this.dialogManager = new DialogManager();
        this.server = new Server({
            name: 'ping-principal-mcp',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.setupHandlers();
    }
    setupHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: 'ask_human',
                        description: 'Ask a human a question via native macOS dialog. Supports text input, multiple choice, yes/no, and info dialogs.',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                type: {
                                    type: 'string',
                                    enum: ['text', 'choice', 'confirm', 'info'],
                                    description: 'Type of dialog to show',
                                },
                                question: {
                                    type: 'string',
                                    description: 'The question to ask',
                                },
                                context: {
                                    type: 'string',
                                    description: 'Additional context for the question',
                                },
                                choices: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    description: 'Available choices (for choice type)',
                                },
                                defaultValue: {
                                    type: 'string',
                                    description: 'Default value for text input',
                                },
                                defaultAnswer: {
                                    type: 'boolean',
                                    description: 'Default answer for confirmation (true for Yes, false for No)',
                                },
                                defaultChoice: {
                                    type: 'number',
                                    description: 'Index of default choice (for choice type)',
                                },
                                timeout: {
                                    type: 'number',
                                    description: 'Timeout in seconds (default: 300)',
                                },
                            },
                            required: ['type', 'question'],
                        },
                    },
                    {
                        name: 'notify_human',
                        description: 'Send a notification to the human via macOS notification system.',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                message: {
                                    type: 'string',
                                    description: 'The notification message',
                                },
                                title: {
                                    type: 'string',
                                    description: 'Notification title (default: \"Ping Principal\")',
                                },
                                subtitle: {
                                    type: 'string',
                                    description: 'Notification subtitle',
                                },
                                sound: {
                                    type: 'boolean',
                                    description: 'Whether to play sound (default: false)',
                                },
                            },
                            required: ['message'],
                        },
                    },
                ],
            };
        });
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                switch (name) {
                    case 'ask_human':
                        return await this.handleAskHuman(args);
                    case 'notify_human':
                        return await this.handleNotifyHuman(args);
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            }
            catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                        },
                    ],
                    isError: true,
                };
            }
        });
    }
    async handleAskHuman(options) {
        const result = await this.dialogManager.showDialog(options);
        if (!result.success) {
            if (result.cancelled) {
                return {
                    content: [{
                            type: 'text',
                            text: 'User cancelled the dialog.'
                        }],
                    isError: false
                };
            }
            return {
                content: [{
                        type: 'text',
                        text: `Dialog failed: ${result.error || 'Unknown error'}`
                    }],
                isError: true
            };
        }
        const responseText = this.formatDialogResponse(options, result.value);
        return {
            content: [{
                    type: 'text',
                    text: responseText
                }],
            isError: false
        };
    }
    async handleNotifyHuman(options) {
        const result = await this.dialogManager.showNotification(options);
        if (!result.success) {
            return {
                content: [{
                        type: 'text',
                        text: `Notification failed: ${result.error || 'Unknown error'}`
                    }],
                isError: true
            };
        }
        return {
            content: [{
                    type: 'text',
                    text: 'Notification sent successfully.'
                }],
            isError: false
        };
    }
    formatDialogResponse(options, value) {
        const contextStr = options.context ? `\n\nContext: ${options.context}` : '';
        const questionStr = `Question: ${options.question}${contextStr}`;
        switch (options.type) {
            case 'text':
                return `${questionStr}\n\nUser response: ${value}`;
            case 'choice':
                const choices = options.choices || [];
                const choiceText = typeof value === 'number' && choices[value] ? choices[value] : value;
                return `${questionStr}\n\nUser selected: ${choiceText}`;
            case 'confirm':
                return `${questionStr}\n\nUser confirmed: ${value ? 'Yes' : 'No'}`;
            case 'info':
                return `${questionStr}\n\nUser acknowledged the information.`;
            default:
                return `${questionStr}\n\nUser response: ${value}`;
        }
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        // Keep the server running
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }
}
export default MCPServer;
