import {EditorView} from "@codemirror/view";
import {HighlightStyle, syntaxHighlighting} from "@codemirror/language";
import {Extension} from "@codemirror/state";
import {CatppuccinFlavor, flavors} from "@catppuccin/palette";

import {createCatppuccinHighlightStyle, createCatppuccinThemeSpec,} from "./theme-spec";

function createCatppuccinTheme(flavor: CatppuccinFlavor): Extension {
  const theme: Extension = EditorView.theme(createCatppuccinThemeSpec(flavor), {
    dark: flavor.dark,
  });

  const highlightStyle: HighlightStyle = createCatppuccinHighlightStyle(flavor);

  return [theme, syntaxHighlighting(highlightStyle)];
}

// Create extensions for all variants
export const catppuccinLatte = createCatppuccinTheme(flavors.latte);
export const catppuccinFrappe = createCatppuccinTheme(flavors.frappe);
export const catppuccinMacchiato = createCatppuccinTheme(flavors.macchiato);
export const catppuccinMocha = createCatppuccinTheme(flavors.mocha);
