import React from 'react';

const Seva = ({ seva }) => {
    return (
        <section id="seva" className="view active">
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Member Name</th>
                            <th>Assigned Duty</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="seva-list">
                        {seva.map(item => (
                            <tr key={item._id}>
                                <td>{item.member}</td>
                                <td>{item.task}</td>
                                <td>
                                    <span className={`status-badge ${item.status.toLowerCase()}`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default Seva;
