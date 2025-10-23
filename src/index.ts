import fs from "fs";
import { pkgUp } from "pkg-up";
import { getLatestVersion } from "./npm";

function parseVersion(input: string) {
  const v = input.replace(/^v/, "");
  const [coreAndPre,] = v.split("+");
  const [core, pre = ""] = coreAndPre.split("-", 2);
  const [maj, min, pat] = core.split(".");
  const major = parseInt(maj || "0", 10) || 0;
  const minor = parseInt(min || "0", 10) || 0;
  const patch = parseInt(pat || "0", 10) || 0;
  const prerelease = pre === "" ? [] : pre.split(".");
  return { major, minor, patch, prerelease };
}

function compareIdentifiers(a: string, b: string): number {
  const isNumA = /^\d+$/.test(a);
  const isNumB = /^\d+$/.test(b);
  if (isNumA && isNumB) {
    const na = parseInt(a, 10);
    const nb = parseInt(b, 10);
    return na === nb ? 0 : na > nb ? 1 : -1;
  }
  if (isNumA !== isNumB) {
    // Numeric identifiers have lower precedence than non-numeric
    return isNumA ? -1 : 1;
  }
  return a === b ? 0 : a > b ? 1 : -1;
}

function compareSemver(a: string, b: string): number {
  const va = parseVersion(a);
  const vb = parseVersion(b);
  if (va.major !== vb.major) return va.major > vb.major ? 1 : -1;
  if (va.minor !== vb.minor) return va.minor > vb.minor ? 1 : -1;
  if (va.patch !== vb.patch) return va.patch > vb.patch ? 1 : -1;
  const aPre = va.prerelease;
  const bPre = vb.prerelease;
  if (aPre.length === 0 && bPre.length === 0) return 0;
  if (aPre.length === 0) return 1; // release > prerelease
  if (bPre.length === 0) return -1;
  const len = Math.max(aPre.length, bPre.length);
  for (let i = 0; i < len; i++) {
    const ai = aPre[i];
    const bi = bPre[i];
    if (ai === undefined) return -1; // shorter prerelease is lower
    if (bi === undefined) return 1;
    const c = compareIdentifiers(ai, bi);
    if (c !== 0) return c;
  }
  return 0;
}

function gt(a: string, b: string): boolean {
  return compareSemver(a, b) > 0;
}

/**
 *
 * @param cwd @default process.cwd()
 * @returns
 */
export const getCWDPackageJson = async (cwd?: string) => {
  const pjsonPath = (await pkgUp({ cwd }))!;
  return JSON.parse(fs.readFileSync(pjsonPath, { encoding: "utf-8" }));
};

export async function checkUpdate(options: {
  customTips?: (p: {
    latestVersion: string;
    curVersion: string;
    pkgName: string;
  }) => void;
  /** the directory where your cli located*/
  cwd: string;
  /** optional npm registry url */
  registry?: string;
}) {
  const { customTips, cwd, registry } = options || {};
  const pjson = await getCWDPackageJson(cwd);
  const latestVersion = await getLatestVersion(pjson.name, registry);
  if (latestVersion && gt(latestVersion, pjson.version)) {
    if (customTips) {
      customTips({
        latestVersion,
        curVersion: pjson.version,
        pkgName: pjson.name,
      });
    } else {
      console.warn(
        "\x1b[33m%s",
        `The latest version of ${pjson.name} is ${latestVersion} and you have ${pjson.version}. Update it now: npm i -g ${pjson.name}`,
      );
    }
  }
}
