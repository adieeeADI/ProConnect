import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileSetup({ navigation }) {
    const [userType, setUserType] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [skills, setSkills] = useState('');
    const [portfolio, setPortfolio] = useState('');
    const [rate, setRate] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [budget, setBudget] = useState('');

    const handleSubmit = async () => {
        if (!userType || !name || !bio) {
            Alert.alert('Error', 'Please fill all required fields.');
            return;
        }

        try {
            const user = auth().currentUser;
            if (!user) {
                Alert.alert('Error', 'User not found. Please login again.');
                return;
            }
            
            await database()
                .ref(`/users/${user.uid}`)
                .set({
                    userType,
                    name,
                    bio,
                    ...(userType === 'Freelancer' && { skills, portfolio, rate }),
                    ...(userType === 'Client' && { companyName, budget })
                });
            
            Alert.alert(
                'Success', 
                'Profile setup complete!',
                [{ text: 'OK', onPress: () => navigation.replace('BottomTabNavigator') }]
            );
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', error.message);
        }
    };

    const renderInput = (icon, placeholder, value, setValue, props = {}) => (
        <View style={styles.inputWrapper}>
            <MaterialCommunityIcons name={icon} size={20} color="#8e8e8e" style={styles.inputIcon} />
            <TextInput 
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#8e8e8e"
                value={value}
                onChangeText={setValue}
                {...props}
            />
        </View>
    );

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView 
                style={styles.scrollView} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <LinearGradient
                    colors={['#000', '#262626']}
                    style={styles.header}
                >
                    <Text style={styles.title}>ProConnect</Text>
                    <Text style={styles.subtitle}>Complete your profile</Text>
                </LinearGradient>

                <View style={styles.formContainer}>
                    <Text style={styles.sectionTitle}>Choose your role</Text>
                    <View style={styles.roleContainer}>
                        <TouchableOpacity 
                            style={[styles.roleButton, userType === 'Freelancer' && styles.selectedRole]} 
                            onPress={() => setUserType('Freelancer')}
                        >
                            <MaterialCommunityIcons 
                                name="account-tie" 
                                size={28} 
                                color={userType === 'Freelancer' ? '#fff' : '#8e8e8e'} 
                            />
                            <Text style={[styles.roleText, userType === 'Freelancer' && styles.selectedText]}>
                                Freelancer
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[styles.roleButton, userType === 'Client' && styles.selectedRole]} 
                            onPress={() => setUserType('Client')}
                        >
                            <MaterialCommunityIcons 
                                name="briefcase" 
                                size={28} 
                                color={userType === 'Client' ? '#fff' : '#8e8e8e'} 
                            />
                            <Text style={[styles.roleText, userType === 'Client' && styles.selectedText]}>
                                Client
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {renderInput('account', 'Full Name', name, setName)}
                    {renderInput('text-box-outline', 'Bio', bio, setBio, {
                        multiline: true,
                        numberOfLines: 4,
                        style: [styles.input, styles.bioInput],
                        textAlignVertical: 'top'
                    })}

                    {userType === 'Freelancer' && (
                        <>
                            {renderInput('tools', 'Skills (comma separated)', skills, setSkills)}
                            {renderInput('link-variant', 'Portfolio Link', portfolio, setPortfolio)}
                            {renderInput('currency-usd', 'Hourly Rate ($)', rate, setRate, {
                                keyboardType: 'numeric'
                            })}
                        </>
                    )}

                    {userType === 'Client' && (
                        <>
                            {renderInput('domain', 'Company Name', companyName, setCompanyName)}
                            {renderInput('cash-multiple', 'Budget Range', budget, setBudget)}
                        </>
                    )}

                    <TouchableOpacity 
                        style={styles.submitButton} 
                        onPress={handleSubmit}
                    >
                        <LinearGradient
                            colors={['#0095f6', '#00d4ff']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.submitText}>Complete Profile</Text>
                            <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        padding: 20,
        paddingTop: 60,
        alignItems: 'center',
    },
    title: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 16,
        color: '#8e8e8e',
        marginBottom: 20,
    },
    formContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
        letterSpacing: 0.5,
    },
    roleContainer: {
        flexDirection: 'row',
        marginBottom: 25,
        gap: 15,
    },
    roleButton: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#262626',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#363636',
        elevation: 2,
    },
    selectedRole: {
        backgroundColor: '#0095f6',
        borderColor: '#0095f6',
    },
    roleText: {
        fontSize: 14,
        color: '#8e8e8e',
        fontWeight: '600',
        marginTop: 8,
    },
    selectedText: {
        color: '#fff',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#262626',
        borderRadius: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#363636',
        elevation: 2,
    },
    inputIcon: {
        padding: 12,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 14,
        paddingVertical: 12,
        paddingRight: 12,
    },
    bioInput: {
        minHeight: 100,
        paddingTop: 12,
    },
    submitButton: {
        marginTop: 20,
        marginBottom: 30,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        gap: 10,
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    }
});