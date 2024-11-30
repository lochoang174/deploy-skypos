// src/features/account/accountSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AccountsPayload, IAccount } from "../../types";
import { AxiosInstance } from "axios";
import { TablePaginationConfig } from "antd";
// Định nghĩa state cho slice
interface AccountState {
    accounts: IAccount[];
    accountSelected: IAccount[];
    loading: boolean;
    pagination: TablePaginationConfig;
    totalStaff: number;
    error: string | null;
}

// Khởi tạo state ban đầu
const initialState: AccountState = {
    accounts: [],
    accountSelected: [],
    loading: false,
    error: null,
    pagination: {
        current: 1,
        pageSize: 10,
    },
    totalStaff: 0,
};

// Tạo async thunk để fetch data
interface FetchAccountsParams {
    axiosInstance: AxiosInstance;
    page: number;
    limit: number;
}

// Tạo async thunk để fetch data với page và limit
export const fetchAccounts = createAsyncThunk<
    AccountsPayload,
    FetchAccountsParams, // Truyền thêm page và limit ở đây
    { rejectValue: string }
>("account/fetchAccounts", async ({ axiosInstance, page, limit }, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get(`/account`, {
            params: {
                page,
                limit,
            },
        });
        return response.data.data as AccountsPayload;
    } catch (err: any) {
        console.error("Error:", err);
        return rejectWithValue(err.response?.data || "Error fetching accounts");
    }
});
// Tạo slice
const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        addAccount: (state, action: PayloadAction<IAccount>) => {
            state.accounts.push(action.payload); // Add the new account to the state
        },
        setAccountSelected: (state, action: PayloadAction<IAccount[]>) => {
            state.accountSelected = action.payload; // Add the new account to the state
        },
        setAccountLock: (state, action: PayloadAction<{ id: string; isLock: boolean }>) => {
            const { id, isLock } = action.payload;
            const account = state.accounts.find((account) => account._id === id);
            if (account) {
                account.isLock = isLock;
            }
        },
        removeSelectedAccounts: (state) => {
            state.accounts = state.accounts.filter(
                (account) => !state.accountSelected.some((selected) => selected._id === account._id)
            ); // Remove the selected accounts
            state.accountSelected = []; // Clear the selected accounts after removal
        },
        setPagination: (state, action: PayloadAction<{ page: number; pageSize: number }>) => {
            const { page, pageSize } = action.payload;
            state.pagination = {
                current: page,
                pageSize,
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAccounts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAccounts.fulfilled, (state, action: PayloadAction<AccountsPayload>) => {
                state.accounts = action.payload.staffList;

                state.totalStaff = action.payload.totalStaff;
                state.loading = false;
                state.accountSelected = [];
            })
            .addCase(fetchAccounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch accounts";
            });
    },
});
export const { addAccount, setAccountSelected, setPagination, removeSelectedAccounts, setAccountLock } = accountSlice.actions; // Export the action for dispatching

export default accountSlice.reducer;
