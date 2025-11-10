import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await api.get(`/items/${id}`);
      setItem(response.data);
    } catch (error) {
      console.error('Failed to fetch item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setSendingMessage(true);
    setMessageSuccess(false);

    try {
      await api.post('/messages', {
        receiverId: item.postedBy.id,
        itemId: item.id,
        message,
      });
      setMessage('');
      setMessageSuccess(true);
      setTimeout(() => setMessageSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Item not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="mb-6 text-primary-600 hover:text-primary-700">
        ← Back to Items
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <span className="text-gray-400 text-8xl">📦</span>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
              {item.urgent && (
                <span className="bg-red-500 text-white text-sm px-3 py-1 rounded">URGENT</span>
              )}
            </div>

            <p className="text-4xl font-bold text-primary-600 mb-4">
              {item.price === 0 ? 'FREE' : `$${item.price.toFixed(2)}`}
            </p>

            <div className="mb-4">
              <span className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {item.category}
              </span>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{item.description}</p>
            </div>

            <div className="mb-6 pb-6 border-b">
              <h3 className="font-semibold text-gray-900 mb-2">Seller</h3>
              <p className="text-gray-700">{item.postedBy.name}</p>
              <p className="text-sm text-gray-500">Posted {new Date(item.datePosted).toLocaleDateString()}</p>
            </div>

            {user && user.id !== item.postedBy.id && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Contact Seller</h3>
                {messageSuccess && (
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
                    Message sent successfully!
                  </div>
                )}
                <form onSubmit={handleSendMessage}>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hi, I'm interested in this item..."
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3"
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage}
                    className="w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 disabled:bg-gray-400 font-semibold"
                  >
                    {sendingMessage ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
