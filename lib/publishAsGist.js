const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const { Octokit } = require("@octokit/rest");

/**
 * 
 * @param {*} vscodeContext 
 * @returns {Promise<void>}
 * @description Publish the current workspace as a github gist 
 */

async function publishAsGist(vscodeContext) {
  const fiddleName = await vscode.window.showInputBox({
    prompt: "Enter the fiddle's name",
    placeHolder: "fiddle name",
    validateInput: (name) => {
      if (name.length > 0) {
        return null;
      } else {
        return "Please enter a valid name";
      }
    },
  });

  const githubPAT = vscodeContext.globalState.get("githubPAT");
  if (!githubPAT) {
    vscode.window.showErrorMessage(
      "Please set your github personal access token first"
    );
    return;
  }

  const octokit = new Octokit({
    auth: githubPAT,
  });

  function readFilesRecursively(dir, prefix = "") {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    return entries.reduce((files, entry) => {
      const fullPath = path.join(dir, entry.name);
      const key = path.join(prefix, entry.name);

      if (entry.isDirectory()) {
        Object.assign(files, readFilesRecursively(fullPath, key));
      } else {
        files[key] = { content: fs.readFileSync(fullPath, "utf8") };
      }

      return files;
    }, {});
  }

  const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
  const files = readFilesRecursively(workspaceFolder);
  try {
    const response = await octokit.gists.create({
      files,
      description: fiddleName,
      public: true,
    });

    vscode.window.showInformationMessage(
      `Gist created: ${response.data.html_url}`
    );
    console.log(response.data.html_url);
  } catch (error) {
    vscode.window.showErrorMessage(`Error creating gist: ${error.message}`);
  }
}

module.exports = publishAsGist;
