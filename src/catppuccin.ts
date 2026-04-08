import { EditorView } from "@codemirror/view";
import { syntaxHighlighting } from "@codemirror/language";
import { Extension } from "@codemirror/state";
import { CatppuccinFlavor, flavors } from "@catppuccin/palette";

import {
  createCatppuccinHighlightStyle,
  createCatppuccinThemeSpec,
} from "./theme-spec";

function createCatppuccinTheme(flavor: CatppuccinFlavor) {
  const theme = EditorView.theme(createCatppuccinThemeSpec(flavor), {
    dark: flavor.dark,
  });

  const highlightStyle = createCatppuccinHighlightStyle(flavor);

  return [theme, syntaxHighlighting(highlightStyle)];
}

// Create extensions for all variants
export const catppuccinLatte: Extension = createCatppuccinTheme(flavors.latte);
export const catppuccinFrappe: Extension = createCatppuccinTheme(
  flavors.frappe,
);
export const catppuccinMacchiato: Extension = createCatppuccinTheme(
  flavors.macchiato,
);
export const catppuccinMocha: Extension = createCatppuccinTheme(flavors.mocha);
