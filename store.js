/**
 * Store - Handles Data Persistence using LocalStorage
 * Also provides mock data for demonstration purposes
 */

const STORAGE_KEY = 'family_trip_finance_data';

// Initial Mock Data
const MOCK_DATA = {
    years: [2025, 2024, 2023], // Explicitly tracked years
    donations: [
        // 2025 (Current)
        // 2025 (Current)
        { id: 1, date: '2025-12-01', name: 'Ravi Sharma', family: 'Sharma Ji', amount: 5001 },
        { id: 2, date: '2025-12-05', name: 'Anjali Verma', family: 'Verma Ji', amount: 2100 },
        { id: 3, date: '2025-12-10', name: 'K. Gupta', family: 'Gupta Traders', amount: 11000 },
        { id: 4, date: '2025-12-15', name: 'Anonymous', family: '-', amount: 501 },
        { id: 5, date: '2025-12-20', name: 'Suresh Reddy', family: 'Reddy Builders', amount: 5000 },
        // 2024
        { id: 11, date: '2024-05-15', name: 'Old Donor 1', family: 'Fam A', amount: 10000 },
        { id: 12, date: '2024-06-01', name: 'Old Donor 2', family: 'Fam B', amount: 5000 },
        // 2023
        { id: 21, date: '2023-08-10', name: 'Ancient Donor', family: 'Fam C', amount: 8000 },
    ],
    expenses: [
        // 2025
        { id: 1, date: '2025-12-02', category: 'Pooja', description: 'Idol Decoration Items', amount: 1500 },
        { id: 2, date: '2025-12-12', category: 'Food', description: 'Advance for Catering', amount: 5000 },
        { id: 3, date: '2025-12-18', category: 'Travel', description: 'Bus Booking Advance', amount: 8000 },
        // 2024
        { id: 11, date: '2024-05-20', category: 'Food', description: '2024 Feast', amount: 70000 },
        { id: 12, date: '2024-05-21', category: 'Pooja', description: '2024 Rituals', amount: 30000 },
        { id: 13, date: '2024-05-22', category: 'Misc', description: 'Tent House', amount: 50000 },
        // 2023
        { id: 21, date: '2023-08-15', category: 'Food', description: '2023 Annadanam', amount: 60000 },
        { id: 22, date: '2023-08-16', category: 'Pooja', description: '2023 Homa', amount: 40000 },
    ]
};

class Store {
    constructor() {
        this.data = this.loadData();
    }

    loadData() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
        // Initialize with mock data if empty
        this.saveData(MOCK_DATA);
        return MOCK_DATA;
    }

    saveData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        this.data = data;
    }

    saveData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        this.data = data;
    }

    getYears() {
        const years = new Set(this.data.years || []);
        // Also scavenge from data just in case
        this.data.donations.forEach(d => years.add(new Date(d.date).getFullYear()));
        this.data.expenses.forEach(e => years.add(new Date(e.date).getFullYear()));

        // Ensure current year is always there in defaults if empty
        if (years.size === 0) years.add(new Date().getFullYear());

        return Array.from(years).sort((a, b) => b - a);
    }

    addYear(year) {
        if (!this.data.years) this.data.years = [];
        if (!this.data.years.includes(Number(year))) {
            this.data.years.push(Number(year));
            this.saveData(this.data);
            return true;
        }
        return false; // Already exists
    }

    getDonations(year) {
        return this.data.donations
            .filter(d => year === 'all' || new Date(d.date).getFullYear() == year)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    getExpenses(year) {
        return this.data.expenses
            .filter(e => year === 'all' || new Date(e.date).getFullYear() == year)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    getStats(year) {
        const donations = this.getDonations(year);
        const expenses = this.getExpenses(year);

        const totalDonations = donations.reduce((acc, curr) => acc + Number(curr.amount), 0);
        const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
        const balance = totalDonations - totalExpenses;

        // Group expenses by category for charts
        const expensesByCategory = expenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
            return acc;
        }, {});

        return {
            totalDonations,
            totalExpenses,
            balance,
            expensesByCategory
        };
    }

    addDonation(donation) {
        const newDonation = { ...donation, id: Date.now() };
        this.data.donations.push(newDonation);
        this.saveData(this.data);
        return newDonation;
    }

    addExpense(expense) {
        const newExpense = { ...expense, id: Date.now() };
        this.data.expenses.push(newExpense);
        this.saveData(this.data);
        return newExpense;
    }


}

const store = new Store();
