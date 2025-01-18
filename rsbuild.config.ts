import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { execSync } from "node:child_process";

let hash = "";

try {
  hash = execSync("git rev-parse --short HEAD").toString().trim();
} catch (error) {
  hash = "DEV";
}

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    define: {
      "process.env.COMMIT_HASH": JSON.stringify(hash),
    },
    alias: {
      "@app": "./src",
      "@pages": "./src/pages",
      "@components": "./src/components",
      "@core": "./src/core",
      "@layouts": "./src/layouts",
    },
  },
  html: {
    title: "Meshtastic Web",
  },
  output: {
    distPath: {
      root: 'build',
      html: 'meshtastic/web',
      js: 'meshtastic/web/js',
      jsAsync:'meshtastic/web/js/async',
      css: 'meshtastic/web/css',
      cssAsync: 'meshtastic/web/css/async',
      svg: 'meshtastic/web/svg',
      font: 'meshtastic/web/font',
      wasm: 'meshtastic/web/wasm',
      image: 'meshtastic/web/image',
      media: 'meshtastic/web/media',
      assets: 'meshtastic/web/assets',
    },
  }
});
