import { Outlet, Link, useLocation } from 'react-router-dom';
import { CartSlideOver } from './CartSlideOver';
import { CartButton } from './CartButton';
import { ThemeToggle } from './ThemeToggle';
import { useAuthStore } from '@/store/auth.store';
import { useWishlistStore } from '@/stores/wishlistStore';
import { 
  ShoppingBagIcon, 
  UserIcon, 
  HeartIcon, 
  ArrowsRightLeftIcon, 
  UserCircleIcon 
} from '@heroicons/react/24/outline';

export function Layout() {
  const { user, logout } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 w-full bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link 
                to="/" 
                className={`flex-shrink-0 flex items-center ${
                  isActive('/') 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <span className="text-2xl font-bold">
                  EcomMini
                </span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/products"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium border-b-2 ${
                    isActive('/products')
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  <ShoppingBagIcon className="w-5 h-5 mr-1.5" />
                  Shop
                </Link>
                <Link
                  to="/compare"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium border-b-2 ${
                    isActive('/compare')
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  <ArrowsRightLeftIcon className="w-5 h-5 mr-1.5" />
                  Compare
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <ThemeToggle />
              <Link
                to="/wishlist"
                className={`inline-flex items-center text-sm relative ${
                  isActive('/wishlist')
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <HeartIcon className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              <CartButton />
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-sm text-gray-700 dark:text-gray-300">
                    <UserCircleIcon className="w-6 h-6" />
                    <span className="hidden md:inline">{user.name}</span>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hidden group-hover:block">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        My Account
                      </Link>
                      <Link
                        to="/wishlist"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        My Wishlist
                        {wishlistItems.length > 0 && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {wishlistItems.length}
                          </span>
                        )}
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <UserIcon className="w-5 h-5 mr-1.5" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <Link 
                to="/" 
                className={`flex items-center ${
                  isActive('/') 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <span className="text-2xl font-bold">
                  EcomMini
                </span>
              </Link>
              <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
                Your one-stop shop for all your needs. Quality products at great prices.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider">
                Quick Links
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/products" className="text-base text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="text-base text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                    Cart
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" className="text-base text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link to="/compare" className="text-base text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                    Compare
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-300 uppercase tracking-wider">
                Account
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/profile" className="text-base text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-base text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                    Login / Register
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-base text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-base text-gray-400 text-center">
              © {new Date().getFullYear()} EcomMini. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Cart slide-over */}
      <CartSlideOver />
    </div>
  );
} 