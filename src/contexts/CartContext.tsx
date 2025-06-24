"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useSession } from "next-auth/react";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  isLoading: boolean;
}

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: CartItem }
  | {
      type: "UPDATE_QUANTITY";
      payload: { id: string; quantity: number };
    }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" };

const CartContext = createContext<{
  state: CartState;
  addToCart: (product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_CART":
      const total = action.payload.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return { ...state, items: action.payload, total, isLoading: false };

    case "ADD_ITEM":
      const existingItemIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId
      );
      let newItems;

      if (existingItemIndex >= 0) {
        newItems = [...state.items];
        newItems[existingItemIndex].quantity += action.payload.quantity;
      } else {
        newItems = [...state.items, action.payload];
      }

      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return { ...state, items: newItems, total: newTotal };

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter((item) => item.quantity > 0);

      const updatedTotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return { ...state, items: updatedItems, total: updatedTotal };
    }

    case "REMOVE_ITEM": {
      const filteredItems = state.items.filter(
        (item) => item.id !== action.payload
      );
      const filteredTotal = filteredItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return { ...state, items: filteredItems, total: filteredTotal };
    }

    case "CLEAR_CART":
      return { ...state, items: [], total: 0 };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session } = useSession();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    isLoading: false,
  });

  // Load cart from server when user logs in
  useEffect(() => {
    if (session?.user) {
      loadCart();
    }
  }, [session]);

  const loadCart = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const cartData = await response.json();
        dispatch({ type: "SET_CART", payload: cartData.items || [] });
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addToCart = async (product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  }) => {
    const cartItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    };

    // Optimistic update
    dispatch({ type: "ADD_ITEM", payload: cartItem });

    // Sync with server if logged in
    if (session?.user) {
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id, quantity: 1 }),
        });
      } catch (error) {
        console.error("Failed to sync cart with server:", error);
        // Could revert optimistic update here
      }
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });

    if (session?.user) {
      try {
        await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id, quantity }),
        });
      } catch (error) {
        console.error("Failed to update cart on server:", error);
      }
    }
  };

  const removeFromCart = async (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });

    if (session?.user) {
      try {
        await fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id }),
        });
      } catch (error) {
        console.error("Failed to remove item from server cart:", error);
      }
    }
  };

  const clearCart = async () => {
    dispatch({ type: "CLEAR_CART" });

    if (session?.user) {
      try {
        await fetch("/api/cart/clear", { method: "POST" });
      } catch (error) {
        console.error("Failed to clear cart on server:", error);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
