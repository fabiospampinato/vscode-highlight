
/* IMPORT */

import * as _ from 'lodash';
import * as vscode from 'vscode';
import RegexesDefaults from './config_regexes_defaults';

/* CONFIG */

const Config = {

  get ( extension = 'highlight' ) {

    return vscode.workspace.getConfiguration ().get ( extension ) as any;

  },

  init () {

    const config = Config.get ();

    if ( !_.isEmpty ( config.regexes ) ) return;

    vscode.workspace.getConfiguration ().update ( 'highlight.regexes', RegexesDefaults, vscode.ConfigurationTarget.Global );

  }

};

/* EXPORT */

export default Config;
