import { exec } from "child_process"

export async function getLatestVersion(
  pkgName: string,
  registry?: string,
): Promise<string | undefined> {
  if (pkgName) {
    return new Promise((resolve, reject) => {
      try {
        const registryArg = registry ? `--registry=${registry}` : ""
        exec(
          `npm show ${pkgName} version ${registryArg}`,
          {
            encoding: "utf-8",
          },
          (err, latestVersion) => {
            if (err) return reject(err)
            resolve(latestVersion.trim())
          },
        )
      } catch (error) { }
    })
  }
  return undefined
}
