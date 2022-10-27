const router = require('express').Router();
const Lead = require('../models/lead.model');

router.route('/').get((req, res) => {
    Lead.find()
        .then(leads => res.json(leads))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    
    const email = req.body.email;
    const source = req.body.source;
    const dateTouch = Date.parse(req.body.dateTouch);
    const dateWeb = Date.parse(req.body.dateWeb);
    const webName = req.body.webName;
    

    const newLead = new Lead({
        email,
        source,
        dateTouch,
        dateWeb,
        webName,
    });

    newLead.save()
        .then(() => res.json('Lead added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Lead.findById(req.params.id)
        .then(lead => res.json(lead))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Lead.findByIdAndDelete(req.params.id)
        .then(lead => res.json('Lead deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    Lead.findById(req.params.id)
    .then(lead => {
        lead.email = req.body.email;
        lead.source = req.body.source;
        lead.dateTouch = req.body.dateTouch;
        lead.dateWeb = req.body.dateWeb;
        lead.webName = req.body.webName;

        lead.save()
            .then(() => res.json('Lead updated'))
            .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// router.route('/paste_weekly_report').post((req, res) => {
//     const googlesheetsAPI = require('../google_sheets/pasteWeeklyReport');
//     googlesheetsAPI.pasteWeeklyReport(req.body.link, req.body.datestart, req.body.dateend)
//     .then((status) => { res.json(status) });
// });

// router.route('/datepaid/:start/:end').get((req, res) => {
//     Client.find({datePaid:{$gte: new Date(req.params.start), $lt: new Date(req.params.end)}})
//     .then(clients => res.json(clients))
//         .catch(err => res.status(400).json('Error: ' + err));
// });

// router.route('/autopayid/:autopayid').get((req, res) => {
//     Client.find({ autopayID: req.params.autopayid, })
//     .then(clients => res.json(clients))
//         .catch(err => res.status(400).json('Error: ' + err));
// });

module.exports = router;