const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Get all expenses for a year
router.get('/', async (req, res) => {
    try {
        const { year } = req.query;
        let query = {};
        if (year && year !== 'all') {
            const start = new Date(`${year}-01-01`);
            const end = new Date(`${year}-12-31T23:59:59`);
            query.date = { $gte: start, $lte: end };
        }
        const expenses = await Expense.find(query).sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add an expense
router.post('/', async (req, res) => {
    const expense = new Expense({
        date: req.body.date,
        category: req.body.category,
        description: req.body.description,
        amount: req.body.amount
    });

    try {
        const newExpense = await expense.save();
        res.status(201).json(newExpense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
