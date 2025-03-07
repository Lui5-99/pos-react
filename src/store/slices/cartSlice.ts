import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, Product } from "../../types";
import { cartAPI } from "../../services/api";

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.error = null;
    },
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity: number }>
    ) => {
      const existingItem = state.items.find(
        (item) => item.product._id === action.payload.product._id
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.error = null;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.product._id !== action.payload
      );
      state.error = null;
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (item) => item.product._id === action.payload.productId
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
      state.error = null;
    },
    clearCart: (state) => {
      state.items = [];
      state.error = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Thunk actions
export const fetchCart = () => async (dispatch: any) => {
  try {
    const cartData = await cartAPI.getCart();
    dispatch(setCartItems(cartData.items));
  } catch (error) {
    dispatch(
      setError(error instanceof Error ? error.message : "Failed to fetch cart")
    );
  }
};

export const addToCartAsync =
  (product: Product, quantity: number) => async (dispatch: any) => {
    try {
      await cartAPI.addToCart(product._id, quantity);
      dispatch(addToCart({ product, quantity }));
    } catch (error) {
      dispatch(
        setError(
          error instanceof Error ? error.message : "Failed to add item to cart"
        )
      );
      throw error;
    }
  };

export const removeFromCartAsync =
  (productId: string) => async (dispatch: any) => {
    try {
      await cartAPI.removeFromCart(productId);
      dispatch(removeFromCart(productId));
    } catch (error) {
      dispatch(
        setError(
          error instanceof Error
            ? error.message
            : "Failed to remove item from cart"
        )
      );
      throw error;
    }
  };

export const updateQuantityAsync =
  (productId: string, quantity: number) => async (dispatch: any) => {
    try {
      await cartAPI.updateQuantity(productId, quantity);
      dispatch(updateQuantity({ productId, quantity }));
    } catch (error) {
      dispatch(
        setError(
          error instanceof Error ? error.message : "Failed to update quantity"
        )
      );
      throw error;
    }
  };

export const clearCartAsync = () => async (dispatch: any) => {
  try {
    await cartAPI.clearCart();
    dispatch(clearCart());
  } catch (error) {
    dispatch(
      setError(error instanceof Error ? error.message : "Failed to clear cart")
    );
    throw error;
  }
};

export const {
  setCartItems,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setError,
} = cartSlice.actions;

export default cartSlice.reducer;
