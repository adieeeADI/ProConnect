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

                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                    <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.divider} />
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('CreateAcc')}>
                    <Text style={styles.registerText}>Don't have an account? <Text style={styles.signUpText}>Sign up</Text></Text>
                </TouchableOpacity>
            </View>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0095f6" />
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
    registerText: {
        fontSize: 14,
        color: '#8e8e8e',
        textAlign: 'center',
        marginTop: 15,
    },
    signUpText: {
        color: '#0095f6',
        fontWeight: '600',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});