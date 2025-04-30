import { EditorView, basicSetup } from "codemirror";
import { Compartment, EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { php } from "@codemirror/lang-php";
import { sql } from "@codemirror/lang-sql";
import { go } from "@codemirror/lang-go";
import { yaml } from "@codemirror/lang-yaml";
import { csharp } from "@replit/codemirror-lang-csharp";
import { nix } from "@replit/codemirror-lang-nix";
import { flavors } from "@catppuccin/palette";
import {
  catppuccinLatte,
  catppuccinFrappe,
  catppuccinMacchiato,
  catppuccinMocha,
} from "@catppuccin/codemirror";

const samplesUrl =
  "https://raw.githubusercontent.com/catppuccin/catppuccin/refs/heads/main/samples";
const themeConfig = new Compartment();
const langConfig = new Compartment();

const languageProviders = {
  "cpp.cpp": cpp(),
  "cs.cs": csharp(),
  "css.css": css(),
  "go.go": go(),
  "html.html": html(),
  "java.java": java(),
  "javascript.js": javascript(),
  "json.json": json(),
  "jsx.jsx": javascript({ jsx: true }),
  "markdown.md": markdown(),
  "nix.nix": nix(),
  "php.php": php(),
  "python.py": python(),
  "rust.rs": rust(),
  "sql.sql": sql(),
  "tsx.tsx": javascript({ typescript: true, jsx: true }),
  "typescript.ts": javascript({ typescript: true }),
  "yaml.yaml": yaml(),
};

const editor = new EditorView({
  doc: "",
  parent: document.getElementById("code"),
  extensions: [
    basicSetup,
    langConfig.of(javascript({ typescript: true })),
    EditorState.readOnly.of(true),
    EditorView.editable.of(false),
    EditorView.contentAttributes.of({ tabindex: "0" }),
    themeConfig.of([catppuccinMocha]),
  ],
});

const themes = {
  mocha: catppuccinMocha,
  macchiato: catppuccinMacchiato,
  frappe: catppuccinFrappe,
  latte: catppuccinLatte,
};

const input = document.getElementById("flavor-select");
const selectTheme = () => {
  const theme = input.options[input.selectedIndex].value;

  location.hash = "#" + theme;

  // Set styles for the demo.
  flavors[theme].colorEntries.forEach(([name, { hex }]) => {
    document.documentElement.style.setProperty(`--${name}`, hex);
  });

  // Update editor with selected theme.
  editor.dispatch({
    effects: themeConfig.reconfigure([themes[theme]]),
  });
};
input.addEventListener("change", selectTheme);

const defaultTheme = location.hash.slice(1);
if (themes[defaultTheme]) input.value = defaultTheme;

const languageSelector = document.getElementById("language-select");
const selectLanguage = () => {
  const languageFile = languageSelector.value;
  const languageProvider = languageProviders[languageFile] ?? javascript();
  fetch(`${samplesUrl}/${languageFile}`)
    .then((response) => response.text())
    .then((text) => {
      editor.dispatch({
        changes: {
          from: 0,
          to: editor.state.doc.length,
          insert: text,
        },
        effects: langConfig.reconfigure(languageProvider),
      });
    });
};
languageSelector.addEventListener("change", selectLanguage);

selectTheme();
selectLanguage();
