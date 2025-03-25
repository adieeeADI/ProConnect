import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    ScrollView
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Settings({ navigation }) {
    const menuItems = [
        {
            title: 'Update Profile',
            icon: 'account-edit',
            onPress: () => navigation.navigate('UpdateProfile'),
        },
        {
            title: 'Buy Subscription',
            icon: 'crown',
            onPress: () => navigation.navigate('Subscription'),
        },
        {
            title: 'Manage Account',
            icon: 'account-cog',
            onPress: () => navigation.navigate('ManageAccount'),
        },
        {
            title: 'Terms & Policy',
            icon: 'file-document-outline',
            onPress: () => navigation.navigate('TermsPolicy'),
        },
    ];

    const MenuItem = ({ item }) => (
        <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
            <View style={styles.menuItemContent}>
                <MaterialCommunityIcons name={item.icon} size={24} color="#fff" />
                <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#8e8e8e" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <ScrollView>
                {menuItems.map((item, index) => (
                    <MenuItem key={index} item={item} />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
        marginTop: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#262626',
    },
    menuItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 15,
    }
});