
/* IMPORT */

import * as _ from 'lodash';
import * as vscode from 'vscode';
import Decorator from './decorator';

/* ACTIVATE */

function activate ( context: vscode.ExtensionContext ) {

  Decorator.init ();

  const debouncedDectorate = _.debounce ( () => Decorator.decorate (), 100 );

  context.subscriptions.push (
    vscode.workspace.onDidChangeConfiguration ( () => Decorator.init (), debouncedDectorate () ),
    vscode.workspace.onDidChangeTextDocument ( debouncedDectorate ),
    vscode.window.onDidChangeActiveTextEditor ( debouncedDectorate )
  );

  Decorator.decorate ();

}

/* EXPORT */

export {activate};
