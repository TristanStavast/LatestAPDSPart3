import { getCsrfToken } from "../services/authService";

export const addCsrfTokenToHeaders = async (headers = {}) => {
    try {
        const csrfToken = await getCsrfToken();  
    return {
      ...headers,
      'X-CSRF-TOKEN': csrfToken,  
    };
    } catch (error) {
        console.error('Error adding CSRF token to headers:', error);
        throw new Error('Failed to add CSRF token');
    }
}