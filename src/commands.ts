
/* IMPORT */

import vscode from 'vscode';
import decorate from './decorate';

/* MAIN */

//TODO: update intraline regexes frequently, and interline regexes infrequently

const forceDecorate = ( editor: vscode.TextEditor, ranges: vscode.Range[] ): void => {

  decorate ( editor, ranges );

};

const forceDecorateAll = (): void => {

  for ( const editor of vscode.window.visibleTextEditors ) {

    forceDecorate ( editor, [] );

  }

};

/* EXPORT */

export {forceDecorate, forceDecorateAll};
