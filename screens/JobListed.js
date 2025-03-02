import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function JobListed({ navigation }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const user = auth().currentUser;
        if (!user) {
            Alert.alert('Error', 'You must be logged in to view your jobs');
            navigation.goBack();
            return;
        }

        const jobsRef = database()
            .ref('jobs')
            .orderByChild('clientId')
            .equalTo(user.uid);

        jobsRef.on('value', snapshot => {
            const jobsData = [];
            snapshot.forEach(child => {
                jobsData.push({
                    id: child.key,
                    ...child.val()
                });
            });
            setJobs(jobsData.reverse()); // Show newest first
            setLoading(false);
        });

        return () => jobsRef.off();
    }, []);
    const handleDelete = async (jobId) => {
        Alert.alert(
            "Delete Job",
            "Are you sure you want to delete this job?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await database().ref(`jobs/${jobId}`).remove();
                            Alert.alert("Success", "Job deleted successfully");
                        } catch (error) {
                            console.error('Error deleting job:', error);
                            Alert.alert("Error", "Failed to delete job");
                        }
                    }
                }
            ]
        );
    };

    const JobCard = ({ job }) => (
        <View style={styles.jobCard}>
            <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <View style={styles.headerActions}>
                    <Text style={styles.budget}>${job.budget}</Text>
                    <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => handleDelete(job.id)}
                    >
                        <MaterialCommunityIcons 
                            name="delete-outline" 
                            size={20} 
                            color="#ff4444" 
                        />
                    </TouchableOpacity>
                </View>
            </View>
            
            <Text style={styles.description} numberOfLines={2}>
                {job.description}
            </Text>
    
            <View style={styles.skillsContainer}>
                {job.skills.split(',').map((skill, index) => (
                    <View key={index} style={styles.skillBadge}>
                        <Text style={styles.skillText}>{skill.trim()}</Text>
                    </View>
                ))}
            </View>
    
            <Text style={styles.dateText}>
                Posted on: {new Date(job.createdAt).toLocaleDateString()}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons 
                        name="arrow-left" 
                        size={24} 
                        color="#fff" 
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Posted Jobs</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.scrollView}>
                {loading ? (
                    <Text style={styles.loadingText}>Loading jobs...</Text>
                ) : jobs.length > 0 ? (
                    jobs.map(job => <JobCard key={job.id} job={job} />)
                ) : (
                    <Text style={styles.noJobsText}>No jobs posted yet</Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#262626',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
    },
    backButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#262626',
    },
    headerRight: {
        width: 40,
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    jobCard: {
        backgroundColor: '#262626',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#363636',
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    jobTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        flex: 1,
    },
    budget: {
        fontSize: 16,
        color: '#0095f6',
        fontWeight: '600',
    },
    description: {
        color: '#8e8e8e',
        marginBottom: 12,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    skillBadge: {
        backgroundColor: '#363636',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
    },
    skillText: {
        color: '#0095f6',
        fontSize: 12,
    },
    dateText: {
        color: '#666',
        fontSize: 12,
    },
    loadingText: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 20,
    },
    noJobsText: {
        color: '#8e8e8e',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    deleteButton: {
        padding: 4,
        borderRadius: 4,
        backgroundColor: '#363636',
    },
});