
/* IMPORT */

import * as _ from 'lodash';
import stringMatches from 'string-matches';
import * as vscode from 'vscode';
import Config from './config';
import Utils from './utils';

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
  colorTheme: undefined,

  initConfig () {

    Decorator.config = Config.get ();
    Decorator.colorTheme = Config.colorTheme ();

  },

  /* REGEXES */

  regexesStrs: undefined,
  regexes: undefined,

  initRegexes () {

    Decorator.regexesStrs = Object.keys ( Decorator.config.regexes );

    const res = Decorator.regexesStrs.map ( reStr => {

      const options = Decorator.config.regexes[reStr];

      return new RegExp ( reStr, options.regexFlags || Decorator.config.regexFlags );

    });

    Decorator.regexes = _.zipObject ( Decorator.regexesStrs, res );

  },

  getRegex ( reStr ) {

    return Decorator.regexes[reStr];

  },

  /* TYPES */

  types: undefined,
  typesDynamic: [],

  initTypes () {

    if ( Decorator.types ) Decorator.undecorate ();

    const decorations = Decorator.config.decorations,
          types = Decorator.regexesStrs.map ( reStr => {

            const options = Decorator.config.regexes[reStr];
            let themeDecorations = undefined;
            const themeOptions = options[Decorator.colorTheme];
            if (themeOptions) { themeDecorations = themeOptions.decorations; }
            const reDecorations = _.castArray ( themeDecorations || options.decorations || options );

            return reDecorations.map ( options => {

              const decorationsFull = _.merge ( {}, decorations, options ),
                    decorationsStr = JSON.stringify ( decorationsFull );

              if ( /\$\d/.test ( decorationsStr ) ) { // Dynamic decorator

                return _.memoize<any> ( match => {

                  const decorationsStrReplaced = decorationsStr.replace ( /\$(\d)/g, ( m, index ) => match[index] ),
                        decorationsFullReplaced = JSON.parse ( decorationsStrReplaced );

                  const type = vscode.window.createTextEditorDecorationType ( decorationsFullReplaced );

                  Decorator.typesDynamic.push ( type );

                  return type;

                }, match => match[0] );

              } else { // Static decorator

                return vscode.window.createTextEditorDecorationType ( decorationsFull );

              }

            });

          });

    Decorator.types = _.zipObject ( Decorator.regexesStrs, types );

  },

  getTypes ( reStr ) {

    return Decorator.types[reStr];

  },

  getType ( reStr, matchNr = 0 ) {

    return Decorator.getTypes ( reStr )[matchNr];

  },

  /* DECORATIONS */

  decorations: {}, // Map of document id => decorations

  decorate ( target?: vscode.TextEditor | vscode.TextDocument, force?: boolean ) {

    if ( !target ) {

      const textEditor = vscode.window.activeTextEditor;

      if ( !textEditor ) return;

      return Decorator.decorate ( textEditor, force );

    }

    if ( !Utils.editor.is ( target ) ) {

      const textEditors = Utils.document.getEditors ( target );

      return textEditors.forEach ( textEditor => Decorator.decorate ( textEditor, force ) );

    }

    const textEditor = target,
          doc = target.document,
          text = doc.getText (),
          decorations = new Map ();

    /* PARSING */

    Decorator.regexesStrs.forEach ( reStr => {

      const options = Decorator.config.regexes[reStr],
            isFiltered = Utils.document.isFiltered ( doc, options );

      if ( !isFiltered ) return;

      const re = Decorator.getRegex ( reStr ),
            matches = stringMatches ( text, re, Decorator.config.maxMatches );

      matches.forEach ( match => {

        let startIndex = match.index;

        for ( let i = 1, l = match.length; i < l; i++ ) {

          const value = match[i];

          if ( _.isUndefined ( value ) ) continue;

          const startPos = doc.positionAt ( startIndex ),
                endPos = doc.positionAt ( startIndex + value.length ),
                range = new vscode.Range ( startPos, endPos );

          let type = Decorator.getType ( reStr, i - 1 );

          if ( !type ) return;

          if ( _.isFunction ( type ) ) type = type ( match );

          const ranges = decorations.get ( type );

          decorations.set ( type, ( ranges || [] ).concat ([ range ]) );

          startIndex += value.length;

        }

      });

    });

    /* LINE COUNT */

    const prevLineCount = Decorator.docsLines[textEditor['id']];

    Decorator.docsLines[textEditor['id']] = doc.lineCount;

    /* CLEARING */

    const prevDecorations = Decorator.decorations[textEditor['id']];

    if ( force !== true && ( ( ( !prevDecorations || !prevDecorations.size ) && !decorations.size ) || ( prevLineCount === doc.lineCount && _.isEqual ( prevDecorations, decorations ) ) ) ) return; // Nothing changed, skipping unnecessary work //URL: https://github.com/Microsoft/vscode/issues/50415

    Decorator.decorations[textEditor['id']] = decorations;

    Decorator.undecorate ();

    /* SETTING */

    decorations.forEach ( ( ranges, type ) => {

      textEditor.setDecorations ( type, ranges );

    });

  },

  docsLines: {},

  decorateLines ( doc: vscode.TextDocument, lineNrs: number[] ) {

    // Optimizing the case where:
    // 1. The line count is the same
    // 2. There were no decorations in lineNrs
    // 3. There still are no decorations in lineNrs

    const textEditor = Utils.document.getEditors ( doc )[0];

    if ( textEditor && Decorator.docsLines[textEditor['id']] === doc.lineCount ) {

      const decorations = Decorator.decorations[textEditor['id']];

      let hadDecorations = false;

      if ( decorations ) {

        for ( let ranges of decorations.values () ) {

          if ( ranges.find ( range => _.includes ( lineNrs, range.start.line ) || _.includes ( lineNrs, range.end.line ) ) ) {

            hadDecorations = true;

            break;

          }

        }

      }

      if ( !hadDecorations ) {

        const hasDecorations = _.isNumber ( lineNrs.find ( lineNr => {

          const line = doc.lineAt ( lineNr );

          return Decorator.regexesStrs.find ( reStr => {

            const re = Decorator.getRegex ( reStr ),
                  matches = stringMatches ( line.text, re );

            return !!matches.length;

          });

        }));

        if ( !hasDecorations ) return;

      }

    }

    Decorator.decorate ( doc );

  },

  undecorate ( textEditor: vscode.TextEditor = vscode.window.activeTextEditor ) {

    if ( !textEditor ) return;

    const types = _.flatten ( _.values ( Decorator.types ) );

    types.forEach ( type => {

      if ( _.isFunction ( type ) ) return;

      textEditor.setDecorations ( type, [] );

    });

    Decorator.typesDynamic.forEach ( type => {

      textEditor.setDecorations ( type, [] );

    });

  }

};

/* EXPORT */

export default Decorator;
