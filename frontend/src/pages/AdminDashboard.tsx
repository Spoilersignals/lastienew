import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'items' | 'users'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [flaggedItems, setFlaggedItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'items') {
      fetchFlaggedItems();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFlaggedItems = async () => {
    try {
      const response = await api.get('/admin/items/flagged');
      setFlaggedItems(response.data);
    } catch (error) {
      console.error('Failed to fetch flagged items:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleApproveItem = async (itemId: string) => {
    try {
      await api.put(`/admin/items/${itemId}/approve`);
      fetchFlaggedItems();
      fetchStats();
    } catch (error) {
      console.error('Failed to approve item:', error);
    }
  };

  const handleFlagItem = async (itemId: string) => {
    const reason = prompt('Reason for flagging:');
    if (!reason) return;

    try {
      await api.put(`/admin/items/${itemId}/flag`, { reason });
      fetchStats();
    } catch (error) {
      console.error('Failed to flag item:', error);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await api.delete(`/admin/items/${itemId}`);
      fetchFlaggedItems();
      fetchStats();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleBlockUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to block this user?')) return;

    try {
      await api.put(`/admin/users/${userId}/block`);
      fetchUsers();
    } catch (error) {
      console.error('Failed to block user:', error);
    }
  };

  const handleUnblockUser = async (userId: string) => {
    try {
      await api.put(`/admin/users/${userId}/unblock`);
      fetchUsers();
    } catch (error) {
      console.error('Failed to unblock user:', error);
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
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 rounded-md font-medium ${
            activeTab === 'overview'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`px-6 py-3 rounded-md font-medium ${
            activeTab === 'items'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Flagged Items
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 rounded-md font-medium ${
            activeTab === 'users'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Users
        </button>
      </div>

      {activeTab === 'overview' && stats && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.stats.totalUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Total Items</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.stats.totalItems}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Active Items</h3>
              <p className="text-3xl font-bold text-green-600">{stats.stats.activeItems}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Flagged Items</h3>
              <p className="text-3xl font-bold text-red-600">{stats.stats.flaggedItems}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Users</h2>
            <div className="space-y-3">
              {stats.recentUsers.map((user: any) => (
                <div key={user.id} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Items</h2>
            <div className="space-y-3">
              {stats.recentItems.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-600">
                      {item.category} • ${item.price.toFixed(2)} • by {item.postedBy.name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {item.status === 'AVAILABLE' && (
                      <button
                        onClick={() => handleFlagItem(item.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                      >
                        Flag
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'items' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Flagged Items</h2>
          {flaggedItems.length === 0 ? (
            <p className="text-gray-600">No flagged items</p>
          ) : (
            <div className="space-y-4">
              {flaggedItems.map((item: any) => (
                <div key={item.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Posted by {item.postedBy.name} ({item.postedBy.email})
                      </p>
                    </div>
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm">
                      {item.status}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleApproveItem(item.id)}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">All Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user: any) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{user._count.items}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          user.blocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {user.blocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {user.role !== 'ADMIN' && (
                        <button
                          onClick={() => (user.blocked ? handleUnblockUser(user.id) : handleBlockUser(user.id))}
                          className={`px-3 py-1 rounded text-xs ${
                            user.blocked
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          {user.blocked ? 'Unblock' : 'Block'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
