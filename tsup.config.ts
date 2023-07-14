import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  clean: true,
  format: ["esm", "cjs"],
  target: "node16",
  skipNodeModulesBundle: true,
  outExtension() {
    return {
      js: `.js`,
    }
  },
})
