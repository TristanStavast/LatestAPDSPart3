import axios from 'axios';


// Define the API base URL for your backend
const API_URL = 'https://localhost:3000';                

// Initiate payment
export const initiatePayment = async (paymentData, csrfToken) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/payments`,
      paymentData,
      {
        headers: {
          'X-CSRF-TOKEN': csrfToken,  
        },
        withCredentials: true,  
      }
    );
    return response.data;  
  } catch (error) {
    console.error('Payment initiation failed:', error);
    throw new Error('Payment initiation failed');
  }
};

// Confirm payment
export const confirmPayment = async (paymentId, csrfToken) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/payments/confirm/${paymentId}`,
      {},
      {
        headers: {
          'X-CSRF-TOKEN': csrfToken,  
        },
        withCredentials: true,  
      }
    );
    return response.data;  
  } catch (error) {
    console.error('Payment confirmation failed:', error);
    throw new Error('Payment confirmation failed');
  }
};

// Get all transactions for a user
export const getTransactions = async (csrfToken) => {
  try {
    const response = await axios.get(`${API_URL}/api/payments`, {
      headers: {
        'X-CSRF-TOKEN': csrfToken,  
      },
      withCredentials: true,
    });
    return response.data;  
  } catch (error) {
    console.error('Fetching transactions failed:', error);
    throw new Error('Fetching transactions failed');
  }
};
