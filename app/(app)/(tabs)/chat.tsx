import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  FlatList
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Header } from '@/components/common/Header';
import { Card } from '@/components/ui/Card';
import { Search, Plus, Send, Paperclip, Mic } from 'lucide-react-native';
import { format } from 'date-fns';

// Mock conversation data
const mockConversations = [
  {
    id: '1',
    name: 'Dr. Jane Smith',
    role: 'doctor',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    lastMessage: "Your blood pressure readings look good!",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    unread: 2,
  },
  {
    id: '2',
    name: 'John Doe',
    role: 'patient',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    lastMessage: "I have been taking the medication as prescribed.",
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    unread: 0,
  },
  {
    id: '3',
    name: 'Dr. Michael Chen',
    role: 'doctor',
    image: 'https://randomuser.me/api/portraits/men/67.jpg',
    lastMessage: "Let's schedule a follow-up appointment next week.",
    timestamp: new Date(Date.now() - 172800000), // 2 days ago
    unread: 0,
  },
  {
    id: '4',
    name: 'Emily Johnson',
    role: 'patient',
    image: 'https://randomuser.me/api/portraits/women/17.jpg',
    lastMessage: "Thank you for the prescription, doctor.",
    timestamp: new Date(Date.now() - 259200000), // 3 days ago
    unread: 0,
  },
];

// Mock messages for a selected conversation
const mockMessages = [
  {
    id: '1',
    sender: 'user',
    text: "Good morning doctor, I have been experiencing some dizziness lately when I stand up too quickly.",
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
  },
  {
    id: '2',
    sender: 'other',
    text: "Hello, I am sorry to hear that. Have you been taking your blood pressure medication regularly?",
    timestamp: new Date(Date.now() - 7000000),
  },
  {
    id: '3',
    sender: 'user',
    text: "Yes, I take it every morning. Should I be concerned about these symptoms?",
    timestamp: new Date(Date.now() - 6800000),
  },
  {
    id: '4',
    sender: 'other',
    text: "It could be related to low blood pressure. Can you measure your blood pressure next time you feel dizzy and let me know the readings?",
    timestamp: new Date(Date.now() - 6600000),
  },
  {
    id: '5',
    sender: 'user',
    text: "I will do that. Would you recommend any other changes to my routine in the meantime?",
    timestamp: new Date(Date.now() - 6400000),
  },
  {
    id: '6',
    sender: 'other',
    text: "Try to stay hydrated and stand up slowly from sitting or lying down positions. Also, avoid hot environments for extended periods. Let's monitor your symptoms for a few days.",
    timestamp: new Date(Date.now() - 6200000),
  },
  {
    id: '7',
    sender: 'user',
    text: "Thank you, doctor. I will follow your advice and keep track of my blood pressure.",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
  },
];

export default function ChatScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const messagesRef = useRef<FlatList>(null);
  
  // Filter conversations based on search query
  const filteredConversations = mockConversations.filter(conversation => {
    return conversation.name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Handle sending a new message
  const handleSend = () => {
    if (message.trim() === '') return;
    
    const newMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: message.trim(),
      timestamp: new Date(),
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Scroll to bottom
    setTimeout(() => {
      messagesRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  
  // Format timestamp for chat list
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (timestamp >= today) {
      return format(timestamp, 'h:mm a');
    } else if (timestamp >= yesterday) {
      return 'Yesterday';
    } else {
      return format(timestamp, 'MMM d');
    }
  };
  
  // Render conversation list
  const renderConversationList = () => {
    return (
      <ScrollView style={styles.conversationListContainer}>
        <View style={styles.searchContainer}>
          <View style={[styles.searchInputContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search conversations..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <TouchableOpacity style={[styles.newChatButton, { backgroundColor: colors.primary }]}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        {filteredConversations.map((conversation) => {
          // Only show doctors for patients, and only show patients for doctors
          const isOtherRoleMatch = 
            (user?.role === 'patient' && conversation.role === 'doctor') ||
            (user?.role === 'doctor' && conversation.role === 'patient');
          
          if (!isOtherRoleMatch) return null;
          
          return (
            <TouchableOpacity
              key={conversation.id}
              style={styles.conversationItem}
              onPress={() => setSelectedConversation(conversation)}
            >
              <View style={styles.avatarContainer}>
                <Image source={{ uri: conversation.image }} style={styles.avatar} />
                {conversation.unread > 0 && (
                  <View style={[styles.unreadBadge, { backgroundColor: colors.error }]}>
                    <Text style={styles.unreadCount}>{conversation.unread}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.conversationDetails}>
                <View style={styles.conversationHeader}>
                  <Text style={[styles.conversationName, { color: colors.text }]} numberOfLines={1}>
                    {conversation.name}
                  </Text>
                  <Text style={[styles.conversationTime, { color: colors.textSecondary }]}>
                    {formatTimestamp(conversation.timestamp)}
                  </Text>
                </View>
                
                <Text 
                  style={[
                    styles.conversationPreview, 
                    { color: conversation.unread > 0 ? colors.text : colors.textSecondary }
                  ]}
                  numberOfLines={1}
                >
                  {conversation.lastMessage}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };
  
  // Render chat screen
  const renderChatScreen = () => {
    const otherUserName = selectedConversation.name;
    
    return (
      <KeyboardAvoidingView
        style={styles.chatScreenContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <View style={[styles.chatHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => setSelectedConversation(null)} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: colors.primary }]}>Back</Text>
          </TouchableOpacity>
          
          <View style={styles.chatHeaderProfile}>
            <Image source={{ uri: selectedConversation.image }} style={styles.chatHeaderAvatar} />
            <Text style={[styles.chatHeaderName, { color: colors.text }]}>
              {otherUserName}
            </Text>
          </View>
          
          <View style={styles.headerRightPlaceholder} />
        </View>
        
        <FlatList
          ref={messagesRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          data={messages}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isUser = item.sender === 'user';
            
            return (
              <View
                style={[
                  styles.messageContainer,
                  isUser ? styles.userMessageContainer : styles.otherMessageContainer,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isUser
                      ? [styles.userMessageBubble, { backgroundColor: colors.primary }]
                      : [styles.otherMessageBubble, { backgroundColor: colors.backgroundSecondary }],
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isUser
                        ? { color: '#FFFFFF' }
                        : { color: colors.text },
                    ]}
                  >
                    {item.text}
                  </Text>
                </View>
                
                <Text
                  style={[
                    styles.messageTime,
                    { color: colors.textSecondary },
                  ]}
                >
                  {format(item.timestamp, 'h:mm a')}
                </Text>
              </View>
            );
          }}
        />
        
        <View style={[styles.inputContainer, { backgroundColor: colors.backgroundSecondary }]}>
          <TouchableOpacity style={styles.attachButton}>
            <Paperclip size={24} color={colors.primary} />
          </TouchableOpacity>
          
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Type your message..."
            placeholderTextColor={colors.textSecondary}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          
          <TouchableOpacity style={styles.micButton}>
            <Mic size={24} color={colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: colors.primary }]}
            onPress={handleSend}
            disabled={message.trim() === ''}
          >
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {selectedConversation ? (
        renderChatScreen()
      ) : (
        <>
          <Header title="Messages" />
          {renderConversationList()}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  conversationListContainer: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  newChatButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  conversationItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  conversationDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  conversationTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  conversationPreview: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  
  // Chat screen styles
  chatScreenContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  chatHeaderProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatHeaderAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  chatHeaderName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  headerRightPlaceholder: {
    width: 40,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '75%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
  },
  userMessageBubble: {
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    borderRadius: 18,
    marginHorizontal: 8,
  },
  micButton: {
    padding: 8,
    marginRight: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});