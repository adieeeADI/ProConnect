import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const AlertMessage = ({ message }) => (
    <View>
        <Text>{message}</Text>
    </View>
);

export default function LoginPage({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkExistingLogin = async () => {
            try {
                const user = auth().currentUser;
                if (user) {
                    const hasProfile = await checkUserProfile(user.uid);
                    navigation.replace(hasProfile ? 'HomePage' : 'ProfileSetup');
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error checking existing login:", error);
                Alert.alert("Error", "An error occurred while checking login status.");
                setLoading(false);
            }
        };

        checkExistingLogin();
    }, []);

    const checkUserProfile = async (userId) => {
        try {
            const snapshot = await database().ref(`/users/${userId}`).once('value');
            return snapshot.exists();
        } catch (error) {
            console.error('Error checking profile:', error);
            return false;
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Email and password are required.");
            return;
        }

        try {
            setLoading(true);
            const userCredential = await auth().signInWithEmailAndPassword(email, password);
            const hasProfile = await checkUserProfile(userCredential.user.uid);
            
            // Save login state in AsyncStorage
            await AsyncStorage.setItem("isLoggedIn", "true");

            Alert.alert("Success", "Logged in successfully!", [
                {
                    text: "OK",
                    onPress: () => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: hasProfile ? "BottomTabNavigator" : "ProfileSetup" }],
                        });
                    },
                },
            ]);
        } catch (error) {
            console.error("Login Error:", error);
            Alert.alert("Error", error.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Enter Password"
                placeholderTextColor="#888"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('CreateAcc')}>
                <Text style={styles.registerText}>Don't have an account? Sign up</Text>
            </TouchableOpacity>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007BFF" />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        paddingLeft: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 15,
    },
    button: {
        width: '100%',
        height: 50,
        borderRadius: 25,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    registerText: {
        fontSize: 14,
        color: '#007BFF',
        marginTop: 10,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
