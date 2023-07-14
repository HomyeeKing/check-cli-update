import { pkgUp } from "pkg-up"
import fs from "fs"
import { getLatestVersion } from "./npm"

/**
 *
 * @param cwd @default process.cwd()
 * @returns
 */
export const getCWDPackageJson = async (cwd?: string) => {
  const pjsonPath = (await pkgUp({ cwd }))!
  return JSON.parse(fs.readFileSync(pjsonPath, { encoding: "utf-8" }))
}

export async function checkUpdate(options: {
  customTips?: (p: {
    latestVersion: string
    curVersion: string
    pkgName: string
  }) => void
  /** the directory where your cli located*/
  cwd: string
}) {
  const { customTips, cwd } = options || {}
  const pjson = await getCWDPackageJson(cwd)
  const latestVersion = await getLatestVersion(pjson.name)
  try {
    // @ts-expect-error need developer to install semver
    const semver = (await import("semver")).default
    if (latestVersion && semver.gt(latestVersion, pjson.version)) {
      if (customTips) {
        customTips({
          latestVersion,
          curVersion: pjson.version,
          pkgName: pjson.name,
        })
      } else {
        console.warn(
          "\x1b[33m%s",
          `The latest version of ${pjson.name} is ${latestVersion} and you have ${pjson.version}. Update it now: npm i -g ${pjson.name}`,
        )
      }
    }
  } catch (e: any) {
    if (e.code === "ERR_MODULE_NOT_FOUND") {
      console.error("\x1B[31m%s", '"semver" not found. Did you install it?')
    }
    throw e.message
  }
}
