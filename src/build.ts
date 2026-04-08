import { flavors } from "@catppuccin/palette";
import CleanCSS from "clean-css";
import express from "express";
import fs from "fs";
import type { Server } from "http";
import process from "node:process";
import path from "path";
import postcss from "postcss";
import type { Plugin } from "postcss";
import puppeteer from "puppeteer";

const app = express();
const out_dir = path.join(process.cwd(), "dist", "css");
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

fs.mkdirSync(out_dir, { recursive: true });

const formatLog = (type: string, context: string, message: string) => {
  const typePad = type.padEnd(7);
  const contextPad = context.padEnd(11);
  return `[${typePad}] ${contextPad} ${message}`;
};

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

app.use(
  (
    req: { path: string },
    res: { send: (data: any) => any },
    next: () => void,
  ) => {
    const originalSend = res.send;
    res.send = function (data: any) {
      if (
        typeof data === "string" &&
        (req.path === "/" || req.path.endsWith(".html"))
      ) {
        data = data.replace(
          '"@catppuccin/codemirror": "./index.js"',
          '"@catppuccin/codemirror": "/dist/index.js"',
        );
      }
      return originalSend.call(this, data);
    };
    next();
  },
);

///  Serve Priority
// Serve dist at root
app.use(express.static("dist"));
// Serve demo as root
app.use(express.static("demo"));
// Serve dist at /dist
app.use("/dist", express.static("dist"));

function startLocalServer(port: number): Promise<Server> {
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.log(
        formatLog(
          "LOG",
          "SERVER",
          "-  serving http://localhost:${port}.",
        ),
      );
      resolve(server);
    });
  });
}

async function fetchStyleSheetFromPage(
  flavor: string,
  port: number,
): Promise<string> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    console.log(
      formatLog(
        "LOG",
        flavor,
        "-  navigating frame to http://localhost:${port}/#${flavor} (timeout: 30s)...",
      ),
    );
    await page.goto(`http://localhost:${port}/#${flavor}`, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    console.log(
      formatLog(
        "LOG",
        flavor,
        "-  waiting for load of stylesheet with .cm-editor selector (timeout: 5s)...",
      ),
    );
    await page.waitForSelector(".cm-editor", { timeout: 5000 });

    console.log(
      formatLog(
        "LOG",
        flavor,
        "-  sleep 1s to allow time to render...",
      ),
    );
    await page.evaluate(() =>
      new Promise((resolve) => setTimeout(resolve, 1000))
    );

    console.log(
      formatLog(
        "LOG",
        flavor,
        "-  extracting stylesheet...",
      ),
    );
    const css = await page.evaluate(() => {
      const styles = Array.from(document.querySelectorAll("style"));
      return styles
        .map((s) => s.textContent || "")
        .filter((text) => text.trim().length > 0)
        .join("\n\n");
    });

    if (!css) {
      throw new Error("No matching CSS found in page");
    }

    console.log(
      formatLog(
        "LOG",
        flavor,
        "-  extracted ${css.length} chars.",
      ),
    );
    return css;
  } finally {
    await browser.close();
  }
}

async function processFlavorThread(
  flavor: string,
  port: number,
  minifier: InstanceType<typeof CleanCSS>,
): Promise<void> {
  try {
    console.log(
      formatLog(
        "LOG",
        flavor,
        "1. rendering: http://localhost:${port}/#${flavor}...",
      ),
    );
    let css = await fetchStyleSheetFromPage(flavor, port);

    console.log(formatLog("LOG", flavor, `2. matching only color rules...`));
    css = postcss([extractColorDeclarationsPlugin]).process(css, {
      from: undefined,
    }).css;

    console.log(formatLog("LOG", flavor, `3. minifying...`));
    css = minifier.minify(css).styles;

    const filename = path.join(out_dir, `catppuccin-${flavor}.css`);
    console.log(formatLog("LOG", flavor, `4. writing to ${filename}`));
    fs.writeFileSync(filename, css, "utf-8");

    console.log(formatLog("SUCCESS", flavor, `- complete: ${filename}`));
  } catch (error) {
    console.error(
      formatLog(
        "ERROR",
        flavor,
        `- ${error instanceof Error ? error.message : String(error)}`,
      ),
    );
  }
}

const minifier = new CleanCSS();
const PORT = 3000;
const server = await startLocalServer(PORT);

await Promise.all(
  Object.keys(flavors).map((flavor) =>
    processFlavorThread(flavor, PORT, minifier)
  ),
);

console.log(formatLog("LOG", "SERVER", `-  closing server.`));
await new Promise<void>((resolve) => {
  server.close(() => resolve());
});
console.log(formatLog("EXIT", "build.ts", "- success"));
