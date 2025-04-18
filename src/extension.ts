import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {
  // Register the command to rename file to selected symbol
  const renameFileToSymbolCommand = vscode.commands.registerCommand(
    "extension.renameFileToSymbol",
    async () => {
      await renameFileToSymbolAtCursor();
    }
  );

  // Register a code action provider for refactoring
  const codeActionProvider = vscode.languages.registerCodeActionsProvider(
    "*", // All languages
    new RenameFileToSymbolActionProvider(),
    {
      providedCodeActionKinds: [vscode.CodeActionKind.RefactorRewrite],
    }
  );

  context.subscriptions.push(renameFileToSymbolCommand, codeActionProvider);
}

// Function to perform the actual renaming
async function renameFileToSymbolAtCursor(): Promise<void> {
  try {
    // Get the active text editor
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showErrorMessage("No active editor found");
      return;
    }

    const document = editor.document;
    const position = editor.selection.active;
    
    // Get the word at the current cursor position
    const wordRange = document.getWordRangeAtPosition(position);
    if (!wordRange) {
      vscode.window.showErrorMessage("No symbol found at cursor position");
      return;
    }
    
    // Get the text of the word at cursor position
    const symbolText = document.getText(wordRange).trim();

    if (!symbolText) {
      vscode.window.showErrorMessage("No valid symbol found at cursor position");
      return;
    }

    // Sanitize filename - replace characters not allowed in filenames
    const sanitizedText = symbolText.replace(/[\\/:*?"<>|]/g, "_");

    // Get the file path and extension
    const filePath = document.uri.fsPath;
    const fileExtension = path.extname(filePath);
    const dirName = path.dirname(filePath);

    // Create new file name with the selected symbol
    const newFileName = sanitizedText + fileExtension;
    const newFilePath = path.join(dirName, newFileName);

    // Check if target file already exists
    if (fs.existsSync(newFilePath)) {
      const overwrite = await vscode.window.showWarningMessage(
        `A file named "${newFileName}" already exists. Do you want to overwrite it?`,
        "Yes",
        "No"
      );

      if (overwrite !== "Yes") {
        return;
      }
    }

    // Create a new URI for the new file location
    const newUri = vscode.Uri.file(newFilePath);

    // Use the workspace file system to rename (move) the file
    await vscode.workspace.fs.rename(document.uri, newUri, { overwrite: true });

    // Show success message
    vscode.window.showInformationMessage(`File renamed to ${newFileName}`);

    // Open the newly renamed file
    const doc = await vscode.workspace.openTextDocument(newUri);
    await vscode.window.showTextDocument(doc);
  } catch (error) {
    if (error instanceof Error) {
      vscode.window.showErrorMessage(`Failed to rename file: ${error.message}`);
    } else {
      vscode.window.showErrorMessage(
        "Failed to rename file due to an unknown error"
      );
    }
  }
}

// Code action provider for the rename file to symbol refactoring
class RenameFileToSymbolActionProvider implements vscode.CodeActionProvider {
  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.CodeAction[]> {
    let symbolText: string;
    let symbolRange: vscode.Range;
    
    // If there's a selection, use it
    if (!range.isEmpty) {
      symbolRange = range;
      symbolText = document.getText(range).trim();
    } else {
      // If no selection, get the word at cursor position
      const position = range.start;
      const wordRange = document.getWordRangeAtPosition(position);
      
      if (!wordRange) {
        return [];
      }
      
      symbolRange = wordRange;
      symbolText = document.getText(wordRange).trim();
    }
    
    if (!symbolText) {
      return [];
    }

    // Create a code action
    const action = new vscode.CodeAction(
      `Rename file to "${symbolText}"`,
      vscode.CodeActionKind.RefactorRewrite
    );

    // Set the command that should be executed
    action.command = {
      title: "Rename File to Symbol",
      command: "extension.renameFileToSymbol",
    };

    return [action];
  }
}
