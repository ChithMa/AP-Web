import React from 'react';

const Sidebar = ({ activeView, setActiveView, years, selectedYear, setSelectedYear, onAddYear }) => {
    return (
        <nav className="sidebar" id="sidebar">
            <span id="close-sidebar-btn" className="close-sidebar-btn">&times;</span>
            <div className="logo">
                <span className="logo-icon"></span>
                <h1>Muluthan Pooja</h1>
            </div>
            <ul className="nav-links">
                <li className={activeView === 'dashboard' ? 'active' : ''} onClick={() => setActiveView('dashboard')}>
                    <span className="icon">📊</span> Dashboard
                </li>
                <li className={activeView === 'donations' ? 'active' : ''} onClick={() => setActiveView('donations')}>
                    <span className="icon">🙏</span> Donations
                </li>
                <li className={activeView === 'expenses' ? 'active' : ''} onClick={() => setActiveView('expenses')}>
                    <span className="icon">💸</span> Expenses
                </li>
                <li className={activeView === 'seva' ? 'active' : ''} onClick={() => setActiveView('seva')}>
                    <span className="icon">🤝</span> Seva (Duties)
                </li>
                <li className={activeView === 'attendance' ? 'active' : ''} onClick={() => setActiveView('attendance')}>
                    <span className="icon">📋</span> Namelist
                </li>
                <li className={activeView === 'reports' ? 'active' : ''} onClick={() => setActiveView('reports')}>
                    <span className="icon">📑</span> Reports
                </li>
            </ul>

            <div className="year-filter-box">
                <label>Active Pooja Year</label>
                <div className="year-select-wrap">
                    <select
                        id="year-select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="all">All Time</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <button
                        id="add-year-btn"
                        className="btn-add-year"
                        onClick={onAddYear}
                        title="Add Year"
                    >+</button>
                </div>
            </div>

            <div className="user-profile">
                <div className="avatar">A</div>
                <div className="info">
                    <p className="name">Admin User</p>
                    <p className="role">Organizer</p>
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;
