const express = require('express');
const router = express.Router();
const Year = require('../models/Year');

// Get all years
router.get('/', async (req, res) => {
    try {
        const years = await Year.find().sort({ year: -1 });
        res.json(years.map(y => y.year));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a year
router.post('/', async (req, res) => {
    const year = new Year({
        year: req.body.year
    });

    try {
        const newYear = await year.save();
        res.status(201).json(newYear);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
