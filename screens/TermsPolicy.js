import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const PolicySection = ({ title, content }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionContent}>{content}</Text>
    </View>
);

export default function TermsPolicy({ navigation }) {
    const policies = [
        {
            title: "1. User Agreement",
            content: "By accessing and using ProConnect, you agree to comply with and be bound by these terms and conditions. If you disagree with any part of these terms, you may not access our services."
        },
        {
            title: "2. Privacy Policy",
            content: "We respect your privacy and are committed to protecting your personal data. We collect and process information in accordance with our Privacy Policy, which is an integral part of these terms."
        },
        {
            title: "3. User Conduct",
            content: "Users must maintain professional conduct, provide accurate information, and respect other users. Any form of harassment, spam, or fraudulent activity is strictly prohibited."
        },
        {
            title: "4. Payment Terms",
            content: "Subscription payments are processed securely through our payment partners. Refunds are subject to our refund policy and must be requested within 14 days of purchase."
        },
        {
            title: "5. Intellectual Property",
            content: "All content, features, and functionality of ProConnect are owned by us and are protected by international copyright, trademark, and other intellectual property laws."
        },
        {
            title: "6. Limitation of Liability",
            content: "ProConnect is provided 'as is' without any warranties. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages."
        }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Terms & Policy</Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.introSection}>
                    <MaterialCommunityIcons name="shield-check" size={40} color="#0095f6" />
                    <Text style={styles.introTitle}>Our Commitment</Text>
                    <Text style={styles.introText}>
                        We are committed to protecting your rights and providing a safe, 
                        professional environment for all users.
                    </Text>
                </View>

                <View style={styles.divider} />

                {policies.map((policy, index) => (
                    <PolicySection 
                        key={index}
                        title={policy.title}
                        content={policy.content}
                    />
                ))}

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Last updated: March 2024
                    </Text>
                    <Text style={styles.footerVersion}>
                        Version 1.0.0
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 40,
        backgroundColor: '#000',
        borderBottomWidth: 0.5,
        borderBottomColor: '#262626',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 15,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    introSection: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#262626',
        borderRadius: 15,
        marginBottom: 30,
    },
    introTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 15,
        marginBottom: 10,
    },
    introText: {
        color: '#8e8e8e',
        textAlign: 'center',
        lineHeight: 22,
    },
    divider: {
        height: 1,
        backgroundColor: '#262626',
        marginVertical: 20,
    },
    section: {
        marginBottom: 25,
        backgroundColor: '#262626',
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#363636',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    sectionContent: {
        color: '#8e8e8e',
        lineHeight: 22,
    },
    footer: {
        marginTop: 30,
        marginBottom: 50,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#262626',
        borderRadius: 12,
    },
    footerText: {
        color: '#8e8e8e',
        marginBottom: 5,
    },
    footerVersion: {
        color: '#0095f6',
        fontWeight: '600',
    }
});