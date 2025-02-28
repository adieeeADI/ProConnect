import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomePage from './HomePage';
import ClientJobAdd from '../screens/ClientJobAdd';  // Adjust the path if needed

const Tab = createBottomTabNavigator(); // ✅ Define the tab navigator

// Dummy Screens
const ProfileScreen = () => (
    <View style={styles.screenContainer}>
        <Text>Profile Screen</Text>
    </View>
);

const SettingsScreen = () => (
    <View style={styles.screenContainer}>
        <Text>Settings Screen</Text>
    </View>
);

// Logout button component
const LogoutButton = ({ onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={styles.logoutButton}
    >
        <Icon name="logout" size={24} color="red" />
        <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
);

export default function BottomTabNavigator({ navigation, handleLogout }) {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Home') iconName = 'home';
                    else if (route.name === 'Profile') iconName = 'person';
                    else if (route.name === 'Settings') iconName = 'settings';
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007BFF',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: '#fff',
                    height: 70,
                    borderRadius: 20,
                    position: 'absolute',
                    left: 20,
                    right: 20,
                    bottom: 10,
                    elevation: 5,
                    paddingBottom: 10,
                },
            })}
        >
            <Tab.Screen name="Home" component={HomePage} />
            <Tab.Screen
    name="Profile"
    component={() => null} // Empty component
    options={{
        tabBarButton: () => (
            <TouchableOpacity
                onPress={() => navigation.navigate('ClientJobAdd')}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                }}
            >
                <Icon name="person" size={24} color="gray" />
                <Text style={{ color: 'gray', fontSize: 12 }}>Profile</Text>
            </TouchableOpacity>
        ),
    }}
/>

            
            <Tab.Screen name="Settings" component={SettingsScreen} />
            
            {/* ✅ Logout Tab */}
            <Tab.Screen
                name="Logout"
                component={() => null} // Empty component
                options={{
                    tabBarButton: () => (
                        <LogoutButton
                            onPress={() =>
                                Alert.alert(
                                    "Confirm Logout",
                                    "Do you really want to log out?",
                                    [
                                        { text: "No", style: "cancel" },
                                        { text: "Yes", onPress: () => handleLogout(navigation) },
                                    ]
                                )
                            }
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    logoutText: {
        fontSize: 12,
        color: 'red',
    },
});
