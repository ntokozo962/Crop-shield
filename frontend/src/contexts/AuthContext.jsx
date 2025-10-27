import React, { createContext, useState, useEffect } from 'react';

// Export the context itself
export const AuthContext = createContext();

// Only export the provider component from this file
export function AuthProvider({ children }) {
  // Restore initial state from localStorage if it exists
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    return savedAuth === 'true' ? true : false;
  });

  // Persist changes to localStorage whenever user or auth state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('user');
      localStorage.setItem('isAuthenticated', 'false');
    }
  }, [user]);

  const login = (email, password) => {
    // Mock login - replace with real authentication
    const loggedInUser = { email, name: 'Farmer User', location: 'Farm Location' };
    setUser(loggedInUser);
    setIsAuthenticated(true);
    // localStorage is updated automatically by useEffect
  };

  const signup = (email, password, userData) => {
    // Mock signup - replace with real authentication
    const newUser = { ...userData, email };
    setUser(newUser);
    setIsAuthenticated(true);
    // localStorage is updated automatically by useEffect
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.setItem('isAuthenticated', 'false');
  };

  const value = {
    user,
    isAuthenticated,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
