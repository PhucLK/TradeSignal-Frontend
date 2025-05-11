import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { login, register } from '../services/AuthService';

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{3,}$/;
  return passwordRegex.test(password);
};

export function LoginScreen({ navigation, route, setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // useEffect(() => {
  //   if (route.params?.email) {
  //     setUsername(route.params.email);
  //   }
  // }, [route.params]);

  const handleLogin = async () => {
    if (!username || !password) {
      setMessage('All fields are required.');
      return;
    }

    if (!validateEmail(username)) {
      setMessage('Invalid email format.');
      return;
    }

    if (!validatePassword(password)) {
      setMessage('Password must contain at least one letter, one number, and be at least 3 characters long.');
      return;
    }

    const result = await login(username, password);
    setIsLoggedIn(true); // Ensure isLoggedIn is updated
    navigation.navigate('Home'); // Navigate to the Home screen
    // setMessage(result.message);
    // if (result.success) {
    //   setIsLoggedIn(true); // Ensure isLoggedIn is updated
    //   navigation.navigate('Home'); // Navigate to the Home screen
    // }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Text style={styles.header}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title="Login" onPress={handleLogin} />
          {message ? <Text style={styles.error}>{message}</Text> : null}
          <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    if (!username || !password) {
      setMessage('All fields are required.');
      return;
    }

    if (!validateEmail(username)) {
      setMessage('Invalid email format.');
      return;
    }

    if (!validatePassword(password)) {
      setMessage('Password must contain at least one letter, one number, and be at least 3 characters long.');
      return;
    }

    const result = await register(username, password);
    setMessage(result.message);
    console.log('Registration successful:', result);
      
    navigation.navigate('Login', { email: username }); // Pass the current email to the Login screen
    // if (result.success) {
    //   console.log('Registration successful:', result);
      
    //   navigation.navigate('Login', { email: username }); // Pass the current email to the Login screen
    // }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Text style={styles.header}>Register</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title="Register" onPress={handleRegister} />
          {message ? <Text style={styles.error}>{message}</Text> : null}
          <Button title="Go to Login" onPress={() => navigation.navigate('Login')} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});