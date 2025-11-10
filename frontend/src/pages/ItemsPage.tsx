import { useState, useEffect } from 'react';
import api from '../api/axios';
import ItemCard from '../components/ItemCard';

const categories = ['ALL', 'BOOKS', 'ELECTRONICS', 'FURNITURE', 'CLOTHING', 'SPORTS', 'STATIONERY', 'OTHER'];

export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [urgentOnly, setUrgentOnly] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [category, urgentOnly]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (category !== 'ALL') params.category = category;
      if (search) params.search = search;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (urgentOnly) params.urgent = 'true';

      const response = await api.get('/items', { params });
      setItems(response.data.items);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Browse Items</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700"
            >
              Search
            </button>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Min Price:</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-24 px-2 py-1 border border-gray-300 rounded-md"
                placeholder="0"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Max Price:</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-24 px-2 py-1 border border-gray-300 rounded-md"
                placeholder="1000"
              />
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={urgentOnly}
                onChange={(e) => setUrgentOnly(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">Urgent Only</span>
            </label>
          </div>
        </form>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-md font-medium ${
              category === cat
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-600">Loading items...</div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No items found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item: any) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
