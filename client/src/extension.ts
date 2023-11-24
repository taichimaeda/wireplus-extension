/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { exec, execSync } from "child_process";
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from "vscode-languageclient/node";
import {
  detailWebviewTemplate,
  graphWebviewTemplate,
} from "./webview-templates";

const WIREPLUS_VERSION = "v0.1.6";

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
        Please install the latest version of wireplus by running: 
        go install github.com/taichimaeda/wireplus/cmd/wireplus@latest`
      );
      return false;
    }
  } catch (error) {
    vscode.window.showErrorMessage(
      `Error: wireplus not found. 
      Please install wireplus by running: 
      go install github.com/taichimaeda/wireplus/cmd/wireplus@latest`
    );
    return false;
  }
  return true;
}

function updateSettings(
  editor: vscode.TextEditor,
  statusBarItem: vscode.StatusBarItem
) {
  if (editor.document.languageId !== "go") return;

  const folder = vscode.workspace.workspaceFolders.find((folder) => {
    const editorPath = editor.document.uri.path;
    const folderPath = folder.uri.path;
    return editorPath.startsWith(folderPath);
  });
  if (!folder) return;

  const settingsPath = `${folder.uri.path}/.vscode/settings.json`;
  const content = editor.document.getText();
  const buildTags = content.includes("// +build !wireinject")
    ? "!wireinject"
    : "wireinject";

  // Read and write file asynchronously to avoid blocking the UI
  if (!fs.existsSync(settingsPath)) {
    fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
    fs.writeFile(settingsPath, `{"go.buildTags": "${buildTags}"}`, () => {
      statusBarItem.text = buildTags;
      statusBarItem.tooltip = `wireplus: go.buildTags set to ${buildTags}`;
      statusBarItem.show();
    });
    return;
  }
  fs.readFile(settingsPath, (_, buffer) => {
    const settings = JSON.parse(buffer.toString());
    settings["go.buildTags"] = buildTags;
    fs.writeFile(settingsPath, JSON.stringify(settings), () => {
      statusBarItem.text = buildTags;
      statusBarItem.tooltip = `wireplus: go.buildTags set to ${buildTags}`;
      statusBarItem.show();
    });
  });
}

export function activate(context: vscode.ExtensionContext) {
  if (!checkVersion()) return;

  context.subscriptions.push(showGraphCommand);
  context.subscriptions.push(showDetailCommand);

  const statusBarItem = vscode.window.createStatusBarItem();
  const disposable = vscode.Disposable.from(statusBarItem);
  context.subscriptions.push(disposable);

  updateSettings(vscode.window.activeTextEditor, statusBarItem);
  vscode.window.onDidChangeActiveTextEditor((editor) =>
    updateSettings(editor, statusBarItem)
  );

  const outputChannel = vscode.window.createOutputChannel(
    "wireplus Language Server",
    "go"
  );

  const serverOptions: ServerOptions = {
    command: "wireplus",
    args: ["lsp"],
    options: { shell: true },
  };
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
