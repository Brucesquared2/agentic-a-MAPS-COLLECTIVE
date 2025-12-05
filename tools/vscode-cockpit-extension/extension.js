const vscode = require('vscode');
const fetch = require('node-fetch');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand('cockpit.sendWorkload', async function () {
    const editor = vscode.window.activeTextEditor;
    const notes = editor ? `${editor.document.fileName}` : 'VSCode workload';
    const publishUrl = process.env.COCKPIT_PUBLISH_URL || 'http://localhost:3000/api/cockpit/publish';
    const token = process.env.COCKPIT_PUBLISH_TOKEN || process.env.PUBLISH_AUTH_TOKEN || '';

    try {
      const res = await fetch(publishUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publish-token': token,
        },
        body: JSON.stringify({ agent: 'vscode', action: 'task_assigned', notes }),
      });

      if (!res.ok) {
        const t = await res.text();
        vscode.window.showErrorMessage(`Failed to send workload: ${t}`);
      } else {
        vscode.window.showInformationMessage('📡 Workload sent to cockpit');
      }
    } catch (err) {
      vscode.window.showErrorMessage(`Network error sending workload: ${String(err)}`);
    }
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
