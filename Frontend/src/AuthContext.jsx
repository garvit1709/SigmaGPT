import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  fetchMe,
  getStoredToken,
  setStoredToken,
  clearStoredToken,
} from "./api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setUsage(null);
      setLoading(false);
      return;
    }

    try {
      const data = await fetchMe();
      setUser(data.user);
      setUsage(data.usage);
    } catch {
      clearStoredToken();
      setUser(null);
      setUsage(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    setStoredToken(data.token);
    setUser(data.user);
    await loadUser();
    return data.user;
  };

  const register = async (name, email, password) => {
    const data = await apiRegister(name, email, password);
    setStoredToken(data.token);
    setUser(data.user);
    await loadUser();
    return data.user;
  };

  const logout = () => {
    clearStoredToken();
    setUser(null);
    setUsage(null);
  };

  const updateUser = (updatedUser, updatedUsage) => {
    if (updatedUser) setUser(updatedUser);
    if (updatedUsage) setUsage(updatedUsage);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        usage,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loadUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
