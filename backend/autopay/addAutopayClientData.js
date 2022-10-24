const {Builder, Browser, By, Key, until} = require('selenium-webdriver');
require('chromedriver');

module.exports.addAutopayClientData = async function addAutopayClientData() {
    const driver = await buildDriver()
    await getWeeklyDataAutopay(driver, By);
    await setTimeout(function () { addAutopayXLStoDB() }, 1000);
  };

async function buildDriver() {
    let driver = await new Builder().forBrowser("chrome").build();
    return driver;
};
async function getWeeklyDataAutopay(driver, By) {
    const autopayLogin = 'selenium';
    const autopayPassword = 'selenium1924';
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

function addAutopayXLStoDB() {
    const filePath = '../../../../../../../Users/stepan/Downloads/' + getFileName('../../../../../../../Users/stepan/Downloads/').file;
    const xlsFile = parseXLS(filePath);
    const clients = convertAutopayXLStoDBformat(xlsFile[0].data);
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

function convertAutopayXLStoDBformat(xlsFile) {
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
    
    var clientsData = [];

    rawClientsData.forEach(clientData => {
        const setStatus = (status) => {
            if(status == "Нет") {
                return false;
            } else return true;
        }

        const setDate = (date) => {
            return date.substring(6,10)+"-"+date.substring(3,5)+"-"+date.substring(0,2)
        }

        const setManagerComment = (comment) => {
            if(comment === undefined) {
                return "none" 
            } else return comment
        }
        const setPhoneNum = (phone) => {
            if(phone === undefined) {
                return "none" 
            } else return phone
        }

        const temp = new Map()
            .set('autopayID', clientData.get(clientMap.get('autopayID')))
            .set('clientName', clientData.get(clientMap.get('clientName')))
            .set('email', clientData.get(clientMap.get('email')))
            .set('revenue', clientData.get(clientMap.get('revenue')).toString()
                .substring(0, clientData.get(clientMap.get('revenue')).toString().length - 3))
            .set('status', setStatus(clientData.get(clientMap.get('status'))))
            .set('dateCreate', setDate(clientData.get(clientMap.get('dateCreate'))))
            .set('datePaid', setDate(clientData.get(clientMap.get('datePaid'))))
            .set('product', clientData.get(clientMap.get('product')))
            .set('phone', setPhoneNum(clientData.get(clientMap.get('phone'))))
            .set('ip', clientData.get(clientMap.get('ip')))
            .set('managerComment', setManagerComment(clientData.get(clientMap.get('managerComment'))))
            .set('managerName', 'none')
            .set('leadType', 'lead')
            .set('managerPayout', 0)

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
    };

    findClientByAutopayID(clientsData, client)
};

function findClientByAutopayID(clientsData, client) {
    const axios = require('axios');
    var id = '';
    axios.get(`http://localhost:8080/clients/autopay/${clientsData.get('autopayID')}/`)
        .then(res => { if(res.data.length > 0) id = res.data[0]._id })
        .then(res =>{
            if(id.length > 0) {
                axios.post('http://localhost:8080/clients/update/'+id, client)
                    .then( res => console.log("ID: " + id + " with autopayID: " + client.autopayID + " was edited"));
            } else {
                axios.post('http://localhost:8080/clients/add/', client)
                    .then( res => console.log("new client with autopayID: " + client.autopayID + " was created"));
            }
        });
};

  