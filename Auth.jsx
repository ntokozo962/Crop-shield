import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/O-modified.png';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine initial state based on current route
  const getInitialIsLogin = () => {
    return location.pathname === '/login';
  };

  const [isLogin, setIsLogin] = useState(getInitialIsLogin());
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    location: '',
    farmType: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState('');
  const { login, signup } = useAuth();

  // Update isLogin when route changes
  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.location) newErrors.location = 'Location is required';
      if (!formData.farmType) newErrors.farmType = 'Farm type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isLogin) {
      login(formData.email, formData.password, formData.rememberMe);
    } else {
      signup(formData.email, formData.password, formData);
    }
    navigate('/dashboard');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
    alert(`${provider} login would be implemented here`);
  };

  const handleForgotPassword = () => {
    console.log('Forgot password flow');
    alert('Password reset feature would be implemented here');
  };

  const getInputSuggestions = (fieldName) => {
    const suggestions = {
      email: 'Enter your email address',
      password: 'Use a strong password with 6+ characters',
      confirmPassword: 'Re-enter your password to confirm',
      name: 'Enter your full name',
      location: 'Enter your farm location (city, state)',
      farmType: 'Select your primary farm type'
    };
    return suggestions[fieldName] || '';
  };

  const handleToggleAuthMode = () => {
    const newMode = !isLogin;
    setIsLogin(newMode);
    
    // Navigate to the correct route
    if (newMode) {
      navigate('/login');
    } else {
      navigate('/signup');
    }
    
    // Clear form when switching modes
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      location: '',
      farmType: '',
      rememberMe: false
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-[#C0CFC5] pt-16">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="glass-card rounded-2xl p-8">
          <div className="text-center mb-8">
            {/* Logo Section */}
            <div className="mx-auto w-16 h-16 bg-[#091B07] rounded-xl flex items-center justify-center shadow-lg mb-4 overflow-hidden">
              <img 
                src={logo} 
                alt="Crop Shield Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-3xl font-bold text-[#091B07] font-sans-serif">
              {isLogin ? 'WELCOME BACK' : 'JOIN CROP SHIELD'}
            </h2>
            <p className="text-[#091B07] mt-2">
              {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
            <div className="space-y-4">
              {/* SIGNUP FIELDS - Only show when NOT in login mode */}
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[#091B07] mb-2">
                      Full Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      className="w-full px-4 py-3 bg-[#C0CFC5] border border-[#091B07]/20 rounded-lg text-[#091B07] placeholder-[#091B07]/60 focus:outline-none focus:ring-2 focus:ring-[#091B07] focus:border-transparent"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField('')}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#091B07] mb-2">
                      Farm Location
                    </label>
                    <input
                      name="location"
                      type="text"
                      required
                      autoComplete="address-level2"
                      className="w-full px-4 py-3 bg-[#C0CFC5] border border-[#091B07]/20 rounded-lg text-[#091B07] placeholder-[#091B07]/60 focus:outline-none focus:ring-2 focus:ring-[#091B07] focus:border-transparent"
                      placeholder="Enter your farm location"
                      value={formData.location}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('location')}
                      onBlur={() => setFocusedField('')}
                    />
                    {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#091B07] mb-2">
                      Farm Type
                    </label>
                    <select
                      name="farmType"
                      required
                      autoComplete="off"
                      className="w-full px-4 py-3 bg-[#C0CFC5] border border-[#091B07]/20 rounded-lg text-[#091B07] focus:outline-none focus:ring-2 focus:ring-[#091B07] focus:border-transparent"
                      value={formData.farmType}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('farmType')}
                      onBlur={() => setFocusedField('')}
                    >
                      <option value="">Select Farm Type</option>
                      <option value="vegetable">Vegetable Farm</option>
                      <option value="fruit">Fruit Orchard</option>
                      <option value="grain">Grain Farm</option>
                      <option value="livestock">Livestock Farm</option>
                      <option value="mixed">Mixed Farming</option>
                    </select>
                    {errors.farmType && <p className="text-red-500 text-sm mt-1">{errors.farmType}</p>}
                  </div>
                </>
              )}
              
              {/* EMAIL FIELD - Always show */}
              <div>
                <label className="block text-sm font-medium text-[#091B07] mb-2">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 bg-[#C0CFC5] border border-[#091B07]/20 rounded-lg text-[#091B07] placeholder-[#091B07]/60 focus:outline-none focus:ring-2 focus:ring-[#091B07] focus:border-transparent"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              
              {/* PASSWORD FIELD - Always show */}
              <div>
                <label className="block text-sm font-medium text-[#091B07] mb-2">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full px-4 py-3 bg-[#C0CFC5] border border-[#091B07]/20 rounded-lg text-[#091B07] placeholder-[#091B07]/60 focus:outline-none focus:ring-2 focus:ring-[#091B07] focus:border-transparent"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* CONFIRM PASSWORD - Only show in signup mode */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-[#091B07] mb-2">
                    Confirm Password
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-3 bg-[#C0CFC5] border border-[#091B07]/20 rounded-lg text-[#091B07] placeholder-[#091B07]/60 focus:outline-none focus:ring-2 focus:ring-[#091B07] focus:border-transparent"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField('')}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              )}

              {/* Input Suggestions */}
              {focusedField && (
                <div className="p-3 bg-[#091B07]/10 rounded-lg text-sm text-[#091B07]">
                  💡 {getInputSuggestions(focusedField)}
                </div>
              )}
            </div>

            {/* Remember Me & Forgot Password - Only show in login mode */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    name="rememberMe"
                    type="checkbox"
                    className="w-4 h-4 text-[#091B07] bg-[#C0CFC5] border-[#091B07]/20 rounded focus:ring-[#091B07] focus:ring-2"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <span className="ml-2 text-sm text-[#091B07]">Remember me</span>
                </label>
                
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-[#091B07] hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#091B07] text-[#C0CFC5] py-4 rounded-xl font-semibold hover:bg-[#091B07]/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </button>
          </form>

          {/* Social Login Section - Below Manual Input */}
          <div className="mt-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#C0CFC5] text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 transition-all duration-300 font-medium"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              
              <button
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-all duration-300 font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continue with Facebook
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('apple')}
                className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-all duration-300 font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Continue with Apple
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[#091B07]">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={handleToggleAuthMode}
                className="font-semibold text-[#091B07] hover:underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;