import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import CleanCSS from "clean-css";
import process from "node:process";
import http from "http";

const flavors = ["latte", "frappe", "macchiato", "mocha"];
const out_dir = path.join(process.cwd(), "dist", "css");

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

      let content = fs.readFileSync(site_path, "utf-8");
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

async function fetch(flavor: string, port: number): Promise<string> {
  const browser = await puppeteer.launch();
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

async function main() {
  const minifier = new CleanCSS();

  const PORT = 3000;
  const server = await startServer(PORT);

  for (const flavor of flavors) {
    console.log(`1. rendering: http://localhost:${PORT}/#${flavor}...`);
    let css = await fetch(flavor, PORT);

    if (css) {
      console.log(`2. matching only color rules...`);
      css = colorMatch(css);
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
