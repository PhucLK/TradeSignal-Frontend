// import dotenv from 'dotenv';
// dotenv.config();

// const BACKEND_URL = process.env.BACKEND_URL;
// const BACKEND_URL = 'https://tradesignal-backend-production.up.railway.app/api';
const BACKEND_URL = 'http://localhost:3000/api/auth';

export const login = async (email, password) => {
  try {
    const response = await fetch(`${BACKEND_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.success) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || 'Login failed' };
    }

    const data = await response.json();
    console.log('Login response:', data);
    
    // const { success, message, userId } = data;
    return { success: data.success, message: data.message, userId: data.userId };
    // return { success: true, message: 'Login successful', token: 'mockToken123' };
  } catch (error) {
    return { success: false, message: 'An error occurred during login' };
  }
};

export const register = async (email, password) => {
  try {
    const response = await fetch(`${BACKEND_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.success) {
      const errorData = await response.json();
      return { success: false, message: errorData.message || 'Registration failed' };
    }

    const data = await response.json();
    return { success: true, message: 'Registration successful', userId: data.userId };
  } catch (error) {
    return { success: false, message: 'An error occurred during registration' };
  }
};