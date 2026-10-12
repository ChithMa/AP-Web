import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Reports = ({ donations, expenses, selectedYear }) => {
    const exportDonations = () => {
        const doc = new jsPDF();
        doc.text(`Donations Report - ${selectedYear === 'all' ? 'All Time' : selectedYear}`, 14, 15);

        const tableData = donations.map(d => [
            new Date(d.date).toLocaleDateString(),
            d.name,
            d.family,
            `Rs. ${d.amount}`
        ]);

        doc.autoTable({
            head: [['Date', 'Name', 'Family', 'Amount']],
            body: tableData,
            startY: 20
        });
        doc.save(`donations_${selectedYear}.pdf`);
    };

    const exportExpenses = () => {
        const doc = new jsPDF();
        doc.text(`Expenses Report - ${selectedYear === 'all' ? 'All Time' : selectedYear}`, 14, 15);

        const tableData = expenses.map(e => [
            new Date(e.date).toLocaleDateString(),
            e.category,
            e.description,
            `Rs. ${e.amount}`
        ]);

        doc.autoTable({
            head: [['Date', 'Category', 'Description', 'Amount']],
            body: tableData,
            startY: 20
        });
        doc.save(`expenses_${selectedYear}.pdf`);
    };

    return (
        <section id="reports" className="view active">
            <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
                <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>Export Data</h3>
                <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>Download your financial data for the selected year as PDF files.</p>

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <button onClick={exportDonations} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <span>📑</span> Export Donations (PDF)
                    </button>
                    <button onClick={exportExpenses} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 0.5, backgroundColor: 'var(--color-gold)' }}>
                        <span>📑</span> Export Expenses (PDF)
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Reports;
