'use strict';

var view = require('@codemirror/view');
var language = require('@codemirror/language');
var highlight = require('@lezer/highlight');
var palette = require('@catppuccin/palette');

function createCatppuccinTheme(flavor) {
    const colors = flavor.colors;
    const isDark = flavor.dark;
    const theme = view.EditorView.theme({
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
            backgroundColor: colors.surface2.hex,
        },
        ".cm-panels": {
            backgroundColor: colors.mantle.hex,
            color: colors.text.hex,
        },
        ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
        ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },
        ".cm-searchMatch": {
            backgroundColor: `${colors.blue.hex}59`,
            outline: `1px solid ${colors.blue.hex}`,
        },
        ".cm-searchMatch.cm-searchMatch-selected": {
            backgroundColor: `${colors.blue.hex}2f`,
        },
        ".cm-activeLine": { backgroundColor: colors.surface0.hex },
        ".cm-selectionMatch": {
            backgroundColor: `${colors.surface2.hex}4d`,
        },
        "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
            backgroundColor: `${colors.surface2.hex}47`,
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
    }, { dark: isDark });
    const highlightStyle = language.HighlightStyle.define([
        { tag: highlight.tags.keyword, color: colors.mauve.hex },
        {
            tag: [highlight.tags.name, highlight.tags.deleted, highlight.tags.character, highlight.tags.propertyName, highlight.tags.macroName],
            color: colors.text.hex,
        },
        {
            tag: [highlight.tags.function(highlight.tags.variableName), highlight.tags.labelName],
            color: colors.blue.hex,
        },
        {
            tag: [highlight.tags.color, highlight.tags.constant(highlight.tags.name), highlight.tags.standard(highlight.tags.name)],
            color: colors.peach.hex,
        },
        { tag: [highlight.tags.definition(highlight.tags.name), highlight.tags.separator], color: colors.teal.hex },
        {
            tag: [
                highlight.tags.typeName,
                highlight.tags.className,
                highlight.tags.changed,
                highlight.tags.annotation,
                highlight.tags.modifier,
                highlight.tags.self,
                highlight.tags.namespace,
            ],
            color: colors.yellow.hex,
        },
        { tag: [highlight.tags.operator, highlight.tags.operatorKeyword], color: colors.sky.hex },
        { tag: [highlight.tags.url, highlight.tags.escape, highlight.tags.regexp, highlight.tags.link], color: colors.teal.hex },
        { tag: [highlight.tags.meta, highlight.tags.comment], color: colors.overlay0.hex },
        { tag: highlight.tags.strong, fontWeight: "bold" },
        { tag: highlight.tags.emphasis, fontStyle: "italic" },
        { tag: highlight.tags.strikethrough, textDecoration: "line-through" },
        { tag: highlight.tags.link, color: colors.blue.hex, textDecoration: "underline" },
        { tag: highlight.tags.heading, fontWeight: "bold", color: colors.blue.hex },
        {
            tag: [highlight.tags.atom, highlight.tags.bool, highlight.tags.special(highlight.tags.variableName)],
            color: colors.lavender.hex,
        },
        { tag: highlight.tags.number, color: colors.peach.hex },
        {
            tag: [highlight.tags.processingInstruction, highlight.tags.string, highlight.tags.inserted],
            color: colors.green.hex,
        },
        { tag: highlight.tags.invalid, color: colors.red.hex },
    ]);
    return [theme, language.syntaxHighlighting(highlightStyle)];
}
// Create extensions for all variants
const catppuccinLatte = createCatppuccinTheme(palette.flavors.latte);
const catppuccinFrappe = createCatppuccinTheme(palette.flavors.frappe);
const catppuccinMacchiato = createCatppuccinTheme(palette.flavors.macchiato);
const catppuccinMocha = createCatppuccinTheme(palette.flavors.mocha);

exports.catppuccinFrappe = catppuccinFrappe;
exports.catppuccinLatte = catppuccinLatte;
exports.catppuccinMacchiato = catppuccinMacchiato;
exports.catppuccinMocha = catppuccinMocha;
