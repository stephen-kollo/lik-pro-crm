// getSource('ira.deryabina.89@inbox.ru', new Date('2022-10-25T00:00:00.000Z'))
//     .then(res => { console.log(res) })
// console.log(new Date('2022-10-25T00:00:00.000Z'))
module.exports.getSource =  async function getSource(leadEmail, autopayDate) {
    const axios = require('axios')
    var lead = {};
    const data = await axios.get(`http://localhost:8080/webutms/email/${leadEmail}/`)
        .then( res => {
            if(res.data.length > 0 ) {
                return res.data;
            } else {
                return false;
            }
        });

    if (!data) {
        lead = {
            email: leadEmail,
            source: 'none',
            dateTouch: autopayDate,
            touchWebName: 'none',
        }
        return lead;
    }    
    
    var counter = data.length - 1;
    while(new Date(data[counter].dateTouch) > autopayDate) {
        if (counter === 0) {
            lead = {
                email: leadEmail,
                source: 'none',
                dateTouch: autopayDate,
                touchWebName: 'none',
            }
            return lead;
        }
        counter = counter - 1;
    }
    
    lead = {
        email: leadEmail,
        source: data[counter].source,
        dateTouch: new Date(data[counter].dateTouch),
        touchWebName: data[counter].webName,
    }
    return lead
    // axios.get(`http://localhost:8080/leads/webid/${lastWebID}/${leadEmail}`)
    //     .then( res => {
    //         if(res.data.length > 0 ) {
    //             console.log("Client "+ leadEmail + " with webID: " + lastWebID + " has been already uploaded");
    //         } else {
    //             axios.post('http://localhost:8080/leads/add/', lead)
    //             .then( res => {
    //                 console.log(leadEmail + " was added")
    //                 console.log(lead)
    //             });
    //         }
    //     });
}