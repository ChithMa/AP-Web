import React, { useState } from 'react';

const Modal = ({ isOpen, onClose, onSave, selectedYear }) => {
    const [type, setType] = useState('donation');
    const [formData, setFormData] = useState({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        name: '',
        family: '',
        category: 'Travel',
        description: '',
        member: '',
        task: '',
        pax: 1,
        status: 'Coming'
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(type, formData);
        onClose();
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    return (
        <div id="modal" className="modal">
            <div className="modal-content">
                <span className="close-modal" onClick={onClose}>&times;</span>
                <h2 id="modal-title">Add Entry</h2>
                <form id="transaction-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Type</label>
                        <div className="toggle-group" style={{ flexWrap: 'wrap' }}>
                            {['donation', 'expense', 'seva', 'attendance'].map(t => (
                                <label key={t} className="radio-label">
                                    <input
                                        type="radio"
                                        name="type"
                                        value={t}
                                        checked={type === t}
                                        onChange={() => setType(t)}
                                    /> {t.charAt(0).toUpperCase() + t.slice(1)}
                                </label>
                            ))}
                        </div>
                    </div>

                    {(type === 'donation' || type === 'expense') && (
                        <div className="form-group" id="amount-group">
                            <label htmlFor="amount">Amount (₹)</label>
                            <input type="number" id="amount" value={formData.amount} onChange={handleChange} min="1" required />
                        </div>
                    )}

                    {(type === 'donation' || type === 'expense') && (
                        <div className="form-group" id="date-group">
                            <label htmlFor="date">Date</label>
                            <input type="date" id="date" value={formData.date} onChange={handleChange} required />
                        </div>
                    )}

                    {type === 'donation' && (
                        <div id="donation-fields">
                            <div className="form-group">
                                <label htmlFor="name">Donor Name</label>
                                <input type="text" id="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="family">Family Head</label>
                                <input type="text" id="family" value={formData.family} onChange={handleChange} required />
                            </div>
                        </div>
                    )}

                    {type === 'expense' && (
                        <div id="expense-fields">
                            <div className="form-group">
                                <label htmlFor="category">Category</label>
                                <select id="category" value={formData.category} onChange={handleChange}>
                                    <option value="Travel">Travel</option>
                                    <option value="Food">Food</option>
                                    <option value="Pooja">Pooja Items</option>
                                    <option value="Accommodation">Accommodation</option>
                                    <option value="Misc">Miscellaneous</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <input type="text" id="description" value={formData.description} onChange={handleChange} required />
                            </div>
                        </div>
                    )}

                    {type === 'seva' && (
                        <div id="seva-fields">
                            <div className="form-group">
                                <label htmlFor="member">Member Name</label>
                                <input type="text" id="member" value={formData.member} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="task">Task Description</label>
                                <input type="text" id="task" value={formData.task} onChange={handleChange} placeholder="e.g. Cleaning, Flowers" required />
                            </div>
                        </div>
                    )}

                    {type === 'attendance' && (
                        <div id="attendance-fields">
                            <div className="form-group">
                                <label htmlFor="name">Member Name</label>
                                <input type="text" id="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="family">Family</label>
                                <input type="text" id="family" value={formData.family} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="pax">Pax Count</label>
                                <input type="number" id="pax" value={formData.pax} onChange={handleChange} min="1" required />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary btn-block">Save</button>
                </form>
            </div>
        </div>
    );
};

export default Modal;
