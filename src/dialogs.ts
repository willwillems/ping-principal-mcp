import { execute } from '@7c/osascript';
import {
  DialogOptions,
  DialogResult,
  TextInputOptions,
  MultipleChoiceOptions,
  ConfirmOptions,
  InfoOptions,
  DialogType,
  NotificationOptions
} from './types.js';

class DialogManager {
  private defaultTimeout = 300; // 5 minutes

  async showDialog(options: DialogOptions): Promise<DialogResult> {
    try {
      switch (options.type) {
        case DialogType.TEXT:
          return await this.showTextInputDialog(options);
        case DialogType.CHOICE:
          return await this.showMultipleChoiceDialog(options);
        case DialogType.CONFIRM:
          return await this.showConfirmDialog(options);
        case DialogType.INFO:
          return await this.showInfoDialog(options);
        default:
          return { success: false, error: 'Unsupported dialog type' };
      }
    } catch (error) {
      return { success: false, error: `Dialog failed: ${error instanceof Error ? error.message : String(error)}` };
    }
  }

  private async showTextInputDialog(options: TextInputOptions): Promise<DialogResult> {
    const escapedQuestion = this.escapeAppleScript(options.question);
    const escapedDefault = this.escapeAppleScript(options.defaultValue || '');
    const script = `
      set dialogResult to display dialog "${escapedQuestion}" default answer "${escapedDefault}" giving up after ${options.timeout || this.defaultTimeout}
      return text returned of dialogResult
    `;
    try {
      const result = await execute(script);
      return { success: true, value: result };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error), 
        cancelled: error instanceof Error && error.message.includes('cancel') 
      };
    }
  }

  private async showMultipleChoiceDialog(options: MultipleChoiceOptions): Promise<DialogResult> {
    const escapedQuestion = this.escapeAppleScript(options.question);
    const choices = options.choices.map(choice => `"${this.escapeAppleScript(choice)}"`).join(', ');
    const script = `choose from list {${choices}} with prompt "${escapedQuestion}"`;
    
    try {
      const result = await execute(script);
      
      // Check if user cancelled (returns "false")
      if (result === 'false') {
        return { success: false, cancelled: true };
      }
      
      // Find the index of the selected choice
      const choiceIndex = options.choices.indexOf(result);
      return { success: true, value: choiceIndex >= 0 ? choiceIndex : result };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private async showConfirmDialog(options: ConfirmOptions): Promise<DialogResult> {
    const escapedQuestion = this.escapeAppleScript(options.question);
    const defaultButton = options.defaultAnswer ? 'Yes' : 'No';
    const script = `
      set dialogResult to display dialog "${escapedQuestion}" buttons {"No", "Yes"} default button "${defaultButton}" giving up after ${options.timeout || this.defaultTimeout}
      return button returned of dialogResult
    `;
    
    try {
      const result = await execute(script);
      return { success: true, value: (result as string).trim() === 'Yes' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error), 
        cancelled: error instanceof Error && error.message.includes('cancel') 
      };
    }
  }

  private async showInfoDialog(options: InfoOptions): Promise<DialogResult> {
    const escapedQuestion = this.escapeAppleScript(options.question);
    const script = `
      display dialog "${escapedQuestion}" buttons {"OK"} default button "OK" giving up after ${options.timeout || this.defaultTimeout}
    `;
    
    try {
      await execute(script);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error), 
        cancelled: error instanceof Error && error.message.includes('cancel') 
      };
    }
  }

  async showNotification(options: NotificationOptions): Promise<DialogResult> {
    const escapedMessage = this.escapeAppleScript(options.message);
    const escapedTitle = this.escapeAppleScript(options.title || 'Ping Principal');
    const escapedSubtitle = this.escapeAppleScript(options.subtitle || '');
    
    const script = `
      display notification "${escapedMessage}" with title "${escapedTitle}" subtitle "${escapedSubtitle}"${options.sound ? ' sound name "default"' : ''}
    `;
    
    try {
      await execute(script);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  private escapeAppleScript(text: string): string {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  }
}

export default DialogManager;

