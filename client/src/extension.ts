/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { exec } from "child_process";
import * as vscode from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node";
import { detailWebviewTemplate } from "./webviews/detail";
import { graphWebviewTemplate } from "./webviews/graph";

let client: LanguageClient;

const showGraphCommand = vscode.commands.registerCommand(
  "wireplus.showGraph",
  (wd, name) => {
    const panel = vscode.window.createWebviewPanel(
      "wireplusGraph",
      "wireplus - Graph",
      vscode.ViewColumn.One,
      { enableScripts: true }
    );
    exec(
      `wireplus graph --format cytospace . ${name}`,
      { cwd: wd },
      (_, stdout, stderr) => {
        panel.webview.html = graphWebviewTemplate.replace(
          "{{content}}",
          stdout
        );
      }
    );
  }
);

const showDetailCommand = vscode.commands.registerCommand(
  "wireplus.showDetail",
  (wd, name) => {
    const panel = vscode.window.createWebviewPanel(
      "wireplusDetail",
      "wireplus - Detail",
      vscode.ViewColumn.One,
      { enableScripts: true }
    );
    exec(`wireplus detail . ${name}`, { cwd: wd }, (_, stdout, stderr) => {
      panel.webview.html = detailWebviewTemplate.replace("{{content}}", stdout);
    });
  }
);

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(showGraphCommand);
  context.subscriptions.push(showDetailCommand);

  const serverOptions: ServerOptions = {
    command: "wireplus",
    args: ["lsp"],
    // args: ["lsp", "|", "tee", "/Users/taichimaeda/workspace/projects/freee/wireplus/stdout.log"],
    options: { shell: true },
  };
  const outputChannel = vscode.window.createOutputChannel(
    "wireplus Language Server"
  );
  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: "go" }],
    outputChannel,
  };
  client = new LanguageClient(
    "wireplusServer",
    "wireplus Language Server",
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
