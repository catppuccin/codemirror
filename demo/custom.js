const editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  lineNumbers     : true,
  styleActiveLine : true,
  matchBrackets   : true
});
const input = document.getElementById("select");
function selectTheme() {
  const theme = input.options[input.selectedIndex].value;
  editor.setOption("theme", theme);
  location.hash = "#" + theme;
  document.documentElement.style.setProperty('--bg', `var(--${theme})`);
}
const choice = (location.hash && location.hash.slice(1)) ||
  (document.location.search &&
    decodeURIComponent(document.location.search.slice(1))) || 'ctp-mocha';
if (choice) {
  input.value = choice;
  editor.setOption("theme", choice);
  document.documentElement.style.setProperty('--bg', `var(--${choice})`);
}
CodeMirror.on(window, "hashchange", function () {
  const theme = location.hash.slice(1);
  if (theme) { input.value = theme; selectTheme(); }
});
