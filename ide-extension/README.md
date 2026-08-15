# DSH IDE Context

一个给 VS Code / Cursor 用的微型扩展，把「当前打开的文件 + 工作区」写进
`$DSH_HOME/ide-context.json`，让在集成终端里运行的 `dsh -tui` 能识别它们。

无网络、无遥测、无命令，只做一件事：在编辑器/窗口切换时写一个 JSON 文件。

## 为什么需要它

VS Code/Cursor 不会把「当前活动文件」通过环境变量暴露给集成终端（只有
`TERM_PROGRAM`、工作目录这些）。所以 `dsh -tui` 能自动识别 IDE 和工作区，
但**当前打开的文件必须靠这个扩展提供**。

## 安装

```sh
cd dsh-ide-extension
./install.sh
```

脚本会把扩展复制到已存在的 IDE 扩展目录（`~/.vscode/extensions`、
`~/.cursor/extensions`、`~/.windsurf/extensions` 等）。

然后**重启/重载窗口**（VS Code: `Ctrl+Shift+P` → "Reload Window"；
Cursor 同理）。

## 效果

装好后，在集成终端里运行：

```sh
dsh -tui
```

输入框下方的状态区会多出一行，例如：

```
Cursor · /home/grady/project · 打开 src/foo.ts
```

- 前半段是**工作区**（多根工作区取第一个）；
- `打开 …` 是**当前活动文件**（相对工作区的路径）；
- 切换标签页/编辑器时会实时更新（约 1.5s 内）。

## 未安装扩展时

`dsh -tui` 仍会识别 IDE（`VS Code` / `Cursor`），并显示工作区为终端当前
目录；但「当前打开的文件」会缺失。装上本扩展即可补齐。

## 卸载

删除对应扩展目录即可：

```sh
rm -rf ~/.vscode/extensions/dsh-ide-context
rm -rf ~/.cursor/extensions/dsh-ide-context
```

## License

MIT
