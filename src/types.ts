
/* IMPORT */

import vscode from 'vscode';

/* MAIN */

type Change = {
  ranges: vscode.Range[],
  shifts?: Record<number, number>
};

type Decoration = {
  ( match: RegExpExecArray ): vscode.TextEditorDecorationType
};

type Highlight = {
  fileRe?: RegExp,
  languageRe?: RegExp,
  highlightRe: RegExp,
  highlightDecorations: Decoration[],
  highlightLimit: number,
  isEnabled: boolean,
  isIntraline: boolean
};

type Options = {
  debugging: boolean,
  enabled: boolean,
  highlights: Highlight[]
};

/* EXPORT */

export type {Change, Decoration, Highlight, Options};
