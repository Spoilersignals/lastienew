import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Campus Essentials Exchange
          </h1>
          <p className="text-2xl text-gray-700 mb-8">
            Buy, Sell, Donate, and Exchange items with fellow students
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Save money, reduce waste, and build community. Find textbooks, electronics, furniture, and more from students on your campus.
          </p>

          <div className="flex justify-center space-x-4">
            <Link
              to="/items"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 shadow-lg"
            >
              Browse Items
            </Link>
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Textbooks</h3>
            <p className="text-gray-600">Find affordable textbooks from students who've already taken your classes</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-5xl mb-4">💻</div>
            <h3 className="text-xl font-semibold mb-2">Electronics</h3>
            <p className="text-gray-600">Buy and sell laptops, calculators, and other tech essentials</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-5xl mb-4">🛋️</div>
            <h3 className="text-xl font-semibold mb-2">Furniture</h3>
            <p className="text-gray-600">Find or donate furniture for your dorm or apartment</p>
          </div>
        </div>

        <div className="mt-16 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Campus Exchange?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <span className="text-2xl mr-4">✅</span>
              <div>
                <h4 className="font-semibold mb-1">University Email Verified</h4>
                <p className="text-gray-600">Only verified students can post and message</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-4">💬</span>
              <div>
                <h4 className="font-semibold mb-1">Direct Messaging</h4>
                <p className="text-gray-600">Chat directly with sellers in a safe environment</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-4">🌱</span>
              <div>
                <h4 className="font-semibold mb-1">Sustainable</h4>
                <p className="text-gray-600">Reduce waste by reusing items within your campus</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-2xl mr-4">🎯</span>
              <div>
                <h4 className="font-semibold mb-1">Campus-Focused</h4>
                <p className="text-gray-600">Find items nearby and arrange easy pickups</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
