const mongoose = require('mongoose');

const SevaSchema = new mongoose.Schema({
    year: { type: Number, required: true },
    member: { type: String, required: true },
    task: { type: String, required: true },
    status: { type: String, default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Seva', SevaSchema);
