// auth.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { saveItem, getItem, deleteItem } from './SecureStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = await getItem('token');
      if (token) setUser({ token });
    };
    loadUser();
  }, []);

  const login = async (token) => {
    await saveItem('token', token);
    setUser({ token });
  };

  const logout = async () => {
    await deleteItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
