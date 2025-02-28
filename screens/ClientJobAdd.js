import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

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
                    setUserType(userSnapshot.val().userType);
                }
            }
        };
        fetchUserType();
    }, []);

    if (userType === '') {
        return <Text>Loading...</Text>; // Show a loading state until userType is fetched
    }

    // 🚀 Redirect freelancers to another page
    if (userType === 'Freelancer') {
        return (
            <View style={styles.container}>
                <Text style={styles.warning}>You are logged in as a Freelancer.</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('BottomTabNavigator')} // Redirect to HomePage
                >
                    <Text style={styles.buttonText}>Go to Jobs</Text>
                </TouchableOpacity>
            </View>
        );
    }

    
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
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Profile</Text>
            {userType === 'Client' ? (
                <>
                    <Text style={styles.subHeader}>Post a Job</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Job Title"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Job Description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Skills Required (comma separated)"
                        value={skills}
                        onChangeText={setSkills}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Budget ($)"
                        value={budget}
                        onChangeText={setBudget}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Job Type (Fixed/Hourly)"
                        value={jobType}
                        onChangeText={setJobType}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Duration (e.g., 2 weeks)"
                        value={duration}
                        onChangeText={setDuration}
                    />

                    <TouchableOpacity style={styles.button} onPress={postJob}>
                        <Text style={styles.buttonText}>Post Job</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text style={styles.warning}>Only clients can post jobs.</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    subHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#444',
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 10,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    warning: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});
