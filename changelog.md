### Version 2.0.0
- Rewritten: more modern code, no third-party dependencies, 95% smaller bundle
- Massively optimized for "intraline" regexes, i.e. regexes that can never possibly match a newline character at any point
- Deleted limitation regarding all parts of the regex having to be inside a capturing group
- Deleted limitation regarding nested capturing groups not being supported
- Deleted "Highlight: Force Decorate" command, as it should never be needed
- Added "Highlight: Toggle Decorations" command, to toggle all highlights on and off
- Added "Highlight: Disable Decorations" command, to disable all highlights
- Added "Highlight: Enable Decorations" command, to enable all highlights
- Added an "enabled" setting for each highlight, for enabling/disabling specific highlights
- Added an "highlight.debugging" setting, to enable some debugging info dialogs when decorating
- Deleted "highlight.minDelay" setting, as redecorations are not throttled anymore
- Deleted "highlight.maxMatches" setting, as it was replaced with an hard-coded 10K limit
- Updated schema to allow for non-hex colors too

### Version 1.9.0
- Readme: added a warning for multiline strings
- New command: highlight.forceDecorate

### Version 1.8.0
- Improved contribution schema store

### Version 1.7.3
- Lowercased readme file
- Lowercased changelog file
- Lowercased license file
- Attempt at reducing flickering on large decorated files

### Version 1.7.2
- Reverted change that skipped removing old decorations before applying the new ones

### Version 1.7.1
- Avoiding undecorating the document, which seems no longer necessary

### Version 1.7.0
- Readme: fixed a typo
- New option: "highlight.minDelay", number of ms to use for throttling highlighting

### Version 1.6.0
- Added support for disabling donation prompts by setting "donations.disablePrompt" to "true"

### Version 1.5.1
- Added a dialog announcing the fundraising

### Version 1.5.0
- Deleted repo-level github funding.yml
- Providing some default decorations

### Version 1.4.1
- Ensuring types generated from dynamic decorators are cleared up properly

### Version 1.4.0
- Readme: reorganized
- Added support for dynamic decorators that use `$0`, `$1` etc. placeholders

### Version 1.3.4
- Ensuring curly braces in regexes are properly escaped
- Fixed an exception

### Version 1.3.3
- Updated advenced regex: added support for common templating languages

### Version 1.3.2
- Readme: using hi-res logo

### Version 1.3.1
- Outputting modern code (es2017, faster)
- Using "Debug Launcher" for debugging

### Version 1.3.0
- Added a `maxMatches` option

### Version 1.2.11
- Fixed support for non-global regexes

### Version 1.2.10
- Bundling with webpack

### Version 1.2.9
- Updated advenced regex: added support for `//TODO (foo)`
- Updated advenced regex: add support for JSDoc-style comments

### Version 1.2.8
- Updated robust regex

### Version 1.2.7
- Updated logo

### Version 1.2.6
- Fixed first line highlighting

### Version 1.2.5
- When a document changes all of its visible editors are decorated

### Version 1.2.4
- Fixed highlighting of duplicated editors

### Version 1.2.3
- Robust regex: added support for AppleScript-like style comments

### Version 1.2.2
- Renamed `matching groups` to `capturing groups`
- Readme: added a note about nested capturing groups

### Version 1.2.1
- Improved skipping-redecoration logic

### Version 1.2.0
- Substancial performance improvement
- Added regex-level options: `regexFlags`, `filterLanguageRegex` and `filterFileRegex`

### Version 1.1.0
- Updated robust example regex for matching todos
- Added a note about capturing groups and decorations alignment
- Added support for a `decorations` option

### Version 1.0.2
- Ensuring `textEditor` is not undefined
- Clearing previous decorations before decorating

### Version 1.0.1
- Updated todo
- Updated advanced regex for matching todos

### Version 1.0.0
- Initial release
