import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';


export default function ChatList({ navigation }) {
    const [chats, setChats] = useState([]);
    const [userNames, setUserNames] = useState({});
    const user = auth().currentUser;

    useEffect(() => {
        if (!user) return;

        const chatsRef = database().ref('chats');

        chatsRef.on('value', async (snapshot) => {
            if (snapshot.exists()) {
                const chatData = snapshot.val();
                const userChats = [];
                const userIds = new Set();

                Object.entries(chatData).forEach(([chatId, chat]) => {
                    if (chat.participants.clientId === user.uid || chat.participants.freelancerId === user.uid) {
                        // Get the latest message from messages object
                        let latestMessage = 'No messages yet';
                        if (chat.messages) {
                            const messages = Object.values(chat.messages);
                            const sortedMessages = messages.sort((a, b) => b.timestamp - a.timestamp);
                            latestMessage = sortedMessages[0]?.text || 'No messages yet';
                        }
                
                        userChats.push({
                            id: chatId,
                            lastMessage: latestMessage,
                            freelancerId: chat.participants.freelancerId,
                            clientId: chat.participants.clientId,
                            timestamp: chat.messages ? Math.max(...Object.values(chat.messages).map(m => m.timestamp)) : 0,
                        });
                        userIds.add(chat.participants.clientId);
                        userIds.add(chat.participants.freelancerId);
                    }
                });
                const sortedChats = userChats.sort((a, b) => b.timestamp - a.timestamp);
setChats(sortedChats);

                // Fetch usernames for all participants
                const names = {};
                for (const userId of userIds) {
                    const userSnapshot = await database().ref(`/users/${userId}/name`).once('value');
                    names[userId] = userSnapshot.val() || 'Unknown User';
                }

                setUserNames(names);
                setChats(userChats);
            } else {
                setChats([]);
            }
        });

        return () => chatsRef.off();
    }, [user]);

    const getChatName = (chat) => {
        const otherUserId = chat.clientId === user.uid ? chat.freelancerId : chat.clientId;
        return userNames[otherUserId] || 'Loading...';
    };

    const openChat = (chatId, clientId, freelancerId) => {
        navigation.navigate('ChatScreen', { chatId, clientId, freelancerId });
    };
 
       return (
            <View style={styles.mainContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>Messages</Text>
                    <TouchableOpacity style={styles.searchButton}>
                        <Icon name="search" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
    
                <FlatList
                    style={styles.chatList}
                    data={chats}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={styles.chatItem} 
                            onPress={() => openChat(item.id, item.clientId, item.freelancerId)}
                        >
                            <View style={styles.avatarContainer}>
                                <Text style={styles.avatarText}>
                                    {getChatName(item).charAt(0).toUpperCase()}
                                </Text>
                            </View>
                            <View style={styles.chatContent}>
                                <View style={styles.chatHeader}>
                                    <Text style={styles.chatName}>{getChatName(item)}</Text>
                                    {item.timestamp > 0 && (
                                        <Text style={styles.timestamp}>
                                            {new Date(item.timestamp).toLocaleTimeString([], { 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                            })}
                                        </Text>
                                    )}
                                </View>
                                <Text style={styles.chatMessage} numberOfLines={1}>
                                    {item.lastMessage}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Icon name="chat-bubble-outline" size={48} color="#666" />
                            <Text style={styles.emptyText}>No messages yet</Text>
                        </View>
                    }
                />
            </View>
        );
    }
    
    const styles = StyleSheet.create({
        mainContainer: {
            flex: 1,
            backgroundColor: '#000',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            paddingTop: 40,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            borderBottomWidth: 1,
            borderBottomColor: '#262626',
            elevation: 8,
        },
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            color: '#fff',
            letterSpacing: 0.5,
        },
        searchButton: {
            padding: 10,
            borderRadius: 25,
            backgroundColor: '#262626',
            elevation: 3,
        },
        chatList: {
            flex: 1,
            paddingHorizontal: 16,
            paddingTop: 16,
        },
        chatItem: {
            flexDirection: 'row',
            padding: 16,
            marginBottom: 12,
            backgroundColor: 'rgba(38, 38, 38, 0.9)',
            borderRadius: 16,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#363636',
            elevation: 4,
        },
        avatarContainer: {
            width: 56,
            height: 56,
            borderRadius: 28,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
            elevation: 3,
            backgroundColor: '#1a1a1a',
            borderWidth: 2,
            borderColor: '#0095f6',
        },
        avatarText: {
            color: '#fff',
            fontSize: 22,
            fontWeight: 'bold',
        },
        chatContent: {
            flex: 1,
        },
        chatHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6,
        },
        chatName: {
            fontSize: 18,
            fontWeight: '600',
            color: '#fff',
            letterSpacing: 0.3,
        },
        chatMessage: {
            fontSize: 14,
            color: '#a0a0a0',
            marginTop: 2,
            letterSpacing: 0.2,
        },
        timestamp: {
            fontSize: 12,
            color: '#666',
            backgroundColor: 'rgba(38, 38, 38, 0.8)',
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 10,
        },
        emptyContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 100,
        },
        emptyText: {
            color: '#666',
            fontSize: 16,
            marginTop: 16,
            letterSpacing: 0.5,
        }
    });