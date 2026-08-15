# DeepSeek Harness TUI（dsh-tui 定制版）

基于 [@dsh-tui/dsh-tui](https://github.com/dsh-tui/dsh-tui)（MIT）的 DeepSeek Harness
终端界面定制版。它是一个 dsh 的 out-of-tree bundle，叠加在官方 `@deepseek-ai/dsh-base`
之上，插件生态与官方 web 界面完全一致。

## 定制内容

- **音鲸欢迎横幅**：蓝色鲸鱼 + 音乐音符 `♪ ♫`，欢迎语「我是音鲸」。
- **Claude Code 风格扁平对话**：`❯` 提示符标记用户消息、陶土色 `#D97757` 强调、Markdown 渲染、工具卡片折叠。
- **思考过程可折叠**：默认折叠为一行 `✻ Thinking · N lines`，三态循环（折叠 / 展开 / 隐藏）。
  - `Ctrl+R` 或**鼠标左键点击**（对话区）切换；`/details reasoning collapsed|expanded|hidden` 直接指定。
- **输入框固定底部**：上下两条横线框住，随窗口高度自适应。
- **底部状态栏**：左侧 `模型 · 思考强度`（**可点击原地切换**），右下角显示当前打开文件的文件名。
- **IDE 集成**：识别 VS Code / Cursor，右下角显示当前打开的文件名（配合 `ide-extension`）。

## 安装

前置：Node `^22.19 || >=24`、`dsh` CLI（`npm i -g @deepseek-ai/dsh@next`）。

```sh
dsh plugin --profile tui add github:graduy/Deepseek-Harness-Tui
dsh -tui                        # 或 dsh --profile tui
dsh --profile tui --resume <id> # 恢复会话
```

Git 安装会在安装时通过 `prepare` 脚本构建（`tsdown`）。pnpm 默认阻止依赖构建脚本，如果
`add` 失败，把打印出来的 key 加到 `~/.dsh/profiles/tui/pnpm-workspace.yaml` 后重跑：

```yaml
allowBuilds:
  "@dsh-tui/dsh-tui": true
```

## 构建

```sh
pnpm install   # 应用 pi-tui 补丁（patches/）
pnpm build     # tsc 声明 + tsdown 运行时打包到 lib/
```

pi-tui 锁定 0.80.7 并用 pnpm patch 打补丁，随后被打进 `lib/`，仓库外安装不会看到未补丁副本。

## IDE 集成（VS Code / Cursor 当前文件）

`ide-extension/` 是一个微型 VS Code / Cursor 扩展，把「当前打开的文件 + 工作区」写入
`$DSH_HOME/ide-context.json`。安装：

```sh
cd ide-extension
./install.sh        # 或：code/cursor --install-extension dsh-ide-context-0.1.0.vsix
```

然后重载窗口（`Ctrl+Shift+P` → Reload Window），在集成终端跑 `dsh -tui`，右下角即显示当前文件名。

## 快捷键

- `Enter` 发送；`Shift/Alt+Enter` 换行；`↑/↓` 历史
- `Esc` 取消当前轮；`Ctrl+C` 取消/清空/退出；`Ctrl+D` 退出
- `Ctrl+O` 循环工具卡片（折叠/展开/隐藏）；`Ctrl+R` 循环思考；`Ctrl+L` 重绘
- 左键点击：状态栏模型/思考强度原地切换；其它区域折叠/展开思考
- 斜杠命令：`/model` `/resume` `/compact` `/details` `/help` `/palette` `/status` `/skill:<name>` …

## 出处与许可

本仓库是 `dsh-tui/dsh-tui` 的定制 fork，其 TUI 实现源自 DeepSeek Harness 仓库历史
（`packages/ui/tui`，上游在 commit `10bb9cbf4a` 移除）并移植到已发布的 rc API；上游版权保留在
[LICENSE](LICENSE)。MIT。

---

# DeepSeek Harness TUI (Customized dsh-tui)

A customized fork of [@dsh-tui/dsh-tui](https://github.com/dsh-tui/dsh-tui) (MIT) — the
terminal UI for DeepSeek Harness. It is an out-of-tree dsh bundle layered over the official
`@deepseek-ai/dsh-base`, so the plugin ecosystem is the same one the web surface uses.

## Features

- **音鲸 (sound whale) welcome banner**: a blue whale with music notes `♪ ♫`, greeting "我是音鲸".
- **Claude Code-style flat conversation**: `❯` prompt marker for user messages, clay `#D97757` accent, Markdown rendering, collapsible tool cards.
- **Collapsible reasoning**: collapsed to one `✻ Thinking · N lines` line by default; three-state cycle (collapsed / expanded / hidden).
  - `Ctrl+R` or a **left click** (in the transcript) toggles; `/details reasoning collapsed|expanded|hidden` sets it directly.
- **Input pinned to the bottom**: framed by two horizontal rules, adapting to window height.
- **Bottom status bar**: `model · reasoning effort` on the left (**clickable in-place switching**), current file name in the bottom-right corner.
- **IDE integration**: detects VS Code / Cursor and shows the currently open file name (with `ide-extension`).

## Install

Requires Node `^22.19 || >=24` and the `dsh` CLI (`npm i -g @deepseek-ai/dsh@next`).

```sh
dsh plugin --profile tui add github:graduy/Deepseek-Harness-Tui
dsh -tui                        # or: dsh --profile tui
dsh --profile tui --resume <id> # resume a session
```

A git install builds on install via the `prepare` script (`tsdown`). pnpm blocks dependency
build scripts by default; if `add` fails, add the printed key to
`~/.dsh/profiles/tui/pnpm-workspace.yaml` and re-run:

```yaml
allowBuilds:
  "@dsh-tui/dsh-tui": true
```

## Build

```sh
pnpm install   # applies the pi-tui patch (patches/)
pnpm build     # tsc declarations + tsdown runtime bundle into lib/
```

pi-tui is pinned at 0.80.7 with a pnpm patch and bundled into `lib/`, so installs outside this
repo never see an unpatched copy.

## IDE integration (current file in VS Code / Cursor)

`ide-extension/` is a tiny VS Code / Cursor extension that writes the current file + workspace
to `$DSH_HOME/ide-context.json`. Install:

```sh
cd ide-extension
./install.sh        # or: code/cursor --install-extension dsh-ide-context-0.1.0.vsix
```

Then reload the window (`Ctrl+Shift+P` → Reload Window) and run `dsh -tui` in the integrated
terminal; the current file name appears in the bottom-right corner.

## Key bindings

- `Enter` send; `Shift/Alt+Enter` newline; `↑/↓` history
- `Esc` cancel turn; `Ctrl+C` cancel / clear / exit; `Ctrl+D` exit
- `Ctrl+O` cycle tool cards (collapse/expand/hide); `Ctrl+R` cycle reasoning; `Ctrl+L` redraw
- Left click: switch model / reasoning effort on the status bar; toggle reasoning elsewhere
- Slash commands: `/model` `/resume` `/compact` `/details` `/help` `/palette` `/status` `/skill:<name>` …

## Provenance & license

This repo is a customized fork of `dsh-tui/dsh-tui`; its TUI implementation was recovered from
DeepSeek Harness repository history (`packages/ui/tui`, removed upstream in commit `10bb9cbf4a`)
and ported to the published rc API. Upstream copyright is preserved in [LICENSE](LICENSE). MIT.
