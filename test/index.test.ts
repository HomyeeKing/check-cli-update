import { getLatestVersion } from "@/npm"
import * as exports from "../src"
import path from "path"

const { checkUpdate, getCWDPackageJson } = exports
test("getCWDPackageJson", async () => {
  const cwd = path.join(__dirname, "./fixtures/lowVersion")
  expect((await getCWDPackageJson(cwd)) as string).toMatchObject({
    name: "@homy/gito-core",
    version: "0.0.1",
  })
})

test("getLatestVersion", async () => {
  expect(await getLatestVersion("@homy/gito-core")).toBe("1.0.0")
  expect(await getLatestVersion("pkg-up")).toBe("4.0.0")
})

describe("checkUpdate", () => {
  const warnSpy = vi.spyOn(console, "warn")

  afterEach(() => {
    warnSpy.mockClear()
  })

  test("basic", async () => {
    const cwd = path.join(__dirname, "./fixtures/lowVersion")
    await checkUpdate({ cwd })
    expect(warnSpy).toHaveBeenCalled()

    expect(warnSpy).toBeCalledWith(
      "\x1b[33m%s",
      `The latest version of @homy/gito-core is 1.0.0 and you have 0.0.1. Update it now: npm i -g @homy/gito-core`,
    )
  })

  test("w/ customTips", async () => {
    const cwd = path.join(__dirname, "./fixtures/lowVersion")

    await checkUpdate({
      customTips(p) {
        expect(p).toMatchObject({
          latestVersion: "1.0.0",
          curVersion: "0.0.1",
          pkgName: "@homy/gito-core",
        })
      },
      cwd,
    })
    expect(warnSpy).not.toBeCalled()
  })

  test("w/ exactVersion", async () => {
    const cwd = path.join(__dirname, "./fixtures/exactVersion")
    const fn = vi.fn()
    await checkUpdate({
      customTips: fn,
      cwd,
    })
    expect(warnSpy).not.toBeCalled()
    expect(fn).not.toBeCalled()
  })

  test("get caller dirname", async () => {
    const getCWDPackageJsonSpy = vi.spyOn(exports, "getCWDPackageJson")

    await checkUpdate()
    expect(getCWDPackageJsonSpy).toBeCalledWith(__dirname)
  })
})
