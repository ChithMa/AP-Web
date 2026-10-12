const mongoose = require('mongoose');
const Donation = require('./models/Donation');
const Expense = require('./models/Expense');
const Seva = require('./models/Seva');
const Attendance = require('./models/Attendance');
const Year = require('./models/Year');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ap_web_db';

const MOCK_DATA = {
    years: [2025, 2024, 2023],
    donations: [
        { date: '2025-12-01', name: 'Ravi Sharma', family: 'Sharma Ji', amount: 5001 },
        { date: '2025-12-05', name: 'Anjali Verma', family: 'Verma Ji', amount: 2100 },
        { date: '2025-12-10', name: 'K. Gupta', family: 'Gupta Traders', amount: 11000 },
        { date: '2025-12-15', name: 'Anonymous', family: '-', amount: 501 },
        { date: '2025-12-20', name: 'Suresh Reddy', family: 'Reddy Builders', amount: 5000 },
        { date: '2024-05-15', name: 'Old Donor 1', family: 'Fam A', amount: 10000 },
        { date: '2024-06-01', name: 'Old Donor 2', family: 'Fam B', amount: 5000 },
        { date: '2023-08-10', name: 'Ancient Donor', family: 'Fam C', amount: 8000 },
    ],
    expenses: [
        { date: '2025-12-02', category: 'Pooja', description: 'Idol Decoration Items', amount: 1500 },
        { date: '2025-12-12', category: 'Food', description: 'Advance for Catering', amount: 5000 },
        { date: '2025-12-18', category: 'Travel', description: 'Bus Booking Advance', amount: 8000 },
        { date: '2024-05-20', category: 'Food', description: '2024 Feast', amount: 70000 },
        { date: '2024-05-21', category: 'Pooja', description: '2024 Rituals', amount: 30000 },
        { date: '2024-05-22', category: 'Misc', description: 'Tent House', amount: 50000 },
        { date: '2023-08-15', category: 'Food', description: '2023 Annadanam', amount: 60000 },
        { date: '2023-08-16', category: 'Pooja', description: '2023 Homa', amount: 40000 },
    ],
    seva: [
        { year: 2025, member: 'Ravi Sharma', task: 'Cleaning Floor', status: 'Pending' },
        { year: 2025, member: 'Anjali Verma', task: 'Flower Decoration', status: 'Completed' },
        { year: 2024, member: 'Suresh', task: 'Food Serving', status: 'Completed' }
    ],
    attendance: [
        { year: 2025, name: 'Ravi Sharma', family: 'Sharma Ji', pax: 3, status: 'Coming' },
        { year: 2025, name: 'Anjali Verma', family: 'Verma Ji', pax: 2, status: 'Not Coming' }
    ]
};

async function migrate() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Promise.all([
            Donation.deleteMany({}),
            Expense.deleteMany({}),
            Seva.deleteMany({}),
            Attendance.deleteMany({}),
            Year.deleteMany({})
        ]);
        console.log('Cleared existing data');

        // Insert new data
        await Year.insertMany(MOCK_DATA.years.map(y => ({ year: y })));
        await Donation.insertMany(MOCK_DATA.donations);
        await Expense.insertMany(MOCK_DATA.expenses);
        await Seva.insertMany(MOCK_DATA.seva);
        await Attendance.insertMany(MOCK_DATA.attendance);

        console.log('Migration completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
