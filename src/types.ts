
/* IMPORT */

import type vscode from 'vscode';

/* MAIN */

type Decoration = {
  ( match: RegExpExecArray ): vscode.TextEditorDecorationType
};

type Highlight = {
  fileRe?: RegExp,
  languageRe?: RegExp,
  highlightRe: RegExp,
  highlightDecorations: Decoration[],
  isIntraline: boolean
};

/* EXPORT */

export type {Decoration, Highlight};
