import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    ActivityIndicator
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

export default function UpdateProfile({ navigation }) {
    const [userType, setUserType] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState('');
    const [portfolio, setPortfolio] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [hourlyRate, setHourlyRate] = useState('');
    useEffect(() => {
        fetchUserData();
    }, []);

    // Update the fetchUserData function
    const fetchUserData = async () => {
        try {
            const userId = auth().currentUser.uid;
            const snapshot = await database().ref(`users/${userId}`).once('value');
            const userData = snapshot.val();
            
            console.log('Raw user data:', userData);
    
            if (userData) {
                setUserType(userData.userType || '');
                setName(userData.name || '');
                setBio(userData.bio || '');
                
                if (userData.userType === 'Freelancer' || userData.userType === 'freelancer') {
                    // Convert skills array back to string if it's an array
                    const skillsData = Array.isArray(userData.skills) 
                        ? userData.skills.join(', ')
                        : userData.skills || '';
                    setSkills(skillsData);
                    setPortfolio(userData.portfolio || '');
                    setHourlyRate(userData.rate ? userData.rate.toString() : '');
                } else if (userData.userType === 'Client') {
                    setCompanyName(userData.companyName || '');
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            Alert.alert('Error', 'Failed to load profile data. Please try again.');
        } finally {
            setInitialLoading(false);
        }
    };

// Update the handleUpdate function to handle skills properly
const handleUpdate = async () => {
    if (!name.trim()) {
        Alert.alert('Error', 'Name is required');
        return;
    }

    if (userType === 'Freelancer' && !hourlyRate) {
        Alert.alert('Error', 'Hourly rate is required');
        return;
    }

    setLoading(true);
    try {
        const userId = auth().currentUser.uid;
        const updateData = {
            userType,
            name: name.trim(),
            bio: bio.trim(),
            updatedAt: database.ServerValue.TIMESTAMP
        };

        if (userType === 'Freelancer') {
            updateData.skills = skills.trim();
            updateData.portfolio = portfolio.trim();
            updateData.rate = parseFloat(hourlyRate) || 0;
            console.log('Updating freelancer data:', updateData);
        } else if (userType === 'Client') {
            updateData.companyName = companyName.trim();
        }

        await database().ref(`users/${userId}`).update(updateData);

        Alert.alert('Success', 'Profile updated successfully', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
    } catch (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Error', 'Failed to update profile');
    } finally {
        setLoading(false);
    }
};

const renderFreelancerFields = () => (
    <>
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Hourly Rate ($)</Text>
            <TextInput
                style={styles.input}
                value={hourlyRate}
                onChangeText={setHourlyRate}
                placeholder="Enter your hourly rate"
                placeholderTextColor="#8e8e8e"
                keyboardType="numeric"
            />
        </View>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Skills</Text>
            <TextInput
                style={styles.input}
                value={skills}
                onChangeText={setSkills}
                placeholder="Enter your skills (comma separated)"
                placeholderTextColor="#8e8e8e"
            />
            <Text style={styles.helperText}>Separate skills with commas (e.g., React, Node.js)</Text>
        </View>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Portfolio URL</Text>
            <TextInput
                style={styles.input}
                value={portfolio}
                onChangeText={setPortfolio}
                placeholder="Enter your portfolio URL"
                placeholderTextColor="#8e8e8e"
                keyboardType="url"
            />
        </View>
    </>
);

    const renderClientFields = () => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Company Name</Text>
            <TextInput
                style={styles.input}
                value={companyName}
                onChangeText={setCompanyName}
                placeholder="Enter your company name"
                placeholderTextColor="#8e8e8e"
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Update Profile</Text>
            </View>

            {initialLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0095f6" />
                    <Text style={styles.loadingText}>Loading profile...</Text>
                </View>
            ) : (
                <ScrollView style={styles.content}>
                    <View style={styles.profileHeader}>
                        <MaterialCommunityIcons name="account-edit" size={40} color="#0095f6" />
                        <Text style={styles.profileHeaderText}>Edit Your Profile</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                            placeholderTextColor="#8e8e8e"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Bio</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Write something about yourself"
                            placeholderTextColor="#8e8e8e"
                            multiline
                            numberOfLines={4}
                        />
                    </View>

                    {userType === 'Freelancer' ? renderFreelancerFields() : renderClientFields()}

                    <TouchableOpacity 
                        style={[styles.updateButton, loading && styles.disabledButton]}
                        onPress={handleUpdate}
                        disabled={loading}
                    >
                        {loading ? (
                            <View style={styles.buttonContent}>
                                <ActivityIndicator size="small" color="#fff" />
                                <Text style={[styles.updateButtonText, styles.loadingButtonText]}>
                                    Updating...
                                </Text>
                            </View>
                        ) : (
                            <Text style={styles.updateButtonText}>Update Profile</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            )}
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
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    updateButton: {
        backgroundColor: '#0095f6',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    disabledButton: {
        opacity: 0.7,
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#8e8e8e',
        marginTop: 10,
        fontSize: 16,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profileHeaderText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    helperText: {
        color: '#8e8e8e',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingButtonText: {
        marginLeft: 10,
    },
});