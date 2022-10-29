const test = require('./addAutopayClientData');
const partners = require('./countPartnersRevenue');
test.addAutopayClientData()
// partnerTest()
async function partnerTest() {
    const axios = require('axios')
    const payout = await axios.get(`http://localhost:8080/clients/635c6032cbd40efeda1f998d/`)
        .then( res => {
            console.log(res.data)
            return partners.getPartnersRevenue(res.data);
        });
    
    console.log(payout)
}
