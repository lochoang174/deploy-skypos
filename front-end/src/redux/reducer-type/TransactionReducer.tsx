// src/features/account/accountSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { axiosPrivate } from "../../api/axios";
import { TransactionsPayLoad, ITransaction, ITransactionDetail } from "../../types";
import usePrivateAxios from "../../hooks/usePrivateAxios";
import { AxiosInstance } from "axios";
// Định nghĩa state cho slice
interface TransactionState {
    transactions: ITransaction[];
    selectedTransaction: ITransactionDetail | null;
    loading: boolean;
    currentPage: number;
    totalPages: number;
    totalTransaction: number;
    error: string | null;
}

// Khởi tạo state ban đầu
const initialState: TransactionState = {
    transactions: [],
    selectedTransaction: null,
    loading: false,
    error: null,
    currentPage: 0,
    totalPages: 0,
    totalTransaction: 0,
};

// Tạo async thunk để fetch data
export const fetchTransactions = createAsyncThunk<
    TransactionsPayLoad,
    AxiosInstance, // Axios is now passed as an argument
    { rejectValue: string }
>("transaction/fetchTransactions", async (axiosInstance, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("/transaction");
        return response.data.data as TransactionsPayLoad;
    } catch (err: any) {
        console.error("Error:", err);
        return rejectWithValue(err.response?.data || "Error fetching transactions");
    }
});

export const fetchTransactionById = createAsyncThunk<
    ITransactionDetail,
    { id: string; axiosInstance: AxiosInstance },
    { rejectValue: string }
>("transaction/fetchTransactionById", async ({ id, axiosInstance }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/transaction/${id}`);
        console.log(response.data.data)
        return response.data.data as ITransactionDetail;
    } catch (err: any) {
        console.error("Error:", err);
        return rejectWithValue(err.response?.data || "Error fetching transaction");
    }
});

// Tạo slice
const transactionSlice = createSlice({
    name: "transaction",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<TransactionsPayLoad>) => {
                console.log(action.payload);
                state.transactions = action.payload.transactionList;
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
                state.totalTransaction = action.payload.totalTransactions;
                state.loading = false;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch transactions";
            })
            .addCase(fetchTransactionById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selectedTransaction = null;
            })
            .addCase(fetchTransactionById.fulfilled, (state, action: PayloadAction<ITransactionDetail>) => {
                state.selectedTransaction = action.payload;
                state.loading = false;
            })
            .addCase(fetchTransactionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch transaction";
            });
    },
});

export default transactionSlice.reducer;
