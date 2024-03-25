const vscode = require("vscode");

/**
 *
 * @param {*} vscodeContext
 * @returns {void}
 * @description Save the github personal access token to the vscode global state
 *
 */
function saveGithubPAT(vscodeContext) {
  vscode.window
    .showInputBox({
      prompt: "Enter your github personal access token",
      placeHolder: "ghp_XXXXXXXXXXXXXX",
      password: true,
      validateInput: (pat) => {
        if (pat.startsWith("ghp_")) {
          return null;
        } else {
          return "Please enter a valid github personal access token";
        }
      },
    })
    .then((pat) => {
      // TODO : Use secretStorage API to store the PAT securely instead of global state
      // https://code.visualstudio.com/api/references/vscode-api#SecretStorage
      vscodeContext.globalState.update("githubPAT", pat);
      console.log(vscodeContext.globalState.get("githubPAT"));
    });
}

module.exports = saveGithubPAT;
