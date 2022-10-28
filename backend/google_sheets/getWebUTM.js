const axios = require('axios');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const CREDENTIALS = require('./creds');
const docID = '1Nng-z-2mBSAGLAyUhwHc0VoeHwaW3nrKj6tzi5qwsGE'
const num = 145;
pasteWeeklyReport(docID)

async function pasteWeeklyReport(docID) {
    try {
      doc = new GoogleSpreadsheet(docID);
    } catch (e) {
      console.log(e)
    }
    if (doc.spreadsheetId.length < 10) {
      return false;
    }
    
    await doc.useServiceAccountAuth({
    client_email: CREDENTIALS.client_email,
    private_key: CREDENTIALS.private_key,
    })
    await doc.loadInfo(); 
    
    for(var i = num; i < num + 1; i++) {
      const webUTMdata = await getData(doc, i);
      console.log(i + ': ' + webUTMdata.length + '...');
      await console.log(webUTMdata[0].dateTouch)
      await webUTMdata.forEach(single => {
        axios.post('http://localhost:8080/webutms/add/', single)
      })
    }
  }

async function getData(doc, num) {
  const sheet = doc.sheetsByIndex[num]; 
  var userData = []
    const date = titleToDate(sheet.title);
    await sheet.loadCells('A1:Z1500');
    var counter = 0;
    var webName = sheet.getCell(counter, 0).value;
    while (webName !== null) {
      
      const data = {
        webName: sheet.getCell(counter, 0).value,
        email: sheet.getCell(counter, 3).value.toString().toLowerCase(),
        dateTouch: date,
        source: sheet.getCell(counter, 6).value,
      }
      // console.log(data.dateTouch)
      userData.push(data)
      counter++;
      webName = sheet.getCell(counter, 0).value;
    }
    return userData
}

function titleToDate(title) {
    var day = '';
    var month = '';
    var year = '2022';

    if(title.substring(0,1) === '0') {
      day = title.substring(1,2)
    } else {
      day = title.substring(0,2)
    }
    if(title.substring(3,4) === '0') {
      month = Number(title.substring(4,5)) - 1
    } else {
      month = Number(title.substring(3,5)) - 1
    }

    return new Date(year, month, day);
};