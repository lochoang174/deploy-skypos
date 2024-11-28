import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ITransaction, StaffTransactionsPayload } from "../../types";
import { AxiosInstance } from "axios";
import { TablePaginationConfig } from "antd";

// Định nghĩa state cho slice
interface StaffTransactionState {
    staffId: string;
    transactions: ITransaction[];
    loading: boolean;
    pagination: TablePaginationConfig;
    totalTransactions: number;
    totalRevenue: number;
    searchTerm: string;
    error: string | null;
}

interface FetchTransactionsParams {
    staffId: string,
    axiosInstance: AxiosInstance;
    page: number;
    limit: number;
    customerName?: string;
}

// Khởi tạo state ban đầu
const initialState: StaffTransactionState = {
    staffId: "",
    transactions: [],
    loading: false,
    error: null,
    pagination: {
        current: 1,
        pageSize: 5
    },
    totalTransactions: 0,
    totalRevenue: 0,
    searchTerm: ""
};

// fetch staff transactions
export const fetchStaffTransactions = createAsyncThunk<
    StaffTransactionsPayload,
    FetchTransactionsParams,
    { rejectValue: string }
>(
    'staff/fetchStaffTransactions',
    async ({ staffId, axiosInstance, page, limit, customerName }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/transaction/staff/${staffId}`,
                { params: { page, limit, customerName } }
            );

            console.log("API Response:", response.data);
            return response.data.data as StaffTransactionsPayload;
        } catch (err: any) {
            console.error('Error:', err);
            return rejectWithValue(err.response?.data || 'Error fetching transactions');
        }
    }
);

// Tạo slice
const staffTransactionsSlice = createSlice({
    name: "staffTransactions",
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
            .addCase(fetchStaffTransactions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStaffTransactions.fulfilled, (state, action: PayloadAction<StaffTransactionsPayload>) => {
                //   state.customers = [];
                state.totalRevenue = action.payload.totalRevenue;
                state.transactions = action.payload.transactionList;
                state.totalTransactions = action.payload.totalTransactions;
                state.loading = false;
            })
            .addCase(fetchStaffTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch customer transactions";
            });
    },
});
export const { setPagination, setSearchTerm } = staffTransactionsSlice.actions;
export default staffTransactionsSlice.reducer;