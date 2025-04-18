# Rename File to Symbol

A VS Code extension that helps you rename files to match the symbol your cursor is on or the text you've selected.

## Features

This extension allows you to quickly rename your files to match the symbol (variable, function, class, etc.) that your cursor is positioned on. This helps maintain a consistent naming convention throughout your codebase.

Key features include:

- Rename a file to the symbol/word at your cursor position
- Works with selected text if you have an active selection
- Available via right-click context menu under the "Refactor" group
- Accessible through the command palette with "Rename File to Symbol"
- Supports all file types and languages

![Rename File to Symbol](images/rename-file-to-symbol-demo.gif)

## Requirements

- Visual Studio Code 1.99.0 or higher

## How to Use

1. Place your cursor on a symbol (variable, function name, class, etc.) or select some text
2. Right-click and select "Rename File to Symbol" from the context menu
3. The file will be renamed to match the selected symbol, keeping its original extension

The extension will sanitize the filename by replacing any characters that aren't valid in filenames.

## Extension Settings

This extension doesn't currently have configurable settings.

## Known Issues

No known issues at this time. Please report any bugs on the [GitHub repository](https://github.com/zebapy/rename-file-to-symbol/issues).

## Release Notes

### 0.0.1

Initial release of Rename File to Symbol

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

- Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
- Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
- Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
