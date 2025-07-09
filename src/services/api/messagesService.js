import mockConversations from "@/services/mockData/conversations.json";
import mockMessages from "@/services/mockData/messages.json";
import { usersService } from "@/services/api/usersService";

export const messagesService = {
  async getConversations(userId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get conversations where user is a participant
    const userConversations = mockConversations.filter(conv => 
      conv.participantIds.includes(parseInt(userId))
    );
    
    // Populate participant details and last message
    const populatedConversations = await Promise.all(
      userConversations.map(async (conv) => {
        const participants = await Promise.all(
          conv.participantIds.map(id => usersService.getById(id))
        );
        
        const lastMessage = mockMessages
          .filter(msg => msg.conversationId === conv.Id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        
        return {
          ...conv,
          participants,
          lastMessage
        };
      })
    );
    
    // Sort by last message time
    return populatedConversations.sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(a.createdAt);
      const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(b.createdAt);
      return timeB - timeA;
    });
  },

  async getMessages(conversationId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const messages = mockMessages
      .filter(msg => msg.conversationId === parseInt(conversationId))
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    return messages.map(msg => ({ ...msg }));
  },

  async sendMessage(messageData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const maxId = Math.max(...mockMessages.map(m => m.Id), 0);
    const newMessage = {
      Id: maxId + 1,
      conversationId: parseInt(messageData.conversationId),
      senderId: parseInt(messageData.senderId),
      content: messageData.content,
      type: messageData.type || 'text',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockMessages.push(newMessage);
    
    // Update conversation's updatedAt
    const conversation = mockConversations.find(c => c.Id === parseInt(messageData.conversationId));
    if (conversation) {
      conversation.updatedAt = new Date().toISOString();
    }
    
    return { ...newMessage };
  },

  async createConversation(userId1, userId2) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if conversation already exists
    const existingConversation = mockConversations.find(conv => 
      conv.participantIds.includes(parseInt(userId1)) && 
      conv.participantIds.includes(parseInt(userId2))
    );
    
    if (existingConversation) {
      const participants = await Promise.all(
        existingConversation.participantIds.map(id => usersService.getById(id))
      );
      return {
        ...existingConversation,
        participants,
        lastMessage: null
      };
    }
    
    const maxId = Math.max(...mockConversations.map(c => c.Id), 0);
    const newConversation = {
      Id: maxId + 1,
      participantIds: [parseInt(userId1), parseInt(userId2)],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockConversations.push(newConversation);
    
    const participants = await Promise.all(
      newConversation.participantIds.map(id => usersService.getById(id))
    );
    
    return {
      ...newConversation,
      participants,
      lastMessage: null
    };
  },

  async deleteConversation(conversationId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const convIndex = mockConversations.findIndex(c => c.Id === parseInt(conversationId));
    if (convIndex === -1) {
      throw new Error("Conversation not found");
    }
    
    // Delete all messages in conversation
    const messageIndices = mockMessages
      .map((msg, index) => msg.conversationId === parseInt(conversationId) ? index : -1)
      .filter(index => index !== -1)
      .reverse();
    
    messageIndices.forEach(index => mockMessages.splice(index, 1));
    
    // Delete conversation
    mockConversations.splice(convIndex, 1);
    
    return true;
  },

  async markAsRead(conversationId, userId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const messages = mockMessages.filter(msg => 
      msg.conversationId === parseInt(conversationId) && 
      msg.senderId !== parseInt(userId)
    );
    
    messages.forEach(msg => {
      msg.isRead = true;
      msg.readAt = new Date().toISOString();
    });
    
    return true;
  }
};