
/* IMPORT */

import vscode from 'vscode';
import decorate from './decorate';

/* MAIN */

const activate = (): void => {

  vscode.window.onDidChangeActiveTextEditor ( editor => {
    if ( !editor ) return;
    decorate ( editor, [] );
  });

  vscode.window.onDidChangeVisibleTextEditors ( editors => {
    for ( const editor of editors ) {
      decorate ( editor, [] );
    }
  });

  vscode.workspace.onDidChangeTextDocument ( event => {
    const editors = vscode.window.visibleTextEditors.filter ( editor => editor.document === event.document );
    if ( !editors.length ) return;
    const ranges = event.contentChanges.map ( change => change.range );
    if ( !ranges.length ) return;
    for ( const editor of editors ) {
      decorate ( editor, ranges );
    }
  });

  for ( const editor of vscode.window.visibleTextEditors ) {
    decorate ( editor, [] );
  }

};

/* EXPORT */

export {activate};
