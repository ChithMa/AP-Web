import React from 'react';

const Header = ({ title, onAddNew }) => {
    return (
        <header className="top-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button id="menu-btn" className="menu-btn" style={{ display: 'none', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>☰</button>
                <h2 id="page-title">{title}</h2>
            </div>
            <div className="actions">
                <button className="btn btn-primary" id="add-transaction-btn" onClick={onAddNew}>+ Add New</button>
            </div>
        </header>
    );
};

export default Header;
