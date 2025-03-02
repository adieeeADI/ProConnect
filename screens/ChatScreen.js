import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ChatScreen({ route, navigation }) {
    const { chatId, clientId, freelancerId } = route.params || {};  
    const currentUser = auth().currentUser;

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [userNames, setUserNames] = useState({});
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef(null);

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    useEffect(() => {
        if (!chatId) return;

        const chatRef = database().ref(`/chats/${chatId}/messages`);
        chatRef.on('value', (snapshot) => {
            if (snapshot.exists()) {
                const fetchedMessages = Object.values(snapshot.val()).sort((a, b) => a.timestamp - b.timestamp);
                setMessages(fetchedMessages);
                setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
            } else {
                setMessages([]);
            }
        });

        return () => chatRef.off();
    }, [chatId]);

    useEffect(() => {
        async function fetchUserNames() {
            try {
                const userIds = [clientId, freelancerId]; 
                const nameData = {};

                for (const userId of userIds) {
                    const snapshot = await database().ref(`/users/${userId}/name`).once('value');
                    nameData[userId] = snapshot.val() || "Unknown User";
                }

                setUserNames(nameData);
            } catch (error) {
                console.error("Error fetching user names:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchUserNames();
    }, [clientId, freelancerId]);

    const sendMessage = async () => {
        if (!message.trim() || !chatId) return;

        const newMessage = {
            senderId: currentUser?.uid || "Unknown",
            senderName: userNames[currentUser?.uid] || "Unknown User",
            text: message,
            timestamp: Date.now(),
        };

        await database().ref(`/chats/${chatId}/messages`).push(newMessage);
        setMessage("");
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0095f6" style={styles.loader} />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {userNames[currentUser?.uid === clientId ? freelancerId : clientId] || 'Chat'}
                </Text>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={[
                        styles.messageContainer,
                        item.senderId === currentUser?.uid ? styles.myMessageContainer : styles.otherMessageContainer
                    ]}>
                        <Text style={[
                            styles.senderName,
                            item.senderId === currentUser?.uid ? styles.mySenderName : styles.otherSenderName
                        ]}>
                            {item.senderName}
                        </Text>
                        <View style={[
                            styles.messageBubble,
                            item.senderId === currentUser?.uid ? styles.myMessage : styles.otherMessage
                        ]}>
                            <Text style={styles.messageText}>
                                {item.text}
                            </Text>
                            <Text style={styles.timestamp}>
                                {new Date(item.timestamp).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })}
                            </Text>
                        </View>
                    </View>
                )}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                contentContainerStyle={styles.flatListContent}
            />
    
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor="#666"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    maxLength={500}
                />
                <TouchableOpacity 
                    style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]} 
                    onPress={sendMessage}
                    disabled={!message.trim()}
                >
                    <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>
            </View>
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
        padding: 16,
        paddingTop: 40,
        backgroundColor: '#000',
        borderBottomWidth: 0.5,
        borderBottomColor: '#262626',
        elevation: 4,
    },
    backButton: {
        padding: 8,
        marginRight: 16,
        borderRadius: 20,
        backgroundColor: '#262626',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
    },
    loader: {
        flex: 1,
        backgroundColor: '#000',
    },
    flatListContent: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    messageContainer: {
        marginVertical: 8,
        maxWidth: '80%',
        padding: 4,
    },
    myMessageContainer: {
        alignSelf: 'flex-end',
    },
    otherMessageContainer: {
        alignSelf: 'flex-start',
    },
    senderName: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
        marginHorizontal: 8,
    },
    mySenderName: {
        alignSelf: 'flex-end',
        color: '#0095f6',
    },
    otherSenderName: {
        alignSelf: 'flex-start',
        color: '#a0a0a0',
    },
    messageBubble: {
        minWidth: 150,
        padding: 12,
        borderRadius: 16,
        elevation: 2,
    },
    myMessage: {
        backgroundColor: '#0095f6',
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    otherMessage: {
        backgroundColor: '#262626',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        color: '#fff',
        fontSize: 15,
        lineHeight: 20,
        marginBottom: 16,
        marginRight: 40,
    },
    timestamp: {
        fontSize: 11,
        position: 'absolute',
        bottom: 8,
        right: 12,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#111',
        borderTopWidth: 1,
        borderTopColor: '#262626',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        maxHeight: 100,
        padding: 12,
        borderRadius: 20,
        backgroundColor: '#262626',
        color: '#fff',
        fontSize: 15,
        marginRight: 12,
    },
    sendButton: {
        backgroundColor: '#0095f6',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        elevation: 2,
    },
    sendButtonDisabled: {
        backgroundColor: '#263443',
    },
    sendText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
});