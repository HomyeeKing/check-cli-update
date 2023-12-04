import { getLatestVersion } from "@/npm"
import { checkUpdate, getCWDPackageJson } from "../src"
import path from "path"

test("getCWDPackageJson", async () => {
  const cwd = path.join(__dirname, "./fixtures/lowVersion")
  expect((await getCWDPackageJson(cwd)) as string).toMatchObject({
    name: "tj",
    version: "2.0.0",
  })
})

test("getLatestVersion", async () => {
  expect(await getLatestVersion("tj")).toBe("2.1.0")
  expect(await getLatestVersion("ajsdkljaskld")).toBe("0.0.0")
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
      `The latest version of tj is 2.1.0 and you have 2.0.0. Update it now: npm i -g tj`,
    )
  })

  test("w/ customTips", async () => {
    const cwd = path.join(__dirname, "./fixtures/lowVersion")

    await checkUpdate({
      customTips(p) {
        expect(p).toMatchObject({
          latestVersion: "2.1.0",
          curVersion: "2.0.0",
          pkgName: "tj",
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
})
