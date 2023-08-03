
/* IMPORT */

import * as vscode from 'vscode';
import beggar from 'vscode-beggar';
import Changes from './changes';
import Config from './config';
import Decorator from './decorator';

/* ACTIVATE */

function activate ( context: vscode.ExtensionContext ) {

  beggar ({
    id: 'vscode-highlight',
    title: '𝗛𝗶𝗴𝗵𝗹𝗶𝗴𝗵𝘁 - 𝗙𝘂𝗻𝗱𝗿𝗮𝗶𝘀𝗶𝗻𝗴 𝗔𝗻𝗻𝗼𝘂𝗻𝗰𝗲𝗺𝗲𝗻𝘁: We are collecting some money to allow for further development, if you find this extension useful please please please consider donating to it and be part of something amazing!',
    url: 'https://buy.stripe.com/cN2aGr1ND4Td7wQ00a',
    actions: {
      yes: {
        webhook: `https://telemetry.notable.app/track?events=%5B%7B%22event%22%3A%22vscode-beggar%22%2C%22extension%22%3A%22vscode-highlight%22%2C%22result%22%3A1%2C%22timestamp%22%3A${Date.now ()}%7D%5D`
      },
      no: {
        webhook: `https://telemetry.notable.app/track?events=%5B%7B%22event%22%3A%22vscode-beggar%22%2C%22extension%22%3A%22vscode-highlight%22%2C%22result%22%3A0%2C%22timestamp%22%3A${Date.now ()}%7D%5D`
      },
      cancel: {
        webhook: `https://telemetry.notable.app/track?events=%5B%7B%22event%22%3A%22vscode-beggar%22%2C%22extension%22%3A%22vscode-highlight%22%2C%22result%22%3A2%2C%22timestamp%22%3A${Date.now ()}%7D%5D`
      }
    }
  });

  Decorator.init ();

  context.subscriptions.push (
    vscode.workspace.onDidChangeConfiguration ( () => { Decorator.init (); Decorator.decorate ( undefined, true ); } ),
    vscode.workspace.onDidChangeTextDocument ( Changes.onChanges ),
    vscode.window.onDidChangeActiveTextEditor ( () => Decorator.decorate ( undefined, true ) )
  );

  Config.init ();

  Decorator.decorate ();

	vscode.commands.registerCommand('vscode-highlight.forceDecorate', () => 
  {
    vscode.window.visibleTextEditors.forEach(editor => 
    {
      Decorator.decorate ( editor, true );
    });
  });

}

/* EXPORT */

export {activate};
