const axios = require('axios');

module.exports.getPartnersRevenue =  async function getPartnersRevenue(client) {
    var payout = 0;
    console.log(client.status)
    if (!client.status) {
        return 0
    }
    const clientData = await axios.get(`http://localhost:8080/clients/email/${client.email}/`)
        .then( res => {
            if(res.data.length > 0 ) {
                return res.data;
            } else {
                return false;
            }
        });
    const dealDate = new Date(client.datePaid);

    if ( clientData ) {
        var last = dealDate
        clientData.forEach(deal => {
            if( new Date(deal.datePaid) < last ) {
                last = new Date(deal.datePaid); 
            }
        })
        if ( new Date(dealDate - last) > new Date(1971, 0, 1) ) {
            payout = 0;
        } else {
            payout = countPayout(client)
        }
    } else {
        payout = countPayout(client)
    }
         
    return payout;
}

function countPayout(client) {
    var payout = 0;
    // if (client.leadType.indexOf('elite') === -1) {
        switch (true) {
        case (client.revenue <= 1000):
            payout = client.revenue;
            break;
        case (client.revenue <= 50000):
            payout = 0.20 * client.revenue;
            break;    
        case (client.revenue >= 150000):
            payout = 0
            break;
        case (client.revenue >= 50001):
            payout = 0.15 * client.revenue;
            break;
        default:
            payout = 0
        }
    // } else {
    //     payout = 0
    // }
    return payout;
}