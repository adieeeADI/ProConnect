import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Alert, 
    StyleSheet, 
    ScrollView,
    BackHandler
} from 'react-native'
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AddProject({ navigation }) {
    const [projectTitle, setProjectTitle] = useState('');
    const [description, setDescription] = useState('');
    const [technologies, setTechnologies] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [liveLink, setLiveLink] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const addProject = async () => {
        const user = auth().currentUser;
        if (!user) {
            Alert.alert("Error", "You must be logged in to add a project.");
            return;
        }

        if (!projectTitle || !description || !technologies) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

        const projectData = {
            projectTitle,
            description,
            technologies,
            githubLink,
            liveLink,
            imageUrl,
            freelancerId: user.uid,
            createdAt: new Date().toISOString(),
        };

        try {
            const newProjectRef = database().ref('projects').push();
            await newProjectRef.set(projectData);

            Alert.alert("Success", "Project added successfully!");
            navigation.replace('BottomTabNavigator', { screen: 'Home' });
        } catch (error) {
            Alert.alert("Error", "Failed to add project. Please try again.");
            console.error("Project Add Error:", error);
        }
    };
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.replace('BottomTabNavigator', { screen: 'Home' });
            return true;
        });
        return () => backHandler.remove();
    }, [navigation]);
    
    // Update the header back button
    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => navigation.replace('BottomTabNavigator', { screen: 'Home' })}
                    >
                        <MaterialCommunityIcons 
                            name="arrow-left" 
                            size={24} 
                            color="#fff" 
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Add New Project</Text>
                    <View style={styles.headerRight} />
                </View>
    
                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Project Title*</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter project title"
                            placeholderTextColor="#8e8e8e"
                            value={projectTitle}
                            onChangeText={setProjectTitle}
                        />
                    </View>
    
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Description*</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Describe your project"
                            placeholderTextColor="#8e8e8e"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={4}
                        />
                    </View>
    
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Technologies Used*</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., React Native, Node.js, Firebase"
                            placeholderTextColor="#8e8e8e"
                            value={technologies}
                            onChangeText={setTechnologies}
                        />
                    </View>
    
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>GitHub Link</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="https://github.com/your-project"
                            placeholderTextColor="#8e8e8e"
                            value={githubLink}
                            onChangeText={setGithubLink}
                        />
                    </View>
    
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Live Demo Link</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="https://your-project.com"
                            placeholderTextColor="#8e8e8e"
                            value={liveLink}
                            onChangeText={setLiveLink}
                        />
                    </View>
    
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Project Image URL</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter image URL"
                            placeholderTextColor="#8e8e8e"
                            value={imageUrl}
                            onChangeText={setImageUrl}
                        />
                    </View>
    
                    <TouchableOpacity style={styles.button} onPress={addProject}>
                        <MaterialCommunityIcons name="plus-circle" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Add Project</Text>
                    </TouchableOpacity>
                </View>
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
    // Add to existing StyleSheet
headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
    backgroundColor: '#121212',
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
    width: 40, // For layout balance
},
});