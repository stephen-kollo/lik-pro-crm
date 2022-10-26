const router = require('express').Router();
const Client = require('../models/сlient.model');

router.route('/').get((req, res) => {
    Client.find()
        .then(clients => res.json(clients))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const autopayID = Number(req.body.autopayID);
    const clientName = req.body.clientName;
    const email = req.body.email;
    const revenue = Number(req.body.revenue);
    const status = req.body.status;
    const dateCreate = Date.parse(req.body.dateCreate);
    const datePaid = Date.parse(req.body.datePaid);
    const product = req.body.product;
    const phone = req.body.phone;
    const ip = req.body.ip;
    const managerComment = req.body.managerComment;
    const managerName = req.body.managerName;
    const leadType = req.body.leadType;
    const managerPayout = Number(req.body.managerPayout);
    const partner = req.body.partner;
    const partnerPayout = req.body.partnerPayout;
    const source = req.body.source;
    const dateTouch = Date.parse(req.body.dateTouch);
    const dateWeb = Date.parse(req.body.dateWeb);

    const newClient = new Client({
        autopayID,
        clientName,
        email,
        revenue,
        status,
        dateCreate,
        datePaid,
        product,
        phone,
        ip,
        managerComment,
        managerName,
        leadType,
        managerPayout,
        partner,
        partnerPayout,
        source,
        dateTouch,
        dateWeb,
    });

    newClient.save()
        .then(() => res.json('Client added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req, res) => {
    Client.findById(req.params.id)
        .then(client => res.json(client))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Client.findByIdAndDelete(req.params.id)
        .then(client => res.json('Client deleted'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    Client.findById(req.params.id)
    .then(client => {
        client.autopayID = req.body.autopayID;
        client.clientName = req.body.clientName;
        client.email = req.body.email;
        client.revenue = req.body.revenue;
        client.status = req.body.status;
        client.dateCreate = req.body.dateCreate;
        client.datePaid = req.body.datePaid;
        client.product = req.body.product;
        client.phone = req.body.phone;
        client.ip = req.body.ip;
        client.managerComment = req.body.managerComment;
        client.managerName = req.body.managerName;
        client.leadType = req.body.leadType;
        client.managerPayout = req.body.managerPayout;
        client.partner = req.body.partner;
        client.partnerPayout = req.body.partnerPayout;
        client.source = req.body.source;
        client.dateTouch = req.body.dateTouch;
        client.dateWeb = req.body.dateWeb;

        client.save()
            .then(() => res.json('Client updated'))
            .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/paste_weekly_report').post((req, res) => {
    const googlesheetsAPI = require('../google_sheets/pasteWeeklyReport');
    googlesheetsAPI.pasteWeeklyReport(req.body.link, req.body.datestart, req.body.dateend)
    .then((status) => { res.json(status) });
});

router.route('/datepaid/:start/:end').get((req, res) => {
    Client.find({datePaid:{$gte: new Date(req.params.start), $lt: new Date(req.params.end)}})
    .then(clients => res.json(clients))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/autopayid/:autopayid').get((req, res) => {
    Client.find({ autopayID: req.params.autopayid, })
    .then(clients => res.json(clients))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;