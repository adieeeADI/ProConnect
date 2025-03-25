import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert, StatusBar } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function CreateAcc({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCreateAccount = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match.');
      return;
    }
//create user
    try {
      // Create user with Firebase Authentication
      await auth().createUserWithEmailAndPassword(email, password);
      Alert.alert('Success', 'Account created successfully!');

      // ✅ Ensure that "LoginPage" exists in your navigator
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginPage' }], // ✅ Match this name to your actual navigation setup
      });

    } catch (error) {
      // Handle Firebase errors
      Alert.alert('Error', error.message); // ✅ Display the actual error message
    }
  };

  return (

    <View style={styles.container}>
        <StatusBar backgroundColor="#000" barStyle="light-content" />
        <Text style={styles.title}>ProConnect</Text>

        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#8e8e8e"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#8e8e8e"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#8e8e8e"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.divider} />
            </View>

            <TouchableOpacity onPress={() => navigation.replace('LoginPage')}>
                <Text style={styles.loginText}>Already have an account? <Text style={styles.signInText}>Sign in</Text></Text>
            </TouchableOpacity>
        </View>
    </View>
);
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
},
title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
    fontStyle: 'italic'
},
inputContainer: {
    width: '100%',
    maxWidth: 350,
},
input: {
    width: '100%',
    height: 44,
    borderRadius: 5,
    backgroundColor: '#262626',
    paddingHorizontal: 15,
    fontSize: 14,
    color: '#fff',
    borderWidth: 0.5,
    borderColor: '#363636',
    marginBottom: 12,
},
button: {
    width: '100%',
    height: 44,
    borderRadius: 5,
    backgroundColor: '#0095f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
},
buttonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
},
dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
},
divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#262626',
},
dividerText: {
    color: '#8e8e8e',
    paddingHorizontal: 15,
    fontSize: 12,
    fontWeight: '600',
},
loginText: {
    fontSize: 14,
    color: '#8e8e8e',
    textAlign: 'center',
    marginTop: 15,
},
signInText: {
    color: '#0095f6',
    fontWeight: '600',
}
});
