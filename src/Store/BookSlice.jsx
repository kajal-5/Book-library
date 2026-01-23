import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllBooksApi, addBookApi, deleteBookApi, updateBookApi } from "../APIs/BookAPicall";

/* =========================
   FETCH ALL BOOKS
========================= */
export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getAllBooksApi();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* =========================
   ADD BOOK (ADMIN)
========================= */
export const addBook = createAsyncThunk(
  "books/addBook",
  async (bookData, { rejectWithValue }) => {
    try {
      const savedBook = await addBookApi(bookData);
      return savedBook; // ✅ IMPORTANT
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* =========================
   DELETE BOOK (ADMIN)
========================= */
export const deleteBook = createAsyncThunk(
  "books/deleteBook",
  async (bookId, { rejectWithValue }) => {
    try {
      await deleteBookApi(bookId);
      return bookId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* =========================
   UPDATE BOOK (ADMIN)
========================= */
export const updateBook = createAsyncThunk(
  "books/updateBook",
  async ({ bookId, bookData }, { rejectWithValue }) => {
    try {
      const updatedBook = await updateBookApi(bookId, bookData);
      return updatedBook;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* =========================
   SLICE
========================= */
const bookSlice = createSlice({
  name: "books",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearBooks(state) {
      state.list = [];
    },
  },

  extraReducers: (builder) => {
    builder
      /* ---------- FETCH ---------- */
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- ADD ---------- */
      .addCase(addBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload); // ✅ ONLY FIX
      })
      .addCase(addBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- DELETE ---------- */
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((book) => book.id !== action.payload);
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- UPDATE ---------- */
      .addCase(updateBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((book) => book.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBooks } = bookSlice.actions;
export default bookSlice.reducer;
