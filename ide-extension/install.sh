#!/bin/sh
# Install the DSH IDE Context extension into VS Code and/or Cursor by copying
# it into their per-user extension directories (no packaging/build required).
set -e

HERE="$(cd "$(dirname "$0")" && pwd)"
# Match the folder name `code --install-extension` produces (<publisher>.<name>-<version>)
# so this script is idempotent with a CLI install.
NAME="local.dsh-ide-context-0.1.0"

# Prefer the packaged .vsix via the IDE CLI when available and the CLI can install it;
# otherwise fall back to a direct copy into the extension directory.
VSIX="$HERE/dsh-ide-context-0.1.0.vsix"

install_via_cli() {
  cli="$1"
  if ! command -v "$cli" >/dev/null 2>&1; then return 1; fi
  if [ ! -f "$VSIX" ]; then return 1; fi
  echo "→ $cli --install-extension $VSIX"
  "$cli" --install-extension "$VSIX" --force >/dev/null 2>&1
}

install_to() {
  target="$1"
  if [ -z "$target" ]; then return; fi
  dest="$target/$NAME"
  echo "→ $dest"
  mkdir -p "$dest"
  cp "$HERE/package.json" "$HERE/extension.js" "$HERE/LICENSE" "$dest/"
  [ -f "$HERE/README.md" ] && cp "$HERE/README.md" "$dest/"
}

# Prefer the packaged .vsix via the IDE CLIs; fall back to a direct copy for
# any IDE whose CLI is missing or whose extension dir is present but un-CLI-able.
if command -v code >/dev/null 2>&1 && [ -f "$VSIX" ]; then
  install_via_cli code
else
  [ -d "$HOME/.vscode" ] && install_to "$HOME/.vscode/extensions"
fi
if command -v cursor >/dev/null 2>&1 && [ -f "$VSIX" ]; then
  install_via_cli cursor
else
  [ -d "$HOME/.cursor" ] && install_to "$HOME/.cursor/extensions"
fi
[ -d "$HOME/.vscode-insiders" ] && install_to "$HOME/.vscode-insiders/extensions"
[ -d "$HOME/.windsurf" ] && install_to "$HOME/.windsurf/extensions"

echo "Done. Restart VS Code / Cursor (or run: Developer → Reload Window)."
echo "Then open a file and start: dsh -tui"
