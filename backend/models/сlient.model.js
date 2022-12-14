const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const clientSchema = new Schema({
    autopayID: { type: Number, required: true },
    clientName: { type: String, required: true },
    email: { type: String, required: true },
    revenue: { type: Number, required: true },
    status: { type: Boolean, required: true},
    dateCreate: { type: Date, required: true },
    datePaid: { type: Date, required: true },
    product: { type: String, required: true },
    phone: { type: String, required: true },
    ip: { type: String, required: true },
    managerComment: { type: String, required: true },
    managerName: [],
    leadType: [],
    managerPayout: { type: Number, required: true },
    partner: { type: String, required: true },
    partnerPayout: { type: Number, required: true },
    source: { type: String, required: true },
    dateTouch: { type: Date, required: true },
    touchWebName: { type: String, required: true},
    dateWeb: { type: Date, required: true },
    webName: { type: String, required: true},
}, {
    timestamps: true,
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;