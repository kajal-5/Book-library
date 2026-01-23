import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

import bookReducer from "./BookSlice";
import requestReducer from "./RequestSlice";
import cartReducer from "./CartSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    requests: requestReducer,
    cart: cartReducer,
  },
});

export default store;
