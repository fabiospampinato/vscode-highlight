
/* IMPORT */

import vscode from 'vscode';
import {decorate, decorateAll, undecorateAll} from './decoration';
import {getOptions} from './utils';

/* MAIN */

const activate = (): void => {

  let options = getOptions ();

  vscode.window.onDidChangeActiveTextEditor ( editor => {
    if ( !editor ) return;
    decorate ( editor, options );
  });

  vscode.window.onDidChangeVisibleTextEditors ( editors => {
    for ( const editor of editors ) {
      decorate ( editor, options );
    }
  });

  vscode.workspace.onDidChangeTextDocument ( event => {
    const editors = vscode.window.visibleTextEditors.filter ( editor => editor.document === event.document );
    if ( !editors.length ) return;
    const ranges = event.contentChanges.map ( change => change.range );
    if ( !ranges.length ) return;
    for ( const editor of editors ) {
      decorate ( editor, options, ranges );
    }
  });

  vscode.workspace.onDidChangeConfiguration ( event => {
    if ( !event.affectsConfiguration ( 'highlight' ) ) return;
    undecorateAll ();
    options = getOptions ();
    decorateAll ( options );
  });

  decorateAll ( options );

};

/* EXPORT */

export {activate};
