import React from 'react';

const Expenses = ({ expenses }) => {
    return (
        <section id="expenses" className="view active">
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody id="expenses-list">
                        {expenses.map(expense => (
                            <tr key={expense._id}>
                                <td>{new Date(expense.date).toLocaleDateString()}</td>
                                <td>{expense.category}</td>
                                <td>{expense.description}</td>
                                <td>₹{expense.amount.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default Expenses;
