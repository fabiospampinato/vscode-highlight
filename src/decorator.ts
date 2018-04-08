
/* IMPORT */

import * as _ from 'lodash';
import stringMatches from 'string-matches';
import * as vscode from 'vscode';
import Config from './config';

/* DECORATOR */

const Decorator = {

  /* GENERAL */

  init () {

    Decorator.initConfig ();
    Decorator.initRegexes ();
    Decorator.initTypes ();

  },

  /* CONFIG */

  config: undefined,

  initConfig () {

    Decorator.config = Config.get ();

  },

  /* REGEXES */

  regexesStrs: undefined,
  regexes: undefined,

  initRegexes () {

    Decorator.regexesStrs = Object.keys ( Decorator.config.regexes );

    const res = Decorator.regexesStrs.map ( reStr => new RegExp ( reStr, Decorator.config.regexFlags ) );

    Decorator.regexes = _.zipObject ( Decorator.regexesStrs, res );

  },

  getRegex ( reStr ) {

    return Decorator.regexes[reStr];

  },

  /* TYPES */

  types: undefined,

  initTypes () {

    if ( Decorator.types ) Decorator.undecorate ();

    const types = Decorator.regexesStrs.map ( reStr => _.castArray ( Decorator.config.regexes[reStr] ).map ( options => vscode.window.createTextEditorDecorationType ( options ) ) );

    Decorator.types = _.zipObject ( Decorator.regexesStrs, types );

  },

  getType ( reStr, matchNr = 0 ) {

    return Decorator.types[reStr][matchNr];

  },

  /* DECORATIONS */

  decorate ( textEditor: vscode.TextEditor = vscode.window.activeTextEditor ) {

    if ( !textEditor ) return;

    const doc = textEditor.document,
          text = doc.getText (),
          decorations = new Map ();

    /* CLEARING */

    Decorator.undecorate ();

    /* PARSING */

    Decorator.regexesStrs.forEach ( reStr => {

      const re = Decorator.getRegex ( reStr ),
            matches = stringMatches ( text, re );

      matches.forEach ( match => {

        let startIndex = match.index;

        for ( let i = 1, l = match.length; i < l; i++ ) {

          const value = match[i];

          if ( _.isUndefined ( value ) ) continue;

          const startPos = doc.positionAt ( startIndex ),
                endPos = doc.positionAt ( startIndex + value.length ),
                range = new vscode.Range ( startPos, endPos ),
                type = Decorator.getType ( reStr, i - 1 );

          if ( !type ) return;

          const ranges = decorations.get ( type );

          decorations.set ( type, ( ranges || [] ).concat ([ range ]) );

          startIndex += value.length;

        }

      });

    });

    /* SETTING */

    decorations.forEach ( ( ranges, type ) => {

      textEditor.setDecorations ( type, ranges );

    });

  },

  undecorate ( textEditor: vscode.TextEditor = vscode.window.activeTextEditor ) {

    if ( !textEditor ) return;

    const types = _.flatten ( _.values ( Decorator.types ) );

    types.map ( type => {

      textEditor.setDecorations ( type, [] );

    });

  }

};

/* EXPORT */

export default Decorator;
