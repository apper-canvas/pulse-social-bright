import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { messagesService } from "@/services/api/messagesService";
import { usersService } from "@/services/api/usersService";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/utils/cn";

const Messages = ({ currentUser }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Set());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    try {
      const conversationsData = await messagesService.getConversations(currentUser.id);
      setConversations(conversationsData);
    } catch (err) {
      setError("Failed to load conversations");
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const messagesData = await messagesService.getMessages(conversationId);
      setMessages(messagesData);
      scrollToBottom();
    } catch (err) {
      setError("Failed to load messages");
    }
  };

  const initializeChat = async () => {
    try {
      setLoading(true);
      setError("");
      
      await loadConversations();
      
      if (userId) {
        // Direct message with specific user
        const targetUser = await usersService.getById(userId);
        let conversation = conversations.find(c => 
          c.participants.some(p => p.Id === parseInt(userId))
        );
        
        if (!conversation) {
          conversation = await messagesService.createConversation(currentUser.id, parseInt(userId));
          await loadConversations();
        }
        
        setSelectedConversation(conversation);
        await loadMessages(conversation.Id);
      }
    } catch (err) {
      setError(err.message || "Failed to initialize chat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      initializeChat();
    }
  }, [currentUser, userId]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(async () => {
      if (selectedConversation) {
        try {
          const updatedMessages = await messagesService.getMessages(selectedConversation.Id);
          if (updatedMessages.length > messages.length) {
            setMessages(updatedMessages);
            scrollToBottom();
          }
        } catch (err) {
          // Silent fail for polling
        }
      }
      
      // Update online status
      const users = await usersService.getAll();
      const online = new Set(users.filter(u => u.isOnline).map(u => u.Id));
      setOnlineUsers(online);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedConversation, messages.length]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !selectedConversation) return;

    try {
      setSending(true);
      const messageData = {
        conversationId: selectedConversation.Id,
        senderId: currentUser.id,
        content: newMessage.trim(),
        type: 'text'
      };

      await messagesService.sendMessage(messageData);
      setNewMessage("");
      await loadMessages(selectedConversation.Id);
    } catch (err) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleConversationSelect = async (conversation) => {
    setSelectedConversation(conversation);
    await loadMessages(conversation.Id);
    if (userId) {
      navigate("/messages");
    }
  };

  const startNewConversation = async (targetUserId) => {
    try {
      const conversation = await messagesService.createConversation(currentUser.id, targetUserId);
      await loadConversations();
      setSelectedConversation(conversation);
      await loadMessages(conversation.Id);
    } catch (err) {
      toast.error("Failed to start conversation");
    }
  };

  if (loading) {
    return <Loading type="page" />;
  }

  if (error) {
    return <Error message={error} onRetry={initializeChat} />;
  }

  return (
    <div className="max-w-6xl mx-auto h-screen flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <ApperIcon name="MessageCircle" className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No conversations yet</p>
              <p className="text-sm mt-2">Start messaging by visiting a user's profile</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {conversations.map((conversation) => {
                const otherUser = conversation.participants.find(p => p.Id !== currentUser.id);
                const lastMessage = conversation.lastMessage;
                
                return (
                  <motion.div
                    key={conversation.Id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleConversationSelect(conversation)}
                    className={cn(
                      "conversation-item p-4 rounded-lg cursor-pointer",
                      selectedConversation?.Id === conversation.Id && "active"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("online-indicator", onlineUsers.has(otherUser.Id) && "online")}>
                        <Avatar
                          src={otherUser.avatar}
                          alt={otherUser.displayName}
                          size="default"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate">{otherUser.displayName}</h3>
                          {lastMessage && (
                            <span className="text-xs opacity-70">
                              {formatDistanceToNow(new Date(lastMessage.createdAt), { addSuffix: true })}
                            </span>
                          )}
                        </div>
                        <p className="text-sm opacity-70 truncate">
                          {lastMessage ? lastMessage.content : "Start a conversation"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                {(() => {
                  const otherUser = selectedConversation.participants.find(p => p.Id !== currentUser.id);
                  return (
                    <>
                      <div className={cn("online-indicator", onlineUsers.has(otherUser.Id) && "online")}>
                        <Avatar
                          src={otherUser.avatar}
                          alt={otherUser.displayName}
                          size="default"
                        />
                      </div>
                      <div>
                        <h2 className="font-semibold text-gray-900">{otherUser.displayName}</h2>
                        <p className="text-sm text-gray-600">
                          {onlineUsers.has(otherUser.Id) ? "Online" : "Offline"}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => {
                  const isOwn = message.senderId === currentUser.id;
                  const sender = selectedConversation.participants.find(p => p.Id === message.senderId);
                  
                  return (
                    <motion.div
                      key={message.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={cn("flex", isOwn ? "justify-end" : "justify-start")}
                    >
                      <div className={cn("message-bubble", isOwn ? "sent" : "received")}>
                        <p>{message.content}</p>
                        <div className="message-timestamp">
                          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {typingUsers.size > 0 && (
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                  disabled={sending}
                />
                <Button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="px-4"
                >
                  {sending ? (
                    <ApperIcon name="Loader" className="w-4 h-4 animate-spin" />
                  ) : (
                    <ApperIcon name="Send" className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <ApperIcon name="MessageCircle" className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Messages</h3>
              <p className="text-gray-600">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;