import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import process from "node:process";

// Read and parse YAML config
const configPath = path.resolve("../leaflet.plug.yaml");
const fileContent = fs.readFileSync(configPath, "utf-8");

const configPlugin = {
  name: "inject-config",
  setup(build) {
    build.onResolve({ filter: /^virtual:config$/ }, (args) => {
      return { path: args.path, namespace: "config-ns" };
    });

    build.onLoad({ filter: /.*/, namespace: "config-ns" }, () => {
      return {
        contents: `export default ${JSON.stringify(YAML.parse(fileContent))};`,
        loader: "js",
      };
    });
  },
};

build({
  entryPoints: ["map.tsx"],
  bundle: true,
  minify: true,
  outfile: "../assets/map.js",
  loader: {
    ".png": "dataurl",
  },
  format: "iife",
  plugins: [configPlugin],
}).then(() => {
  console.log("✅ Build complete");
}).catch((error) => {
  console.error("❌ Build failed:", error);
  process.exit(1);
});
