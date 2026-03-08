import { catppuccinMacchiato } from "@catppuccin/codemirror";

const catppuccinPalette: Record<string, string> = {
  "#f4dbd6": "@rosewater",
  "#f0c6c6": "@flamingo",
  "#f5bde6": "@pink",
  "#c6a0f6": "@mauve",
  "#ed8796": "@red",
  "#ee99a0": "@maroon",
  "#f5a97f": "@peach",
  "#eed49f": "@yellow",
  "#a6da95": "@green",
  "#8bd5ca": "@teal",
  "#91d7e3": "@sky",
  "#7dc4e4": "@sapphire",
  "#8aadf4": "@blue",
  "#b7bdf8": "@lavender",
  "#cad3f5": "@text",
  "#b8c0e0": "@subtext1",
  "#a5adcb": "@subtext0",
  "#939ab7": "@overlay2",
  "#8087a2": "@overlay1",
  "#6e738d": "@overlay0",
  "#5b6078": "@surface2",
  "#494d64": "@surface1",
  "#363a4f": "@surface0",
  "#24273a": "@base",
  "#1e2030": "@mantle",
  "#181926": "@crust",
};

const hexLookup = Object.fromEntries(
  Object.entries(catppuccinPalette).map((
    [hex, name],
  ) => [hex.toLowerCase(), name]),
);

const themeArray = catppuccinMacchiato as any;

let styleModule: any = null;
for (const group of themeArray) {
  for (const item of group) {
    if (item.value && item.value.constructor.name === "StyleModule") {
      styleModule = item.value;
      break;
    }
  }
  if (styleModule) break;
}

if (!styleModule) {
  console.error("StyleModule not found");
  process.exit(1);
}

function extractAlpha(hex: string): number | null {
  if (hex.length === 9) {
    return parseInt(hex.slice(7, 9), 16) / 255;
  }
  return null;
}

function hexWithAlphaToVariable(hex: string): string {
  const baseHex = hex.slice(0, 7).toLowerCase();
  const alpha = extractAlpha(hex);

  const varName = hexLookup[baseHex];
  if (!varName) return hex;

  if (alpha !== null) {
    return `rgba(${varName}, ${alpha.toFixed(2)})`;
  }

  return varName;
}

function cssToLess(rules: string[]): string {
  let lessOutput = "";

  rules.forEach((rule) => {
    let lessRule = rule;

    lessRule = lessRule.replace(/#[0-9a-f]{6}(?:[0-9a-f]{2})?/gi, (match) => {
      return hexWithAlphaToVariable(match);
    });

    lessOutput += lessRule + "\n";
  });

  return lessOutput;
}

const lessContent = cssToLess(styleModule.rules);
console.log(lessContent);
