const {Builder, Browser, By, Key, until} = require('selenium-webdriver');
require('chromedriver');
const axios = require('axios');
const getEmailsFromXLS = require('./getEmailsFromXLS');
const monthMap = new Map()
    .set(0, 'янв')
    .set(1, 'фев')
    .set(2, 'мар')
    .set(3, 'апр')
    .set(4, 'мая')
    .set(5, 'июн')
    .set(6, 'июл')
    .set(7, 'авг')
    .set(8, 'сен')
    .set(9, 'окт')
    .set(10, 'ноя')
    .set(11, 'дек')

async function buildDriver() {
    let driver = await new Builder().forBrowser("chrome").build();
    return driver;
};

getWebinarVisitors()
// console.log(getDateFromWebName('7 октября 22г 20:00'))


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
    var lastWebID = 0;
    var dateWeb = '';

    try {
        await driver.get('https://cp.mywebinar.com/');
        await driver.findElement(By.id('login')).sendKeys(login);
        await driver.findElement(By.id('pass')).sendKeys(password);
        await driver.findElement(By.id('sendbutton')).click();
        await driver.findElement(By.xpath("//div[@data-section='attendees']")).click();
        await setTimeout(async function () { 
            return await getLastLine(driver, By)
        }, 4000);
    } finally {  
        await driver.quit;
    };

    const getLastLine = async (driver, By) => {
        await driver.findElement(By.className('group select default')).click()               
        const pendingElements = await driver.findElements(By.className('line')) 
        await pendingElements.forEach(el => {
            el.getAttribute("data-val")
                .then((value) => { 
                    if(Number(value) > lastWebID && value * 0 === 0) {
                        lastWebID = value;
                    }
                })
        })
        setTimeout(async function () { 
            const str = "//div[@data-val='" + lastWebID + "']";
            const name = await driver.findElement(By.xpath(str + "//span")).getText()
            dateWeb = await getDateFromWebName(name);
            console.log('Currend web date...')
            console.log(dateWeb)
            await driver.findElement(By.xpath(str)).click();
            await driver.findElement(By.xpath('/html/body/div[2]/div[3]/div[1]/div[2]/div[2]/div[1]')).click();
            await driver.findElement(By.className('export-att button border')).click();
            await driver.findElement(By.className('type select exp-type')).click();
            await driver.findElement(By.xpath("//div[@data-val='xlsx']")).click();
            await driver.findElement(By.className('get-export button big green')).click();
        }, 15000);

        setTimeout(async function () { 
            const emails = await getEmailsFromXLS.getEmailsFromXLS()
            await addLeadsToDB(emails, dateWeb, lastWebID)
        }, 30000);
    };
};

function getDateFromWebName(name) {
    const setYear = function(str) {
        return Number('20'+str.substr(0,2))
    }
    const setMonth = function(str) {
        for(var i = 0; i < 12; i++) {
            if( str.indexOf(monthMap.get(i)) !== -1 ) return i
        }
    }
    const setDay = function(str) {
        if (str.length == 1) {
            str = '0' + str
        }
        return str
    }
    const setTime = function(str) {
        return str.substr(0,2)
    }

    const temp = name.split(" ");
    return new Date(Date.UTC(setYear(temp[2]),setMonth(temp[1]),setDay(temp[0]),setTime(temp[3])))
}

async function addLeadsToDB(emails, dateWeb, lastWebID) {
    const date = new Date()
    await emails.forEach( leadEmail => {
        const lead = {
            email: leadEmail,
            source: 'none',
            dateTouch: date,
            dateWeb: dateWeb,
            webName: 'none',
        }
        axios.post('http://localhost:8080/leads/add/', lead)
            .then( res => console.log(leadEmail + " was added"));
    })
}