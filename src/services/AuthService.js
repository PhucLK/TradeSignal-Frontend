export const mockLogin = (username, password) => {
  if (username === 'Testuser' && password === '1') {
    return { success: true, message: 'Login successful', token: 'mockToken123' };
  }
  return { success: false, message: 'Invalid username or password' };
};

export const mockRegister = (username, password) => {
  if (username && password) {
    return { success: true, message: 'Registration successful', userId: 'mockUserId123' };
  }
  return { success: false, message: 'Username and password are required' };
};