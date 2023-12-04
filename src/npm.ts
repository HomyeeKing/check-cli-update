import { exec } from "child_process"

export async function getLatestVersion(
  pkgName: string,
): Promise<string | undefined> {
  if (pkgName) {
    return new Promise((resolve, reject) => {
      try {
        exec(
          `npm show ${pkgName} version`,
          {
            encoding: "utf-8",
          },
          (err, latestVersion, stderr) => {
            if (stderr.includes("404")) {
              return resolve("0.0.0")
            }
            if (err) return reject(err)
            resolve(latestVersion.trim())
          },
        )
      } catch (error) {}
    })
  }
  return undefined
}
