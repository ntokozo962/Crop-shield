import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';
  const isPricingPage = location.pathname === '/pricing';

  // Classes
  const activeLinkClasses = 'bg-[#C0CFC5] text-primary font-semibold border border-[#C0CFC5]/20';
  const inactiveLinkClasses = 'text-[#C0CFC5] hover:text-[#C0CFC5] hover:bg-[#C0CFC5]/10';
  const authButtonClasses = 'bg-[#C0CFC5] text-primary px-6 py-2.5 rounded-xl font-semibold hover:bg-[#C0CFC5]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5';

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
              authenticatedLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path ? activeLinkClasses : inactiveLinkClasses
                  }`}
                >
                  {link.label}
                </Link>
              ))
            ) : (
              <>
                <button
                  onClick={() => scrollToSection('features')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${inactiveLinkClasses}`}
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${inactiveLinkClasses}`}
                >
                  How it Works
                </button>
                <Link
                  to="/pricing"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isPricingPage ? activeLinkClasses : inactiveLinkClasses
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
                <button onClick={handleLogout} className={authButtonClasses}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={authButtonClasses}>
                  Login
                </Link>
                <Link to="/signup" className={authButtonClasses}>
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
              <>
                {authenticatedLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block px-4 py-3 text-[#C0CFC5] text-sm font-medium transition-all duration-200 ${
                      location.pathname === link.path ? activeLinkClasses : inactiveLinkClasses
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-[#C0CFC5]/10 pt-2 mt-2 space-y-2">
                  <div className="px-4 py-2 text-sm text-[#C0CFC5]">
                    Welcome, <span className="font-semibold text-[#C0CFC5]">{user?.name || 'Farmer'}</span>
                  </div>
                  <button onClick={handleLogout} className={authButtonClasses + ' w-full text-left'}>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => scrollToSection('features')}
                  className={`block w-full text-left px-4 py-3 text-sm font-medium ${inactiveLinkClasses}`}
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className={`block w-full text-left px-4 py-3 text-sm font-medium ${inactiveLinkClasses}`}
                >
                  How it Works
                </button>
                <Link
                  to="/pricing"
                  className={`block px-4 py-3 text-sm font-medium ${
                    isPricingPage ? activeLinkClasses : inactiveLinkClasses
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
                <div className="border-t border-[#C0CFC5]/10 pt-2 mt-2 space-y-2">
                  <Link to="/login" className={authButtonClasses + ' block text-center'} onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/signup" className={authButtonClasses + ' block text-center'} onClick={() => setIsMenuOpen(false)}>
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
