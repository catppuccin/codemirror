<h3 align="center">
	<img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/logos/exports/1544x1544_circle.png" width="100" alt="Logo"/><br/>
	<img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/misc/transparent.png" height="30" width="0px"/>
	Catppuccin for <a href="https://codemirror.net/5/">CodeMirror</a><sup>v5</sup>
	<img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/misc/transparent.png" height="30" width="0px"/>
</h3>

<p align="center">
	<a href="https://github.com/catppuccin/codemirror/stargazers"><img src="https://img.shields.io/github/stars/catppuccin/codemirror?colorA=363a4f&colorB=b7bdf8&style=for-the-badge"></a>
	<a href="https://github.com/catppuccin/codemirror/issues"><img src="https://img.shields.io/github/issues/catppuccin/codemirror?colorA=363a4f&colorB=f5a97f&style=for-the-badge"></a>
	<a href="https://github.com/catppuccin/codemirror/contributors"><img src="https://img.shields.io/github/contributors/catppuccin/codemirror?colorA=363a4f&colorB=a6da95&style=for-the-badge"></a>
</p>

<p align="center">
	<img src="assets/previews/preview.webp"/>
</p>

## Previews

<details>
<summary>🌻 Latte</summary>
<img src="assets/previews/latte.webp"/>
</details>
<details>
<summary>🪴 Frappé</summary>
<img src="assets/previews/frappe.webp"/>
</details>
<details>
<summary>🌺 Macchiato</summary>
<img src="assets/previews/macchiato.webp"/>
</details>
<details>
<summary>🌿 Mocha</summary>
<img src="assets/previews/mocha.webp"/>
</details>

## Usage

From the [official CodeMirror docs](https://codemirror.net/5/doc/manual.html#:~:text=that%20same%20separator.-,theme,-%3A%20string),

> You must make sure the desired CSS file defining the corresponding .cm-s-[name] styles is loaded (see the theme directory in the distribution).

1. Make sure to add desired css file to your project by copying it from this repository
2. Set CodeMirror editor instance's `theme` option to the name corresponding to your palette choice from following table.

```js
const editor = CodeMirror.fromTextArea(document.getElementById("code"));
editor.setOption("theme", "ctp-mocha"); // set theme to Catppuccin Mocha
```

Check out the [demo](demo) for reference.

| Palette   | Name          |
| --------- | ------------- |
| Latte     | ctp-latte     |
| Frappé    | ctp-frappe    |
| Macchiato | ctp-macchiato |
| Mocha     | ctp-mocha     |

## 🙋 FAQ

-   Q: **_Will this work with latest version of CodeMirror (v6)?_**\
    A: No. It will need additional work to port v6.

## 💝 Thanks to

**Current Maintainer(s)**

-   [uncenter](https://github.com/uncenter)

**Past Maintainer(s)**

-   [griimick](https://github.com/griimick)

**Inspiration and Contribution**

-   [marijnh](https://github.com/marijnh) for [CodeMirror](https://github.com/codemirror/codemirror5)
-   [ghostx31](https://github.com/ghostx31/) for [catppuccin/joplin](https://github.com/catppuccin/joplin)

&nbsp;

<p align="center">
	<img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/footers/gray0_ctp_on_line.svg?sanitize=true" />
</p>

<p align="center">
	Copyright &copy; 2022-present <a href="https://github.com/catppuccin" target="_blank">Catppuccin Org</a>
</p>

<p align="center">
	<a href="https://github.com/catppuccin/catppuccin/blob/main/LICENSE"><img src="https://img.shields.io/static/v1.svg?style=for-the-badge&label=License&message=MIT&logoColor=d9e0ee&colorA=363a4f&colorB=b7bdf8"/></a>
</p>
