import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('@ServerApp:token');
        const savedUser = localStorage.getItem('@ServerApp:user');
        
        if (token && savedUser) {
            api.defaults.headers.authorization = `Bearer ${token}`;
            setUser(JSON.parse(savedUser));
        }
        
        setLoading(false);
    }, []);

    const login = async (email, password, rememberMe = false) => {
        const response = await api.post('/auth/login', {
            email,
            password
        });

        const { token, user } = response.data;

        if (rememberMe) {
            localStorage.setItem('@ServerApp:token', token);
            localStorage.setItem('@ServerApp:user', JSON.stringify(user));
        } else {
            sessionStorage.setItem('@ServerApp:token', token);
            sessionStorage.setItem('@ServerApp:user', JSON.stringify(user));
        }

        api.defaults.headers.authorization = `Bearer ${token}`;
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem('@ServerApp:token');
        localStorage.removeItem('@ServerApp:user');
        sessionStorage.removeItem('@ServerApp:token');
        sessionStorage.removeItem('@ServerApp:user');
        api.defaults.headers.authorization = '';
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading,
            login,
            logout,
            signed: !!user 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
