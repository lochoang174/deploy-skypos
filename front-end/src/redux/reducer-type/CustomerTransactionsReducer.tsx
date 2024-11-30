import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {  ITransaction, TransactionsPayLoad } from "../../types";
import { AxiosInstance } from "axios";
import { TablePaginationConfig } from "antd";

// Định nghĩa state cho slice
interface CustomerTransactionState {
  customerId: string;
  transactions: ITransaction[];
  loading: boolean;
  pagination: TablePaginationConfig;
  totalTransactions: number;
  searchTerm: string;
  error: string | null;
}

interface FetchTransactionsParams {
  customerId: string,
  axiosInstance: AxiosInstance;
  page: number;
  limit: number;
  staffName?: string;
}

// Khởi tạo state ban đầu
const initialState: CustomerTransactionState = {
  customerId: "",
  transactions: [],
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pageSize: 5
  },
  totalTransactions: 0,
  searchTerm: ""
};

// fetch customer transactions
export const fetchCustomerTransactions = createAsyncThunk<
  TransactionsPayLoad,
  FetchTransactionsParams,
  { rejectValue: string }
>(
  'customer/fetchCustomerTransactions',
  async ({ customerId, axiosInstance, page, limit, staffName }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/transaction/customer/${customerId}`,
        { params: { page, limit, staffName } }
      );

      console.log("API Response:", response.data);
      return response.data.data as TransactionsPayLoad;
    } catch (err: any) {
      console.error('Error:', err);
      return rejectWithValue(err.response?.data || 'Error fetching transactions');
    }
  }
);

// Tạo slice
const customerTransactionsSlice = createSlice({
  name: "customerTransactions",
  initialState,
  reducers: {
    setPagination: (state, action: PayloadAction<{ page: number; pageSize: number }>) => {
      const { page, pageSize } = action.payload;
      state.pagination = {
        current: page,
        pageSize
      };
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {

    builder
      .addCase(fetchCustomerTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomerTransactions.fulfilled, (state, action: PayloadAction<TransactionsPayLoad>) => {
        //   state.customers = [];
        state.transactions = action.payload.transactionList;
        state.totalTransactions = action.payload.totalTransactions;
        state.loading = false;
      })
      .addCase(fetchCustomerTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch customer transactions";
      });
  },
});
export const {setPagination, setSearchTerm} = customerTransactionsSlice.actions;
export default customerTransactionsSlice.reducer;