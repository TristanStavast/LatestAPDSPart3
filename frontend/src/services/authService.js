import axios from 'axios'

const API_URL = ' https://localhost:3000'                     

export const getCsrfToken = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/csrf-token`, { withCredentials: true});
        return response.data.token;
    } catch (error) {
        console.error('Error fetching CSRF token: ', error)
        throw new Error('CSRF token fetch failed!');
    }
};

export const login = async (credentials, csrfToken) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/login`,
        credentials,
        {
          headers: {
            'X-CSRF-TOKEN': csrfToken,  
          },
          withCredentials: true,  
        }
      );
      return response.data;  
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed');
    }
};

export const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/logout`, {}, { withCredentials: true });
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      throw new Error('Logout failed');
    }
};