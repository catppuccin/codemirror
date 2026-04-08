import { flavors as catppuccin_flavors } from "@catppuccin/palette";
import CleanCSS from "clean-css";
import fs from "fs";
import http from "http";
import process from "node:process";
import path from "path";
import postcss from "postcss";
import type { Plugin } from "postcss";
import puppeteer from "puppeteer";

const flavors = Object.keys(catppuccin_flavors);
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
          /^(#|rgb|hsl)/.test(decl.value)
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

if (!fs.existsSync(out_dir)) {
  fs.mkdirSync(out_dir, { recursive: true });
}

function startServer(port: number): Promise<http.Server> {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = req.url ?? "/";

      if (url === "/favicon.ico") {
        res.writeHead(204);
        res.end();
        return;
      }

      console.log(`- ${req.method} ${url}`);

      let site_path = path.join(
        process.cwd(),
        url === "/" ? "demo/index.html" : url,
      );

      if (url === "/") {
        site_path = path.join(process.cwd(), "demo", "index.html");
      } else if (url.startsWith("/dist/")) {
        // serve dist from root
        site_path = path.join(process.cwd(), url);
      } else {
        // all else from demo
        site_path = path.join(process.cwd(), "demo", url);
      }

      let content: string;

      try {
        content = fs.readFileSync(site_path, "utf-8");
      } catch (error) {
        console.error(`file not found: ${site_path}`);
        res.writeHead(404);
        res.end("Not Found");
        return;
      }

      const ext = path.extname(site_path).toLowerCase();

      if (ext === ".html") {
        content = content.replace(
          '"@catppuccin/codemirror": "./index.js"',
          '"@catppuccin/codemirror": "/dist/index.js"',
        );
      }

      const buffer = Buffer.from(content);
      const mimetype = {
        ".html": "text/html; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".json": "application/json; charset=utf-8",
        ".mjs": "application/javascript; charset=utf-8",
      }[ext] || "text/plain";
      res.writeHead(200, { "Content-Type": mimetype });
      res.end(buffer);
    });

    server.listen(port, () => {
      console.log(`serving http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function fetchStyleSheetFromSite(
  flavor: string,
  port: number,
): Promise<string> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(`http://localhost:${port}/#${flavor}`, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

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

  const PORT = 3000;
  const server = await startServer(PORT);

  for (const flavor of flavors) {
    console.log(`1. rendering: http://localhost:${PORT}/#${flavor}...`);
    let css = await fetchStyleSheetFromSite(flavor, PORT);

    if (css) {
      console.log(`2. matching only color rules...`);
      css = postcss([extractColorDeclarationsPlugin]).process(css, {
        from: undefined,
      }).css;
      console.log(`3. minifying...`);
      css = minifier.minify(css).styles;
      const filename = path.join(out_dir, `catppuccin-${flavor}.css`);
      fs.writeFileSync(filename, css, "utf-8");
      console.log(`== output: ${filename}`);
    } else {
      console.log(`== error(${flavor}): failed to extract css.`);
    }
  }

  console.log("closing server.");
  server.close();
  console.log("success.");
}

main();
