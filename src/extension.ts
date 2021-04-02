
/* IMPORT */

import * as vscode from 'vscode';
import Changes from './changes';
import Config from './config';
import Decorator from './decorator';

/* ACTIVATE */

function activate ( context: vscode.ExtensionContext ) {

  Decorator.init ();

  context.subscriptions.push (
    vscode.workspace.onDidChangeConfiguration ( () => { Decorator.init (); Decorator.decorate ( undefined, true ); } ),
    vscode.workspace.onDidChangeTextDocument ( Changes.onChanges ),
    vscode.window.onDidChangeActiveTextEditor ( () => Decorator.decorate ( undefined, true ) )
  );

  Config.init ();

  Decorator.decorate ();

}

/* EXPORT */

export {activate};
