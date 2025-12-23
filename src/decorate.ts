
/* IMPORT */

import vscode from 'vscode';
import {alert} from 'vscode-extras';
import {getHighlights, getRangeForWholeDocument, getRangeForWholeLines} from './utils';
import type {Highlight} from './types';

/* HELPERS */

const EDITOR_REGEX_DECORATION_RANGES_CACHE = new WeakMap<vscode.TextEditor, Map<RegExp, Map<vscode.TextEditorDecorationType, vscode.Range[]>>>();

/* MAIN */

const decorate = ( editor: vscode.TextEditor, changeRanges: vscode.Range[] ): number => {

  /* INIT */

  const document = editor.document;

  const decorationsPrev = EDITOR_REGEX_DECORATION_RANGES_CACHE.get ( editor );
  const decorationsNext = new Map<RegExp, Map<vscode.TextEditorDecorationType, vscode.Range[]>>();
  const wasDecorated = EDITOR_REGEX_DECORATION_RANGES_CACHE.has ( editor );

  if ( !changeRanges.length && wasDecorated ) return 0; // No changes and already decorated, nothing to do

  /* COMPUTING DECORATIONS */

  const highlights = getHighlights ();

  for ( const highlight of highlights ) {

    const {fileRe, languageRe, highlightRe} = highlight;
    const {highlightDecorations, isIntraline} = highlight;

    const isPartial = changeRanges.length && isIntraline && wasDecorated;

    const highlightRanges = isPartial ? changeRanges.map ( getRangeForWholeLines ) : [getRangeForWholeDocument ( document )];
    const highlightDecorationsNext = decorationsNext.get ( highlightRe ) || new Map<vscode.TextEditorDecorationType, vscode.Range[]>();

    decorationsNext.set ( highlightRe, highlightDecorationsNext );

    /* FILTERING */

    if ( languageRe ) {

      const language = document.languageId;

      if ( !language ) continue;
      if ( !languageRe.test ( language ) ) continue;

    }

    if ( fileRe ) {

      const filePath = document.uri.fsPath;

      if ( !filePath ) continue;
      if ( !fileRe.test ( filePath ) ) continue;

    }

    /* PRESERVING OLD DECORATIONS */

    if ( isPartial ) {

      const highlightDecorationsPrev = decorationsPrev?.get ( highlightRe );

      if ( highlightDecorationsPrev ) {

        for ( const decoration of highlightDecorationsPrev.keys () ) {

          const decorationRangesPrev = highlightDecorationsPrev.get ( decoration );

          if ( !decorationRangesPrev?.length ) continue;

          const decorationRangesNext = decorationRangesPrev.filter ( prev => highlightRanges.every ( range => !range.intersection ( prev ) ) ); // Keep only ranges that don't intersect changed ranges

          highlightDecorationsNext.set ( decoration, decorationRangesNext );

        }

      }

    }

    /* COMPUTING NEW DECORATIONS */

    for ( const highlightRange of highlightRanges ) {

      const highlightRangeOffset = document.offsetAt ( highlightRange.start );

      const text = document.getText ( highlightRange );

      for ( const match of text.matchAll ( highlightRe ) ) {

        if ( !match.indices ) continue;

        for ( let i = 1, l = match.indices.length; i < l; i++ ) {

          const indices = match.indices[i];
          const decoration = highlightDecorations[i - 1];

          if ( !indices || !decoration ) continue;

          const startIndex = indices[0];
          const endIndex = indices[1];

          if ( startIndex === endIndex ) continue;

          const startPosition = document.positionAt ( highlightRangeOffset + startIndex );
          const endPosition = document.positionAt ( highlightRangeOffset + endIndex );

          const decorationResolved = decoration ( match );

          const range = new vscode.Range ( startPosition, endPosition );
          const ranges = highlightDecorationsNext.get ( decorationResolved ) || [];

          ranges.push ( range );
          highlightDecorationsNext.set ( decorationResolved, ranges );

        }

      }

    }

  }

  /* REMOVING OLD DECORATIONS */

  if ( decorationsPrev ) {

    for ( const [highlightPrev, highlightsPrev] of decorationsPrev ) {

      for ( const decorationPrev of highlightsPrev.keys () ) {

        if ( decorationsNext.get ( highlightPrev )?.get ( decorationPrev ) ) continue; // It will be updated later

        editor.setDecorations ( decorationPrev, [] );

      }

    }

  }

  /* UPDATING OTHER DECORATIONS */

  let decorationsNr = 0;

  for ( const highlightsNext of decorationsNext.values () ) {

    for ( const [decorationNext, decorationRangesNext] of highlightsNext ) {

      editor.setDecorations ( decorationNext, decorationRangesNext );

      decorationsNr += decorationRangesNext.length;

    }

  }

  EDITOR_REGEX_DECORATION_RANGES_CACHE.set ( editor, decorationsNext );

  return decorationsNr;

};

const decorateWithProfiler = ( editor: vscode.TextEditor, changeRanges: vscode.Range[] ): void => {

  const highlights = getHighlights ();
  const intralineNr = highlights.filter ( highlight => highlight.isIntraline ).length;
  const interlineNr = highlights.filter ( highlight => !highlight.isIntraline ).length;

  const start = performance.now ();

  const decorationsNr = decorate ( editor, changeRanges );

  const end = performance.now ();
  const elapsed = Number ( ( end - start ).toFixed ( 2 ) );

  alert.info ( `Done in ${elapsed}ms - ${decorationsNr} ranges - ${intralineNr} intraline, ${interlineNr} interline` );

};

/* EXPORT */

export default decorateWithProfiler;
