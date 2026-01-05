/**
 * App.js - Main Application Logic
 */

// DOM Elements
const views = document.querySelectorAll('.view');
const navLinks = document.querySelectorAll('.nav-links li');
const modal = document.getElementById('modal');
const addTransactionBtn = document.getElementById('add-transaction-btn');
const closeModalBtn = document.querySelector('.close-modal');
const transactionForm = document.getElementById('transaction-form');
const pageTitle = document.getElementById('page-title');

// State
let balanceChartInstance = null;
let expenseChartInstance = null;
let currentYear = new Date().getFullYear();

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initYearSelector();
    initModal();
    // Default to current year or the latest available if current is empty
    renderAll();
});

function initYearSelector() {
    const yearSelect = document.getElementById('year-select');
    const addYearBtn = document.getElementById('add-year-btn');
    const years = store.getYears();

    // Populate Dropdown
    yearSelect.innerHTML = years.map(y => `<option value="${y}" ${y == currentYear ? 'selected' : ''}>${y}</option>`).join('');

    // Listen for changes
    yearSelect.addEventListener('change', (e) => {
        currentYear = e.target.value;
        renderAll();
    });

    // Add Year Button Logic
    // Remove old listener to prevent duplicates if init called multiple times
    const newBtn = addYearBtn.cloneNode(true);
    addYearBtn.parentNode.replaceChild(newBtn, addYearBtn);

    newBtn.addEventListener('click', () => {
        const newYear = prompt("Enter Year for New Pooja (e.g., 2026):");
        if (newYear && /^\d{4}$/.test(newYear)) {
            const added = store.addYear(newYear);
            if (added) {
                currentYear = newYear;
                initYearSelector(); // Refresh dropdown
                renderAll(); // Refresh view (likely empty)
            } else {
                alert("This year already exists!");
                currentYear = newYear; // Switch to it anyway if exists
                initYearSelector();
                renderAll();
            }
        } else if (newYear) {
            alert("Invalid Year! Please enter a 4-digit year.");
        }
    });
}

function renderAll() {
    const currentView = document.querySelector('.view.active').id;
    if (currentView === 'dashboard') renderDashboard();
    if (currentView === 'donations') renderDonations();
    if (currentView === 'expenses') renderExpenses();
}

// Navigation Logic
function initNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Update Active Link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Switch View
            const targetView = link.dataset.view;
            views.forEach(view => {
                view.classList.remove('active');
                if (view.id === targetView) {
                    view.classList.add('active');
                }
            });

            // Update Header (Excluding the selector)
            // We only need to refresh data

            renderAll();
        });
    });
}

// Rendering Logic
function renderDashboard() {
    const stats = store.getStats(currentYear);

    // Update Cards
    document.getElementById('dash-total-donations').textContent = formatCurrency(stats.totalDonations);
    document.getElementById('dash-total-expenses').textContent = formatCurrency(stats.totalExpenses);
    document.getElementById('dash-balance').textContent = formatCurrency(stats.balance);

    // Update Charts
    updateCharts(stats);
}

function renderDonations() {
    const tbody = document.getElementById('donations-list');
    const donations = store.getDonations(currentYear);

    tbody.innerHTML = donations.map(d => `
        <tr>
            <td>${formatDate(d.date)}</td>
            <td><div style="font-weight:600">${d.name}</div></td>
            <td>${d.family}</td>
            <td style="color: var(--color-green); font-weight:600">+ ${formatCurrency(d.amount)}</td>
        </tr>
    `).join('');
}

function renderExpenses() {
    const tbody = document.getElementById('expenses-list');
    const expenses = store.getExpenses(currentYear);

    tbody.innerHTML = expenses.map(e => `
        <tr>
            <td>${formatDate(e.date)}</td>
            <td><span style="background: var(--color-primary-light); color: var(--color-primary); padding: 0.2rem 0.6rem; border-radius: 1rem; font-size: 0.85rem;">${e.category}</span></td>
            <td>${e.description}</td>
            <td style="color: var(--color-primary); font-weight:600">- ${formatCurrency(e.amount)}</td>
        </tr>
    `).join('');
}

function renderPreviousYears() {
    const container = document.getElementById('previous-years-container');
    const records = store.getPreviousPoojas();

    container.innerHTML = `<h3 style="margin-bottom:1rem; font-family:var(--font-heading)">Historical Records</h3>`;

    container.innerHTML += records.map(record => `
        <div class="stat-card" style="margin-bottom: 1.5rem; --accent-color: var(--color-gold);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                <h3 style="margin:0; font-size:1.2rem; color:var(--color-primary);">${record.year} - ${record.description}</h3>
                <span style="font-weight:700; font-size:1.2rem;">${formatCurrency(record.total_expenses)}</span>
            </div>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap:1rem;">
                ${record.details.map(d => `
                    <div style="background:var(--color-bg); padding:0.8rem; border-radius:var(--radius-md);">
                        <div style="font-size:0.8rem; color:var(--color-text-muted);">${d.category}</div>
                        <div style="font-weight:600;">${formatCurrency(d.amount)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Chart.js Logic
function updateCharts(stats) {
    const ctxBalance = document.getElementById('balanceChart').getContext('2d');
    const ctxExpense = document.getElementById('expenseChart').getContext('2d');

    // Destroy existing charts to avoid memory leaks/glitches
    if (balanceChartInstance) balanceChartInstance.destroy();
    if (expenseChartInstance) expenseChartInstance.destroy();

    // Balance Chart (Doughnut)
    balanceChartInstance = new Chart(ctxBalance, {
        type: 'doughnut',
        data: {
            labels: ['Expenses', 'Balance'],
            datasets: [{
                data: [stats.totalExpenses, stats.balance],
                backgroundColor: ['#B91C1C', '#059669'], // Brand Colors
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // Expense Breakdown Chart (Bar)
    const categories = Object.keys(stats.expensesByCategory);
    const amounts = Object.values(stats.expensesByCategory);

    expenseChartInstance = new Chart(ctxExpense, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Expenses',
                data: amounts,
                backgroundColor: '#D97706', // Brand Gold
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Modal & Form Logic
function initModal() {
    // Open Modal
    addTransactionBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        // Set default date to today
        document.getElementById('date').valueAsDate = new Date();
    });

    // Close Modal
    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Toggle Form Fields
    const typeInputs = document.querySelectorAll('input[name="type"]');
    typeInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const isDonation = e.target.value === 'donation';
            document.getElementById('donation-fields').classList.toggle('hidden', !isDonation);
            document.getElementById('expense-fields').classList.toggle('hidden', isDonation);

            // Toggle Required attributes
            document.getElementById('donor-name').required = isDonation;
            document.getElementById('category').required = !isDonation;
        });
    });

    // Submssion
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const type = document.querySelector('input[name="type"]:checked').value;
        const amount = document.getElementById('amount').value;
        const date = document.getElementById('date').value;

        if (type === 'donation') {
            store.addDonation({
                name: document.getElementById('donor-name').value,
                family: document.getElementById('family-name').value,
                amount,
                date
            });
        } else {
            store.addExpense({
                category: document.getElementById('category').value,
                description: document.getElementById('description').value,
                amount,
                date
            });
        }

        modal.classList.add('hidden');
        transactionForm.reset();

        // Refresh Current View & Years List (in case new year added)
        initYearSelector();
        renderAll();
    });
}

// Utility Helpers
function formatCurrency(num) {
    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        maximumFractionDigits: 0
    }).format(num);
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
    });
}
