import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createDropRequestApi, getAllDropRequestsApi, acceptDropRequestApi, rejectDropRequestApi } from "../APIs/RequestAPi";

export const createDropRequest = createAsyncThunk(
  "requests/createDropRequest",
  async (requestData, { rejectWithValue }) => {
    try {
      return await createDropRequestApi(requestData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchDropRequests = createAsyncThunk(
  "requests/fetchDropRequests",
  async (_, { rejectWithValue }) => {
    try {
      const requests = await getAllDropRequestsApi();
      // Sort newest first (last request on top)
      return requests.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const acceptDropRequest = createAsyncThunk(
  "requests/acceptDropRequest",
  async ({ requestId, bookData, userEmail }, { rejectWithValue }) => {
    try {
      await acceptDropRequestApi(requestId, bookData, userEmail);
      return requestId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const rejectDropRequest = createAsyncThunk(
  "requests/rejectDropRequest",
  async ({ requestId, userEmail, bookName, imageUrl }, { rejectWithValue }) => {
    try {
      await rejectDropRequestApi(requestId, userEmail, bookName, imageUrl);
      return requestId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const requestSlice = createSlice({
  name: "requests",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDropRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDropRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDropRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createDropRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDropRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createDropRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(acceptDropRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptDropRequest.fulfilled, (state, action) => {
        state.loading = false;
        const request = state.list.find((req) => req.id === action.payload.requestId);
        if (request) request.status = "accepted";
      })
      .addCase(acceptDropRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(rejectDropRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectDropRequest.fulfilled, (state, action) => {
        state.loading = false;
        const request = state.list.find((req) => req.id === action.payload.requestId);
        if (request) request.status = "rejected";
      })
      .addCase(rejectDropRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default requestSlice.reducer;
