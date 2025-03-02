import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Pressable } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomePage from './HomePage';
import ClientJobAdd from '../screens/ClientJobAdd';
import ChatList from '../screens/ChatList';
import Settings from '../screens/Settings';

const Tab = createBottomTabNavigator();

const TabIcon = ({ focused, iconName }) => (
    <View style={styles.iconContainer}>
        <MaterialCommunityIcons 
            name={iconName} 
            size={24}
            color={focused ? '#0095f6' : '#8e8e8e'}
            style={[styles.icon, focused && styles.activeIcon]}
        />
        {focused && <View style={styles.indicator} />}
    </View>
);

const CustomAlert = ({ visible, onClose, onConfirm }) => (
    <Modal
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
        animationType="fade"
    >
        <Pressable style={styles.modalOverlay} onPress={onClose}>
            <View style={styles.alertContainer}>
                <Text style={styles.alertTitle}>Confirm Logout</Text>
                <Text style={styles.alertMessage}>Do you really want to log out?</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={[styles.alertButton, styles.cancelButton]} 
                        onPress={onClose}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.alertButton, styles.logoutButton]} 
                        onPress={onConfirm}
                    >
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Pressable>
    </Modal>
);

export default function BottomTabNavigator({ navigation, handleLogout }) {
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);

    return (
        <>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused }) => {
                        let iconName;
                        switch (route.name) {
                            case 'Home':
                                iconName = 'home-variant';
                                break;
                            case 'Profile':
                                iconName = 'account-circle-outline';
                                break;
                            case 'Add':
                                iconName = 'plus-circle-outline';
                                break;
                            case 'Chats':
                                iconName = 'message-text-outline';
                                break;
                            case 'Logout':
                                iconName = 'logout-variant';
                                break;
                            default:
                                iconName = 'circle';
                        }
                        return <TabIcon focused={focused} iconName={iconName} />;
                    },
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 60,
                        backgroundColor: '#262626',
                        borderTopWidth: 0,
                        paddingBottom: 5,
                        ...styles.shadow
                    },
                     // Add this to create space for the tab bar
                     contentStyle: {
                        backgroundColor: 'transparent',
                    },
                    // Add bottom padding to prevent content overlap
                    tabBarItemStyle: {
                        padding: 5,
                    },
                    // Add safe area bottom padding
                    safeAreaInsets: { bottom: 0 },
                })}
            >
                <Tab.Screen name="Home" component={HomePage} />
                <Tab.Screen name="Profile" component={Settings} />
                <Tab.Screen name="Add" component={ClientJobAdd} />
                <Tab.Screen name="Chats" component={ChatList} />
                <Tab.Screen
                    name="Logout"
                    component={() => null}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                            setShowLogoutAlert(true);
                        },
                    }}
                />
            </Tab.Navigator>
            
            <CustomAlert
                visible={showLogoutAlert}
                onClose={() => setShowLogoutAlert(false)}
                onConfirm={() => {
                    setShowLogoutAlert(false);
                    handleLogout(navigation);
                }}
            />
        </>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 5
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: 50,
    },
    icon: {
        marginBottom: 4,
    },
    activeIcon: {
        transform: [{scale: 1.1}],
    },
    indicator: {
        position: 'absolute',
        bottom: 0,
        height: 2,
        width: 20,
        backgroundColor: '#0095f6',
        borderRadius: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertContainer: {
        backgroundColor: '#262626',
        borderRadius: 15,
        padding: 20,
        width: '80%',
        maxWidth: 300,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#363636',
    },
    alertTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    alertMessage: {
        color: '#8e8e8e',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        gap: 10,
    },
    alertButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#363636',
    },
    logoutButton: {
        backgroundColor: '#FF375F',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    }
});