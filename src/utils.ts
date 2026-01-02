
/* IMPORT */

import memoize from 'lomemo';
import isEmptyPlainObject from 'plain-object-is-empty';
import isIntraline from 'regexp-is-intraline';
import vscode from 'vscode';
import {getConfig} from 'vscode-extras';
import type {Decoration, Highlight, Options} from './types';

/* MAIN */

const getDecoration = memoize ( ( regex: RegExp, options: vscode.DecorationRenderOptions ): Decoration => { // It's important to memoize decorations by regex too, it makes updating them simpler

  const optionsSerialized = JSON.stringify ( options );
  const isDynamic = /\$\d+/.test ( optionsSerialized );

  if ( isDynamic ) { // Dynamic decoration

    return memoize ( ( match: RegExpExecArray ): vscode.TextEditorDecorationType => {

      const optionsResolved = optionsSerialized.replace ( /\$(\d+)/g, ( _, index ) => match[index] );
      const options = JSON.parse ( optionsResolved );

      return vscode.window.createTextEditorDecorationType ( options );

    }, match => match.join ( '-' ) );

  } else { // Static decoration

    const decoration = vscode.window.createTextEditorDecorationType ( options );

    return () => decoration;

  }

}, ( regex, value ) => `${regex.toString ()}-${JSON.stringify ( value )}` );

const getHighlights = (): Highlight[] => {

  const config = getConfig ( 'highlight' );
  const decorations = isObject ( config?.['decorations'] ) ? config['decorations'] : { rangeBehavior: 3 };
  const regexes = isObject ( config?.['regexes'] ) ? config['regexes'] : {};
  const regexFlags = isString ( config?.['regexFlags'] ) ? config['regexFlags'] : 'gi';

  const highlights: Highlight[] = [];

  for ( const [highlightReSource, highlightConfig] of Object.entries ( regexes ) ) {

    const fileRe = isObject ( highlightConfig ) && isString ( highlightConfig['fileRe'] ) ? getRegExp ( highlightConfig['fileRe'], 'i', '' ) : undefined;
    const languageRe = isObject ( highlightConfig ) && isString ( highlightConfig['languageRe'] ) ? getRegExp ( highlightConfig['languageRe'], 'i', '' ) : undefined;

    const highlightReFlagsFallback = isObject ( highlightConfig ) && isString ( highlightConfig['regexFlags'] ) ? highlightConfig['regexFlags'] : regexFlags;
    const highlightReFlagsExtra = 'gd'; // + global + indices
    const highlightRe = getRegExp ( highlightReSource, highlightReFlagsFallback, highlightReFlagsExtra );

    const highlightDecorationsRaw = isObject ( highlightConfig ) && isArray ( highlightConfig['decorations'] ) && highlightConfig['decorations'].every ( isObject ) ? highlightConfig['decorations'] : isArray ( highlightConfig ) && highlightConfig.every ( isObject ) ? highlightConfig : [];
    const highlightDecorationsRawNormalized = highlightDecorationsRaw.map ( decoration => ({ ...decorations, ...decoration }) );
    const highlightDecorations = highlightDecorationsRawNormalized.map ( decoration => getDecoration ( highlightRe, decoration ) );

    const isEnabled = isObject ( highlightConfig ) && isBoolean ( highlightConfig['enabled'] ) ? highlightConfig['enabled'] : true;
    const isIntraline = isRegExpIntraline ( highlightRe );

    const highlight: Highlight = {
      fileRe,
      languageRe,
      highlightRe,
      highlightDecorations,
      isEnabled,
      isIntraline
    };

    highlights.push ( highlight );

  }

  return highlights;

};

const getOptions = (): Options => {

  const config = getConfig ( 'highlight' );
  const debugging = isBoolean ( config?.['debugging'] ) ? config['debugging'] : false;
  const enabled = isBoolean ( config?.['enabled'] ) ? config['enabled'] : true;
  const highlights = getHighlights ();
  const options: Options = { debugging, enabled, highlights };

  return options;

};

const getRangeForWholeDocument = ( document: vscode.TextDocument ): vscode.Range => {

  return new vscode.Range ( 0, 0, document.lineCount - 1, Infinity );

};

const getRangeForWholeLines = ( range: vscode.Range ): vscode.Range => {

  return new vscode.Range ( range.start.line, 0, range.end.line, Infinity );

};

const getRegExp = memoize ( ( value: string, flagsFallback: string, flagsExtra: string ): RegExp => {

  const regexRe = /^\/(.*)\/([gimsuvyd]*)$/;
  const match = value.match ( regexRe );

  if ( match ) { // /source/flags

    const source = match[1];
    const flags = uniqChars ( `${match[2]}${flagsExtra}` );

    return new RegExp ( source, flags );

  } else { // source

    const flags = uniqChars ( `${flagsFallback}${flagsExtra}` );

    return new RegExp ( value, flags );

  }

}, ( value, flagsFallback, flagsExtra ) => `${value}-${flagsFallback}-${flagsExtra}` );

const isArray = ( value: unknown ): value is unknown[] => {

  return Array.isArray ( value );

};

const isBoolean = ( value: unknown ): value is boolean => {

  return typeof value === 'boolean';

};

const isNumber = ( value: unknown ): value is number => {

  return typeof value === 'number';

};

const isObject = ( value: unknown ): value is Record<string, unknown> => {

  return typeof value === 'object' && value !== null;

};

const isRegExp = ( value: unknown ): value is RegExp => {

  return value instanceof RegExp;

};

const isRegExpIntraline = memoize ( ( regex: RegExp ): boolean => {

  return isIntraline ( regex );

});

const isString = ( value: unknown ): value is string => {

  return typeof value === 'string';

};

const uniq = <T> ( values: T[] ): T[] => {

  return Array.from ( new Set ( values ) );

};

const uniqChars = ( value: string ): string => {

  return uniq ( value.split ( '' ) ).join ( '' );

};

/* EXPORT */

export {getDecoration, getHighlights, getOptions, getRangeForWholeDocument, getRangeForWholeLines, getRegExp};
export {isArray, isBoolean, isEmptyPlainObject, isNumber, isObject, isRegExp, isRegExpIntraline, isString, uniq, uniqChars};
