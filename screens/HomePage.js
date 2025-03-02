import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    TextInput, 
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    StatusBar,
    Animated
} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomePage({ navigation }) {
    const [userType, setUserType] = useState('');
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userName, setUserName] = useState('');
    const scrollY = new Animated.Value(0);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const user = auth().currentUser;
            if (user) {
                const userSnapshot = await database().ref(`/users/${user.uid}`).once('value');
                if (userSnapshot.exists()) {
                    const userData = userSnapshot.val();
                    setUserType(userData.userType || '');
                    setUserName(userData.name || '');
                    await fetchData(userData.userType);
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async (type) => {
        let ref = type === 'Freelancer' ? 'jobs' : 'users';
        try {
            const snapshot = await database().ref(ref).once('value');
            if (snapshot.exists()) {
                const values = snapshot.val();
                const dataArray = Object.entries(values).map(([id, value]) => ({
                    id,
                    title: value.title || '',
                    name: value.name || '',
                    budget: value.budget || 0,
                    skills: value.skills || '',
                    rate: value.rate || 0,
                    description: value.description || '',
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

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUserData();
        setRefreshing(false);
    };

    const renderHeader = () => (
        <Animated.View
            style={[
                styles.headerContainer,
                {
                    opacity: scrollY.interpolate({
                        inputRange: [0, 100],
                        outputRange: [1, 0.9],
                        extrapolate: 'clamp',
                    }),
                },
            ]}
        >
            <LinearGradient
                colors={['#000', '#1a1a1a']}
                style={styles.headerGradient}
            >
               <View style={styles.headerTop}>
    <View>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.userName}>{userName}</Text>
    </View>
    <TouchableOpacity 
        style={styles.notificationButton}
        onPress={() => navigation.navigate(
            userType === 'Client' ? 'JobListed' : 'ProjectListed'
        )}
    >
        <MaterialCommunityIcons 
            name={userType === 'Client' ? 'briefcase-outline' : 'folder-outline'} 
            size={24} 
            color="#fff" 
        />
    </TouchableOpacity>
</View>

                <View style={styles.searchContainer}>
                    <MaterialCommunityIcons name="magnify" size={24} color="#8e8e8e" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={`Search ${userType === 'Freelancer' ? 'jobs' : 'freelancers'}...`}
                        placeholderTextColor="#8e8e8e"
                        value={search}
                        onChangeText={setSearch}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch('')}>
                            <MaterialCommunityIcons name="close-circle" size={20} color="#8e8e8e" />
                        </TouchableOpacity>
                    )}
                </View>
            </LinearGradient>
        </Animated.View>
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate(
                userType === 'Client' ? 'FreelancerDetails' : 'JobDetails',
                { [userType === 'Client' ? 'freelancer' : 'job']: item }
            )}
        >
            <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                    <Text style={styles.cardTitle}>
                        {userType === 'Freelancer' ? item.title : item.name}
                    </Text>
                    {userType === 'Freelancer' ? (
                        <View style={styles.budgetContainer}>
                            <MaterialCommunityIcons name="currency-usd" size={16} color="#2ecc71" />
                            <Text style={styles.budgetText}>{item.budget}</Text>
                        </View>
                    ) : (
                        <View style={styles.rateContainer}>
                            <Text style={styles.rateText}>${item.rate}/hr</Text>
                        </View>
                    )}
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#8e8e8e" />
            </View>

            <View style={styles.skillsContainer}>
                {(item.skills || '').split(',').map((skill, index) => (
                    skill.trim() && (
                        <View key={index} style={styles.skillBadge}>
                            <Text style={styles.skillText}>{skill.trim()}</Text>
                        </View>
                    )
                ))}
            </View>

            <Text style={styles.description} numberOfLines={3}>
                {item.bio || 'No description provided'}
            </Text>

            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate(
                    userType === 'Client' ? 'FreelancerDetails' : 'JobDetails',
                    { [userType === 'Client' ? 'freelancer' : 'job']: item }
                )}
            >
                <MaterialCommunityIcons 
                    name={userType === 'Client' ? 'send' : 'briefcase-outline'} 
                    size={20} 
                    color="#fff" 
                />
                <Text style={styles.buttonText}>
                    {userType === 'Client' ? 'Send Invitation' : 'View Details'}
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0095f6" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <FlatList
                data={data.filter(item => {
                    const searchTerm = search.toLowerCase();
                    return userType === 'Freelancer'
                        ? (item.title || '').toLowerCase().includes(searchTerm) ||
                          (item.description || '').toLowerCase().includes(searchTerm)
                        : (item.name || '').toLowerCase().includes(searchTerm) ||
                          (item.skills || '').toLowerCase().includes(searchTerm);
                })}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContainer}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#0095f6"
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons 
                            name={userType === 'Freelancer' ? 'briefcase-search' : 'account-search'} 
                            size={48} 
                            color="#8e8e8e" 
                        />
                        <Text style={styles.emptyText}>
                            No {userType === 'Freelancer' ? 'jobs' : 'freelancers'} found
                        </Text>
                    </View>
                }
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingBottom: 60,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    headerContainer: {
        backgroundColor: '#000',
        zIndex: 1,
    },
    headerGradient: {
        padding: 20,
        paddingTop: 60,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 16,
        color: '#8e8e8e',
        marginBottom: 4,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    notificationButton: {
        padding: 12,
        backgroundColor: '#262626',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#363636',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#262626',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#363636',
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#fff',
    },
    listContainer: {
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: '#262626',
        borderRadius: 16,
        marginVertical: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: '#363636',
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardHeaderLeft: {
        flex: 1,
        marginRight: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    budgetContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    budgetText: {
        color: '#2ecc71',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 4,
    },
    rateContainer: {
        backgroundColor: '#363636',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    rateText: {
        color: '#2ecc71',
        fontSize: 14,
        fontWeight: '600',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    skillBadge: {
        backgroundColor: '#363636',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#454545',
    },
    skillText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    description: {
        color: '#8e8e8e',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0095f6',
        padding: 12,
        borderRadius: 12,
        gap: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#8e8e8e',
        marginTop: 12,
        textAlign: 'center',
    }
});
