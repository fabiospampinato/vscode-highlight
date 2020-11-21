
/* IMPORT */

import * as vscode from 'vscode';

/* CONFIG */

const Config = {

  get ( extension = 'highlight' ) {

    return vscode.workspace.getConfiguration ().get ( extension ) as any;

  },

  colorTheme() {
    const theme = vscode.workspace.getConfiguration ().get ( "workbench.colorTheme" ) || "Default";
    return `[${theme}]`;
  }

};

/* EXPORT */

export default Config;
