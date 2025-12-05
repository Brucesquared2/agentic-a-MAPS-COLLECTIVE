# VS Code Cockpit Workload Bridge

A minimal VS Code extension that exposes the `Send workload to cockpit` command.

Installation (dev)

1. Open the `tools/vscode-cockpit-extension` folder in VS Code.
2. Run `npm install` to install dependencies (node-fetch).
3. Press F5 to run the extension in the Extension Development Host.

Usage

- Use the command palette (Ctrl/Cmd+Shift+P) and run `Send workload to cockpit`.
- The extension will POST the current file name to `/api/cockpit/publish` using `x-publish-token` from your environment.

Notes

- For local development, set `COCKPIT_PUBLISH_URL` and `COCKPIT_PUBLISH_TOKEN` in your environment.
- The project contains a `src/extension.ts` TypeScript source file for contributors; runtime uses `extension.js` so no build step is required for testing.
