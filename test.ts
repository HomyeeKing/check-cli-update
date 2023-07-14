function getStackDir() {
  console.trace()
  const errorStack = new TypeError().stack!
  const errorStackArr = errorStack.split("\n")
  console.log("errorStack", errorStackArr)
  return errorStackArr.map((stack) => {
    const matchedStr = stack.match(/\/([^\/:]+\/)*[^\/:]+\.\w+/)
    if (matchedStr) {
      return matchedStr[0]
    }
    return null
  })
}

console.log(getStackDir())
