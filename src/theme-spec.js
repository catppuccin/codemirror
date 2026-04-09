"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCatppuccinThemeSpec = createCatppuccinThemeSpec;
exports.createCatppuccinHighlightStyle = createCatppuccinHighlightStyle;
var language_1 = require("@codemirror/language");
var highlight_1 = require("@lezer/highlight");
function createCatppuccinThemeSpec(flavor) {
    var colors = flavor.colors;
    return {
        "&": {
            color: colors.text.hex,
            backgroundColor: colors.base.hex,
        },
        ".cm-content": {
            caretColor: colors.rosewater.hex,
        },
        ".cm-cursor, .cm-dropCursor": {
            borderLeftColor: colors.rosewater.hex,
        },
        "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
            backgroundColor: "".concat(colors.overlay2.hex, "40"),
        },
        ".cm-panels": {
            backgroundColor: colors.mantle.hex,
            color: colors.text.hex,
        },
        ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
        ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },
        ".cm-searchMatch": {
            backgroundColor: "".concat(colors.blue.hex, "59"),
            outline: "1px solid ".concat(colors.blue.hex),
        },
        ".cm-searchMatch.cm-searchMatch-selected": {
            backgroundColor: "".concat(colors.blue.hex, "2f"),
        },
        ".cm-activeLine": { backgroundColor: colors.surface0.hex },
        ".cm-selectionMatch": {
            backgroundColor: "".concat(colors.surface2.hex, "4d"),
        },
        "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
            backgroundColor: "".concat(colors.surface2.hex, "47"),
            color: colors.text.hex,
        },
        ".cm-gutters": {
            backgroundColor: colors.base.hex,
            color: colors.subtext0.hex,
            border: "none",
        },
        ".cm-activeLineGutter": {
            backgroundColor: colors.surface0.hex,
        },
        ".cm-foldPlaceholder": {
            backgroundColor: "transparent",
            border: "none",
            color: colors.overlay0.hex,
        },
        ".cm-placeholder": {
            color: colors.overlay1.hex,
        },
        ".cm-tooltip": {
            border: "none",
            backgroundColor: colors.surface0.hex,
        },
        ".cm-tooltip .cm-tooltip-arrow:before": {
            borderTopColor: "transparent",
            borderBottomColor: "transparent",
        },
        ".cm-tooltip .cm-tooltip-arrow:after": {
            borderTopColor: colors.surface0.hex,
            borderBottomColor: colors.surface0.hex,
        },
        ".cm-tooltip-autocomplete": {
            "& > ul > li[aria-selected]": {
                backgroundColor: colors.surface1.hex,
                color: colors.text.hex,
            },
        },
    };
}
function createCatppuccinHighlightStyle(flavor) {
    var colors = flavor.colors;
    return language_1.HighlightStyle.define([
        { tag: highlight_1.tags.keyword, color: colors.mauve.hex },
        {
            tag: [highlight_1.tags.name, highlight_1.tags.definition(highlight_1.tags.name), highlight_1.tags.deleted, highlight_1.tags.character, highlight_1.tags.macroName],
            color: colors.text.hex,
        },
        {
            tag: [
                highlight_1.tags.function(highlight_1.tags.variableName),
                highlight_1.tags.function(highlight_1.tags.propertyName),
                highlight_1.tags.propertyName,
                highlight_1.tags.labelName,
            ],
            color: colors.blue.hex,
        },
        {
            tag: [highlight_1.tags.color, highlight_1.tags.constant(highlight_1.tags.name), highlight_1.tags.standard(highlight_1.tags.name)],
            color: colors.peach.hex,
        },
        { tag: [highlight_1.tags.self, highlight_1.tags.atom], color: colors.red.hex },
        {
            tag: [highlight_1.tags.typeName, highlight_1.tags.className, highlight_1.tags.changed, highlight_1.tags.annotation, highlight_1.tags.namespace],
            color: colors.yellow.hex,
        },
        { tag: [highlight_1.tags.operator], color: colors.sky.hex },
        { tag: [highlight_1.tags.url, highlight_1.tags.link], color: colors.teal.hex },
        { tag: [highlight_1.tags.escape, highlight_1.tags.regexp], color: colors.pink.hex },
        {
            tag: [highlight_1.tags.meta, highlight_1.tags.punctuation, highlight_1.tags.separator, highlight_1.tags.comment],
            color: colors.overlay2.hex,
        },
        { tag: highlight_1.tags.strong, fontWeight: "bold" },
        { tag: highlight_1.tags.emphasis, fontStyle: "italic" },
        { tag: highlight_1.tags.strikethrough, textDecoration: "line-through" },
        { tag: highlight_1.tags.link, color: colors.blue.hex, textDecoration: "underline" },
        { tag: highlight_1.tags.heading, fontWeight: "bold", color: colors.blue.hex },
        {
            tag: [highlight_1.tags.special(highlight_1.tags.variableName)],
            color: colors.lavender.hex,
        },
        { tag: [highlight_1.tags.bool, highlight_1.tags.number], color: colors.peach.hex },
        {
            tag: [highlight_1.tags.processingInstruction, highlight_1.tags.string, highlight_1.tags.inserted],
            color: colors.green.hex,
        },
        { tag: highlight_1.tags.invalid, color: colors.red.hex },
    ]);
}
