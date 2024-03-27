import * as path from "std/path";
import * as sass from "sass";

import { flavorEntries } from "npm:@catppuccin/palette";

const THEME_DIR = path.join(import.meta.dirname as string, "../themes/");

await Deno.remove(THEME_DIR, { recursive: true })
	.catch(() => {})
	.finally(() => Deno.mkdir(THEME_DIR));

const base = Deno.readTextFileSync(
	path.join(import.meta.dirname as string, "base.scss")
);

for (const [flavor] of flavorEntries) {
	const { css } = sass.compileString(
		`
	@import "@catppuccin/palette/scss/${flavor}";
	$selector: cm-s-ctp-${flavor};
	${base}
	`,
		{
			loadPaths: [
				path.join(import.meta.dirname as string, "../node_modules"),
			],
		}
	);
	await Deno.writeTextFile(path.join(THEME_DIR, flavor + ".css"), css);
}
