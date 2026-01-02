
/* IMPORT */

import vscode from 'vscode';
import {CONFIG_REGEXES_DEFAULT} from './constants';
import {isEmptyPlainObject} from './utils';

/* MAIN */

const init = (): void => {

  const config = vscode.workspace.getConfiguration ( 'highlight' );
  const value = config.get ( 'regexes', {} );

  if ( !isEmptyPlainObject ( value ) ) return;

  config.update ( 'regexes', CONFIG_REGEXES_DEFAULT, vscode.ConfigurationTarget.Global );

};

const enable = (): void => {

  toggle ( true );

};

const disable = (): void => {

  toggle ( false );

};

const toggle = ( force?: boolean ): void => {

  const config = vscode.workspace.getConfiguration ( 'highlight' );
  const valueNext = force ?? !config.get ( 'enabled', true );

  config.update ( 'enabled', valueNext, vscode.ConfigurationTarget.Global );

};

/* EXPORT */

export {init, enable, disable, toggle};
