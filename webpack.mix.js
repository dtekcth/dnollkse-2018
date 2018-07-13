"use strict";

const mix = require("laravel-mix");
const tailwindcss = require("tailwindcss");
const glob = require("glob-all");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const colorFunction = require("postcss-color-function");

const PATHS = {
  src    : path.join(__dirname, "imports"),
  public : path.join(__dirname, "public")
};

/**
 * Custom PurgeCSS Extractor
 * https://github.com/FullHuman/purgecss
 * https://github.com/FullHuman/purgecss-webpack-plugin
 */
class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-z0-9-:\/]+/g);
  }
}

mix.sass("imports/assets/scss/tailwind.scss", "client/stylesheets/bundle.css")
  .options({
    postCss: [
      tailwindcss("tailwind.js"),
      colorFunction()
    ],
    processCssUrls: false
  });

// mix.sass("node_modules/aos/src/sass/aos.scss", "public/css/aos.css");

// mix.webpackConfig({
//   plugins: [
//     new PurgecssPlugin({
//       paths: glob.sync([
//         `${PATHS.src}/**/*.jsx`,
//         `${PATHS.src}/**/*.js`,
//         `${PATHS.src}/**/*.ejs`,
//       ], { nodir: true }),
//       whitelistPatterns: [/^aos/],
//       extractors: [
//         {
//           extractor: TailwindExtractor,
//           extensions: ["js", "jsx", "ejs"]
//         }
//       ]
//     })
//   ]
// });
