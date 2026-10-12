const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    name: { type: String, required: true },
    family: { type: String, required: true },
    amount: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Donation', DonationSchema);
