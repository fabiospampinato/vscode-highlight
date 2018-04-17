# Highlight

<p align="center">
	<img src="https://raw.githubusercontent.com/fabiospampinato/vscode-highlight/master/resources/logo-128x128.png" alt="Logo">
</p>

Advanced text highlighter based on regexes. Useful for todos, annotations etc.

There are other extensions that can be used for this, like [TODO Highlight](https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight), but this can apply different styles to different matching groups within the same regex, and this is focused on doing only one thing and doing it well.

## Install

Follow the instructions in the [Marketplace](https://marketplace.visualstudio.com/items?itemName=fabiospampinato.vscode-highlight), or run the following in the command palette:

```shell
ext install fabiospampinato.vscode-highlight
```

## Settings

```js
{
  "highlight.regexes": {}, // Object mapping regexes to an array of decorations to apply to the matching groups
  "highlight.regexFlags": "gi" // Flags used when building the regexes
}
```

An example configuration could be:

```js
"highlight.regexes": {
  "(//TODO)(:)": [ // A regex will be created from this string, don't forget to double escape it
    { "color": "yellow" }, // Decoration options to apply to the first matching group, in this case "//TODO"
    { "color": "red" } // Decoration options to apply to the second matching group, in this case ":"
  ]
}
```

**Note:** All characters of the matched string must be wrapped in a matching group, and for each matching group a decorations options object must be provided (empty decorations are allowed: `{}`), otherwise the actual decorations will be misaligned.

A much more robust string for matching todos, with support for JavaScript/HTML-style comments, multiple todos in a single line, and [Todo+](https://marketplace.visualstudio.com/items?itemName=fabiospampinato.vscode-todo-plus)-style tags would look like this:

```js
"((?:<!-- *)?(?:#|//|/\\*+|<!--) *TODO:?)(?!\\w)((?: +[^\n@]+?)(?= *(?://|/\\*+|<!--|@))|(?: +[^@\n]+)?)"
```

Once you change your configuration, just close and re-open a file to refresh it's decorations.

All the supported decoration options are defined [here](https://code.visualstudio.com/docs/extensionAPI/vscode-api#DecorationRenderOptions).

## Demo

The following configuration:

```js
"highlight.regexes": {
  "(// ?TODO:?)(.*)": [
    {
      "overviewRulerColor": "#ffcc00",
      "backgroundColor": "#ffcc00",
      "color": "#1f1f1f",
      "fontWeight": "bold"
    },
    {
      "backgroundColor": "#d9ad00",
      "color": "#1f1f1f"
    }
  ],
  "(// ?FIXME:?)(.*)": [
    {
      "overviewRulerColor": "#ff0000",
      "backgroundColor": "#ff0000",
      "color": "#1f1f1f",
      "fontWeight": "bold"
    },
    {
      "backgroundColor": "#d90000",
      "color": "#1f1f1f"
    }
  ],
  "(// )(@\\w+)": [
    {},
    {
      "color": "#4de0ff"
    }
  ]
}
```

Transforms this:

![Before](resources/demo/before.png)

To this:

![After](resources/demo/after.png)

## Hints:

- **Todo**: If you're using this extension for highlighting todos, I recommend using [Todo+](https://marketplace.visualstudio.com/items?itemName=fabiospampinato.vscode-todo-plus) as well.

## License

MIT © Fabio Spampinato
