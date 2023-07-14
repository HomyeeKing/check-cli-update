const fs = require("fs");
const { join, resolve } = require("path");

if (process.env.BUILD_ENV !== "cloud") {
  const cwd = process.cwd().slice(0, process.cwd().indexOf("/node_modules/"));
  const shimData = fs.readFileSync(
    resolve(__dirname, "../dist/typings.d.ts"),
    "utf-8"
  );
  const srcPath = join(cwd, "./src");
  if (fs.existsSync(srcPath)) {
    fs.writeFile(join(srcPath, "./typings.d.ts"), shimData, (err) => {
      fs.rmSync(resolve(__dirname, "../dist/typings.d.ts"));
      fs.rmdirSync(__dirname, {
        recursive: true,
      });
      if (err) {
        console.error(
          "\x1B[31m%s\x1B[0m",
          "生成typings.d.ts 失败，请上报bug或联系@莽原. https://gitlab.alibaba-inc.com/U-Xian/sdk/issues "
        );
      } else {
        console.log("\x1B[32m", "生成typings.d.ts成功");
      }
    });
  }
}
