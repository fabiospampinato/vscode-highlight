"use strict";
/**
 * Creation/composition of extension configuration related JSON objects, due to
 * JSON schema support being "odd" in regards to VSCode settings contributions
 */
Object.defineProperty(exports, "__esModule", { value: true });
const prop = {
    backgroundColor: {
        default: "",
        format: "color",
        type: "string"
    },
    border: {
        default: "",
        type: "string"
    },
    borderColor: {
        default: "#FFFFFF22",
        format: "color",
        type: "string"
    },
    borderRadius: {
        default: "4px",
        examples: [
            "2px",
            "0.25em",
            "2px 0px",
            "0px 0px 0px 4px",
            "10px 40px / 20px 60px",
        ],
        type: "string"
    },
    borderSpacing: {
        default: "2px",
        type: "string"
    },
    borderStyle: {
        examples: [
            "solid",
            "dotted",
            "dashed",
            "solid none",
            "none none solid none",
        ],
        type: "string",
        default: ""
    },
    borderWidth: {
        type: "string",
        default: ""
    },
    color: {
        default: "",
        format: "color",
        type: "string"
    },
    contentIconPath: {
        description: "An absolute path or an URI to an image to be rendered in the attachment. Either an icon or a text can be shown, but not both.",
        anyOf: [
            {
                default: "",
                format: "uri",
                type: "string"
            },
            {
                default: "",
                type: "string"
            },
        ]
    },
    contentText: {
        description: "Defines a text content that is shown in the attachment. Either an icon or a text can be shown, but not both.",
        default: "",
        type: "string"
    },
    cursor: {
        anyOf: [
            {
                enum: [
                    "alias",
                    "all-scroll",
                    "auto",
                    "cell",
                    "context-menu",
                    "col-resize",
                    "copy",
                    "crosshair",
                    "default",
                    "e-resize",
                    "ew-resize",
                    "grab",
                    "grabbing",
                    "help",
                    "move",
                    "n-resize",
                    "ne-resize",
                    "nesw-resize",
                    "ns-resize",
                    "nw-resize",
                    "nwse-resize",
                    "no-drop",
                    "none",
                    "not-allowed",
                    "pointer",
                    "progress",
                    "row-resize",
                    "s-resize",
                    "se-resize",
                    "sw-resize",
                    "text",
                    "vertical-text",
                    "w-resize",
                    "wait",
                    "zoom-in",
                    "zoom-out",
                    "initial",
                    "inherit",
                ]
            },
            {
                format: "uri"
            },
        ],
        default: "",
        description: "Specifies the mouse cursor to be displayed when pointing over a decoration.",
        type: "string"
    },
    filterFileRegex: {
        type: "string"
    },
    filterLanguageRegex: {
        type: "string"
    },
    fontStyle: {
        default: "",
        enum: ["normal", "italic", "oblique", "unset", ""],
        type: "string"
    },
    fontWeight: {
        enum: [
            "100",
            "200",
            "300",
            "400",
            "500",
            "600",
            "700",
            "800",
            "900",
            "bold",
            "medium",
        ],
        type: "string",
        default: "500"
    },
    gutterIconPath: {
        type: "string",
        default: "",
        format: "uri",
        description: "An absolute path or an URI to an image to be rendered in the gutter."
    },
    gutterIconSize: {
        type: "string",
        default: "",
        description: "Specifies the size of the gutter icon. Available values are 'auto', 'contain', 'cover' and any percentage value. For further information: https://msdn.microsoft.com/en-us/library/jj127316(v=vs.85).aspx",
        oneOf: [
            { pattern: "\\d+(\\.\\d+)%" },
            {
                enum: [
                    "auto",
                    "contain",
                    "cover",
                ]
            },
        ]
    },
    height: {
        type: "string",
        default: ""
    },
    isWholeLine: {
        type: "boolean",
        default: false,
        description: "Should the decoration be rendered also on the whitespace after the line text."
    },
    letterSpacing: {
        type: "string",
        default: ""
    },
    margin: {
        type: "string",
        default: ""
    },
    opacity: {
        type: "number",
        minimum: 0,
        maximum: 1,
        default: 1
    },
    outline: {
        type: "string",
        default: ""
    },
    outlineColor: {
        type: "string",
        default: "",
        format: "color",
        description: "Applied to text enclosed by a decoration. Better use 'outline' for setting one or more of the individual outline properties."
    },
    outlineStyle: {
        type: "string",
        default: "",
        description: "Applied to text enclosed by a decoration. Better use 'outline' for setting one or more of the individual outline properties."
    },
    outlineWidth: {
        type: "string",
        default: "",
        description: "Applied to text enclosed by a decoration. Better use 'outline' for setting one or more of the individual outline properties."
    },
    overviewRulerColor: {
        default: "",
        format: "color",
        type: "string",
        description: "The color of the decoration in the overview ruler. Use rgba() and define transparent colors to play well with other decorations."
    },
    overviewRulerLane: {
        description: "The position in the overview ruler where the decoration should be rendered.",
        enum: ["center", "full", "left", "right"],
        type: "string",
        default: "center"
    },
    rangeBehavior: {
        enum: [1, 2, 3, 4],
        type: "number",
        default: 3,
        description: "Customize the growing behavior of the decoration when edits occur at the edges of the decoration's range."
    },
    textDecoration: {
        default: "",
        type: "string",
        description: "CSS styling property that will be applied to text enclosed by a decoration."
    },
    width: {
        default: "",
        type: "string"
    },
};
const propList = {
    /**
    * Decoration schema's properties list. Used for `highlight.regexes` and
    * `highlight.decorations` properties
    *
    * @see https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions
    */
    get decorationRenderOptions() {
        return {
            after: schemaObj.after,
            backgroundColor: prop.backgroundColor,
            before: schemaObj.before,
            border: prop.border,
            borderColor: prop.borderColor,
            borderRadius: prop.borderRadius,
            borderSpacing: prop.borderSpacing,
            borderStyle: prop.borderStyle,
            borderWidth: prop.borderWidth,
            color: prop.color,
            contentIconPath: prop.contentIconPath,
            contentText: prop.contentText,
            cursor: prop.cursor,
            dark: schemaObj.dark,
            fontStyle: prop.fontStyle,
            fontWeight: prop.fontWeight,
            gutterIconPath: prop.gutterIconPath,
            gutterIconSize: prop.gutterIconSize,
            isWholeLine: prop.isWholeLine,
            letterSpacing: prop.letterSpacing,
            light: schemaObj.light,
            opacity: prop.opacity,
            outline: prop.outline,
            outlineColor: prop.outlineColor,
            outlineStyle: prop.outlineStyle,
            outlineWidth: prop.outlineWidth,
            overviewRulerColor: prop.overviewRulerColor,
            overviewRulerLane: prop.overviewRulerLane,
            rangeBehavior: prop.rangeBehavior,
            textDecoration: prop.textDecoration
        };
    },
    /**
     * @see https://code.visualstudio.com/api/references/vscode-api#ThemableDecorationRenderOptions
     */
    get themableDecorationRenderOptions() {
        return {
            after: schemaObj.after,
            backgroundColor: prop.backgroundColor,
            before: schemaObj.before,
            border: prop.border,
            borderColor: prop.borderColor,
            borderRadius: prop.borderRadius,
            borderSpacing: prop.borderSpacing,
            borderStyle: prop.borderStyle,
            borderWidth: prop.borderWidth,
            color: prop.color,
            cursor: prop.cursor,
            fontStyle: prop.fontStyle,
            fontWeight: prop.fontWeight,
            gutterIconPath: prop.gutterIconPath,
            gutterIconSize: prop.gutterIconSize,
            letterSpacing: prop.letterSpacing,
            opacity: prop.opacity,
            outline: prop.outline,
            outlineColor: prop.outlineColor,
            outlineStyle: prop.outlineStyle,
            outlineWidth: prop.outlineWidth,
            overviewRulerColor: prop.overviewRulerColor,
            textDecoration: prop.textDecoration
        };
    },
    /**
     * @see https://code.visualstudio.com/api/references/vscode-api#ThemableDecorationAttachmentRenderOptions
     */
    get themableDecorationAttachmentRenderOptions() {
        return {
            backgroundColor: prop.backgroundColor,
            border: prop.border,
            borderColor: prop.borderColor,
            color: prop.color,
            contentIconPath: prop.contentIconPath,
            contentText: prop.contentText,
            fontStyle: prop.fontStyle,
            fontWeight: prop.fontWeight,
            height: prop.height,
            margin: prop.margin,
            textDecoration: prop.textDecoration,
            width: prop.width
        };
    },
};
const schemaObj = {
    /**
     * Decoration schema. Used for `highlight.regexes` and `highlight.decorations`
     */
    get decoration() {
        return {
            type: "object",
            description: "Object mapping regexes to an array of decorations to apply to the capturing groups",
            default: {},
            properties: propList.decorationRenderOptions
        };
    },
    get regexFlags() {
        return {
            type: "string",
            description: "Flags used when building the regexes",
            pattern: "^((?:([gmi])(?!.*\\2))*)$",
            default: "gi"
        };
    },
    get after() {
        return {
            type: "object",
            default: {},
            description: "Defines the rendering options of the attachment that is inserted before the decorated text.",
            properties: propList.themableDecorationAttachmentRenderOptions
        };
    },
    get before() {
        return {
            type: "object",
            default: {},
            description: "Defines the rendering options of the attachment that is inserted before the decorated text.",
            properties: propList.themableDecorationAttachmentRenderOptions
        };
    },
    get dark() {
        return {
            type: "object",
            description: "Overwrite options for dark themes.",
            default: {},
            properties: propList.themableDecorationRenderOptions
        };
    },
    get light() {
        return {
            type: "object",
            description: "Overwrite options for light themes.",
            default: {},
            properties: propList.themableDecorationRenderOptions
        };
    },
};
const configuration = {
    type: "object",
    title: "Highlight - Configuration",
    properties: {
        "highlight.decorations": {
            type: "object",
            description: "Default decorations from which all others inherit from",
            default: { rangeBehavior: 3 },
            properties: propList.decorationRenderOptions
        },
        "highlight.regexes": {
            type: "object",
            description: "Object mapping regexes to an array of decorations to apply to the capturing groups",
            default: {},
            additionalProperties: {
                properties: {
                    filterFileRegex: prop.filterFileRegex,
                    filterLanguageRegex: prop.filterFileRegex,
                    regexFlags: schemaObj.regexFlags,
                    decorations: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: propList.decorationRenderOptions,
                            default: {}
                        }
                    }
                }
            }
        },
        "highlight.regexFlags": schemaObj.regexFlags,
        "highlight.maxMatches": {
            type: "number",
            description: "Maximum number of matches to decorate per regex, in order not to crash the app with accidental cathastropic regexes",
            default: 250
        }
    },
};
const indentLevel = 2;
class ConfigurationGenerator {
    constructor(configuration) {
        this.indentLevel = indentLevel;
        this.configuration = configuration;
    }
    toString() {
        const output = JSON.stringify(configuration, null, this.indentLevel);
        if (!output) {
            throw new Error("Generating schema failed.");
        }
        return output;
    }
    toJSON() {
        // Not sure why I had to do this
        return JSON.parse(JSON.stringify(this.configuration));
    }
}
exports.default = new ConfigurationGenerator(configuration);
