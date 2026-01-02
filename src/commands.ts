
/* IMPORT */

import vscode from 'vscode';

/* MAIN */

const enable = (): void => {

  toggle ( true );

};

const disable = (): void => {

  toggle ( false );

};

const toggle = ( force?: boolean ): void => {

  const config = vscode.workspace.getConfiguration ( 'highlight' );
  const valueNext = force ?? !config.get ( 'enabled', true );

  config.update ( 'enabled', valueNext );

};

/* EXPORT */

export {enable, disable, toggle};
