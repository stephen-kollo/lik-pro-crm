const router = require('express').Router();
const WebUTM = require('../models/webUTM.model');

router.route('/').get((req, res) => {
    WebUTM.find()
        .then(webUTMs => res.json(webUTMs))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/email/:email/').get((req, res) => {
    WebUTM.find({email: req.params.email})
    .then(clients => res.json(clients))
        .catch(err => res.status(400).json('Error: ' + err));
});

// router.route('/add').post((req, res) => {
//     const email = req.body.email;
//     const source = req.body.source;
//     const dateTouch = Date.parse(req.body.dateTouch);
//     const webName = req.body.webName;

//     const newWebUTM = new WebUTM({
//         email,
//         source,
//         dateTouch,
//         webName,
//     });

//     newWebUTM.save()
//         .then(() => res.json('WebUTM added!'))
//         .catch(err => res.status(400).json('Error: ' + err));
// });

router.route('/:id').get((req, res) => {
    WebUTM.findById(req.params.id)
        .then(webUTM => res.json(webUTM))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    WebUTM.findByIdAndDelete(req.params.id)
        .then(webUTM => res.json('WebUTM deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    WebUTM.findById(req.params.id)
    .then(webUTM => {
        webUTM.email = req.body.email;
        webUTM.source = req.body.source;
        webUTM.dateTouch = req.body.dateTouch;
        webUTM.webName = req.body.webName;

        webUTM.save()
            .then(() => res.json('WebUTM updated'))
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

router.route('/webdate/:webdate/:email').get((req, res) => {
    // TODO
    // webdate >= dateTouch
    WebUTM.find({ webID: req.params.webid, email: req.params.email})
    .then(leads => res.json(leads))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;