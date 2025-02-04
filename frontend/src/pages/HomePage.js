import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';
import { initiatePayment } from '../services/transactionService';
import { getCsrfToken } from '../services/authService';

function HomePage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [newTransaction, setNewTransaction] = useState({ name: '', description: '', amount: '' });
    const [confirmedPaymentsCount, setConfirmedPaymentsCount] = useState(0);
    const [totalConfirmedAmount, setTotalConfirmedAmount] = useState(0);
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
        } else {
            setUsername('User');
            fetchTransactions();
        }
    }, [navigate]);

    // Fetch transactions (mocked or from an API)
    const fetchTransactions = async () => {
        try {
            const response = await axios.get('/api/payments', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setTransactions(response.data.payments || []);
        } catch (error) {
            setErrorMessage('Error fetching transactions. Please try again.');
            console.error('Error fetching transactions:', error.response || error);
        }
    };

    // Handle transaction confirmation
    const handleConfirmPayment = async (transactionId) => {
        if (!transactionId) {
            console.error('Transaction ID is missing');
            setErrorMessage('Confirm ID is missing');
            return;
        }

        try {
            // Make the request to confirm the payment
            const response = await axios.post(`/api/payments/confirm/${transactionId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            // Handle the response after confirmation
            const { message, confirmedPaymentsCount, totalConfirmedAmount, payment } = response.data;

            // Update the success message with the confirmation response
            setSuccessMessage(`Payment confirmed successfully. ${message}`);

            // Update the transactions list to reflect the confirmed payment
            setTransactions(transactions.filter(transaction => transaction.id !== transactionId));

            // Optionally, update the counter and total confirmed amount (if you want to display these in the UI)
            setConfirmedPaymentsCount(confirmedPaymentsCount);
            setTotalConfirmedAmount(totalConfirmedAmount);

            // Reset success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            setErrorMessage('Error confirming payment. Please try again.');
            console.error('Error confirming payment', error.response || error);
        }
    };

    // Add transaction
    const handleAddTransaction = async (e) => {
        e.preventDefault();

        // Validate if the fields are filled and amount is a number
        if (!newTransaction.name || !newTransaction.description || !newTransaction.amount || isNaN(newTransaction.amount)) {
            setErrorMessage('Please enter all fields with a valid amount!');
            return;
        }

        try {
            const response = await axios.post('/api/payments', newTransaction, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            setTransactions([...transactions, response.data.payment]);
            setNewTransaction({ name: '', description: '', amount: '' });
            setSuccessMessage('Transaction added successfully');

            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            setErrorMessage('Error adding transaction. Please try again.');
            console.error('Error adding transaction', error.response || error);
        }
    };

    // Logout method
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="home-container">
            <h1>Welcome, {username}!</h1>
            <div className='stats-container'>
                <h2>Statistics</h2>
                <p>Total confirmed payments: {confirmedPaymentsCount}</p>
                <p>Total confirmed amount: ${totalConfirmedAmount}</p>
            </div>

            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="add-transaction">
                <h2>Add New Payment</h2>
                <form onSubmit={handleAddTransaction}>
                    <input
                        type='text'
                        placeholder='Title'
                        value={newTransaction.name}
                        onChange={(e) => setNewTransaction({ ...newTransaction, name: e.target.value })}
                        required />
                    <input
                        type="text"
                        placeholder="Description"
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                        required
                    />
                    <button type="submit">Add Payment</button>
                </form>
            </div>

            <h2>Transactions</h2>
            {transactions.length > 0 ? (
                <div className="transaction-list">
                    {transactions.map((transaction) => (
                        <div key={transaction.id} className="transaction-item">
                            <span>{transaction.name} - {transaction.description} - ${transaction.amount}</span>
                            <button onClick={() => handleConfirmPayment(transaction.id)}>Confirm Payment</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No transactions available.</p>
            )}

            <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
    );
}

export default HomePage;