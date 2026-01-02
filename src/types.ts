
/* IMPORT */

import vscode from 'vscode';

/* MAIN */

type Decoration = {
  ( match: RegExpExecArray ): vscode.TextEditorDecorationType
};

type Highlight = {
  fileRe?: RegExp,
  languageRe?: RegExp,
  highlightRe: RegExp,
  highlightDecorations: Decoration[],
  isEnabled: boolean,
  isIntraline: boolean
};

type Options = {
  debugging: boolean,
  enabled: boolean,
  highlights: Highlight[]
};

/* EXPORT */

export type {Decoration, Highlight, Options};
