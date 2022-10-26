const router = require('express').Router();
const Settings = require('../models/settings.model');

router.route('/').get((req, res) => {
    Settings.find()
        .then(settings => res.json(settings))
        .catch(err => res.status(400).json('Error: ' + err));
});

// router.route('/add').post((req, res) => {
//     autopaySettings = 
//         {
//             login: req.body.login,
//             password: req.body.password,
//             downloadPath: req.body.downloadPath,
//             salesNames: req.body.salesNames,
//             leadTypes: req.body.leadTypes,
//             payoutSchema:  {
//                 elite: req.body.elite, 
//                 web: req.body.web,
//                 lead: req.body.lead,
//                 reg: req.body.reg,
//                 other: req.body.other,
//                 bot: req.body.bot,
//                 empty: req.body.empty,
//             } 
//         }
    
//     const newSettings = new Settings({
//             autopaySettings
//         })

//     newSettings.save()
//         .then(() => res.json('Settings added!'))
//         .catch(err => res.status(400).json('Error: ' + err));    
// });

router.route('/update/:id').post((req, res) => {
    Settings.findById(req.params.id)
    .then(settings => {
        settings.autopaySettings.login = req.body.login;
        settings.autopaySettings.password = req.body.password;
        settings.autopaySettings.downloadPath = req.body.downloadPath;
        settings.autopaySettings.salesNames = req.body.salesNames;
        settings.autopaySettings.leadTypes = req.body.leadTypes;

        settings.autopaySettings.payoutSchema.elite = req.body.elite;
        settings.autopaySettings.payoutSchema.web = req.body.web;
        settings.autopaySettings.payoutSchema.lead = req.body.lead;
        settings.autopaySettings.payoutSchema.reg = req.body.reg;
        settings.autopaySettings.payoutSchema.other = req.body.other;
        settings.autopaySettings.payoutSchema.bot = req.body.bot;
        settings.autopaySettings.payoutSchema.empty = req.body.empty;


        settings.save()
            .then(() => res.json('Settings updated'))
            .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;