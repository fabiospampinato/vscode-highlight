
/* IMPORT */

import vscode from 'vscode';
import * as Commands from './commands';
import {decorate, decorateAll, undecorateAll} from './decoration';
import {getChangeShiftMap, getOptions} from './utils';

/* MAIN */

const activate = (): void => {

  Commands.init ();

  vscode.commands.registerCommand ( 'highlight.enable', Commands.enable );
  vscode.commands.registerCommand ( 'highlight.disable', Commands.disable );
  vscode.commands.registerCommand ( 'highlight.toggle', Commands.toggle );

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
    const shifts = getChangeShiftMap ( event.contentChanges, event.document.lineCount );
    const change = { ranges, shifts };
    for ( const editor of editors ) {
      decorate ( editor, options, change );
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
