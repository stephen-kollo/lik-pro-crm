module.exports.connectAPI = async function connectAPI(path) {
  const fs = require('fs');
  const { GoogleSpreadsheet } = require('google-spreadsheet');

  const doc = new GoogleSpreadsheet('1issYomri6NsJzqmigVvJ2lBRpiCsROi-eSiZpGD7lmI');

  const CREDENTIALS = JSON.parse(fs.readFileSync(path));

  await doc.useServiceAccountAuth({
  client_email: CREDENTIALS.client_email,
  private_key: CREDENTIALS.private_key,
  })

  await doc.loadInfo(); 
  console.log(doc.title);

  const sheet = doc.sheetsByIndex[0]; 
  console.log(sheet.title);
  console.log(sheet.rowCount);
}
