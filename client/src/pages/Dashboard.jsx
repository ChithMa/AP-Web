import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = ({ donations, expenses }) => {
    const totalDonations = donations.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const balance = totalDonations - totalExpenses;

    const expensesByCategory = expenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
    }, {});

    const barData = {
        labels: ['Donations', 'Expenses'],
        datasets: [
            {
                label: 'Amount (₹)',
                data: [totalDonations, totalExpenses],
                backgroundColor: ['#059669', '#B91C1C'],
            },
        ],
    };

    const pieData = {
        labels: Object.keys(expensesByCategory),
        datasets: [
            {
                data: Object.values(expensesByCategory),
                backgroundColor: [
                    '#B91C1C',
                    '#D97706',
                    '#059669',
                    '#2563EB',
                    '#7C3AED',
                ],
            },
        ],
    };

    return (
        <section id="dashboard" className="view active">
            <div className="stats-grid">
                <div className="stat-card" style={{ '--accent-color': 'var(--color-gold)', '--accent-bg': 'rgba(217, 119, 6, 0.1)' }}>
                    <div className="stat-card-header">
                        <h3>Total Donations</h3>
                        <div className="stat-card-badge">🪙</div>
                    </div>
                    <p className="amount" id="dash-total-donations">₹{totalDonations.toLocaleString()}</p>
                    <div className="stat-card-footer">
                        <span>✨ Community contributions</span>
                    </div>
                </div>
                <div className="stat-card" style={{ '--accent-color': 'var(--color-red)', '--accent-bg': 'rgba(220, 38, 38, 0.1)' }}>
                    <div className="stat-card-header">
                        <h3>Total Expenses</h3>
                        <div className="stat-card-badge">💸</div>
                    </div>
                    <p className="amount" id="dash-total-expenses">₹{totalExpenses.toLocaleString()}</p>
                    <div className="stat-card-footer">
                        <span>📉 Disbursed funds</span>
                    </div>
                </div>
                <div className="stat-card" style={{ '--accent-color': 'var(--color-green)', '--accent-bg': 'rgba(5, 150, 105, 0.1)' }}>
                    <div className="stat-card-header">
                        <h3>Remaining Balance</h3>
                        <div className="stat-card-badge">🏦</div>
                    </div>
                    <p className="amount" id="dash-balance">₹{balance.toLocaleString()}</p>
                    <div className="stat-card-footer">
                        <span>💎 Current net treasury</span>
                    </div>
                </div>
            </div>

            <div className="charts-container">
                <div className="chart-card">
                    <h3>Overview</h3>
                    <div style={{ height: '250px' }}>
                        <Bar data={barData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
                <div className="chart-card">
                    <h3>Expense Breakdown</h3>
                    <div style={{ height: '250px' }}>
                        <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;
