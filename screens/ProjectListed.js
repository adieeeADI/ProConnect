import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Image,
    Linking
} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

export default function ProjectListed({ navigation }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth().currentUser;
        if (!user) {
            Alert.alert('Error', 'You must be logged in to view your projects');
            navigation.goBack();
            return;
        }

        const projectsRef = database()
            .ref('projects')
            .orderByChild('freelancerId')
            .equalTo(user.uid);

        projectsRef.on('value', snapshot => {
            const projectsData = [];
            snapshot.forEach(child => {
                projectsData.push({
                    id: child.key,
                    ...child.val()
                });
            });
            setProjects(projectsData.reverse());
            setLoading(false);
        });

        return () => projectsRef.off();
    }, []);

    const handleDelete = async (projectId) => {
        Alert.alert(
            "Delete Project",
            "Are you sure you want to delete this project?",
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
                            await database().ref(`projects/${projectId}`).remove();
                            Alert.alert("Success", "Project deleted successfully");
                        } catch (error) {
                            console.error('Error deleting project:', error);
                            Alert.alert("Error", "Failed to delete project");
                        }
                    }
                }
            ]
        );
    };

    const ProjectCard = ({ project }) => (
        <LinearGradient
            colors={['#262626', '#1a1a1a']}
            style={styles.projectCard}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
        >
            {project.imageUrl && (
                <Image 
                    source={{ uri: project.imageUrl }} 
                    style={styles.projectImage}
                    resizeMode="cover"
                />
            )}
            <View style={styles.projectContent}>
                <View style={styles.projectHeader}>
                    <Text style={styles.projectTitle}>{project.projectTitle}</Text>
                    <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => handleDelete(project.id)}
                    >
                        <MaterialCommunityIcons 
                            name="delete-outline" 
                            size={24} 
                            color="#ff4444" 
                        />
                    </TouchableOpacity>
                </View>

                <Text style={styles.description} numberOfLines={2}>
                    {project.description}
                </Text>

                <View style={styles.techContainer}>
                    {project.technologies.split(',').map((tech, index) => (
                        <LinearGradient
                            key={index}
                            colors={['#0095f6', '#00729c']}
                            style={styles.techBadge}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                        >
                            <Text style={styles.techText}>{tech.trim()}</Text>
                        </LinearGradient>
                    ))}
                </View>

                <View style={styles.linkContainer}>
                    {project.githubLink && (
                        <TouchableOpacity 
                            style={[styles.link, styles.linkButton]}
                            onPress={() => Linking.openURL(project.githubLink)}
                        >
                            <MaterialCommunityIcons name="github" size={20} color="#fff" />
                            <Text style={styles.linkText}>GitHub</Text>
                        </TouchableOpacity>
                    )}
                    {project.liveLink && (
                        <TouchableOpacity 
                            style={[styles.link, styles.linkButton]}
                            onPress={() => Linking.openURL(project.liveLink)}
                        >
                            <MaterialCommunityIcons name="web" size={20} color="#fff" />
                            <Text style={styles.linkText}>Live Demo</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <Text style={styles.dateText}>
                    Added on: {new Date(project.createdAt).toLocaleDateString()}
                </Text>
            </View>
        </LinearGradient>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#121212', '#1a1a1a']}
                style={styles.header}
            >
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
                <Text style={styles.headerTitle}>My Projects</Text>
                <View style={styles.headerRight} />
            </LinearGradient>

            <ScrollView style={styles.scrollView}>
                {loading ? (
                    <Text style={styles.loadingText}>Loading projects...</Text>
                ) : projects.length > 0 ? (
                    projects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))
                ) : (
                    <Text style={styles.noProjectsText}>No projects added yet</Text>
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
        elevation: 4,
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
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    headerRight: {
        width: 40,
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    projectCard: {
        borderRadius: 16,
        marginBottom: 20,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    projectImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#363636',
    },
    projectContent: {
        padding: 16,
    },
    projectHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    projectTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
        flex: 1,
    },
    deleteButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255,68,68,0.1)',
    },
    description: {
        color: '#8e8e8e',
        marginBottom: 16,
        lineHeight: 20,
    },
    techContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    techBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    techText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    linkContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    link: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    linkButton: {
        backgroundColor: '#363636',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    linkText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
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
    noProjectsText: {
        color: '#8e8e8e',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    }
});