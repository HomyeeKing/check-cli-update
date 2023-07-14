# check-cli-update

[![npm version](https://badgen.net/npm/v/check-cli-update)](https://npm.im/check-cli-update) [![npm downloads](https://badgen.net/npm/dm/check-cli-update)](https://npm.im/check-cli-update)

for CLI developer, you can add this function to remind user to update the command in time.

## Install

```bash
npm i check-cli-update
```

## Usage

```ts
import { checkUpdate } from "check-cli-update"
checkUpdate({
  cwd: "your cli folder location",
})
```

take `@homy/gito-core` for example, if the version you use is `0.0.1`,you will see a message like

```
The latest version of @homy/gito-core is 1.0.0 and you have 0.0.1. Update it now: npm i -g @homy/gito-core
```

also you can custom the tips by `customTips` callback and cwd by `cwd` option

```ts
import { checkUpdate } from "check-cli-update"
checkUpdate({
  customTips({
      latestVersion: string
      curVersion: string
      pkgName: string
    }) {},

  cwd:'xxx'
})
```
