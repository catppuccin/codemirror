import {
  CatppuccinFlavor,
  CatppuccinFlavors,
  flavors,
} from "@catppuccin/palette";
import type { StyleSpec } from "style-mod";
import { StyleModule } from "style-mod";

import fs from "fs";
import process from "node:process";
import path from "path";
import type { Plugin } from "postcss";
import postcss from "postcss";

import {
  createCatppuccinHighlightStyle,
  createCatppuccinThemeSpec,
} from "./theme-spec.js";

const out_dir = path.join(process.cwd(), "dist", "css");
const VERBOSE = process.env.VERBOSE === "1";

const log = (level: string, flavor: string, message: string) => {
  const output = `[${level.padEnd(7)}] ${flavor.padEnd(11)} ${message}`;
  if (level != "LOG" || VERBOSE) {
    console.log(output);
  }
};

fs.mkdirSync(out_dir, { recursive: true });

function createDeclExtractPlugin(flavor: CatppuccinFlavor): Plugin {
  const paletteHexPattern = new RegExp(
    Object.values(flavor.colors)
      .map((c) => c.hex.toLowerCase())
      .join("|"),
    "i",
  );

  return {
    postcssPlugin: "extract-colors",
    Once(root: postcss.Root) {
      root.walkRules((rule: postcss.Rule) => {
        const decls: postcss.Declaration[] = [];
        rule.walkDecls((decl: postcss.Declaration) => {
          if (paletteHexPattern.test(decl.value)) {
            decls.push(decl.clone());
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
}

function createThemeModule(spec: Record<string, StyleSpec>): StyleModule {
  const prefix = StyleModule.newName();

  return new StyleModule(spec, {
    finish(selector: string) {
      return /&/.test(selector)
        ? selector.replace(/&\w*/, (matched) => {
            if (matched === "&") {
              return `.${prefix}`;
            }

            throw new RangeError(`Unsupported selector: ${matched}`);
          })
        : `.${prefix} ${selector}`;
    },
  });
}

function processFlavorThread(flavor: keyof CatppuccinFlavors): void {
  const palette = flavors[flavor];

  log("LOG", flavor, "1. generating theme + highlight styles...");
  const themeSpec = createCatppuccinThemeSpec(palette);
  const themeCSS = createThemeModule(themeSpec).getRules();

  const highlightStyle = createCatppuccinHighlightStyle(palette);
  const highlightCSS = highlightStyle.module?.getRules() ?? "";

  let css = [themeCSS, highlightCSS].filter(Boolean).join("\n\n");

  log("LOG", flavor, "2. matching only color rules...");
  css = postcss([createDeclExtractPlugin(palette)]).process(css, {
    from: undefined,
  }).css;

  const filename = path.join(out_dir, `catppuccin-${flavor}.css`);
  fs.writeFileSync(filename, css, "utf-8");

  log("SUCCESS", flavor, "-  complete: ${filename}");
}

for (const flavor of Object.keys(flavors) as Array<keyof CatppuccinFlavors>) {
  processFlavorThread(flavor);
}

log("EXIT", "build.ts".padEnd(11), "-  success");
