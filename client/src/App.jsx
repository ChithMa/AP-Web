import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Modal from './components/Modal';
import Dashboard from './pages/Dashboard';
import Donations from './pages/Donations';
import Expenses from './pages/Expenses';
import Seva from './pages/Seva';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import {
    donationService,
    expenseService,
    sevaService,
    attendanceService,
    yearService
} from './services/api';

function App() {
    const [activeView, setActiveView] = useState('dashboard');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [years, setYears] = useState([]);
    const [donations, setDonations] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [seva, setSeva] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchYears();
    }, []);

    useEffect(() => {
        fetchData();
    }, [selectedYear]);

    const fetchYears = async () => {
        try {
            const res = await yearService.getAll();
            setYears(res.data);
            if (res.data.length > 0 && !res.data.includes(parseInt(selectedYear))) {
                setSelectedYear(res.data[0].toString());
            }
        } catch (err) {
            console.error('Error fetching years:', err);
            alert('Backend error: Could not fetch years. Make sure your server and MongoDB are running.');
        }
    };

    const fetchData = async () => {
        try {
            const [donRes, expRes, sevaRes, attRes] = await Promise.all([
                donationService.getAll(selectedYear),
                expenseService.getAll(selectedYear),
                sevaService.getAll(selectedYear),
                attendanceService.getAll(selectedYear)
            ]);
            setDonations(donRes.data);
            setExpenses(expRes.data);
            setSeva(sevaRes.data);
            setAttendance(attRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        }
    };

    const handleSave = async (type, data) => {
        try {
            if (type === 'donation') {
                await donationService.create(data);
            } else if (type === 'expense') {
                await expenseService.create(data);
            } else if (type === 'seva') {
                await sevaService.create({ ...data, year: selectedYear });
            } else if (type === 'attendance') {
                await attendanceService.create({ ...data, year: selectedYear });
            }
            fetchData();
        } catch (err) {
            console.error('Error saving entry:', err);
            alert('Save failed: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleUpdateAttendanceStatus = async (id, status) => {
        try {
            await attendanceService.update(id, { status });
            fetchData();
        } catch (err) {
            console.error('Error updating attendance status:', err);
        }
    };

    const handleUpdateAttendancePax = async (id, pax) => {
        try {
            await attendanceService.update(id, { pax });
            fetchData();
        } catch (err) {
            console.error('Error updating attendance pax:', err);
        }
    };

    const handleAddYear = async () => {
        const year = prompt('Enter new year:');
        if (year && !isNaN(year)) {
            try {
                await yearService.create(parseInt(year));
                fetchYears();
            } catch (err) {
                console.error('Error adding year:', err);
                alert('Add Year failed: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    const renderView = () => {
        switch (activeView) {
            case 'dashboard': return <Dashboard donations={donations} expenses={expenses} />;
            case 'donations': return <Donations donations={donations} />;
            case 'expenses': return <Expenses expenses={expenses} />;
            case 'seva': return <Seva seva={seva} />;
            case 'attendance': return <Attendance attendance={attendance} onUpdateStatus={handleUpdateAttendanceStatus} onUpdatePax={handleUpdateAttendancePax} />;
            case 'reports': return <Reports donations={donations} expenses={expenses} selectedYear={selectedYear} />;
            default: return <Dashboard donations={donations} expenses={expenses} />;
        }
    };

    return (
        <div className="app-container">
            <Sidebar
                activeView={activeView}
                setActiveView={setActiveView}
                years={years}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                onAddYear={handleAddYear}
            />
            <main className="main-content">
                <Header
                    title={activeView.charAt(0).toUpperCase() + activeView.slice(1)}
                    onAddNew={() => setIsModalOpen(true)}
                />
                {renderView()}
            </main>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                selectedYear={selectedYear}
            />
        </div>
    );
}

export default App;
