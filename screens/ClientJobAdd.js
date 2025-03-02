import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Profile({ navigation }) {
    const [userType, setUserType] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [skills, setSkills] = useState('');
    const [budget, setBudget] = useState('');
    const [jobType, setJobType] = useState('');
    const [duration, setDuration] = useState('');

    useEffect(() => {
        const fetchUserType = async () => {
            const user = auth().currentUser;
            if (user) {
                const userSnapshot = await database().ref(`/users/${user.uid}`).once('value');
                if (userSnapshot.exists()) {
                    const type = userSnapshot.val().userType;
                    setUserType(type);
                    if (type === 'Freelancer') {
                        navigation.replace('AddProject'); // Using replace instead of navigate
                    }
                }
            }
        };
        fetchUserType();
    }, [navigation]);

   

    
    const postJob = async () => {
        const user = auth().currentUser;
        if (!user) {
            Alert.alert("Error", "You must be logged in to post a job.");
            return;
        }

        if (!title || !description || !skills || !budget || !jobType || !duration) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }

        const jobData = {
            title,
            description,
            skills,
            budget: parseFloat(budget),
            jobType,
            duration,
            clientId: user.uid,
            createdAt: new Date().toISOString(),
        };

        try {
            const newJobRef = database().ref('jobs').push();
            await newJobRef.set(jobData);

            Alert.alert("Success", "Job posted successfully!");
            setTitle('');
            setDescription('');
            setSkills('');
            setBudget('');
            setJobType('');
            setDuration('');
        } catch (error) {
            Alert.alert("Error", "Failed to post job. Please try again.");
            console.error("Job Post Error:", error);
        }
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <MaterialCommunityIcons name="briefcase-plus" size={30} color="#0095f6" />
                    <Text style={styles.header}>Post a New Job</Text>
                </View>

                {userType === 'Freelancer' ? (
                    <View style={styles.warningContainer}>
                        <MaterialCommunityIcons name="alert-circle" size={24} color="#FF375F" />
                        <Text style={styles.warning}>You are logged in as a Freelancer</Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('BottomTabNavigator')}
                        >
                            <Text style={styles.buttonText}>Browse Jobs</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Job Title</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter job title"
                                placeholderTextColor="#8e8e8e"
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Describe the job requirements"
                                placeholderTextColor="#8e8e8e"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Required Skills</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., React Native, Firebase, UI/UX"
                                placeholderTextColor="#8e8e8e"
                                value={skills}
                                onChangeText={setSkills}
                            />
                        </View>

                        <View style={styles.rowInputs}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                                <Text style={styles.label}>Budget ($)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0.00"
                                    placeholderTextColor="#8e8e8e"
                                    value={budget}
                                    onChangeText={setBudget}
                                    keyboardType="numeric"
                                />
                            </View>

                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Duration</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g., 2 weeks"
                                    placeholderTextColor="#8e8e8e"
                                    value={duration}
                                    onChangeText={setDuration}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Job Type</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Fixed/Hourly"
                                placeholderTextColor="#8e8e8e"
                                value={jobType}
                                onChangeText={setJobType}
                            />
                        </View>

                        <TouchableOpacity style={styles.button} onPress={postJob}>
                            <MaterialCommunityIcons name="plus-circle" size={20} color="#fff" />
                            <Text style={styles.buttonText}>Post Job</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#121212',
    },
    container: {
        flex: 1,
        padding: 20,
        paddingBottom: 80,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 10,
    },
    formContainer: {
        gap: 15,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#262626',
        padding: 15,
        borderRadius: 12,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#363636',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    rowInputs: {
        flexDirection: 'row',
        gap: 10,
    },
    button: {
        backgroundColor: '#0095f6',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    warningContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        gap: 15,
    },
    warning: {
        fontSize: 16,
        color: '#FF375F',
        textAlign: 'center',
        marginTop: 10,
    }
});