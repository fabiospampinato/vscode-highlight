
/* IMPORT */

import vscode from 'vscode';

/* MAIN */

type Change = {
  rangesPrev: vscode.Range[],
  rangesNext: vscode.Range[],
  shifts?: ChangeShiftsMap
};

type ChangeShiftsMap = {
  [line: number]: number,
  start: number,
  end: number
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

export type {Change, ChangeShiftsMap, Decoration, Highlight, Options};
