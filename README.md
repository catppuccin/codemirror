<h3 align="center">
	<img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/logos/exports/1544x1544_circle.png" width="100" alt="Logo"/><br/>
	<img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/misc/transparent.png" height="30" width="0px"/>
	Catppuccin for <a href="https://codemirror.net/5/">CodeMirror</a><sup>v6</sup>
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
<a href="https://catppuccin.github.io/codemirror/#latte"><img src="assets/previews/latte.webp"/></a>
</details>
<details>
<summary>🪴 Frappé</summary>
<a href="https://catppuccin.github.io/codemirror/#frappe"><img src="assets/previews/frappe.webp"/></a>
</details>
<details>
<summary>🌺 Macchiato</summary>
<a href="https://catppuccin.github.io/codemirror/#macchiato"><img src="assets/previews/macchiato.webp"/></a>
</details>
<details>
<summary>🌿 Mocha</summary>
<a href="https://catppuccin.github.io/codemirror/#mocha"><img src="assets/previews/mocha.webp"/></a>
</details>

## Usage

```js
import { EditorView, basicSetup } from "codemirror"
import { catppuccinMocha } from "@catppuccin/codemirror"

const editor = new EditorView({
	doc: "...",
	parent: document.body
	extensions: [basicSetup, catppuccinMocha],
})
```

Check out the [demo](https://catppuccin.github.io/codemirror/) for reference.

| Palette   | Name                |
| --------- | ------------------- |
| Latte     | catppuccinLatte     |
| Frappé    | catppuccinFrappe    |
| Macchiato | catppuccinMacchiato |
| Mocha     | catppuccinMocha     |

## 🙋 FAQ

- Q: **_Is this compatible with CodeMirror5?_**\
  A: No. But you can [go back in time](https://github.com/catppuccin/codemirror/tree/aa73c1a1797c97964afcd4a3023353913ec609cb) and find what you want!

## 💝 Thanks to

**Current Maintainer(s)**

This repository currently has no maintainers.

**Past Maintainer(s)**

- [griimick](https://github.com/griimick)

**Inspiration and Contribution**

- [marijnh](https://github.com/marijnh) for [CodeMirror](https://github.com/codemirror/codemirror5)
- [ghostx31](https://github.com/ghostx31/) for [catppuccin/joplin](https://github.com/catppuccin/joplin)

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
