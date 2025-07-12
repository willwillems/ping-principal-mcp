export interface BaseDialogOptions {
    question: string;
    context?: string;
    timeout?: number;
}
export interface TextInputOptions extends BaseDialogOptions {
    type: 'text';
    defaultValue?: string;
    placeholder?: string;
}
export interface MultipleChoiceOptions extends BaseDialogOptions {
    type: 'choice';
    choices: string[];
    defaultChoice?: number;
}
export interface ConfirmOptions extends BaseDialogOptions {
    type: 'confirm';
    defaultAnswer?: boolean;
}
export interface InfoOptions extends BaseDialogOptions {
    type: 'info';
}
export interface NotificationOptions {
    message: string;
    title?: string;
    subtitle?: string;
    sound?: boolean;
}
export type DialogOptions = TextInputOptions | MultipleChoiceOptions | ConfirmOptions | InfoOptions;
export interface DialogResult {
    success: boolean;
    value?: string | boolean | number;
    cancelled?: boolean;
    error?: string;
}
export interface CLIOptions {
    timeout?: number;
    port?: number;
    host?: string;
    help?: boolean;
    version?: boolean;
}
export declare enum DialogType {
    TEXT = "text",
    CHOICE = "choice",
    CONFIRM = "confirm",
    INFO = "info"
}
export interface MCPToolResult {
    content: Array<{
        type: 'text';
        text: string;
    }>;
    isError?: boolean;
    [key: string]: unknown;
}
