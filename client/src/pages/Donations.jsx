import React from 'react';

const Donations = ({ donations }) => {
    return (
        <section id="donations" className="view active">
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Family</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody id="donations-list">
                        {donations.map(donation => (
                            <tr key={donation._id}>
                                <td>{new Date(donation.date).toLocaleDateString()}</td>
                                <td>{donation.name}</td>
                                <td>{donation.family}</td>
                                <td>₹{donation.amount.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default Donations;
