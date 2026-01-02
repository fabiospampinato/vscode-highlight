
/* IMPORT */

import MildMap from 'mild-map';
import vscode from 'vscode';
import {alert} from 'vscode-extras';
import {getRangeForWholeDocument, getRangeForWholeLines} from './utils';
import type {Options} from './types';

/* HELPERS */

const EDITOR_REGEX_DECORATION_RANGES_CACHE = new MildMap<vscode.TextEditor, Map<RegExp, Map<vscode.TextEditorDecorationType, vscode.Range[]>>>();

/* MAIN */

const decorateWithoutProfiler = ( editor: vscode.TextEditor, options: Options, changeRanges: vscode.Range[] = [] ): number => {

  /* INIT */

  const document = editor.document;

  const highlightsPrev = EDITOR_REGEX_DECORATION_RANGES_CACHE.get ( editor );
  const highlightsNext = new Map<RegExp, Map<vscode.TextEditorDecorationType, vscode.Range[]>>();

  if ( !changeRanges.length && highlightsPrev ) return 0; // No changes and already decorated, nothing to do

  /* COMPUTING DECORATIONS */

  const {highlights} = options;

  for ( const highlight of highlights ) {

    const {fileRe, languageRe, highlightRe} = highlight;
    const {highlightDecorations, isIntraline} = highlight;

    const isPartial = changeRanges.length && isIntraline && highlightsPrev;

    const highlightRanges = isPartial ? changeRanges.map ( getRangeForWholeLines ) : [getRangeForWholeDocument ( document )];
    const decorationsNext = highlightsNext.get ( highlightRe ) || new Map<vscode.TextEditorDecorationType, vscode.Range[]>();

    highlightsNext.set ( highlightRe, decorationsNext );

    /* FILTERING */

    if ( languageRe && !languageRe.test ( document.languageId ) ) continue;
    if ( fileRe && !fileRe.test ( document.uri.fsPath ) ) continue;

    /* PRESERVING OLD DECORATIONS */

    if ( isPartial ) {

      const decorationsPrev = highlightsPrev?.get ( highlightRe );

      if ( decorationsPrev ) {

        for ( const [decorationPrev, rangesPrev] of decorationsPrev ) {

          if ( !rangesPrev.length ) continue;

          const rangesNext = rangesPrev.filter ( rangePrev => highlightRanges.every ( range => !range.intersection ( rangePrev ) ) ); // Keep only ranges that don't intersect changed ranges

          if ( !rangesNext.length ) continue;

          decorationsNext.set ( decorationPrev, rangesNext );

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
          const highlightDecoration = highlightDecorations[i - 1];

          if ( !indices || !highlightDecoration ) continue;

          const startIndex = indices[0];
          const endIndex = indices[1];

          if ( startIndex === endIndex ) continue;

          const startPosition = document.positionAt ( highlightRangeOffset + startIndex );
          const endPosition = document.positionAt ( highlightRangeOffset + endIndex );

          const decoration = highlightDecoration ( match );

          const range = new vscode.Range ( startPosition, endPosition );
          const ranges = decorationsNext.get ( decoration ) || [];

          ranges.push ( range );
          decorationsNext.set ( decoration, ranges );

        }

      }

    }

  }

  /* REMOVING OLD DECORATIONS */

  if ( highlightsPrev ) {

    for ( const [highlightPrev, decorationsPrev] of highlightsPrev ) {

      for ( const decorationPrev of decorationsPrev.keys () ) {

        if ( highlightsNext.get ( highlightPrev )?.has ( decorationPrev ) ) continue; // It will be updated later

        editor.setDecorations ( decorationPrev, [] );

      }

    }

  }

  /* UPDATING OTHER DECORATIONS */

  let decorationsNr = 0;

  for ( const highlightNext of highlightsNext.values () ) {

    for ( const [decorationNext, rangesNext] of highlightNext ) {

      editor.setDecorations ( decorationNext, rangesNext );

      decorationsNr += rangesNext.length;

    }

  }

  EDITOR_REGEX_DECORATION_RANGES_CACHE.set ( editor, highlightsNext );

  return decorationsNr;

};

const decorateWithProfiler = ( editor: vscode.TextEditor, options: Options, changeRanges: vscode.Range[] = [] ): void => {

  const intralineNr = options.highlights.filter ( highlight => highlight.isIntraline ).length;
  const interlineNr = options.highlights.filter ( highlight => !highlight.isIntraline ).length;

  const start = performance.now ();

  const decorationsNr = decorateWithoutProfiler ( editor, options, changeRanges );

  const end = performance.now ();
  const elapsed = Number ( ( end - start ).toFixed ( 2 ) );

  alert.info ( `Done in ${elapsed}ms - ${decorationsNr} ranges - ${intralineNr} intraline, ${interlineNr} interline` );

};

const decorate = ( editor: vscode.TextEditor, options: Options, changeRanges: vscode.Range[] = [] ): void => {

  if ( options.debugging ) {

    decorateWithProfiler ( editor, options, changeRanges );

  } else {

    decorateWithoutProfiler ( editor, options, changeRanges );

  }

};

const decorateAll = ( options: Options ): void => {

  for ( const editor of vscode.window.visibleTextEditors ) {

    decorate ( editor, options );

  }

};

const undecorate = ( editor: vscode.TextEditor ): void => {

  const highlightsPrev = EDITOR_REGEX_DECORATION_RANGES_CACHE.get ( editor );

  if ( !highlightsPrev ) return;

  for ( const highlightPrev of highlightsPrev.values () ) {

    for ( const decorationPrev of highlightPrev.keys () ) {

      editor.setDecorations ( decorationPrev, [] );

    }

  }

  EDITOR_REGEX_DECORATION_RANGES_CACHE.delete ( editor );

};

const undecorateAll = (): void => {

  for ( const editor of EDITOR_REGEX_DECORATION_RANGES_CACHE.keys () ) {

    undecorate ( editor );

  }

};

/* EXPORT */

export {decorate, decorateAll, undecorate, undecorateAll};
