declare class MCPServer {
    private server;
    private dialogManager;
    constructor();
    private setupHandlers;
    private handleAskHuman;
    private handleNotifyHuman;
    private formatDialogResponse;
    run(): Promise<void>;
}
export default MCPServer;
