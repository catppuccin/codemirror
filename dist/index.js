import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { flavors } from '@catppuccin/palette';

function createCatppuccinTheme(flavor) {
    const colors = flavor.colors;
    const isDark = flavor.dark;
    const theme = EditorView.theme({
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
    const highlightStyle = HighlightStyle.define([
        { tag: tags.keyword, color: colors.mauve.hex },
        {
            tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName],
            color: colors.text.hex,
        },
        {
            tag: [tags.function(tags.variableName), tags.labelName],
            color: colors.blue.hex,
        },
        {
            tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)],
            color: colors.peach.hex,
        },
        { tag: [tags.definition(tags.name), tags.separator], color: colors.teal.hex },
        {
            tag: [
                tags.typeName,
                tags.className,
                tags.changed,
                tags.annotation,
                tags.modifier,
                tags.self,
                tags.namespace,
            ],
            color: colors.yellow.hex,
        },
        { tag: [tags.operator, tags.operatorKeyword], color: colors.sky.hex },
        { tag: [tags.url, tags.escape, tags.regexp, tags.link], color: colors.teal.hex },
        { tag: [tags.meta, tags.comment], color: colors.overlay0.hex },
        { tag: tags.strong, fontWeight: "bold" },
        { tag: tags.emphasis, fontStyle: "italic" },
        { tag: tags.strikethrough, textDecoration: "line-through" },
        { tag: tags.link, color: colors.blue.hex, textDecoration: "underline" },
        { tag: tags.heading, fontWeight: "bold", color: colors.blue.hex },
        {
            tag: [tags.atom, tags.bool, tags.special(tags.variableName)],
            color: colors.lavender.hex,
        },
        { tag: tags.number, color: colors.peach.hex },
        {
            tag: [tags.processingInstruction, tags.string, tags.inserted],
            color: colors.green.hex,
        },
        { tag: tags.invalid, color: colors.red.hex },
    ]);
    return [theme, syntaxHighlighting(highlightStyle)];
}
// Create extensions for all variants
const catppuccinLatte = /*@__PURE__*/createCatppuccinTheme(flavors.latte);
const catppuccinFrappe = /*@__PURE__*/createCatppuccinTheme(flavors.frappe);
const catppuccinMacchiato = /*@__PURE__*/createCatppuccinTheme(flavors.macchiato);
const catppuccinMocha = /*@__PURE__*/createCatppuccinTheme(flavors.mocha);

export { catppuccinFrappe, catppuccinLatte, catppuccinMacchiato, catppuccinMocha };
