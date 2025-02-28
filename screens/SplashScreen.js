import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

export default function SplashScreen({ navigation }) {
    useEffect(() => {
        let timeoutId; // Store the timeout ID

        const checkLoginStatus = async () => {
            try {
                const user = auth().currentUser;
                if (user) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'BottomTabNavigator' }], // ✅ Correct format
                    });
                } else {
                    const storedLoginStatus = await AsyncStorage.getItem('isLoggedIn');
                    if (storedLoginStatus === 'true') {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'BottomTabNavigator' }], // ✅ Correct format
                        });
                    } else {
                        timeoutId = setTimeout(() => navigation.replace('LoginPage'), 3000); // Store ID
                    }
                }
            } catch (error) {
                console.error("Error checking login status:", error);
                timeoutId = setTimeout(() => navigation.replace('LoginPage'), 3000); // Store ID
            }
        };

        checkLoginStatus();

        return () => { // Cleanup function!
            if (timeoutId) {
                clearTimeout(timeoutId); // Clear timeout if component unmounts
            }
        };
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/splashImage.png')} // Make sure the path is correct
                style={styles.splashImage}
                resizeMode="contain" // Add resizeMode for better image scaling
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#171616', // Or your desired background color
    },
    splashImage: {
        width: 200,
        height: 200,
        // resizeMode: 'contain', // Moved resizeMode here
    },
});