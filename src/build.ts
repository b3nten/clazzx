// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "clazzx",
    version: "0.0.1",
    description: "ClazzX is a small typesafe utility library for composing HTML classes.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/username/repo.git",
    },
    bugs: {
      url: "https://github.com/username/repo/issues",
    },
  },
  typeCheck: false,
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");