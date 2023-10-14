/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { exec } from 'child_process';
import * as vscode from 'vscode';
import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('exampleExtension.showGraph', (wd, name) => {
			const panel = vscode.window.createWebviewPanel(
				'showGraph',
				'Show Graph',
				vscode.ViewColumn.One,
				{ enableScripts: true },
			);
			exec(`wireplus graph . ${name}`, { cwd: wd },
				(_, stdout, stderr) => {
					console.log(stderr)
					panel.webview.html = `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Show Graph</title>
	</head>
	<body>
		<pre><code>${stdout}</code></pre>
		<div id="graph"></div>
	</body>
</html>`
				});
		})
	);

	const serverOptions: ServerOptions = {
		command: "wireplus",
		args: ["lsp"],
		// args: ["lsp", "|", "tee", "/Users/taichimaeda/workspace/projects/freee/wireplus/stdout.log"],
		options: { shell: true },
	};

	const clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', language: 'go' }],
		outputChannel: vscode.window.createOutputChannel('Example Language Server'),
	};

	client = new LanguageClient(
		'languageServerExample',
		'Language Server Example',
		serverOptions,
		clientOptions
	);
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
