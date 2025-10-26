import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation links for logged-in users
  const authenticatedLinks = [
    { path: '/dashboard', label: 'Home' },
    { path: '/history', label: 'History' },
    { path: '/weather', label: 'Weather' },
    { path: '/profile', label: 'Profile' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  // Check if current path is login or signup
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';
  const isPricingPage = location.pathname === '/pricing';

  return (
    <nav className="glass-dark fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <span className="text-2xl font-bold text-[#C0CFC5] font-zen-dots">
                CROP SHIELD
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              // Authenticated user links
              authenticatedLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'text-[#C0CFC5] bg-primary/50 border border-[#C0CFC5]/20'
                      : 'text-[#C0CFC5] hover:text-[#C0CFC5] hover:bg-[#C0CFC5]/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))
            ) : (
              // Unauthenticated user links
              <>
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-[#C0CFC5] hover:text-[#C0CFC5] font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-[#C0CFC5]/10"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-[#C0CFC5] hover:text-[#C0CFC5] font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-[#C0CFC5]/10"
                >
                  How it Works
                </button>
                <Link
                  to="/pricing"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isPricingPage
                      ? 'text-[#C0CFC5] bg-primary/50 border border-[#C0CFC5]/20'
                      : 'text-[#C0CFC5] hover:text-[#C0CFC5] hover:bg-[#C0CFC5]/10'
                  }`}
                >
                  Pricing
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-[#C0CFC5]">
                  Welcome, <span className="font-semibold text-[#C0CFC5]">{user?.name || 'Farmer'}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-[#C0CFC5] text-primary px-6 py-2.5 rounded-xl font-semibold hover:bg-[#C0CFC5]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                    isLoginPage 
                      ? 'bg-[#C0CFC5] text-primary font-semibold' 
                      : 'text-[#C0CFC5] hover:text-[#C0CFC5] hover:bg-[#C0CFC5]/10'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                    isSignupPage
                      ? 'bg-[#C0CFC5] text-primary border-2 border-[#C0CFC5]'
                      : 'bg-primary text-[#C0CFC5] hover:bg-primary/90'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#C0CFC5] hover:text-[#C0CFC5] p-2 rounded-lg hover:bg-[#C0CFC5]/10 transition-colors"
            >
              <span className="text-2xl">☰</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden glass-dark border-t border-[#C0CFC5]/10 py-4 space-y-2">
            {isAuthenticated ? (
              // Mobile authenticated links
              <>
                {authenticatedLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block px-4 py-3 text-[#C0CFC5] hover:text-[#C0CFC5] hover:bg-[#C0CFC5]/10 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-[#C0CFC5]/10 pt-2 mt-2 space-y-2">
                  <div className="px-4 py-2 text-sm text-[#C0CFC5]">
                    Welcome, <span className="font-semibold text-[#C0CFC5]">{user?.name || 'Farmer'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-[#C0CFC5] hover:bg-[#C0CFC5]/10 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              // Mobile unauthenticated links
              <>
                <button
                  onClick={() => scrollToSection('features')}
                  className="block w-full text-left px-4 py-3 text-[#C0CFC5] hover:text-[#C0CFC5] hover:bg-[#C0CFC5]/10 transition-colors font-medium"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="block w-full text-left px-4 py-3 text-[#C0CFC5] hover:text-[#C0CFC5] hover:bg-[#C0CFC5]/10 transition-colors font-medium"
                >
                  How it Works
                </button>
                <Link
                  to="/pricing"
                  className={`block px-4 py-3 transition-colors font-medium ${
                    isPricingPage
                      ? 'bg-[#C0CFC5] text-primary font-semibold'
                      : 'text-[#C0CFC5] hover:text-[#C0CFC5] hover:bg-[#C0CFC5]/10'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
                <div className="border-t border-[#C0CFC5]/10 pt-2 mt-2 space-y-2">
                  <Link
                    to="/login"
                    className={`block px-4 py-3 transition-colors font-medium ${
                      isLoginPage
                        ? 'bg-[#C0CFC5] text-primary font-semibold'
                        : 'text-[#C0CFC5] hover:text-[#C0CFC5] hover:bg-[#C0CFC5]/10'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className={`block mx-4 py-3 rounded-xl font-semibold text-center transition-all duration-300 ${
                      isSignupPage
                        ? 'bg-[#C0CFC5] text-primary border-2 border-[#C0CFC5]'
                        : 'bg-primary text-[#C0CFC5] hover:bg-primary/90'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;