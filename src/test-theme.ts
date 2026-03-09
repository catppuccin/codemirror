// test-theme.ts
import { catppuccinMocha } from "./catppuccin";
import { EditorView } from "@codemirror/view";

// Create a dummy editor to mount the theme
const editor = new EditorView({
  doc: "test code",
  extensions: catppuccinMocha,
  parent: document.body,
});

// Now try to extract styles
const styleSheets = [];
if (document.adoptedStyleSheets) {
  document.adoptedStyleSheets.forEach((sheet) => {
    try {
      const rules = Array.from(sheet.cssRules)
        .map((rule) => rule.cssText)
        .join("\n");
      styleSheets.push(rules);
      console.log("Extracted from adoptedStyleSheets:", rules);
    } catch (e) {
      console.warn("Can't access stylesheet:", e);
    }
  });
}

document.querySelectorAll("style").forEach((tag) => {
  console.log("Style tag content:", tag.textContent);
  styleSheets.push(tag.textContent);
});

console.log("FULL CSS OUTPUT:", styleSheets.join("\n"));
