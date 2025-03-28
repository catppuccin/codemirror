import { EditorView, basicSetup } from "codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { Compartment } from "@codemirror/state"
import { flavors } from "@catppuccin/palette"
import {
	catppuccinLatte,
	catppuccinFrappe,
	catppuccinMacchiato,
	catppuccinMocha,
} from "../dist/index.js"

const defaultDoc = `function findSequence(goal) {
  function find(start, history) {
    if (start == goal)
      return history;
    else if (start > goal)
      return null;
    else
      return find(start + 5, "(" + history + " + 5)") ||
             find(start * 3, "(" + history + " * 3)");
  }
  return find(1, "1");
}`

const themeConfig = new Compartment()

const editor = new EditorView({
	doc: defaultDoc,
	parent: document.getElementById("code"),
	extensions: [basicSetup, javascript(), themeConfig.of([catppuccinMocha])],
})

const themes = {
	mocha: catppuccinMocha,
	macchiato: catppuccinMacchiato,
	frappe: catppuccinFrappe,
	latte: catppuccinLatte,
}

const input = document.getElementById("select")
const selectTheme = () => {
	const theme = input.options[input.selectedIndex].value
	const colors = flavors[theme].colors

	location.hash = "#" + theme

	// Set styles for the demo.
	document.documentElement.style.setProperty("--bg", colors.base.hex)
	document.documentElement.style.setProperty("--hover", colors.surface0.hex)
	document.documentElement.style.setProperty("--color", colors.text.hex)

	// Update editor with selected theme.
	editor.dispatch({
		effects: themeConfig.reconfigure([themes[theme]]),
	})
}
input.addEventListener("change", selectTheme)

const defaultTheme = location.hash.slice(1)
if (themes[defaultTheme]) input.value = defaultTheme

selectTheme()
