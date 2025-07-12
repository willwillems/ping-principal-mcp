import { DialogOptions, DialogResult, NotificationOptions } from './types.js';
declare class DialogManager {
    private defaultTimeout;
    showDialog(options: DialogOptions): Promise<DialogResult>;
    private showTextInputDialog;
    private showMultipleChoiceDialog;
    private showConfirmDialog;
    private showInfoDialog;
    showNotification(options: NotificationOptions): Promise<DialogResult>;
    private escapeAppleScript;
}
export default DialogManager;
