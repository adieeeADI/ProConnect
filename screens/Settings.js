import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Alert,
    ScrollView 
} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export default function UserSettings({ navigation }) {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState('');
    const [rate, setRate] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const user = auth().currentUser;
            if (user) {
                const snapshot = await database()
                    .ref(`/users/${user.uid}`)
                    .once('value');
                
                const userData = snapshot.val();
                if (userData) {
                    setName(userData.name || '');
                    setBio(userData.bio || '');
                    setSkills(userData.skills || '');
                    setRate(userData.rate ? userData.rate.toString() : '');
                }
            }
            setLoading(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch user data');
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const user = auth().currentUser;
            if (!user) return;

            await database()
                .ref(`/users/${user.uid}`)
                .update({
                    name,
                    bio,
                    skills,
                    rate: parseFloat(rate) || 0,
                });

            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmNewPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        try {
            const user = auth().currentUser;
            const credential = auth.EmailAuthProvider.credential(
                user.email,
                currentPassword
            );

            await user.reauthenticateWithCredential(credential);
            await user.updatePassword(newPassword);

            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            Alert.alert('Success', 'Password updated successfully');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profile Information</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#8e8e8e"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={[styles.input, styles.bioInput]}
                    placeholder="Bio"
                    placeholderTextColor="#8e8e8e"
                    value={bio}
                    onChangeText={setBio}
                    multiline
                />
                <TextInput
                    style={styles.input}
                    placeholder="Skills (comma separated)"
                    placeholderTextColor="#8e8e8e"
                    value={skills}
                    onChangeText={setSkills}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Hourly Rate ($)"
                    placeholderTextColor="#8e8e8e"
                    value={rate}
                    onChangeText={setRate}
                    keyboardType="numeric"
                />
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleUpdateProfile}
                >
                    <Text style={styles.buttonText}>Update Profile</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Change Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Current Password"
                    placeholderTextColor="#8e8e8e"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    placeholderTextColor="#8e8e8e"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm New Password"
                    placeholderTextColor="#8e8e8e"
                    value={confirmNewPassword}
                    onChangeText={setConfirmNewPassword}
                    secureTextEntry
                />
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={handleChangePassword}
                >
                    <Text style={styles.buttonText}>Change Password</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
        marginTop: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
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
    bioInput: {
        height: 80,
        textAlignVertical: 'top',
        paddingTop: 12,
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
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});