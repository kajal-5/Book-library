import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const DB_BASE_URL = "https://book-app-339c8-default-rtdb.firebaseio.com";

// Load cart from Firebase for a specific user (load all items where userEmail matches)
export const loadCartFromFirebase = createAsyncThunk(
  "cart/loadFromFirebase",
  async (userEmail) => {
    const response = await fetch(`${DB_BASE_URL}/itemcart.json`);
    const data = await response.json();
    
    if (!data) {
      return { items: [], totalCount: 0, totalAmount: 0 };
    }
    
    // Filter items by userEmail and convert to array
    const items = Object.keys(data)
      .filter(key => data[key].userEmail === userEmail)
      .map(key => ({
        firebaseId: key, // Store Firebase key for deletion
        id: data[key].id,
        book: data[key].book,
        quantity: data[key].quantity,
        itemType: data[key].itemType,
        totalPrice: data[key].totalPrice,
        addedAt: data[key].addedAt,
        userEmail: data[key].userEmail,
        startDate: data[key].startDate,
        endDate: data[key].endDate,
      }));
    
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
    
    return { items, totalCount, totalAmount };
  }
);

// Save a single cart item to Firebase
export const saveCartItemToFirebase = createAsyncThunk(
  "cart/saveItemToFirebase",
  async (cartItem) => {
    // If item already has firebaseId, update it; otherwise create new
    const url = cartItem.firebaseId 
      ? `${DB_BASE_URL}/itemcart/${cartItem.firebaseId}.json`
      : `${DB_BASE_URL}/itemcart.json`;
    
    const method = cartItem.firebaseId ? "PUT" : "POST";
    
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: cartItem.id,
        book: cartItem.book,
        quantity: cartItem.quantity,
        itemType: cartItem.itemType,
        totalPrice: cartItem.totalPrice,
        addedAt: cartItem.addedAt,
        userEmail: cartItem.userEmail,
        startDate: cartItem.startDate,
        endDate: cartItem.endDate,
      })
    });
    
    const result = await response.json();
    
    // If new item, result.name contains the Firebase generated ID
    if (!cartItem.firebaseId && result.name) {
      return { ...cartItem, firebaseId: result.name };
    }
    
    return cartItem;
  }
);

// Delete a cart item from Firebase
export const deleteCartItemFromFirebase = createAsyncThunk(
  "cart/deleteItemFromFirebase",
  async (firebaseId) => {
    if (firebaseId) {
      await fetch(`${DB_BASE_URL}/itemcart/${firebaseId}.json`, {
        method: "DELETE"
      });
    }
    return firebaseId;
  }
);

// Clear all cart items for a user from Firebase
export const clearCartFromFirebase = createAsyncThunk(
  "cart/clearFromFirebase",
  async (userEmail) => {
    // Load all items and delete those belonging to this user
    const response = await fetch(`${DB_BASE_URL}/itemcart.json`);
    const data = await response.json();
    
    if (data) {
      const deletePromises = Object.keys(data)
        .filter(key => data[key].userEmail === userEmail)
        .map(key => fetch(`${DB_BASE_URL}/itemcart/${key}.json`, { method: "DELETE" }));
      
      await Promise.all(deletePromises);
    }
    
    return { items: [], totalCount: 0, totalAmount: 0 };
  }
);

const initialState = {
  items: [], // { id, firebaseId, book, quantity, itemType: 'purchase' | 'rent', startDate?, endDate?, totalPrice, userEmail }
  totalCount: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { book, quantity, type, startDate, endDate, userEmail, firebaseId, id, rentalFee, securityDeposit, totalAmount } = action.payload;
      
      const cartItem = {
        id: id || `${book.id || book.key}_${type}_${Date.now()}`,
        firebaseId: firebaseId, // Store Firebase ID for deletion
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
        totalPrice: totalAmount || (book.price * quantity), // Use totalAmount for rent, simple calc for purchase
        addedAt: new Date().toISOString(),
        userEmail: userEmail, // Store user email with cart item
      };

      if (type === "rent") {
        cartItem.startDate = startDate;
        cartItem.endDate = endDate;
        cartItem.rentalFee = rentalFee;
        cartItem.securityDeposit = securityDeposit;
      }

      state.items.push(cartItem);
      state.totalCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
      state.totalCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
    },

    updateCartItemQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find((item) => item.id === itemId);
      if (item) {
        item.quantity = quantity;
        
        if (item.itemType === "rent") {
          // For rent: recalculate based on rental fee and security deposit per quantity
          const basePrice = item.book.price * quantity;
          const rentalDays = item.startDate && item.endDate ? Math.ceil((new Date(item.endDate) - new Date(item.startDate)) / (1000 * 60 * 60 * 24)) : 0;
          item.rentalFee = rentalDays <= 180 ? basePrice * 0.3 : basePrice * 0.4 * Math.ceil(rentalDays / 365);
          item.securityDeposit = basePrice * 0.5;
          item.totalPrice = item.rentalFee + item.securityDeposit;
        } else {
          // For purchase: simple multiplication
          item.totalPrice = item.book.price * quantity;
        }
        
        state.totalCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.totalAmount = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalCount = 0;
      state.totalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCartFromFirebase.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalCount = action.payload.totalCount || 0;
        state.totalAmount = action.payload.totalAmount || 0;
      })
      .addCase(saveCartItemToFirebase.fulfilled, (state, action) => {
        // Update firebaseId if new item was created
        const item = state.items.find(i => i.id === action.payload.id);
        if (item && action.payload.firebaseId) {
          item.firebaseId = action.payload.firebaseId;
        }
      })
      .addCase(deleteCartItemFromFirebase.fulfilled, (state, action) => {
        // Item already removed from state by removeFromCart
      })
      .addCase(clearCartFromFirebase.fulfilled, (state, action) => {
        state.items = [];
        state.totalCount = 0;
        state.totalAmount = 0;
      });
  },
});

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
