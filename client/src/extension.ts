/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { window, ExtensionContext } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		command: "go",
		args: [
			"run",
			"/Users/taichimaeda/workspace/projects/freee/wireplus/cmd/wireplus/main.go",
			'lsp',
			'2>stderr.log',
			"|",
			"tee",
			"/Users/taichimaeda/workspace/projects/freee/wireplus/stdout.log"
		],
		options: {
			cwd: '/Users/taichimaeda/workspace/projects/freee/wireplus',
			shell: true,
		},
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'go' }],
		outputChannel: window.createOutputChannel('Example Language Server'),
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'languageServerExample',
		'Language Server Example',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}
