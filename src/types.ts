
/* IMPORT */

import type vscode from 'vscode';

/* MAIN */

type Highlight = {
  fileRe?: RegExp,
  languageRe?: RegExp,
  highlightRe: RegExp,
  highlightDecorations: vscode.TextEditorDecorationType[],
  isIntraline: boolean
};

/* EXPORT */

export type {Highlight};
