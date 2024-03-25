// The module 'vscode' contains the VS Code extensibility API
const vscode = require("vscode");

const saveGithubPAT = require("./lib/saveGithubPAT");
const importGistAsFiddle = require("./lib/importGistAsFiddle");
const publishAsGist = require("./lib/publishAsGist");

function activate(context) {
  console.log('Congratulations, your extension "fiddle-gist" is now active!');

  context.subscriptions.push(
    vscode.commands.registerCommand("fiddle-gist.helloWorld", () => {
      vscode.window.showInformationMessage("Hello World from Electron Fiddle!");
    })
  );

  // Commands for the extension -> SaveGithubPAT, ImportGistAsFiddle, PublishAsGist
  
  context.subscriptions.push(
    vscode.commands.registerCommand("fiddle-gist.saveGithubPAT", () => {
      saveGithubPAT(context);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("fiddle-gist.importGistAsFiddle", () => {
      importGistAsFiddle(context);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("fiddle-gist.publishAsGist", () => {
      publishAsGist(context);
    })
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
