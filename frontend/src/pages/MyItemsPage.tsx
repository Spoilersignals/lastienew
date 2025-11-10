import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function MyItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const response = await api.get('/items/user/my-items');
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (itemId: string, newStatus: string) => {
    try {
      await api.put(`/items/${itemId}`, { status: newStatus });
      fetchMyItems();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/items/${itemId}`);
        fetchMyItems();
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">My Items</h1>
        <Link
          to="/post-item"
          className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 font-semibold"
        >
          + Post New Item
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 text-lg mb-4">You haven't posted any items yet.</p>
          <Link
            to="/post-item"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700"
          >
            Post Your First Item
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item: any) => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-md flex gap-6">
              <div className="w-32 h-32 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-gray-400 text-4xl">📦</span>
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      item.status === 'AVAILABLE'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'SOLD'
                        ? 'bg-blue-100 text-blue-800'
                        : item.status === 'DONATED'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-3">{item.description.substring(0, 150)}...</p>

                <div className="flex items-center gap-4 mb-3">
                  <span className="text-lg font-bold text-primary-600">
                    {item.price === 0 ? 'FREE' : `$${item.price.toFixed(2)}`}
                  </span>
                  <span className="text-sm text-gray-500">{item.category}</span>
                  <span className="text-sm text-gray-500">
                    Posted {new Date(item.datePosted).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/items/${item.id}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    View
                  </Link>

                  {item.status === 'AVAILABLE' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(item.id, 'SOLD')}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                      >
                        Mark as Sold
                      </button>
                      <button
                        onClick={() => handleStatusChange(item.id, 'DONATED')}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
                      >
                        Mark as Donated
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
