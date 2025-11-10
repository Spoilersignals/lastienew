import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              🎓 Campus Exchange
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/items" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
              Browse Items
            </Link>

            {user ? (
              <>
                <Link to="/post-item" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
                  Post Item
                </Link>
                <Link to="/my-items" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
                  My Items
                </Link>
                <Link to="/messages" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
                  Messages
                </Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
                    Admin
                  </Link>
                )}
                <span className="text-gray-700">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md">
                  Login
                </Link>
                <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
