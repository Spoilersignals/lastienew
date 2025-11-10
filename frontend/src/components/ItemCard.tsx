import { Link } from 'react-router-dom';

interface Item {
  id: string;
  title: string;
  category: string;
  price: number;
  imageUrl: string | null;
  urgent: boolean;
  datePosted: string;
  postedBy: {
    name: string;
  };
}

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <Link
      to={`/items/${item.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-4xl">📦</span>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{item.title}</h3>
          {item.urgent && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">URGENT</span>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-2">{item.category}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-primary-600">
            {item.price === 0 ? 'FREE' : `$${item.price.toFixed(2)}`}
          </span>
          <span className="text-sm text-gray-500">by {item.postedBy.name}</span>
        </div>
      </div>
    </Link>
  );
}
