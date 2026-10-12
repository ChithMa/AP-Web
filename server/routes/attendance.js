const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Get all attendance for a year
router.get('/', async (req, res) => {
    try {
        const { year } = req.query;
        let query = {};
        if (year && year !== 'all') {
            query.year = year;
        }
        const attendance = await Attendance.find(query).sort({ name: 1 });
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add attendance
router.post('/', async (req, res) => {
    const attendance = new Attendance({
        year: req.body.year,
        name: req.body.name,
        family: req.body.family,
        pax: req.body.pax,
        status: req.body.status
    });

    try {
        const newAttendance = await attendance.save();
        res.status(201).json(newAttendance);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update attendance
router.patch('/:id', async (req, res) => {
    try {
        const attendance = await Attendance.findById(req.params.id);
        if (req.body.status) attendance.status = req.body.status;
        if (req.body.pax) attendance.pax = req.body.pax;
        const updated = await attendance.save();
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
