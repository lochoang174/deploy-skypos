// src/features/account/accountSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { TransactionsPayLoad, ITransaction } from "../../types";
import { AxiosInstance } from "axios";
// Định nghĩa state cho slice
interface TransactionState {
  transactions: ITransaction[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalTransaction: number;
  error: string | null;
}

// Khởi tạo state ban đầu
const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null, 
  currentPage: 0,
  totalPages: 0,
  totalTransaction: 0,
};

// Tạo async thunk để fetch data
export const fetchTransactions = createAsyncThunk<
  TransactionsPayLoad, 
  AxiosInstance,  // Axios is now passed as an argument
  { rejectValue: string }
>(
  'transaction/fetchTransactions',
  async (axiosInstance, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/transaction');
      return response.data.data as TransactionsPayLoad;
    } catch (err: any) {
      console.error('Error:', err);
      return rejectWithValue(err.response?.data || 'Error fetching transactions');
    }
  }
);
// Tạo slice
const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTransactions.fulfilled,
        (state, action: PayloadAction<TransactionsPayLoad>) => {
          console.log( action.payload)
          state.transactions = action.payload.transactionList;
          state.currentPage = action.payload.currentPage;
          state.totalPages = action.payload.totalPages;
          // @ts-ignore
          state.totalTransaction = action.payload.totalTransaction;
          state.loading = false;
        }
      )
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch transactions";
      });
  },
});

export default transactionSlice.reducer;
