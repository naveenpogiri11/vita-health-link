
import React, { createContext, useState, useContext, useEffect } from 'react';

// User types
export type UserRole = 'patient' | 'doctor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const MOCK_USERS = [
  {
    id: "p1",
    name: "John Doe",
    email: "patient@example.com",
    password: "password123",
    role: "patient" as UserRole,
  },
  {
    id: "d1",
    name: "Dr. Sarah Smith",
    email: "doctor@example.com",
    password: "password123",
    role: "doctor" as UserRole,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('vita_health_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<void> => {
    setLoading(true);
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user with matching credentials
    const matchedUser = MOCK_USERS.find(
      u => u.email === email && u.password === password && u.role === role
    );
    
    if (!matchedUser) {
      setLoading(false);
      throw new Error('Invalid credentials');
    }
    
    // Create session without password
    const { password: _, ...userWithoutPassword } = matchedUser;
    localStorage.setItem('vita_health_user', JSON.stringify(userWithoutPassword));
    setUser(userWithoutPassword);
    setLoading(false);
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<void> => {
    setLoading(true);
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (MOCK_USERS.some(u => u.email === email)) {
      setLoading(false);
      throw new Error('User already exists');
    }
    
    // In a real app, this would create a new user in the database
    // For now, we'll just pretend it worked and log the user in
    const newUser = {
      id: `${role[0]}${MOCK_USERS.length + 1}`,
      name,
      email,
      role,
    };
    
    localStorage.setItem('vita_health_user', JSON.stringify(newUser));
    setUser(newUser);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('vita_health_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
