import React, { useState,useEffect } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    Alert,
    ScrollView,
    Image
} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export default function FreelancerDetails({ route, navigation }) {
    const { freelancer } = route.params;
    const [inviting, setInviting] = useState(false);
    const [projects, setProjects] = useState([]);
    useEffect(() => {
        const fetchProjects = async () => {
            const projectsRef = database()
                .ref('projects')
                .orderByChild('freelancerId')
                .equalTo(freelancer.id);

            projectsRef.on('value', snapshot => {
                const projectsData = [];
                snapshot.forEach(child => {
                    projectsData.push({
                        id: child.key,
                        ...child.val()
                    });
                });
                setProjects(projectsData);
            });

            return () => projectsRef.off();
        };

        fetchProjects();
    }, [freelancer.id]);
    const ProjectCard = ({ project }) => (
        <View style={styles.projectCard}>
            {project.imageUrl && (
                <Image 
                    source={{ uri: project.imageUrl }} 
                    style={styles.projectImage}
                />
            )}
            <View style={styles.projectContent}>
                <Text style={styles.projectTitle}>{project.projectTitle}</Text>
                <Text style={styles.projectDescription} numberOfLines={2}>
                    {project.description}
                </Text>
                <View style={styles.techContainer}>
                    {project.technologies.split(',').map((tech, index) => (
                        <View key={index} style={styles.techBadge}>
                            <Text style={styles.techText}>{tech.trim()}</Text>
                        </View>
                    ))}
                </View>
                {project.githubLink && (
                    <TouchableOpacity 
                        style={styles.projectLink}
                        onPress={() => Linking.openURL(project.githubLink)}
                    >
                        <MaterialCommunityIcons name="github" size={20} color="#0095f6" />
                        <Text style={styles.linkText}>View on GitHub</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const handleInvite = async () => {
        const user = auth().currentUser;
        if (!user) return Alert.alert('Error', 'You must be logged in.');

        setInviting(true);
        const inviteRef = database().ref('/invites').push();
        const inviteData = {
            clientId: user.uid,
            freelancerId: freelancer.id,
            freelancerName: freelancer.name,
            clientName: user.displayName || 'Client',
            timestamp: Date.now(),
            status: 'pending',
        };

        try {
            await inviteRef.set(inviteData);
            Alert.alert('Success', 'Invite sent successfully!');
            navigation.goBack(); // Navigate back to HomePage
        } catch (error) {
            console.error('Error sending invite:', error);
            Alert.alert('Error', 'Failed to send invite. Try again.');
        } finally {
            setInviting(false);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Image
                            source={{ uri: freelancer.profileImage || 'https://via.placeholder.com/150' }}
                            style={styles.profileImage}
                        />
                        <Text style={styles.name}>{freelancer.name || 'Name not available'}</Text>
                        {freelancer.rating && (
                            <View style={styles.ratingContainer}>
                                <MaterialCommunityIcons name="star" size={20} color="#FFD700" />
                                <Text style={styles.rating}>{freelancer.rating}</Text>
                            </View>
                        )}
                    </View>
    
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="briefcase-outline" size={24} color="#0095f6" />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Experience</Text>
                                <Text style={styles.infoText}>
                                    {freelancer.experience || 'Experience not specified'}
                                </Text>
                            </View>
                        </View>
    
                        <View style={styles.infoRow}>
                            <MaterialCommunityIcons name="currency-usd" size={24} color="#0095f6" />
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Hourly Rate</Text>
                                <Text style={styles.infoText}>
                                    {freelancer.rate ? `$${freelancer.rate}/hr` : 'Rate not specified'}
                                </Text>
                            </View>
                        </View>
    
                        <View style={styles.skillsContainer}>
                            <Text style={styles.skillsTitle}>Skills</Text>
                            <View style={styles.skillsWrapper}>
                                {freelancer.skills ? (
                                    freelancer.skills.split(',').map((skill, index) => (
                                        <View key={index} style={styles.skillBadge}>
                                            <Text style={styles.skillText}>{skill.trim()}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.noDataText}>No skills listed</Text>
                                )}
                            </View>
                        </View>
    
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.descriptionTitle}>About</Text>
                            <Text style={styles.descriptionText}>
                                {freelancer.bio || 'No description available'}
                            </Text>
                        </View>
    
                        <View style={styles.projectsSection}>
                            <Text style={styles.sectionTitle}>Projects</Text>
                            {projects.length > 0 ? (
                                projects.map(project => (
                                    <ProjectCard key={project.id} project={project} />
                                ))
                            ) : (
                                <Text style={styles.noDataText}>No projects available</Text>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>
    
            {/* Floating Invite Button */}
            <View style={styles.floatingButtonContainer}>
                <TouchableOpacity 
                    style={[styles.inviteButton, inviting && styles.invitingButton]} 
                    onPress={handleInvite} 
                    disabled={inviting}
                >
                    {inviting ? (
                        <MaterialCommunityIcons name="loading" size={24} color="#fff" />
                    ) : (
                        <>
                            <MaterialCommunityIcons name="send" size={24} color="#fff" />
                            <Text style={styles.inviteButtonText}>Send Invite</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#121212',
    },
    mainContainer: {
        flex: 1,
        backgroundColor: '#121212',
    },
    container: {
        padding: 20,
        paddingBottom: 100, // Extra padding to prevent content from being hidden behind floating button
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    floatingButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: '#121212',
        borderTopWidth: 1,
        borderTopColor: '#262626',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 16,
        borderWidth: 3,
        borderColor: '#0095f6',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    rating: {
        color: '#fff',
        fontSize: 16,
    },
    infoCard: {
        backgroundColor: '#262626',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#363636',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoContent: {
        marginLeft: 12,
    },
    infoLabel: {
        color: '#8e8e8e',
        fontSize: 14,
    },
    infoText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    skillsContainer: {
        marginTop: 16,
    },
    skillsTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    skillsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillBadge: {
        backgroundColor: '#363636',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    skillText: {
        color: '#0095f6',
        fontSize: 14,
    },
    descriptionContainer: {
        marginTop: 20,
    },
    descriptionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    descriptionText: {
        color: '#8e8e8e',
        fontSize: 16,
        lineHeight: 24,
    },
    inviteButton: {
        backgroundColor: '#0095f6',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    invitingButton: {
        backgroundColor: '#0077c3',
    },
    inviteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    projectsSection: {
        marginTop: 24,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 16,
    },
    projectCard: {
        backgroundColor: '#262626',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#363636',
    },
    projectImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#363636',
    },
    projectContent: {
        padding: 16,
    },
    projectTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 8,
    },
    projectDescription: {
        color: '#8e8e8e',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
    },
    techContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    techBadge: {
        backgroundColor: '#363636',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 16,
    },
    techText: {
        color: '#0095f6',
        fontSize: 12,
    },
    projectLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    linkText: {
        color: '#0095f6',
        fontSize: 14,
        fontWeight: '500',
    }
});