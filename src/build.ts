import { flavors } from "@catppuccin/palette";
import { cyan, green, hex, magenta, red, white } from "ansis";
import { StyleModule } from "style-mod";

import CleanCSS from "clean-css";
import fs from "fs";
import process from "node:process";
import path from "path";
import postcss from "postcss";

import type { Plugin } from "postcss";
import type { StyleSpec } from "style-mod";

import {
  createCatppuccinHighlightStyle,
  createCatppuccinThemeSpec,
} from "./theme-spec";

const out_dir = path.join(process.cwd(), "dist", "css");
const props: Set<string> = new Set([
  "color",
  "background-color",
  "border-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "outline-color",
  "caret-color",
  "fill",
  "stroke",
  "text-shadow",
  "box-shadow",
]);

fs.mkdirSync(out_dir, { recursive: true });

const createLogger = (palette?: typeof flavors.macchiato) => {
  const logtype_enum: Record<string, (s: string) => string> = {
    ERROR: palette?.colors.red.hex ? hex(palette.colors.red.hex) : red,
    SUCCESS: palette?.colors.green.hex ? hex(palette.colors.green.hex) : green,
    LOG: palette?.colors.teal.hex ? hex(palette.colors.teal.hex) : cyan,
    EXIT: palette?.colors.mauve.hex ? hex(palette.colors.mauve.hex) : magenta,
  };

  return (type: string, context: string, message: string) => {
    const logtype_pad = type.padEnd(7);
    const context_pad = context.padEnd(11);
    const colorize = logtype_enum[type] || white;

    return `[${colorize(logtype_pad)}] ${colorize(context_pad)} ${message}`;
  };
};

const termLogger: ReturnType<typeof createLogger> = createLogger();

const extractColorDeclarationsPlugin: Plugin = {
  postcssPlugin: "extract-colors",
  Once(root: postcss.Root) {
    root.walkRules((rule: postcss.Rule) => {
      const decls: postcss.Declaration[] = [];

      rule.walkDecls((decl: postcss.Declaration) => {
        const prop = decl.prop.toLowerCase();

        if (props.has(prop)) {
          decls.push(decl.clone());
        } else if (
          (prop === "background" || prop === "border" ||
            prop === "outline") &&
          /^(#|rgba?|hsla?)/.test(decl.value)
        ) {
          const cloned = decl.clone();
          cloned.prop = prop === "background"
            ? "background-color"
            : `${prop}-color`;
          decls.push(cloned);
        }
      });

      if (decls.length === 0) {
        rule.remove();
      } else {
        rule.removeAll();
        decls.forEach((d) => rule.append(d));
      }
    });
  },
};

function createThemeModule(spec: Record<string, StyleSpec>): StyleModule {
  const prefix = StyleModule.newName();

  return new StyleModule(spec, {
    finish(selector: string) {
      return /&/.test(selector)
        ? selector.replace(/&\w*/, (matched: string) => {
          if (matched === "&") {
            return `.${prefix}`;
          }

          throw new RangeError(`Unsupported selector: ${matched}`);
        })
        : `.${prefix} ${selector}`;
    },
  });
}

function processFlavorThread(
  flavor: string,
  minifier: InstanceType<typeof CleanCSS>,
): void {
  const palette = flavors[flavor as keyof typeof flavors];
  const flavorLogger: ReturnType<typeof createLogger> = createLogger(palette);

  try {
    console.log(
      flavorLogger("LOG", flavor, "1. generating theme + highlight styles..."),
    );

    const themeSpec = createCatppuccinThemeSpec(palette);
    const themeCSS = createThemeModule(themeSpec).getRules();

    const highlightStyle = createCatppuccinHighlightStyle(palette);
    const highlightCSS = highlightStyle.module?.getRules() ?? "";

    let css = [themeCSS, highlightCSS].filter(Boolean).join("\n\n");
    console.log(
      flavorLogger("LOG", flavor, `-  extracted ${css.length} chars.`),
    );

    console.log(
      flavorLogger("LOG", flavor, "2. matching only color rules..."),
    );
    css = postcss([extractColorDeclarationsPlugin]).process(css, {
      from: undefined,
    }).css;

    console.log(flavorLogger("LOG", flavor, "3. minifying..."));
    css = minifier.minify(css).styles;

    const filename = path.join(out_dir, `catppuccin-${flavor}.css`);
    console.log(flavorLogger("LOG", flavor, `4. writing to ${filename}`));
    fs.writeFileSync(filename, css, "utf-8");

    console.log(flavorLogger("SUCCESS", flavor, `-  complete: ${filename}`));
  } catch (error) {
    console.error(
      flavorLogger(
        "ERROR",
        flavor,
        `-  ${error instanceof Error ? error.message : String(error)}`,
      ),
    );
  }
}

const minifier: InstanceType<typeof CleanCSS> = new CleanCSS();

for (const flavor of Object.keys(flavors)) {
  processFlavorThread(flavor, minifier);
}

console.log(termLogger("EXIT", "build.ts", "-  success"));
