
/* IMPORT */

import vscode from 'vscode';
import * as Commands from './commands';

/* MAIN */

const activate = (): void => {

  vscode.commands.registerCommand ( 'highlight.forceDecorate', Commands.forceDecorateAll );

  vscode.window.onDidChangeActiveTextEditor ( editor => {
    if ( !editor ) return;
    Commands.forceDecorate ( editor, [] ); //TODO: either decorate the whole thing or do nothing, no ranges changed
  });

  vscode.window.onDidChangeVisibleTextEditors ( editors => {
    for ( const editor of editors ) {
      Commands.forceDecorate ( editor, [] );
    }
  });

  vscode.workspace.onDidChangeTextDocument ( event => {
    const editors = vscode.window.visibleTextEditors.filter ( editor => editor.document === event.document );
    if ( !editors.length ) return;
    const ranges = event.contentChanges.map ( change => change.range ); //TODO: check that pasting in a block of text containing a todo in place of somewhere with a single line is handled correctly
    if ( !ranges.length ) return;
    for ( const editor of editors ) {
      Commands.forceDecorate ( editor, ranges );
    }
  });

  Commands.forceDecorateAll ();

};

/* EXPORT */

export {activate};
