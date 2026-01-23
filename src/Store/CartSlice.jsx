import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // { id, book, quantity, type: 'purchase' | 'rent', startDate?, endDate?, totalPrice }
  totalCount: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { book, quantity, type, startDate, endDate } = action.payload;
      
      const cartItem = {
        id: `${book.id || book.key}_${type}_${Date.now()}`,
        book: {
          id: book.id || book.key,
          name: book.name,
          price: book.price,
          imageUrl: book.imageUrl,
          description: book.description,
          type: book.type,
        },
        quantity,
        itemType: type, // 'purchase' or 'rent'
        totalPrice: book.price * quantity,
        addedAt: new Date().toISOString(),
      };

      if (type === "rent") {
        cartItem.startDate = startDate;
        cartItem.endDate = endDate;
      }

      state.items.push(cartItem);
      state.totalCount = state.items.length;
      state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
      state.totalCount = state.items.length;
      state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
    },

    updateCartItemQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find((item) => item.id === itemId);
      if (item) {
        item.quantity = quantity;
        item.totalPrice = item.book.price * quantity;
        state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalCount = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
