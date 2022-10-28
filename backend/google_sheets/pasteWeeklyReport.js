// node-google-spreadsheet
// https://theoephraim.github.io/node-google-spreadsheet/#/classes/google-spreadsheet-cell
const axios = require('axios');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const CREDENTIALS = require('./creds');

module.exports.pasteWeeklyReport = async function pasteWeeklyReport(docID, datestart, dateend) {
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

  const clients = await getClientsFromDBbyDate(datestart, dateend)
  const sheet = doc.sheetsByIndex[0]; 
  setDataToGS(clients, sheet);
  return true;
}

async function getClientsFromDBbyDate(datestart, dateend) {
  return axios.get(`http://localhost:8080/clients/datepaid/${datestart}/${dateend}/`)
    .then(clients => { return clients.data })
};

async function setDataToGS(clients, sheet) {
  await sheet.loadCells( `A1:Z${clients.length + 1}` );

  const arrayToString = (array)  => {
    var string = '';
    array.forEach(item => {
        string = string + item + ' / ';
    })
    if ( string.length > 1 ) return string.substring(0, string.length-3)
    return string;
  };

  const columnSchema = [
    "Autopay ID",
    "Client Name",
    "E-mail",
    "Revenue",
    "Status",
    "Date Create",
    "Date Paid",
    "Product",
    "Phone",
    "IP",
    "Manager Comment",
    "Manager Name",
    "Lead Type",
    "Manager Payout",
    "Partner",
    "Partner Payout",
    "Source",
    "Date Touch",
    "Touch Web Name",
    "Date Last Web",
    "Last Web Name"
  ];

  for ( var i = 0; i < columnSchema.length; i++ ) {
    var cell = sheet.getCell(0, i);
    cell.value = columnSchema[i];
  };
  

  for ( var i = 0; i < clients.length; i++ ) {
    for ( var j = 0; j < columnSchema.length; j++ ) {
      var cell = sheet.getCell(i + 1, j);
      
        switch (j) {
          case 0: 
            cell.value = clients[i].autopayID;
            break;
          case 1:
            cell.value = clients[i].clientName;
            break; 
          case 2:
            cell.value = clients[i].email;
            break;
          case 3: 
            cell.value = clients[i].revenue;
            break;
          case 4:
            cell.value = clients[i].status;
            break; 
          case 5:
            cell.value = clients[i].dateCreate;
            break;
          case 6: 
            cell.value = clients[i].datePaid;
            break;
          case 7:
            cell.value = clients[i].product;
            break; 
          case 8:
            cell.value = clients[i].phone;
            break;
          case 9: 
            cell.value = clients[i].ip;
            break;
          case 10:
            cell.value = clients[i].managerComment;
            break; 
          case 11:
            cell.value = arrayToString(clients[i].managerName)
            break;
          case 12:
            cell.value = arrayToString(clients[i].leadType)
            break; 
          case 13:
            cell.value = clients[i].managerPayout;
            break;
          case 14:
            cell.value = clients[i].partner;
            break;
          case 15:
            cell.value = clients[i].partnerPayout;
            break;
          case 16:
            cell.value = clients[i].source;
            break;
          case 17:
            cell.value = clients[i].dateTouch;
            break;
          case 18:
            cell.value = clients[i].touchWebName;
            break;
          case 19:
              cell.value = clients[i].dateWeb;
              break;
          case 20:
            cell.value = clients[i].webName;
            break;
          default:
            console.log('default');
        };
    };
  };

  await sheet.saveUpdatedCells();
}