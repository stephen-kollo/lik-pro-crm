const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const webUTMSchema = new Schema({
    email: { type: String, required: true },
    source: { type: String, required: true },
    dateTouch: { type: Date, required: true },
    webName: { type: String, required: true },
}, {
    timestamps: true,
});

const WebUTM = mongoose.model('WebUTM', webUTMSchema);

module.exports = WebUTM;