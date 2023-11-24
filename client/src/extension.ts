/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { exec, execSync, spawnSync } from "child_process";
import * as vscode from "vscode";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node";
import {
  graphWebviewTemplate,
  detailWebviewTemplate,
} from "./webview-templates";

const WIREPLUS_VERSION = "v0.1.5";

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
    const command = `wireplus graph --format cytospace . ${name}`;
    exec(command, { cwd: wd }, (_, stdout, stderr) => {
      panel.webview.html = graphWebviewTemplate.replace("{{content}}", stdout);
    });
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
    const command = `wireplus detail . ${name}`;
    exec(command, { cwd: wd }, (_, stdout, stderr) => {
      panel.webview.html = detailWebviewTemplate.replace("{{content}}", stdout);
    });
  }
);

function checkVersion() {
  try {
    const stdout = execSync("wireplus --version");
    const line = stdout.toString().trim();
    const version = line.replace("wireplus:", "").trim();
    if (version !== WIREPLUS_VERSION) {
      vscode.window.showErrorMessage(
        `Error: wireplus Extension requires wireplus ${WIREPLUS_VERSION}, but found ${version}. 
        Please install the latest version of wireplus by running: go install github.com/taichimaeda/wireplus/cmd/wireplus@latest`
      );
      return false;
    }
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error: wireplus not found. 
      Please install wireplus by running: go install github.com/taichimaeda/wireplus/cmd/wireplus@latest`
    );
    return false;
  }
  return true;
}

export function activate(context: vscode.ExtensionContext) {
  if (!checkVersion()) return;

  context.subscriptions.push(showGraphCommand);
  context.subscriptions.push(showDetailCommand);

  const serverOptions: ServerOptions = {
    command: "wireplus",
    args: ["lsp"],
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
