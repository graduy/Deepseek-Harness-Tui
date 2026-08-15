// DSH IDE Context — a tiny VS Code / Cursor extension that mirrors the active
// editor file and workspace folder into $DSH_HOME/ide-context.json so the dsh
// terminal UI can show which file you have open.
//
// No network, no telemetry, no commands. It only writes one JSON file on
// editor / window changes.

const vscode = require('vscode')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')

const TARGET = path.join(process.env.DSH_HOME || path.join(os.homedir(), '.dsh'), 'ide-context.json')

let timer = null

function snapshot() {
  const editor = vscode.window.activeTextEditor
  const folders = vscode.workspace.workspaceFolders
  const doc = editor && editor.document
  const payload = {
    workspace: folders && folders.length > 0 ? folders[0].uri.fsPath : null,
    activeFile: doc && doc.uri.scheme === 'file' ? doc.uri.fsPath : null,
    languageId: doc ? doc.languageId : null,
    updatedAt: Date.now(),
  }
  try {
    fs.mkdirSync(path.dirname(TARGET), { recursive: true })
    const tmp = `${TARGET}.tmp`
    fs.writeFileSync(tmp, JSON.stringify(payload))
    fs.renameSync(tmp, TARGET)
  } catch (_) {
    // Best effort — the terminal side already handles a missing payload.
  }
}

function schedule() {
  if (timer) clearTimeout(timer)
  timer = setTimeout(snapshot, 100)
}

function activate(context) {
  snapshot()
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(schedule),
    vscode.window.onDidChangeVisibleTextEditors(schedule),
    vscode.workspace.onDidChangeWorkspaceFolders(schedule),
    vscode.workspace.onDidSaveTextDocument(schedule),
  )
}

function deactivate() {
  if (timer) clearTimeout(timer)
}

module.exports = { activate, deactivate }
