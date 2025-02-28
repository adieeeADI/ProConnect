import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

export default function ProfileSetup({ navigation }) {
  const [userType, setUserType] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [rate, setRate] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [budget, setBudget] = useState('');

  const handleSubmit = async () => {
    if (!userType || !name || !bio) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'User not found. Please login again.');
        return;
      }
      
      await database()
        .ref(`/users/${user.uid}`)
        .set({
          userType,
          name,
          bio,
          ...(userType === 'Freelancer' && { skills, portfolio, rate }),
          ...(userType === 'Client' && { companyName, budget })
        });
      
      Alert.alert(
        'Success', 
        'Profile setup complete!',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('BottomTabNavigator')
          }
        ]
      );
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Setup</Text>
      
      <Text style={styles.label}>Select User Type</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.userTypeButton, userType === 'Freelancer' && styles.selected]} 
          onPress={() => setUserType('Freelancer')}>
          <Text style={styles.buttonText}>Freelancer</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.userTypeButton, userType === 'Client' && styles.selected]} 
          onPress={() => setUserType('Client')}>
          <Text style={styles.buttonText}>Client</Text>
        </TouchableOpacity>
      </View>
      
      <TextInput 
        style={styles.input} 
        placeholder="Full Name" 
        value={name} 
        onChangeText={setName} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Bio" 
        value={bio} 
        onChangeText={setBio} 
        multiline 
      />
      
      {userType === 'Freelancer' && (
        <>
          <TextInput 
            style={styles.input} 
            placeholder="Skills (comma separated)" 
            value={skills} 
            onChangeText={setSkills} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Portfolio Link" 
            value={portfolio} 
            onChangeText={setPortfolio} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Hourly Rate ($)" 
            keyboardType="numeric" 
            value={rate} 
            onChangeText={setRate} 
          />
        </>
      )}
      
      {userType === 'Client' && (
        <>
          <TextInput 
            style={styles.input} 
            placeholder="Company Name" 
            value={companyName} 
            onChangeText={setCompanyName} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Budget Range" 
            value={budget} 
            onChangeText={setBudget} 
          />
        </>
      )}
      
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Complete Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  userTypeButton: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#ddd',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
  },
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  submitButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    borderRadius: 5,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});