import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export default function ManageAccount({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDeleteAccount = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        Alert.alert(
            'Confirm Delete',
            'This action cannot be undone. Are you sure you want to delete your account?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const currentUser = auth().currentUser;
                            
                            // Reauthenticate user
                            const credential = auth.EmailAuthProvider.credential(email, password);
                            await currentUser.reauthenticateWithCredential(credential);
                            
                            // Delete user data from database
                            await database().ref(`users/${currentUser.uid}`).remove();
                            
                            // Delete user account
                            await currentUser.delete();
                            
                            // Navigate to login screen
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'LoginPage' }],
                            });
                        } catch (error) {
                            console.error('Error deleting account:', error);
                            Alert.alert(
                                'Error',
                                'Failed to delete account. Please check your credentials and try again.'
                            );
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Manage Account</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.warningBox}>
                    <MaterialCommunityIcons name="alert-circle" size={24} color="#ff3b30" />
                    <Text style={styles.warningText}>
                        Deleting your account will permanently remove all your data.
                        This action cannot be undone.
                    </Text>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirm Email</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        placeholderTextColor="#8e8e8e"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password"
                        placeholderTextColor="#8e8e8e"
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity 
                    style={[styles.deleteButton, loading && styles.disabledButton]}
                    onPress={handleDeleteAccount}
                    disabled={loading}
                >
                    <Text style={styles.deleteButtonText}>
                        {loading ? 'Deleting...' : 'Delete My Account'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 40,
        backgroundColor: '#000',
        borderBottomWidth: 0.5,
        borderBottomColor: '#262626',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 15,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    warningBox: {
        flexDirection: 'row',
        backgroundColor: '#262626',
        padding: 15,
        borderRadius: 8,
        marginBottom: 30,
        alignItems: 'center',
    },
    warningText: {
        color: '#ff3b30',
        marginLeft: 10,
        flex: 1,
        fontSize: 14,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#262626',
        borderRadius: 8,
        padding: 15,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#363636',
    },
    deleteButton: {
        backgroundColor: '#ff3b30',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    disabledButton: {
        opacity: 0.7,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});