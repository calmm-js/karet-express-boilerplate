import main from "../src/server/main"

const Browser = require("zombie")
const browser = new Browser()
const baseUrl = "http://localhost:3100/"

main(3100)

console.log("Testing against ", baseUrl + "\n")

describe("Main page",() => {
  before(() => browser.visit(baseUrl))

  it("loads main page", () => {
    browser.assert.text("title", "KEEP CALMM and CURRY ON")
  })
})
