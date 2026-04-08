import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import CleanCSS from "clean-css";
import process from "node:process";

const flavors = ["latte", "frappe", "macchiato", "mocha"];
const out_dir = path.join(process.cwd(), "dist", "css");

if (!fs.existsSync(out_dir)) {
  fs.mkdirSync(out_dir, { recursive: true });
}

function colorMatch(css: string): string {
  const props = new Set([
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

  const col_rule = /(#[0-9a-f]{3,8}|rgb[a]?\([^)]+\)|[a-z]+)/gi;

  const rule_rule = /([^{]+)\{([^}]*)\}/g;
  const out: string[] = [];
  let match;

  while ((match = rule_rule.exec(css)) !== null) {
    const selector = match[1].trim();
    const declarations = match[2];

    const decls = declarations
      .split(";")
      .map((d) => d.trim())
      .filter((d) => d.length > 0)
      .map((d) => {
        const [propName, ...valueParts] = d.split(":");
        const prop = propName.trim().toLowerCase();
        const value = valueParts.join(":").trim();

        if (props.has(prop)) {
          return d;
        }

        if (prop === "background" && col_rule.test(value)) {
          const color = value.match(col_rule)
            ?.[value.match(col_rule)!.length - 1];
          return color ? `background-color:${color}` : null;
        }

        if (prop === "border" && col_rule.test(value)) {
          const color = value.match(col_rule)
            ?.[value.match(col_rule)!.length - 1];
          return color ? `border-color:${color}` : null;
        }

        if (
          prop.match(/^border-(top|right|bottom|left)$/) && col_rule.test(value)
        ) {
          const color = value.match(col_rule)
            ?.[value.match(col_rule)!.length - 1];
          const dir = prop.split("-")[1];
          return color ? `border-${dir}-color:${color}` : null;
        }

        if (prop === "outline" && col_rule.test(value)) {
          const color = value.match(col_rule)
            ?.[value.match(col_rule)!.length - 1];
          return color ? `outline-color:${color}` : null;
        }

        return null;
      })
      .filter((d) => d !== null);

    if (decls.length > 0) {
      out.push(`${selector}{${decls.join(";")}}`);
    }
  }

  return out.join("");
}

async function fetchTheme(flavor: string): Promise<string> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto(
      `https://codemirror.catppuccin.com/#${flavor}`,
      { waitUntil: "networkidle2", timeout: 30000 },
    );

    await page.waitForSelector(".cm-editor", { timeout: 5000 });

    await page.evaluate(() =>
      new Promise((resolve) => setTimeout(resolve, 1000))
    );

    const css = await page.evaluate(() => {
      const styles = Array.from(document.querySelectorAll("style"));
      return styles
        .map((s) => s.textContent || "")
        .filter((text) => text.trim().length > 0)
        .join("\n\n");
    });

    return css;
  } catch (error) {
    console.error(`error(${flavor}):`, error);
    return "";
  } finally {
    await browser.close();
  }
}

async function main() {
  const minifier = new CleanCSS();
  for (const flavor of flavors) {
    console.log(
      `1. fetching CMv6 stylesheet from: https://codemirror.catppuccin.com/#${flavor}...`,
    );
    let css = await fetchTheme(flavor);

    if (css) {
      console.log(`2. matching only color rules...`);
      css = colorMatch(css);
      console.log(`3. minifying...`);
      css = minifier.minify(css).styles;
      const filename = path.join(out_dir, `catppuccin-${flavor}.css`);
      fs.writeFileSync(filename, css, "utf-8");
      console.log(`- Output: ${filename}`);
    } else {
      console.log(`- error(${flavor}): failed to fetch any CSS.`);
    }
  }

  console.log("success");
}

main();
