const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const settigsSchema = new Schema({
    autopaySettings: { 
        login: { type: String, required: true }, 
        password: { type: String, required: true},
        downloadPath: { type: String, required: true },
        salesNames: [],
        leadTypes: [],
        payoutSchema:  {
            elite: { type: Number, required: true }, 
            web: { type: Number, required: true },
            lead: { type: Number, required: true },
            reg: { type: Number, required: true },
            other: { type: Number, required: true },
            bot: { type: Number, required: true },
            empty: { type: Number, required: true },
        } 
    }
}, {
    timestamps: true,
});

const Settings = mongoose.model('Settings', settigsSchema);

module.exports = Settings;