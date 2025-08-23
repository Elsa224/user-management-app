"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { toast } from "sonner";
import { User, authApi, tokenManager } from "./api";

// Create Query Client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
});

// Auth Context
interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const login = async (email: string, password: string) => {
        try {
            const response = await authApi.login(email, password);
            if (response.success) {
                tokenManager.set(response.data.access_token);
                setUser(response.data.user);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            tokenManager.remove();
            setUser(null);
            
            // Add a 2-second delay before redirecting to login
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
        }
    };

    const refreshUser = async () => {
        try {
            const response = await authApi.me();
            if (response.success && response.data) {
                setUser(response.data);
            } else {
                throw new Error("Failed to fetch user");
            }
        } catch (error) {
            console.error("Refresh user error:", error);
            tokenManager.remove();
            setUser(null);
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            const token = tokenManager.get();
            if (token) {
                await refreshUser();
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// Combined Providers
export function Providers({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
    );
}
