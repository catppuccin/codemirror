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

const defaultDoc = `module ModuleValidator {
    import checkChars = CharUtils.notWhiteSpace

    export interface HasValidator<T> {
        validateValue(): Boolean
    }

    type FooBarAlias = string

    @decorator()
    class HasValidator implements HasValidator<String> {
        /* Processed values */
        static validatedValue: Array<String> = ['', 'aa']
        private myValue: String

        /**
         * Constructor for class
         * @param valueParameter Value for <i>validation</i>
         */
        constructor(valueParameter: String) {
            this.myValue = valueParameter
            HasValidator.validatedValue.push(value)
        }

        public validateValue(): Boolean {
            var resultValue: Boolean = checkChars(this.myValue)
            return resultValue
        }

        static createInstance(valueParameter: string): HasValidator {
            return new HasValidator(valueParameter)
        }
    }

    function globalFunction<TypeParameter>(value: TypeParameter) {
        //global function
        return 42
    }

    declare var declareUrl
    var varUrl = declareUrl.replace(/^\s*(.*)/, '$1').concat('\u1111z\n\u0022')
    var html = \`<div title='HTML injection'>Injected language fragment</div>\`
    var hello = () => console.log('hello')
    HasValidator.createInstance(varUrl).validateValue()

    function acceptsUnion(s: string | number) {
        if (typeof s === 'string') {
            s
        }
    }

    enum EnumName {
        EnumMember,
    }
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
