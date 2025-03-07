import axios, { AxiosError } from "axios";
import { Product, User, CartItem } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear token and user data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login if not already on login page
      const currentPath = window.location.pathname;
      if (
        !currentPath.includes("/login") &&
        !currentPath.includes("/register")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    return response.data;
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    const response = await api.post("/auth/register", userData);
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    const user = response.data;
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },

  // Get stored user data
  getStoredUser: () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        return null;
      }
    }
    return null;
  },

  getProfile: async (): Promise<User> => {
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  },

  updateProfile: async (data: {
    name: string;
    email: string;
  }): Promise<User> => {
    const response = await axios.put(`${API_URL}/auth/profile`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await axios.put(`${API_URL}/auth/password`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },

  deleteAccount: async (): Promise<void> => {
    await axios.delete(`${API_URL}/auth/account`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  },
};

// Products endpoints
export const productsAPI = {
  getAll: async (params?: {
    category?: string;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get("/products", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (product: Omit<Product, "_id">) => {
    const response = await api.post("/products", product);
    return response.data;
  },

  update: async (id: string, product: Partial<Product>) => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  updateStock: async (id: string, stock: number) => {
    const response = await api.patch(`/products/${id}/stock`, { stock });
    return response.data;
  },
};

// Cart endpoints
export const cartAPI = {
  getCart: async () => {
    try {
      const response = await api.get("/cart");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || "Failed to get cart");
      }
      throw error;
    }
  },

  addToCart: async (productId: string, quantity: number) => {
    try {
      const response = await api.post("/cart", { productId, quantity });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || "Failed to add item to cart";
        if (error.response?.status === 401) {
          throw new Error("Please log in to add items to your cart");
        }
        if (error.response?.status === 400) {
          throw new Error(errorMessage);
        }
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  updateQuantity: async (productId: string, quantity: number) => {
    try {
      const response = await api.put(`/cart/${productId}`, { quantity });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || "Failed to update quantity"
        );
      }
      throw error;
    }
  },

  removeFromCart: async (productId: string) => {
    try {
      const response = await api.delete(`/cart/${productId}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || "Failed to remove item from cart"
        );
      }
      throw error;
    }
  },

  clearCart: async () => {
    try {
      const response = await api.delete("/cart");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || "Failed to clear cart"
        );
      }
      throw error;
    }
  },
};

// Orders endpoints
export const ordersAPI = {
  createOrder: async (orderData: {
    items: CartItem[];
    shippingAddress: string;
    paymentMethod: string;
  }) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },

  getOrders: async () => {
    const response = await api.get("/orders");
    return response.data;
  },

  getOrderById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
};

// Admin endpoints
export const adminAPI = {
  getUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data;
  },

  updateUserRole: async (userId: string, role: "user" | "admin") => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get("/admin/dashboard");
    return response.data;
  },
};

export default api;
