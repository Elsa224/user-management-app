import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

// API configuration
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

// Create axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Token management
export const tokenManager = {
    get: () => getCookie("token"),
    set: (token: string) => {
        setCookie("token", token, {
            maxAge: 60 * 60 * 24 * 7, // 7 days
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
    },
    remove: () => {
        deleteCookie("token");
    },
};

// Request interceptor to add token
api.interceptors.request.use(
    config => {
        const token = tokenManager.get();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Token expired or invalid, remove it
            tokenManager.remove();
            // Redirect to login page
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

// Types
export interface User {
    id: number;
    slug: string;
    name: string;
    email: string;
    role: "admin" | "user";
    active: boolean;
    created_at: string;
    updated_at: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        access_token: string;
        token_type: string;
        expires_in: number;
        user: User;
    };
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

// Auth API functions
export const authApi = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await api.post("/login", { email, password });
        return response.data;
    },

    logout: async (): Promise<ApiResponse> => {
        const response = await api.post("/logout");
        return response.data;
    },

    me: async (): Promise<ApiResponse<User>> => {
        const response = await api.get("/me");
        return response.data;
    },

    refresh: async (): Promise<LoginResponse> => {
        const response = await api.post("/refresh");
        return response.data;
    },

    changePassword: async (
        currentPassword: string,
        newPassword: string,
        newPasswordConfirmation: string
    ): Promise<ApiResponse> => {
        const response = await api.post("/change-password", {
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirmation: newPasswordConfirmation,
        });
        return response.data;
    },
};

// Users API functions
export const usersApi = {
    getUsers: async (params?: {
        search?: string;
        per_page?: number;
        page?: number;
    }): Promise<ApiResponse<PaginatedResponse<User>>> => {
        const response = await api.get("/users", { params });
        return response.data;
    },

    getUser: async (slug: string): Promise<ApiResponse<User>> => {
        const response = await api.get(`/users/${slug}`);
        return response.data;
    },

    createUser: async (userData: {
        name: string;
        email: string;
        password: string;
        role: "admin" | "user";
        active?: boolean;
    }): Promise<ApiResponse<User>> => {
        const response = await api.post("/users", userData);
        return response.data;
    },

    updateUser: async (
        slug: string,
        userData: Partial<{
            name: string;
            email: string;
            password: string;
            role: "admin" | "user";
            active: boolean;
        }>
    ): Promise<ApiResponse<User>> => {
        const response = await api.put(`/users/${slug}`, userData);
        return response.data;
    },

    deleteUser: async (slug: string): Promise<ApiResponse> => {
        const response = await api.delete(`/users/${slug}`);
        return response.data;
    },

    changeUserStatus: async (
        slug: string,
        active: boolean
    ): Promise<ApiResponse<User>> => {
        const response = await api.patch(`/users/${slug}/status`, { active });
        return response.data;
    },
};
