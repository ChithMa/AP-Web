const express = require('express');
const router = express.Router();
const Seva = require('../models/Seva');

// Get all seva for a year
router.get('/', async (req, res) => {
    try {
        const { year } = req.query;
        let query = {};
        if (year && year !== 'all') {
            query.year = year;
        }
        const seva = await Seva.find(query);
        res.json(seva);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add seva
router.post('/', async (req, res) => {
    const seva = new Seva({
        year: req.body.year,
        member: req.body.member,
        task: req.body.task,
        status: req.body.status
    });

    try {
        const newSeva = await seva.save();
        res.status(201).json(newSeva);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
