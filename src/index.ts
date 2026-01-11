
/* IMPORT */

import vscode from 'vscode';
import * as Commands from './commands';
import {decorate, decorateAll, undecorateAll} from './decoration';
import {getChange, getOptions} from './utils';

/* MAIN */

const activate = ( context: vscode.ExtensionContext ): void => {

  const isInited = context.globalState.get<boolean>( 'inited', false );

  if ( !isInited ) {
    Commands.init ();
    context.globalState.update ( 'inited', true );
  }

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
    if ( !event.contentChanges.length ) return; // Weirdly this can happen
    const editors = vscode.window.visibleTextEditors.filter ( editor => editor.document === event.document );
    if ( !editors.length ) return;
    const change = getChange ( event.contentChanges );
    for ( const editor of editors ) {
      decorate ( editor, options, change );
    }
  });

  vscode.workspace.onDidChangeConfiguration ( event => {
    const isExtensionChanged = event.affectsConfiguration ( 'highlight' );
    const isThemeChanged = event.affectsConfiguration ( 'workbench.colorTheme' );
    if ( !isExtensionChanged && !isThemeChanged ) return;
    undecorateAll ();
    options = getOptions ();
    decorateAll ( options );
  });

  decorateAll ( options );

};

/* EXPORT */

export {activate};
