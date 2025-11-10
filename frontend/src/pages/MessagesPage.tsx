import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';

export default function MessagesPage() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<any>({});
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInbox();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchConversation(selectedUser);
    }
  }, [selectedUser]);

  const fetchInbox = async () => {
    try {
      const response = await api.get('/messages/inbox');
      setConversations(response.data);
      if (Object.keys(response.data).length > 0 && !selectedUser) {
        setSelectedUser(Object.keys(response.data)[0]);
      }
    } catch (error) {
      console.error('Failed to fetch inbox:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async (userId: string) => {
    try {
      const response = await api.get(`/messages/conversation/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await api.post('/messages', {
        receiverId: selectedUser,
        message: newMessage,
      });
      setNewMessage('');
      fetchConversation(selectedUser);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const getOtherUser = (userId: string) => {
    const userMessages = conversations[userId];
    if (!userMessages || userMessages.length === 0) return null;
    const msg = userMessages[0];
    return msg.sender.id === user?.id ? msg.receiver : msg.sender;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const conversationList = Object.keys(conversations);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Messages</h1>

      {conversationList.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 text-lg">No messages yet. Start a conversation by contacting sellers!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          <div className="bg-white rounded-lg shadow-md overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-900">Conversations</h2>
            </div>
            <div>
              {conversationList.map((userId) => {
                const otherUser = getOtherUser(userId);
                if (!otherUser) return null;
                return (
                  <button
                    key={userId}
                    onClick={() => setSelectedUser(userId)}
                    className={`w-full text-left p-4 border-b hover:bg-gray-50 ${
                      selectedUser === userId ? 'bg-primary-50' : ''
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{otherUser.name}</div>
                    <div className="text-sm text-gray-500 truncate">
                      {conversations[userId][conversations[userId].length - 1].message}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-lg shadow-md flex flex-col">
            {selectedUser ? (
              <>
                <div className="p-4 border-b">
                  <h2 className="font-semibold text-gray-900">{getOtherUser(selectedUser)?.name}</h2>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.senderId === user?.id
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p>{msg.message}</p>
                        <p className="text-xs mt-1 opacity-75">
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      type="submit"
                      className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
