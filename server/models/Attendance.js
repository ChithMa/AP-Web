const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    year: { type: Number, required: true },
    name: { type: String, required: true },
    family: { type: String, required: true },
    pax: { type: Number, required: true },
    status: { type: String, default: 'Coming' },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
