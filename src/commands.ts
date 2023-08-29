
/* IMPORT */

import * as vscode from 'vscode';
import Decorator from './decorator';

/* MAIN */

const forceDecorate = (): void => {

  vscode.window.visibleTextEditors.forEach (editor => {

    Decorator.decorate ( editor, true );

  });

};

/* EXPORT */

export {forceDecorate};
