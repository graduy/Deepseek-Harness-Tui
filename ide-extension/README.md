# DSH IDE Context

一个给 VS Code / Cursor 用的微型扩展，把「当前打开的文件 + 工作区」写进
`$DSH_HOME/ide-context.json`，让在集成终端里运行的 `dsh -tui` 能识别它们。

无网络、无遥测、无命令，只做一件事：在编辑器/窗口切换时写一个 JSON 文件。

## 为什么需要它

VS Code/Cursor 不会把「当前活动文件」通过环境变量暴露给集成终端（只有
`TERM_PROGRAM`、工作目录这些）。所以 `dsh -tui` 能自动识别 IDE 和工作区，但
**当前打开的文件必须靠这个扩展提供**。

## 安装

```sh
cd ide-extension
./install.sh        # 或：code/cursor --install-extension dsh-ide-context-0.1.0.vsix
```

脚本会优先用 `code` / `cursor` CLI 安装 `.vsix`，否则复制到扩展目录
（`~/.vscode/extensions`、`~/.cursor/extensions` 等）。

然后**重启/重载窗口**（`Ctrl+Shift+P` → "Reload Window"）。

## 效果

在集成终端里运行 `dsh -tui`，右下角会显示当前打开文件的文件名（如 `foo.ts`），
切换标签页/编辑器时实时更新（约 1.5s 内）。工作区信息仅在内部使用，不显示。

## 卸载

```sh
rm -rf ~/.vscode/extensions/local.dsh-ide-context-0.1.0
rm -rf ~/.cursor/extensions/local.dsh-ide-context-0.1.0
```

## License

MIT

---

# DSH IDE Context

A tiny VS Code / Cursor extension that writes the currently open file + workspace to
`$DSH_HOME/ide-context.json` so `dsh -tui` running in the integrated terminal can see them.

No network, no telemetry, no commands — it only writes one JSON file on editor / window changes.

## Why it exists

VS Code / Cursor do not expose the active file to the integrated terminal via environment
variables (only `TERM_PROGRAM`, the working directory, etc.). So `dsh -tui` can detect the IDE
and workspace on its own, but **the currently open file must come from this extension**.

## Install

```sh
cd ide-extension
./install.sh        # or: code/cursor --install-extension dsh-ide-context-0.1.0.vsix
```

The script prefers installing the `.vsix` via the `code` / `cursor` CLIs, and falls back to
copying into the extension directory (`~/.vscode/extensions`, `~/.cursor/extensions`, …).

Then **restart / reload the window** (`Ctrl+Shift+P` → "Reload Window").

## Effect

Run `dsh -tui` in the integrated terminal and the current file's base name (e.g. `foo.ts`)
appears in the bottom-right corner, refreshing within ~1.5s as you switch tabs/editors. The
workspace is used internally and not displayed.

## Uninstall

```sh
rm -rf ~/.vscode/extensions/local.dsh-ide-context-0.1.0
rm -rf ~/.cursor/extensions/local.dsh-ide-context-0.1.0
```

## License

MIT
