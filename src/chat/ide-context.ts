/**
 * IDE-context detection for terminals running inside VS Code / Cursor. The
 * workspace and active file come from the companion `dsh-ide-context` extension,
 * which atomically writes `$DSH_HOME/ide-context.json` on editor and window
 * changes. Without that extension we still detect the host IDE and fall back to
 * the terminal's current directory as the workspace.
 * @module @deepseek-ai/dsh-tui/chat/ide-context
 */

import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { basename, join } from 'node:path'

/** The companion extension's payload. */
export interface IdeContext {
  workspace: string | null
  activeFile: string | null
  languageId: string | null
  updatedAt: number
}

/** The host IDE name when the terminal reports one, otherwise `undefined`. */
export function detectIde(): string | undefined {
  const term = process.env.TERM_PROGRAM
  if (term === 'cursor') return 'Cursor'
  if (term === 'vscode') return 'VS Code'
  // Some forks still report TERM_PROGRAM=vscode; sniff the helper binary path.
  const helper = process.env.VSCODE_IPC_HOOK_CLI ?? process.env.VSCODE_GIT_ASKPASS_NODE ?? ''
  if (/cursor/i.test(helper)) return 'Cursor'
  if (/vscode|[/\\]code(?:-insiders)?(?:\.cmd|\.exe)?$/i.test(helper)) return 'VS Code'
  return undefined
}

/** The absolute path the companion extension writes its payload to. */
export function ideContextPath(): string {
  return join(process.env.DSH_HOME ?? join(homedir(), '.dsh'), 'ide-context.json')
}

/** Read the companion payload, or `undefined` when absent or malformed. */
export function readIdeContext(path: string): IdeContext | undefined {
  try {
    if (!existsSync(path)) return undefined
    const parsed = JSON.parse(readFileSync(path, 'utf8')) as Partial<IdeContext>
    if (typeof parsed !== 'object' || parsed === null) return undefined
    if (typeof parsed.workspace !== 'string' && parsed.workspace !== null) return undefined
    if (typeof parsed.activeFile !== 'string' && parsed.activeFile !== null) return undefined
    return {
      workspace: parsed.workspace ?? null,
      activeFile: parsed.activeFile ?? null,
      languageId: typeof parsed.languageId === 'string' ? parsed.languageId : null,
      updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : 0,
    }
  } catch {
    return undefined
  }
}

/**
 * Format the active file's base name for the bottom-right corner, or `''` when
 * no file is known. The workspace stays internal (the agent already uses the
 * terminal cwd); only the file name is surfaced to the user.
 * @param context - Latest companion payload, when available.
 * @returns The file base name, or `''`.
 */
export function formatIdeFile(context: IdeContext | undefined): string {
  const active = context?.activeFile
  if (active === null || active === undefined) return ''
  return basename(active)
}
