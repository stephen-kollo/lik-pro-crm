const {Builder, Browser, By, Key, until} = require('selenium-webdriver');
require('chromedriver');
const autopay = require('../autopay/addAutopayClientData')

console.log(autopay.addAutopayClientData())

// async function main() {
//   let driver = await buildDriver()
//   await autopay.getWeeklyDataAutopay(driver, By);
//   await setTimeout(function () { autopay.addAutopayXLStoDB() }, 1000);
// };