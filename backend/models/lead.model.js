const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const leadSchema = new Schema({
    email: { type: String, required: true },
    source: { type: String, required: true },
    dateTouch: { type: Date, required: true },
    dateWeb: { type: Date, required: true },
    webName: { type: String, required: true },
}, {
    timestamps: true,
});

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;