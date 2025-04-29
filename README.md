<h3 align="center">
	<img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/logos/exports/1544x1544_circle.png" width="100" alt="Logo"/><br/>
	<img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/misc/transparent.png" height="30" width="0px"/>
	Catppuccin for <a href="https://codemirror.net">CodeMirror</a><sup>v6</sup>
	<img src="https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/misc/transparent.png" height="30" width="0px"/>
</h3>

<p align="center">
	<a href="https://github.com/catppuccin/codemirror/stargazers"><img src="https://img.shields.io/github/stars/catppuccin/codemirror?colorA=363a4f&colorB=b7bdf8&style=for-the-badge"></a>
	<a href="https://github.com/catppuccin/codemirror/issues"><img src="https://img.shields.io/github/issues/catppuccin/codemirror?colorA=363a4f&colorB=f5a97f&style=for-the-badge"></a>
	<a href="https://github.com/catppuccin/codemirror/contributors"><img src="https://img.shields.io/github/contributors/catppuccin/codemirror?colorA=363a4f&colorB=a6da95&style=for-the-badge"></a>
</p>

<p align="center">
	<img src="assets/preview.webp"/>
</p>

## Previews

<details>
<summary>🌻 Latte</summary>
<a href="https://codemirror.catppuccin.com/#latte"><img src="assets/latte.webp"/></a>
</details>
<details>
<summary>🪴 Frappé</summary>
<a href="https://codemirror.catppuccin.com/#frappe"><img src="assets/frappe.webp"/></a>
</details>
<details>
<summary>🌺 Macchiato</summary>
<a href="https://codemirror.catppuccin.com/#macchiato"><img src="assets/macchiato.webp"/></a>
</details>
<details>
<summary>🌿 Mocha</summary>
<a href="https://codemirror.catppuccin.com/#mocha"><img src="assets/mocha.webp"/></a>
</details>

## Usage

1. Install `@catppuccin/codemirror`:

   ```bash
   npm install @catppuccin/codemirror
   yarn add @catppuccin/codemirror
   pnpm add @catppuccin/codemirror
   ```

2. Import the theme in your project:

   ```js
   import { EditorView, basicSetup } from "codemirror"
   import { catppuccinLatte } from "@catppuccin/codemirror"

   const editor = new EditorView({
     doc: "...",
     parent: document.body
     extensions: [basicSetup, catppuccinLatte], // or catppuccinFrappe, catppuccinMacchiato, catppuccinMocha
   })
   ```

Check out the [demo](https://codemirror.catppuccin.com) for reference.

## 🙋 FAQ

- Q: **_Is this compatible with CodeMirror5?_**\
  A: No, see the [v0.0.1](https://github.com/catppuccin/codemirror/tree/v0.0.1) tag for CodeMirror5 support.

## 💝 Thanks to

**Current Maintainer(s)**

This repository currently has no maintainers.

**Past Maintainer(s)**

- [griimick](https://github.com/griimick)

**Inspiration and Contribution**

- [marijnh](https://github.com/marijnh) for [CodeMirror](https://github.com/codemirror/codemirror5)
- [ghostx31](https://github.com/ghostx31/) for [catppuccin/joplin](https://github.com/catppuccin/joplin)
- [BuonOmo](https://github.com/BuonOmo) for CodeMirror v6 support

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
