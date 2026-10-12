const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const Attendance = require('../models/Attendance');

// Get all donations for a year
router.get('/', async (req, res) => {
    try {
        const { year } = req.query;
        let query = {};
        if (year && year !== 'all') {
            const start = new Date(`${year}-01-01`);
            const end = new Date(`${year}-12-31T23:59:59`);
            query.date = { $gte: start, $lte: end };
        }
        const donations = await Donation.find(query).sort({ date: -1 });
        res.json(donations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a donation
router.post('/', async (req, res) => {
    const donation = new Donation({
        date: req.body.date,
        name: req.body.name,
        family: req.body.family,
        amount: req.body.amount
    });

    try {
        const newDonation = await donation.save();

        // Auto-add to attendance if not already present
        const year = new Date(req.body.date).getFullYear();
        const existingAttendance = await Attendance.findOne({
            year: year,
            name: { $regex: new RegExp(`^${req.body.name}$`, 'i') }
        });

        if (!existingAttendance) {
            const attendance = new Attendance({
                year: year,
                name: req.body.name,
                family: req.body.family,
                pax: 1,
                status: 'Coming'
            });
            await attendance.save();
        }

        res.status(201).json(newDonation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
