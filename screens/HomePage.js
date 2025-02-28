import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomePage({ navigation }) {
    const [userType, setUserType] = useState('');
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchUserType = async () => {
            const user = auth().currentUser;
            if (user) {
                const userSnapshot = await database().ref(`/users/${user.uid}`).once('value');
                if (userSnapshot.exists()) {
                    const userData = userSnapshot.val();
                    const userTypeValue = userData.userType || '';
                    setUserType(userTypeValue);
                    fetchData(userTypeValue);
                }
            }
        };
        fetchUserType();
    }, []);

    const fetchData = async (type) => {
        let ref = type === 'Freelancer' ? 'jobs' : 'users';
        try {
            const snapshot = await database().ref(ref).once('value');
            const value = snapshot.val();
            if (snapshot.exists() && value) {
                const dataArray = Object.entries(value).map(([id, value]) => ({
                    id,
                    title: value.title || '',
                    name: value.name || '',
                    budget: value.budget || 0,
                    skills: value.skills || '',
                    rate: value.rate || 0,
                    ...value
                }));

                const sortedData = type === 'Freelancer'
                    ? dataArray.sort((a, b) => (b.budget || 0) - (a.budget || 0))
                    : dataArray
                        .filter(item => item.userType === 'Freelancer')
                        .sort((a, b) => (b.rate || 0) - (a.rate || 0));

                setData(sortedData);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>
                {userType === 'Freelancer' ? item.title || 'No Title' : item.name || 'No Name'}
            </Text>
            <Text style={styles.cardText}>
                {userType === 'Freelancer' ? `Budget: $${item.budget || 0}` : `Skills: ${item.skills || 'None Listed'}`}
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    console.log('Button pressed for item:', item.id);
                }}
            >
                <Text style={styles.buttonText}>
                    {userType === 'Freelancer' ? 'Apply' : 'Invite'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {userType === 'Freelancer' ? 'Recommended Jobs' : 'Available Freelancers'}
                </Text>
            </View>

            <TextInput
                style={styles.searchBar}
                placeholder="Search..."
                value={search}
                onChangeText={setSearch}
                placeholderTextColor="#999"
            />

            <FlatList
                data={data.filter(item => userType === 'Freelancer'
                    ? (item.title || '').toLowerCase().includes(search.toLowerCase())
                    : (item.name || '').toLowerCase().includes(search.toLowerCase())
                )}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No items found</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f7f7f7'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical: 10
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333'
    },
    searchBar: {
        width: '100%',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 20,
        backgroundColor: '#fff',
        fontSize: 16
    },
    card: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#eee'
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8
    },
    cardText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 12
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center'
    }
});
