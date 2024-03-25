const vscode = require("vscode");
const path = require("path");
const { Octokit } = require("@octokit/rest");
const { TextEncoder } = require("util");

/**
 * @description Get the gist URL from the user input
 * @returns {Promise<string>} gistUrl
 */
async function getGistUrl() {
  const url = await vscode.window.showInputBox({
    prompt: "Enter the fiddle's github gist URL",
    placeHolder: "https://gist.github.com/username/gist_id",
    validateInput: (url) => {
      if (url.startsWith("https") && url.includes("gist.github.com")) {
        return null;
      } else {
        return "Please enter a valid github gist URL";
      }
    },
  });
  return url;
}

/**
 *
 * @param {*} vscodeContext
 * @returns {Promise<void>}
 * @description Import the githubgist as a fiddle to the present workspace
 */
async function importGistAsFiddle(vscodeContext) {
  const gistUrl = await getGistUrl();

  const octokit = new Octokit({
    auth: vscodeContext.globalState.get("githubPAT"),
  });

  const gistId = String(gistUrl).split("/").pop();
  const res = await octokit
    .request("GET /gists/{gist_id}", {
      gist_id: gistId,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
    .then(async (response) => {
      console.log(response);
      const files = response.data.files;

      for (const [filename, file] of Object.entries(files)) {
        const filePath = vscode.Uri.file(
          path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, filename)
        );

        const encoder = new TextEncoder();
        const data = encoder.encode(files[filename].content);
        await vscode.workspace.fs.writeFile(filePath, data);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  console.log(res);
}

module.exports = importGistAsFiddle;
