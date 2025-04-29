import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { Compartment, EditorState } from "@codemirror/state";
import { flavors } from "@catppuccin/palette";
import {
  catppuccinLatte,
  catppuccinFrappe,
  catppuccinMacchiato,
  catppuccinMocha,
} from "@catppuccin/codemirror";

const defaultDoc = `/**
 * Constructor for <code>AjaxRequest</code> class
 * @param url the url for the request<p/>
 */
function AjaxRequest(url) {
    var urls = ['www.cnn.com', 5, globalVar]
    this.request = new XMLHttpRequest()
    url = url.replace(/^\s*(.*)/, '$1') // skip leading whitespace
    /* check the url to be in urls */
    var a = '\u1111z\u11ac'
    this.foo = new (function () {})()
    let a = true && false
    foo()
    // #
    console.log('abc)
}

typeof 'nice'
new Class()
class NameClass {}
foo({ abc: 'abcde', "efg": 2 })
foo.bar({ foo: 'abc' })
obj.abc = function () {}

;async () => {
    await Promise.resolve()
}`;

const themeConfig = new Compartment();

const editor = new EditorView({
  doc: defaultDoc,
  parent: document.getElementById("code"),
  extensions: [
    basicSetup,
    javascript({ typescript: true }),
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

const input = document.getElementById("select");
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

selectTheme();

const languageSelector = document.getElementById("language");
const selectLanguage = () => {
  const languageFile = languageSelector.value;
  fetch("https://raw.githubusercontent.com/catppuccin/catppuccin/refs/heads/main/samples/" + languageFile)
    .then((response) => response.text())
    .then((text) => {
      editor.dispatch({
        changes: {
          from: 0,
          to: editor.state.doc.length,
          insert: text,
        },
      });
    });
};
languageSelector.addEventListener("change", selectLanguage);
