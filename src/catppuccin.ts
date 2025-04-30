import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { Extension } from "@codemirror/state";
import { tags as t } from "@lezer/highlight";
import { CatppuccinFlavor, flavors } from "@catppuccin/palette";

function createCatppuccinTheme(flavor: CatppuccinFlavor) {
  const colors = flavor.colors;
  const isDark = flavor.dark;

  const theme = EditorView.theme(
    {
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

      "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
        {
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
    },
    { dark: isDark }
  );

  const highlightStyle = HighlightStyle.define([
    { tag: t.keyword, color: colors.mauve.hex },
    {
      tag: [
        t.name,
        t.definition(t.name),
        t.deleted,
        t.character,
        t.macroName,
      ],
      color: colors.text.hex,
    },
    {
      tag: [
        t.function(t.variableName),
        t.function(t.propertyName),
        t.propertyName,
        t.labelName,
      ],
      color: colors.blue.hex,
    },
    {
      tag: [t.color, t.constant(t.name), t.standard(t.name)],
      color: colors.peach.hex,
    },
    { tag: [t.self, t.atom], color: colors.red.hex },
    {
      tag: [t.typeName, t.className, t.changed, t.annotation, t.namespace],
      color: colors.yellow.hex,
    },
    { tag: [t.operator], color: colors.sky.hex },
    { tag: [t.url, t.link], color: colors.teal.hex },
    { tag: [t.escape, t.regexp], color: colors.pink.hex },
    {
      tag: [t.meta, t.punctuation, t.separator, t.comment],
      color: colors.overlay2.hex,
    },
    { tag: t.strong, fontWeight: "bold" },
    { tag: t.emphasis, fontStyle: "italic" },
    { tag: t.strikethrough, textDecoration: "line-through" },
    { tag: t.link, color: colors.blue.hex, textDecoration: "underline" },
    { tag: t.heading, fontWeight: "bold", color: colors.blue.hex },
    {
      tag: [t.special(t.variableName)],
      color: colors.lavender.hex,
    },
    { tag: [t.bool, t.number], color: colors.peach.hex },
    {
      tag: [t.processingInstruction, t.string, t.inserted],
      color: colors.green.hex,
    },
    { tag: t.invalid, color: colors.red.hex },
  ]);

  return [theme, syntaxHighlighting(highlightStyle)];
}

// Create extensions for all variants
export const catppuccinLatte: Extension = createCatppuccinTheme(flavors.latte);
export const catppuccinFrappe: Extension = createCatppuccinTheme(
  flavors.frappe
);
export const catppuccinMacchiato: Extension = createCatppuccinTheme(
  flavors.macchiato
);
export const catppuccinMocha: Extension = createCatppuccinTheme(flavors.mocha);
