import React, { createContext, useState } from 'react';

// Export the context itself
export const AuthContext = createContext();

// Only export the provider component from this file
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email, password) => {
    // Mock login - replace with real authentication
    setUser({ email, name: 'Farmer User', location: 'Farm Location' });
    setIsAuthenticated(true);
  };

  const signup = (email, password, userData) => {
    // Mock signup - replace with real authentication
    setUser({ ...userData, email });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
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