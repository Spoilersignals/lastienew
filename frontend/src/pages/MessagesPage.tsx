import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';

interface Conversation {
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  item?: { id: string; title: string };
}

interface Message {
  id: string;
  message: string;
  timestamp: string;
  senderId: string;
  receiverId: string;
  sender: { id: string; name: string };
  receiver: { id: string; name: string };
  item?: { id: string; title: string };
}

export default function MessagesPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId);
    }
  }, [selectedUserId]);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      const response = await api.get(`/messages/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) return;

    try {
      await api.post('/messages', {
        receiverId: selectedUserId,
        message: newMessage,
      });

      setNewMessage('');
      await fetchMessages(selectedUserId);
      await fetchConversations();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const selectedConversation = conversations.find((c) => c.userId === selectedUserId);

  if (loading) {
    return <div className="text-center py-8">Loading conversations...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Messages</h1>

      <div className="bg-white rounded-lg shadow-md" style={{ height: '600px' }}>
        <div className="grid grid-cols-3 h-full">
          {/* Conversations List */}
          <div className="col-span-1 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Conversations</h2>
              {conversations.length === 0 ? (
                <p className="text-gray-500 text-sm">No conversations yet</p>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <div
                      key={conv.userId}
                      onClick={() => setSelectedUserId(conv.userId)}
                      className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                        selectedUserId === conv.userId ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-sm">{conv.userName}</span>
                        {conv.unreadCount > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      {conv.item && (
                        <p className="text-xs text-gray-500 mb-1">Re: {conv.item.title}</p>
                      )}
                      <p className="text-xs text-gray-600 truncate">{conv.lastMessage}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(conv.lastMessageTime).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="col-span-2 flex flex-col">
            {selectedUserId ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-lg">{selectedConversation?.userName}</h3>
                  {selectedConversation?.item && (
                    <p className="text-sm text-gray-500">About: {selectedConversation.item.title}</p>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.senderId === user?.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a conversation to view messages
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
