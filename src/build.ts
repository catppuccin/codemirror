import { CatppuccinFlavor, CatppuccinFlavors, flavors } from "@catppuccin/palette";
import { cyan, green, hex, magenta, red, white } from "ansis";
import type { StyleSpec } from "style-mod";
import { StyleModule } from "style-mod";

import CleanCSS from "clean-css";
import fs from "fs";
import process from "node:process";
import path from "path";
import type { Plugin } from "postcss";
import postcss from "postcss";

import { createCatppuccinHighlightStyle, createCatppuccinThemeSpec } from "./theme-spec";

const out_dir = path.join( process.cwd(), "dist", "css" );

fs.mkdirSync( out_dir, { recursive: true } );

type LoggerType = (
  type: string,
  context: string,
  message: string
) => string;
type LogType = "ERROR" | "SUCCESS" | "LOG" | "EXIT";

const createLogger = ( palette?: CatppuccinFlavor ): LoggerType => {
  const logtype_enum: Record<LogType, ( s: string ) => string> = {
    ERROR: palette?.colors.red.hex ? hex( palette.colors.red.hex ) : red,
    SUCCESS: palette?.colors.green.hex ? hex( palette.colors.green.hex ) : green,
    LOG: palette?.colors.teal.hex ? hex( palette.colors.teal.hex ) : cyan,
    EXIT: palette?.colors.mauve.hex ? hex( palette.colors.mauve.hex ) : magenta
  };

  return ( type: string, context: string, message: string ): string => {
    const logtype_pad = type.padEnd( 7 );
    const context_pad = context.padEnd( 11 );
    const colorize = logtype_enum[type as LogType] ||
      white;

    return `[${colorize( logtype_pad )}] ${colorize( context_pad )} ${message}`;
  };
};

const termLogger = createLogger();

function createDeclExtractPlugin(
  flavor: CatppuccinFlavor
): Plugin {
  const paletteHexes = Object.values( flavor.colors ).map(
    ( color ) => color.hex.toLowerCase()
  );

  return {
    postcssPlugin: "extract-colors",
    Once( root: postcss.Root ) {
      root.walkRules( ( rule: postcss.Rule ) => {
        const decls: postcss.Declaration[] = [];

        rule.walkDecls( ( decl: postcss.Declaration ) => {
          const valueLower = decl.value.toLowerCase();

          for ( const hex of paletteHexes ) {
            if ( valueLower.includes( hex ) ) {
              decls.push( decl.clone() );
              break;
            }
          }
        } );

        if ( decls.length === 0 ) {
          rule.remove();
        } else {
          rule.removeAll();
          decls.forEach( ( d ) => rule.append( d ) );
        }
      } );
    }
  };
}

function createThemeModule( spec: Record<string, StyleSpec> ): StyleModule {
  const prefix = StyleModule.newName();

  return new StyleModule( spec, {
    finish( selector: string ) {
      return /&/.test( selector )
        ? selector.replace( /&\w*/, ( matched ) => {
          if ( matched === "&" ) {
            return `.${prefix}`;
          }

          throw new RangeError( `Unsupported selector: ${matched}` );
        } )
        : `.${prefix} ${selector}`;
    }
  } );
}

function processFlavorThread(
  flavor: keyof CatppuccinFlavors,
  minifier: InstanceType<typeof CleanCSS>
): void {
  const palette = flavors[flavor];
  const flavorLogger = createLogger( palette );

  try {
    console.log(
      flavorLogger( "LOG", flavor, "1. generating theme + highlight styles..." )
    );

    const themeSpec = createCatppuccinThemeSpec(
      palette
    );
    const themeCSS = createThemeModule( themeSpec ).getRules();

    const highlightStyle = createCatppuccinHighlightStyle(
      palette
    );
    const highlightCSS = highlightStyle.module?.getRules() ?? "";

    let css = [ themeCSS, highlightCSS ].filter( Boolean ).join( "\n\n" );
    console.log(
      flavorLogger( "LOG", flavor, `-  extracted ${css.length} chars.` )
    );

    console.log(
      flavorLogger( "LOG", flavor, "2. matching only color rules..." )
    );
    css = postcss( [ createDeclExtractPlugin( palette ) ] ).process( css, {
      from: undefined
    } ).css;

    console.log( flavorLogger( "LOG", flavor, "3. minifying..." ) );
    css = minifier.minify( css ).styles;

    const filename = path.join( out_dir, `catppuccin-${flavor}.css` );
    console.log( flavorLogger( "LOG", flavor, `4. writing to ${filename}` ) );
    fs.writeFileSync( filename, css, "utf-8" );

    console.log( flavorLogger( "SUCCESS", flavor, `-  complete: ${filename}` ) );
  } catch (error) {
    console.error(
      flavorLogger(
        "ERROR",
        flavor,
        `-  ${error instanceof Error ? error.message : String( error )}`
      )
    );
  }
}

const minifier: InstanceType<typeof CleanCSS> = new CleanCSS();

for ( const flavor of Object.keys( flavors ) as Array<keyof CatppuccinFlavors> ) {
  processFlavorThread( flavor, minifier );
}

console.log( termLogger( "EXIT", "build.ts", "-  success" ) );
