import React from 'react';

const Attendance = ({ attendance, onUpdateStatus, onUpdatePax }) => {
    const totalPax = attendance
        .filter(a => a.status === 'Coming')
        .reduce((acc, curr) => acc + curr.pax, 0);

    return (
        <section id="attendance" className="view active">
            <div style={{ background: 'var(--color-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>Attendance List</h3>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Total Confirmed</span>
                    <span id="total-pax-count" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-green)' }}>{totalPax}</span>
                </div>
            </div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Family</th>
                            <th>Pax</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="attendance-list">
                        {attendance.map(item => (
                            <tr key={item._id}>
                                <td>{item.name}</td>
                                <td>{item.family}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={item.pax}
                                        min="1"
                                        onChange={(e) => onUpdatePax(item._id, parseInt(e.target.value))}
                                        style={{ width: '60px', padding: '0.2rem' }}
                                    />
                                </td>
                                <td>
                                    <select
                                        value={item.status}
                                        onChange={(e) => onUpdateStatus(item._id, e.target.value)}
                                        style={{ padding: '0.2rem' }}
                                    >
                                        <option value="Coming">Coming</option>
                                        <option value="Not Coming">Not Coming</option>
                                        <option value="Maybe">Maybe</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section >
    );
};

export default Attendance;
