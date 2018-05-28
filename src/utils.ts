
/* IMPORT */

import * as vscode from 'vscode';

/* UTILS */

const Utils = {

  document: {

    getEditor ( doc: vscode.TextDocument ) {

      return vscode.window.visibleTextEditors.find ( textEditor => textEditor.document === doc );

    }

  }

};

/* EXPORT */

export default Utils;
