// src/features/account/accountSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CustomersPayload, ICustomer } from "../../types";
import { AxiosInstance } from "axios";
import { TablePaginationConfig } from "antd";
interface CustomerState {
  customers: ICustomer[];
  loading: boolean;
  pagination: TablePaginationConfig
  totalCustomers: number;
  searchTerm: string;
  error: string | null;
}

interface FetchCustomersParams {
  axiosInstance: AxiosInstance;
  page: number;
  limit: number;
  customerName?: string;
}

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pageSize: 5
  },
  totalCustomers: 0,
  searchTerm: ""
};

// Tạo async thunk để fetch data
export const fetchCustomers = createAsyncThunk<
  CustomersPayload,
  FetchCustomersParams,
  { rejectValue: string }
>(
  'customer/fetchCustomers',
  async ({ axiosInstance, page, limit, customerName }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/customer',
        { params: { page, limit, customerName } }
      );
      console.log(response.data)
      return response.data.data as CustomersPayload;
    } catch (err: any) {
      console.error('Error:', err);
      return rejectWithValue(err.response?.data || 'Error fetching customers');
    }
  }
);

// Tạo slice
const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setPagination: (state, action: PayloadAction<{ page: number; pageSize: number }>) => {
      const { page, pageSize } = action.payload;
      state.pagination = {
        current: page,
        pageSize,
      };
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action: PayloadAction<CustomersPayload>) => {
        state.customers = action.payload.customerList;
        state.totalCustomers = action.payload.totalCustomer;
        state.loading = false;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch customers";
      });
  },
});
export const { setPagination, setSearchTerm } = customerSlice.actions;
export default customerSlice.reducer;
