import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slice/authSlice.js';
import { logoutUser } from '../apis/user.api.js';
import { useToast } from '../hooks/useToast.js';
import { useQueryClient } from '@tanstack/react-query';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) return savedTheme === 'dark'
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false
  });
  const { isAuthenticated, isAuthLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      dispatch(logout());
      queryClient.removeQueries({ queryKey: ['currentUser'] });
      queryClient.removeQueries({ queryKey: ['userUrls'] });
      showToast('Logged out successfully');
      setIsOpen(false);
      navigate({ to: '/' });
    } catch (error) {
      showToast(error.message || 'Logout failed. Please try again.', 'error');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const linkClass = 'text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-300';
  const buttonClass = 'rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60';
  const outlineButtonClass = 'rounded-md border border-blue-500 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50';

  const navLinks = (
    <>
      <Link to="/" className={linkClass} onClick={() => setIsOpen(false)}>
        Home
      </Link>
      {isAuthenticated && (
        <Link to="/dashboard" className={linkClass} onClick={() => setIsOpen(false)}>
          Dashboard
        </Link>
      )}
    </>
  );

  const authActions = isAuthLoading ? null : isAuthenticated ? (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoggingOut ? 'Logging out...' : 'Logout'}
    </button>
  ) : (
    <>
      <Link
        to="/auth"
        search={{ mode: 'login' }}
        className={outlineButtonClass}
        onClick={() => setIsOpen(false)}
      >
        Login
      </Link>
      <Link
        to="/auth"
        search={{ mode: 'register' }}
        className={buttonClass}
        onClick={() => setIsOpen(false)}
      >
        Register
      </Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white">
              URL Shortener
            </Link>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            {navLinks}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsDarkMode((current) => !current)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? 'Light' : 'Dark'}
              </button>
              {authActions}
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-200 md:hidden"
            aria-label="Toggle navigation"
            onClick={() => setIsOpen((current) => !current)}
          >
            {isOpen ? 'Close' : 'Menu'}
          </button>
        </div>

        {isOpen && (
          <div className="space-y-4 border-t border-gray-100 py-4 dark:border-gray-800 md:hidden">
            <div className="flex flex-col gap-3">
              {navLinks}
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setIsDarkMode((current) => !current)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              {authActions}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
