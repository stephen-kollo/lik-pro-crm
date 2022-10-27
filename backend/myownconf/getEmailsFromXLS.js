module.exports.getEmailsFromXLS =  async function getEmailsFromXLS() {
    const settings = await axiosGetSettings();
    const downloadPath = settings.autopaySettings.downloadPath;
    const filePath = downloadPath + getFileName(downloadPath).file;
    const data = parseXLS(filePath)[0].data;
    var emails = [];
    data.forEach(visitor => {
        emails.push(visitor.Email)
    });
    console.log(emails)
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

async function axiosGetSettings() {
    const axios = require('axios');
    return axios.get(`http://localhost:8080/settings/`)
        .then( res => {
            return res.data[0]
        });
}
