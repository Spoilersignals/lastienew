import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ItemsPage from './pages/ItemsPage';
import ItemDetailPage from './pages/ItemDetailPage';
import PostItemPage from './pages/PostItemPage';
import MessagesPage from './pages/MessagesPage';
import MyItemsPage from './pages/MyItemsPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/items" />} />
        <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/items" />} />
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
        <Route path="/post-item" element={user ? <PostItemPage /> : <Navigate to="/login" />} />
        <Route path="/messages" element={user ? <MessagesPage /> : <Navigate to="/login" />} />
        <Route path="/my-items" element={user ? <MyItemsPage /> : <Navigate to="/login" />} />
        <Route
          path="/admin"
          element={user?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App;
