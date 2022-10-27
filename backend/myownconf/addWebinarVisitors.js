const {Builder, Browser, By, Key, until} = require('selenium-webdriver');
require('chromedriver');
const axios = require('axios');
const getEmailsFromXLS = require('./getEmailsFromXLS');


async function buildDriver() {
    let driver = await new Builder().forBrowser("chrome").build();
    return driver;
};

getWebinarVisitors()

// async function getLastLine(driver, By) {
//     await driver.findElement(By.className('group select default')).click()
//     const pendingElements = await driver.findElements(By.className('line'))
//     const element = await pendingElements[0].getText()
//     console.log(element);
// }


async function getWebinarVisitors() {
    const driver = await buildDriver();
    const login = 'webinar@likpro.ru';
    const password = 'xcdffdfQ123wqQ!';

    const getLastLine = async (driver, By) => {
        var lastWeb = 0;
        await driver.findElement(By.className('group select default')).click()               
        const pendingElements = await driver.findElements(By.className('line')) 
        await pendingElements.forEach(el => {
            el.getAttribute("data-val")
                .then((value) => { 
                    if(Number(value) > lastWeb && value * 0 === 0) {
                        lastWeb = value;
                    }
                })
        })
        setTimeout(async function () { 
            const str = "//div[@data-val='" + lastWeb + "']";
            await driver.findElement(By.xpath(str)).click();
            await driver.findElement(By.xpath('/html/body/div[2]/div[3]/div[1]/div[2]/div[2]/div[1]')).click();
            await driver.findElement(By.className('export-att button border')).click();
            await driver.findElement(By.className('type select exp-type')).click();
            await driver.findElement(By.xpath("//div[@data-val='xlsx']")).click();
            await driver.findElement(By.className('get-export button big green')).click();
        }, 15000);
    };
    
    try {
        await driver.get('https://cp.mywebinar.com/');
        await driver.findElement(By.id('login')).sendKeys(login);
        await driver.findElement(By.id('pass')).sendKeys(password);
        await driver.findElement(By.id('sendbutton')).click();
        await driver.findElement(By.xpath("//div[@data-section='attendees']")).click();
        await setTimeout(async function () { 
            await getLastLine(driver, By)
        }, 4000);
    } finally {  
        await driver.quit;
        await setTimeout( async function () { getEmailsFromXLS.getEmailsFromXLS() }, 2000 )
    };
};