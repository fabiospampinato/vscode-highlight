
/* REGEXES DEFAULTS */

const defaults = {
  "((?:<!-- *)?(?:#|// @|//|./\\*+|<!--|--|\\* @|{!|{{!--|{{!) *TODO(?:\\s*\\([^)]+\\))?:?)((?!\\w)(?: *-->| *\\*/| *!}| *--}}| *}}|(?= *(?:[^:]//|/\\*+|<!--|@|--|{!|{{!--|{{!))|(?: +[^\\n@]*?)(?= *(?:[^:]//|/\\*+|<!--|@|--(?!>)|{!|{{!--|{{!))|(?: +[^@\\n]+)?))": {
    "filterFileRegex": ".*(?<!CHANGELOG.md)$",
    "decorations": [
      {
        "overviewRulerColor": "#ffcc00",
        "backgroundColor": "#ffcc00",
        "color": "#1f1f1f",
        "fontWeight": "bold"
      },
      {
        "backgroundColor": "#ffcc00",
        "color": "#1f1f1f"
      }
    ]
  },
  "((?:<!-- *)?(?:#|// @|//|./\\*+|<!--|--|\\* @|{!|{{!--|{{!) *(?:FIXME|FIX|BUG|UGLY|DEBUG|HACK|XXX)(?:\\s*\\([^)]+\\))?:?)((?!\\w)(?: *-->| *\\*/| *!}| *--}}| *}}|(?= *(?:[^:]//|/\\*+|<!--|@|--|{!|{{!--|{{!))|(?: +[^\\n@]*?)(?= *(?:[^:]//|/\\*+|<!--|@|--(?!>)|{!|{{!--|{{!))|(?: +[^@\\n]+)?))": {
    "filterFileRegex": ".*(?<!CHANGELOG.md)$",
    "decorations": [
      {
        "overviewRulerColor": "#cc0000",
        "backgroundColor": "#cc0000",
        "color": "#1f1f1f",
        "fontWeight": "bold"
      },
      {
        "backgroundColor": "#cc0000",
        "color": "#1f1f1f"
      }
    ]
  },
  "((?:<!-- *)?(?:#|// @|//|./\\*+|<!--|--|\\* @|{!|{{!--|{{!) *(?:REVIEW|OPTIMIZE|TSC)(?:\\s*\\([^)]+\\))?:?)((?!\\w)(?: *-->| *\\*/| *!}| *--}}| *}}|(?= *(?:[^:]//|/\\*+|<!--|@|--|{!|{{!--|{{!))|(?: +[^\\n@]*?)(?= *(?:[^:]//|/\\*+|<!--|@|--(?!>)|{!|{{!--|{{!))|(?: +[^@\\n]+)?))": {
    "filterFileRegex": ".*(?<!CHANGELOG.md)$",
    "decorations": [
      {
        "overviewRulerColor": "#00ccff",
        "backgroundColor": "#00ccff",
        "color": "#1f1f1f",
        "fontWeight": "bold"
      },
      {
        "backgroundColor": "#00ccff",
        "color": "#1f1f1f"
      }
    ]
  },
  "((?:<!-- *)?(?:#|// @|//|./\\*+|<!--|--|\\* @|{!|{{!--|{{!) *(?:IDEA)(?:\\s*\\([^)]+\\))?:?)((?!\\w)(?: *-->| *\\*/| *!}| *--}}| *}}|(?= *(?:[^:]//|/\\*+|<!--|@|--|{!|{{!--|{{!))|(?: +[^\\n@]*?)(?= *(?:[^:]//|/\\*+|<!--|@|--(?!>)|{!|{{!--|{{!))|(?: +[^@\\n]+)?))": {
    "filterFileRegex": ".*(?<!CHANGELOG.md)$",
    "decorations": [
      {
        "overviewRulerColor": "#cc00cc",
        "backgroundColor": "#cc00cc",
        "color": "#1f1f1f",
        "fontWeight": "bold"
      },
      {
        "backgroundColor": "#cc00cc",
        "color": "#1f1f1f"
      }
    ]
  }
};

/* EXPORT */

export default defaults;
