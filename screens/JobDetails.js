import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function JobDetails({ route, navigation }) {
    const { job } = route.params;
    const currentUser = auth().currentUser;
    const [clientName, setClientName] = useState("Loading...");
    useEffect(() => {
        navigation.setOptions({
            headerShown: false, // This hides the default header
        });
    }, [navigation]);
    useEffect(() => {
        if (job.clientId) {
            database()
                .ref(`/users/${job.clientId}/name`)
                .once('value')
                .then(snapshot => {
                    if (snapshot.exists()) {
                        setClientName(snapshot.val());
                    } else {
                        setClientName("Unknown");
                    }
                })
                .catch(error => {
                    console.error("Error fetching client name:", error);
                    setClientName("Unknown");
                });
        }
    }, [job.clientId]);

    const handleApply = async () => {
        if (!currentUser) return;

        const freelancerId = currentUser.uid;
        const clientId = job.clientId;
        let chatId = null;
        const chatRef = database().ref("/chats");

        try {
            const chatSnapshot = await chatRef.once("value");
            if (chatSnapshot.exists()) {
                chatSnapshot.forEach(snapshot => {
                    const chatData = snapshot.val();
                    if (
                        chatData.participants &&
                        ((chatData.participants.clientId === clientId && chatData.participants.freelancerId === freelancerId) ||
                        (chatData.participants.clientId === freelancerId && chatData.participants.freelancerId === clientId))
                    ) {
                        chatId = snapshot.key;
                    }
                });
            }

            if (!chatId) {
                chatId = chatRef.push().key;
                await chatRef.child(chatId).set({
                    participants: { clientId, freelancerId },
                    messages: {},
                    lastMessage: "Freelancer has applied for the job.",
                    timestamp: Date.now(),
                });
            }

            navigation.navigate("ChatScreen", { chatId, clientId, freelancerId });
        } catch (error) {
            console.error("Error creating chat:", error);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Job Details</Text>
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <Text style={styles.title}>{job.title}</Text>
                    
                    <View style={styles.infoSection}>
                        <View style={styles.infoRow}>
                            <Icon name="person" size={20} color="#8e8e8e" />
                            <Text style={styles.labelText}>Posted by:</Text>
                            <Text style={styles.valueText}>{clientName}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Icon name="attach-money" size={20} color="#8e8e8e" />
                            <Text style={styles.labelText}>Budget:</Text>
                            <Text style={styles.valueText}>${job.budget || 0}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Icon name="schedule" size={20} color="#8e8e8e" />
                            <Text style={styles.labelText}>Duration:</Text>
                            <Text style={styles.valueText}>{job.duration || 'Not Specified'}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Icon name="work" size={20} color="#8e8e8e" />
                            <Text style={styles.labelText}>Job Type:</Text>
                            <Text style={styles.valueText}>{job.jobType || 'N/A'}</Text>
                        </View>
                    </View>

                    <View style={styles.descriptionSection}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.descriptionText}>
                            {job.description || 'No Description Available'}
                        </Text>
                    </View>

                    <View style={styles.skillsSection}>
                        <Text style={styles.sectionTitle}>Required Skills</Text>
                        <View style={styles.skillsContainer}>
                            {(job.skills || '').split(',').map((skill, index) => (
                                <View key={index} style={styles.skillChip}>
                                    <Text style={styles.skillText}>{skill.trim()}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                    <Text style={styles.applyButtonText}>Apply for Job</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#000',
        borderBottomWidth: 0.5,
        borderBottomColor: '#262626',
    },
    backButton: {
        marginRight: 15,
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    card: {
        backgroundColor: '#262626',
        borderRadius: 15,
        margin: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#363636',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    infoSection: {
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    labelText: {
        fontSize: 16,
        color: '#8e8e8e',
        marginLeft: 8,
        marginRight: 8,
    },
    valueText: {
        fontSize: 16,
        color: '#fff',
        flex: 1,
    },
    descriptionSection: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#1c1c1c',
        borderRadius: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 16,
        color: '#8e8e8e',
        lineHeight: 24,
    },
    skillsSection: {
        marginBottom: 20,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },
    skillChip: {
        backgroundColor: '#363636',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        margin: 4,
    },
    skillText: {
        color: '#fff',
        fontSize: 14,
    },
    applyButton: {
        backgroundColor: '#0095f6',
        borderRadius: 8,
        padding: 16,
        margin: 20,
        alignItems: 'center',
        marginBottom: 40,
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 20, // Fixed value for Android
        backgroundColor: '#000',
        borderBottomWidth: 0.5,
        borderBottomColor: '#262626',
        elevation: 4, // Android shadow
    },
    backButton: {
        padding: 8, // Increased touch target
        marginRight: 12,
        borderRadius: 20, // Makes touch ripple circular
    },
});