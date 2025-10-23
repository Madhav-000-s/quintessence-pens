import { create } from "zustand";
import type { CartItemResponse } from "@/types/api";
import {
  getCart,
  removeFromCart as removeFromCartService,
  updateCartQuantity as updateCartQuantityService,
  getCartItemCount,
  getCartTotal,
} from "@/lib/services/cart-service";
import { getCurrentCustomerId } from "@/lib/services/user-service";

interface CartState {
  // State
  items: CartItemResponse[];
  isLoading: boolean;
  error: string | null;
  customerId: number | null;

  // Actions
  fetchCart: () => Promise<void>;
  addItem: (item: CartItemResponse) => void;
  removeItem: (cartId: number) => Promise<void>;
  updateQuantity: (cartId: number, count: number) => Promise<void>;
  clearError: () => void;
  getItemCount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  customerId: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });

    try {
      const customerId = await getCurrentCustomerId();
      const items = await getCart(customerId);

      set({
        items,
        customerId,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch cart";
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  addItem: (item: CartItemResponse) => {
    set((state) => ({
      items: [...state.items, item],
    }));
  },

  removeItem: async (cartId: number) => {
    set({ isLoading: true, error: null });

    try {
      await removeFromCartService(cartId);

      set((state) => ({
        items: state.items.filter((item) => item.id !== cartId),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error removing cart item:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to remove item";
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  updateQuantity: async (cartId: number, count: number) => {
    set({ isLoading: true, error: null });

    try {
      const updatedItem = await updateCartQuantityService(cartId, count);

      set((state) => ({
        items: state.items.map((item) =>
          item.id === cartId ? updatedItem : item
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update quantity";
      set({
        error: errorMessage,
        isLoading: false,
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  getItemCount: () => {
    const { items } = get();
    return items.reduce((total, item) => total + (item.count || 1), 0);
  },

  getTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + (item.total_price || 0), 0);
  },
}));
