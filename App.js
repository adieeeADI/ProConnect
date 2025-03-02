import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import SplashScreen from './screens/SplashScreen';
import LoginPage from './screens/LoginPage';
import HomePage from './screens/HomePage';
import CreateAcc from './screens/CreateAcc';
import ClientJobAdd from './screens/ClientJobAdd';
import ProfileSetup from './screens/ProfileSetup';
import BottomTabNavigator from './screens/BottomTabNavigator';
import JobDetails from './screens/JobDetails';  // ✅ Import JobDetails screen
import ChatScreen from './screens/ChatScreen';
import FreelancerDetails from './screens/FreeLancerDetails';
import ChatList from './screens/ChatList';   // ✅ Import FreelancerDetails screen
import Settings from './screens/Settings';
import AddProject from './screens/AddProject';
import JobListed from './screens/JobListed';
import ProjectListed from './screens/ProjectListed';


const Stack = createStackNavigator();

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const storedLoginStatus = await AsyncStorage.getItem('isLoggedIn');
                setIsLoggedIn(storedLoginStatus === 'true');
            } catch (error) {
                console.error('Error checking login status:', error);
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkLoginStatus();
    }, []);

    // ✅ Handle Logout Function
    const handleLogout = async (navigation) => {
        try {
            await auth().signOut();
            await AsyncStorage.removeItem('isLoggedIn');

            navigation.reset({
                index: 0,
                routes: [{ name: "LoginPage" }],
            });
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={isLoggedIn ? "BottomTabNavigator" : "SplashScreen"}>
                <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
                <Stack.Screen name="LoginPage" component={LoginPage} />
                <Stack.Screen name="CreateAcc" component={CreateAcc} />
                <Stack.Screen name="ProfileSetup" component={ProfileSetup} />
                <Stack.Screen name="ClientJobAdd" component={ClientJobAdd} />
                <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: "Chat" }} />
                <Stack.Screen name="FreelancerDetails" component={FreelancerDetails} options={{ title: "Freelancer Details" }} />
                <Stack.Screen name="ChatList" component={ChatList} />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen  name="AddProject" component={AddProject} options={{ headerShown: false }} />
                <Stack.Screen name="ProjectListed" component={ProjectListed}options={{ headerShown: false }}/>
                <Stack.Screen name="JobListed" component={JobListed}options={{ headerShown: false }} />

                
                {/* ✅ Bottom Tab Navigation */}
                <Stack.Screen 
                    name="BottomTabNavigator" 
                    component={(props) => <BottomTabNavigator {...props} handleLogout={handleLogout} />} 
                    options={{ headerShown: false }}
                />

                {/* ✅ Added Job Details Screen */}
                <Stack.Screen name="JobDetails" component={JobDetails} options={{ title: "Job Details" }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
