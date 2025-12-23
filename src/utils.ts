
/* IMPORT */

import memoize from 'lomemo';
import isIntralineRegExp from 'regexp-is-intraline';
import * as vscode from 'vscode';
// import {getConfig} from 'vscode-extras'; //TODO
import DEV_CONFIG from './config';
import type {Highlight} from './types';

/* MAIN */

const getDecoration = memoize ( ( regex: RegExp, value: object ): vscode.TextEditorDecorationType => { // It's important to memoize decorations by regexes, it makes updating them simpler

  return vscode.window.createTextEditorDecorationType ( value );

}, ( regex, value ) => `${regex.toString ()}-${JSON.stringify ( value )}` );

const getHighlights = (): Highlight[] => {

  // const config = getConfig ( 'highlight' ); //TODO
  const config = DEV_CONFIG;
  const decorations = isObject ( config?.['decorations'] ) ? config['decorations'] : { rangeBehavior: 3 };
  const regexes = isObject ( config?.['regexes'] ) ? config['regexes'] : {};
  const regexFlags = isString ( config?.['regexFlags'] ) ? config['regexFlags'] : 'gi';

  const highlights: Highlight[] = [];

  for ( const [highlightReSource, highlightConfig] of Object.entries ( regexes ) ) {

    const fileRe = isObject ( highlightConfig ) && isString ( highlightConfig['fileRe'] ) ? getRegExp ( highlightConfig['fileRe'], 'i' ) : undefined;
    const languageRe = isObject ( highlightConfig ) && isString ( highlightConfig['languageRe'] ) ? getRegExp ( highlightConfig['languageRe'], 'i' ) : undefined;

    const highlightReFlags = isObject ( highlightConfig ) && isString ( highlightConfig['regexFlags'] ) ? highlightConfig['regexFlags'] : regexFlags;
    const highlightReFlagsNormalized = uniqChars ( `${highlightReFlags}gd` ); // + global + indices
    const highlightRe = getRegExp ( highlightReSource, highlightReFlagsNormalized );

    const highlightDecorationsRaw = isObject ( highlightConfig ) && isArray ( highlightConfig['decorations'] ) && highlightConfig['decorations'].every ( isObject ) ? highlightConfig['decorations'] : isArray ( highlightConfig ) && highlightConfig.every ( isObject ) ? highlightConfig : [];
    const highlightDecorationsRawNormalized = highlightDecorationsRaw.map ( decoration => ({ ...decorations, ...decoration }) );
    const highlightDecorations = highlightDecorationsRawNormalized.map ( decoration => getDecoration ( highlightRe, decoration ) );

    const isIntraline = isRegExpIntraline ( highlightRe );

    const highlight: Highlight = {
      fileRe,
      languageRe,
      highlightRe,
      highlightDecorations,
      isIntraline
    };

    highlights.push ( highlight );

  }

  return highlights;

};

const getRangeForWholeDocument = ( document: vscode.TextDocument ): vscode.Range => {

  return new vscode.Range ( 0, 0, document.lineCount - 1, Infinity );

};

const getRangeForWholeLines = ( range: vscode.Range ): vscode.Range => {

  return new vscode.Range ( range.start.line, 0, range.end.line, Infinity );

};

const getRegExp = memoize ( ( value: string, fallbackFlags?: string ): RegExp => {

  const regexRe = /^\/(.*)\/([gimsuvyd]*)$/;
  const match = value.match ( regexRe );

  if ( match ) { // /source/flags

    const source = match[1] ?? '';
    const flags = match[2] ?? '';

    return new RegExp ( source, flags );

  } else { // source

    return new RegExp ( value, fallbackFlags );

  }

}, ( value, fallbackFlags ) => `${value}-${fallbackFlags}` );

const isArray = ( value: unknown ): value is unknown[] => {

  return Array.isArray ( value );

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

const isRegExpIntraline = memoize ( isIntralineRegExp );

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

export {getDecoration, getHighlights, getRangeForWholeDocument, getRangeForWholeLines, getRegExp, isArray, isNumber, isObject, isRegExp, isRegExpIntraline, isString, memoize, uniq, uniqChars};
