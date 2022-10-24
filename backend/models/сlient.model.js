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
    managerName: { type: String, required: true },
    leadType: { type: String, required: true },
    managerPayout: { type: Number, required: true },
}, {
    timestamps: true,
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;