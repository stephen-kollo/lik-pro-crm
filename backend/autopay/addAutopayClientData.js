const {Builder, Browser, By, Key, until} = require('selenium-webdriver');
require('chromedriver');
const axios = require('axios');

module.exports.addAutopayClientData = async function addAutopayClientData() {
    const settings = await axiosGetSettings();
    // const driver = await buildDriver()
    // await getDailyDataAutopay(driver, By, settings);
    await setTimeout(function () { addAutopayXLStoDB(settings) }, 1000);
};

async function axiosGetSettings() {
    return axios.get(`http://localhost:8080/settings/`)
        .then( res => {
            return res.data[0]
        });
}

async function buildDriver() {
    let driver = await new Builder().forBrowser("chrome").build();
    return driver;
};

async function getDailyDataAutopay(driver, By, settings) {
    const autopayLogin = settings.autopaySettings.login;
    const autopayPassword = settings.autopaySettings.password;
    try {
        await driver.get('https://shkolalik878.e-autopay.com/adminka/login/co-worker');
        await driver.findElement(By.id('inputEmail')).sendKeys(autopayLogin);
        await driver.findElement(By.id('inputPassword')).sendKeys(autopayPassword);
        await driver.findElement(By.className('btn btn-success btn-block btn-lg btn-signin')).click();
        await driver.get('https://shkolalik878.e-autopay.com/adminka/orders.php');
        await driver.findElement(By.xpath('/html/body/div[14]/div[8]/div[1]/div/center/div/div[2]/table/tbody/tr/td/form[1]/table/tbody/tr[5]/td[2]/div[2]/label[3]')).click();
        await driver.findElement(By.id('Submit')).click();
        await driver.get('https://shkolalik878.e-autopay.com/adminka/export_to_xls.php?filter=current');
    } finally {  
        await driver.quit;
    };
};

function addAutopayXLStoDB(settings) {
    const downloadPath = settings.autopaySettings.downloadPath;
    const filePath = downloadPath + getFileName(downloadPath).file;
    const xlsFile = parseXLS(filePath);
    const clients = convertAutopayXLStoDBformat(xlsFile[0].data, settings);
    clients.forEach(client => {
        addClientsToDB(client);
    });
};

function getFileName(filePath) {
    const fs = require('fs');
    const path = require('path');
  
    const getMostRecentFile = (dir) => {
      const files = orderReccentFiles(dir);
      return files.length ? files[0] : undefined;
    };
  
    const orderReccentFiles = (dir) => {
      return fs.readdirSync(dir)
        .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
        .map((file) => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    };
    return getMostRecentFile(filePath);
  }

function parseXLS(path) {
    const XLSX = require('xlsx');
    const parse = (filename) => {
        const excelData = XLSX.readFile(filename);

        return Object.keys(excelData.Sheets).map((name) => ({
        name,
        data: XLSX.utils.sheet_to_json(excelData.Sheets[name]),
        }));
    };
    return parse(path)
};

function convertAutopayXLStoDBformat(xlsFile, settings) {
    var rawClientsData = [];
    xlsFile.forEach(clientData => {
        rawClientsData.push( new Map(Object.entries(clientData)) );
    });

    const clientMap = new Map()
        .set('autopayID', 'ID')
        .set('clientName', 'ФИО')
        .set('email', 'E-mail')
        .set('revenue', 'Сумма оплаты')
        .set('status', 'Оплачен')
        .set('dateCreate', 'Дата создания заказа')
        .set('datePaid', 'Дата оплаты (заказа)')
        .set('product', 'Заказанный(ые) товар(ы)')
        .set('phone', 'Телефон')
        .set('ip', 'IP')
        .set('managerComment', 'Служебные комментарии')
        .set('partner', 'Партнер')
    
    var clientsData = [];

    rawClientsData.forEach(clientData => {

        const setRevenue = (revenue) => {
            return Number(revenue.toString()
                .substring(0, clientData.get(clientMap.get('revenue'))
                .toString().length - 3))
        }

        const setStatus = (status) => {
            if(status == "Нет") {
                return false;
            } else return true;
        }

        const setDate = (date) => {
            return date.substring(6,10)+"-"+date.substring(3,5)+"-"+date.substring(0,2)
        }

        const setPhoneNum = (phone) => {
            if(phone === undefined) {
                return "none" 
            } else return phone
        }

        const setManagerComment = (comment) => {
            if(comment === undefined) {
                return "none" 
            } else return comment
        }

        const setPartner = (partner) => {
            if(partner === undefined) {
                return "none" 
            } else return partner
        }

        const setManagerName = (managerComment, settings)  => {
            var managerName = []
            settings.autopaySettings.salesNames.forEach(name => {
                if ( managerComment.toLowerCase().indexOf(name) > 0 ) {
                    managerName.push(name)
                }
            })
            return managerName;
        }

        const setLeadType = (managerComment, revenue, settings) => {
            var leadType = [];
            settings.autopaySettings.leadTypes.forEach(type => {
                if ( managerComment.toLowerCase().indexOf(type) > 0 ) {
                    leadType.push(type)
                }
            })
            if(revenue > 100000) {
                if (leadType.indexOf("elite") == -1) {
                    leadType.push("elite")
                }
            }
            return leadType;
        }

        const setManagerPayout = (revenue, status, managerName, leadType, settings) => {
            var payout = 0;
            if (status && managerName.length !== 0) {
                if( leadType.indexOf("elite") !== -1 ) {
                    payout = revenue * settings.autopaySettings.payoutSchema.elite / managerName.length;
                } else if ( leadType.indexOf("web") !== -1 ) {
                    payout = revenue * settings.autopaySettings.payoutSchema.web / managerName.length;
                } else if ( leadType.indexOf("lead") !== -1 ) {
                    payout = revenue * settings.autopaySettings.payoutSchema.lead / managerName.length;
                } else if ( leadType.indexOf("reg") !== -1 ) {
                    payout = revenue * settings.autopaySettings.payoutSchema.reg / managerName.length;
                } else if ( leadType.indexOf("other") !== -1 ) {
                    payout = revenue * settings.autopaySettings.payoutSchema.other / managerName.length;
                } else if ( leadType.indexOf("bot") !== -1 ) {
                    payout = revenue * settings.autopaySettings.payoutSchema.bot / managerName.length;
                } else {
                    payout = settings.autopaySettings.payoutSchema.empty;
                } 
            }
            return payout;
        }

        const revenue = setRevenue(clientData.get(clientMap.get('revenue')));
        const status = setStatus(clientData.get(clientMap.get('status')));
        const dateCreate = setDate(clientData.get(clientMap.get('dateCreate')));
        const datePaid = setDate(clientData.get(clientMap.get('datePaid')));
        const phone = setPhoneNum(clientData.get(clientMap.get('phone')));
        const managerComment = setManagerComment(clientData.get(clientMap.get('managerComment')));
        const managerName = setManagerName(managerComment, settings); 
        const leadType = setLeadType(managerComment, revenue, settings);
        const managerPayout = setManagerPayout(revenue, status, managerName, leadType, settings);
        const partner = setPartner(clientData.get(clientMap.get('partner')));
        const partnerPayout = 0;
        const source = 'source';
        const dateTouch = new Date();
        const dateWeb = new Date();

        const temp = new Map()
            .set('autopayID', clientData.get(clientMap.get('autopayID')))
            .set('clientName', clientData.get(clientMap.get('clientName')))
            .set('email', clientData.get(clientMap.get('email')))
            .set('revenue', revenue)
            .set('status', status)
            .set('dateCreate', dateCreate)
            .set('datePaid', datePaid)
            .set('product', clientData.get(clientMap.get('product')))
            .set('phone', phone)
            .set('ip', clientData.get(clientMap.get('ip')))
            .set('managerComment', managerComment)
            .set('managerName', managerName)
            .set('leadType', leadType)
            .set('managerPayout', managerPayout)
            .set('partner', partner)
            .set('partnerPayout', partnerPayout)
            .set('source', source)
            .set('dateTouch', dateTouch)
            .set('dateWeb', dateWeb)

            temp.managerName = []
        clientsData.push(temp);    
    });

    return clientsData;
};


async function addClientsToDB(clientsData) {
    const client = {
        autopayID: clientsData.get('autopayID'),
        clientName: clientsData.get('clientName'),
        email: clientsData.get('email'),
        revenue: clientsData.get('revenue'),
        status: clientsData.get('status'),
        dateCreate: (clientsData.get('dateCreate')),
        datePaid: (clientsData.get('datePaid').substring(0,10)),
        product: clientsData.get('product'),
        phone: clientsData.get('phone'),
        ip: clientsData.get('ip'),
        managerComment: clientsData.get('managerComment'),
        managerName: clientsData.get('managerName'),
        leadType: clientsData.get('leadType'),
        managerPayout: clientsData.get('managerPayout'),
        partner: clientsData.get('partner'),
        partnerPayout: clientsData.get('partnerPayout'),
        source: clientsData.get('source'),
        dateTouch: clientsData.get('dateTouch'),
        dateWeb: clientsData.get('dateWeb'),
    };

    checkNewClientByAutopayID(clientsData, client)
};
function checkNewClientByAutopayID(clientsData, client) {
    var id = '';
    axios.get(`http://localhost:8080/clients/autopayid/${clientsData.get('autopayID')}/`)
        .then(res => { if(res.data.length > 0) id = res.data[0]._id })
        .then( res => {
            if(id.length > 0) {
                axios.post('http://localhost:8080/clients/update/'+id, client)
                    .then( res => console.log("ID: " + id + " with autopayID: " + client.autopayID + " was edited"));
            } else {
                axios.post('http://localhost:8080/clients/add/', client)
                    .then( res => console.log("new client with autopayID: " + client.autopayID + " was created"));
            }
        });
};
  
