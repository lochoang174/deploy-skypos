import { IOrder, IOrderPayload } from "../../types";
import { AxiosInstance } from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrderState {
    orders: IOrder[];
    loading: boolean;
    error: string | null;
}

interface FetchOrdersParams {
    axiosInstance: AxiosInstance;
    date: string;
}

const initialState: OrderState = {
    orders: [],
    loading: false,
    error: null,
};

export const fetchOrders = createAsyncThunk<IOrderPayload, FetchOrdersParams, { rejectValue: string }>(
    "order/fetchOrders",
    async ({ axiosInstance, date }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/statistics/transactions-of-date", {
                params: { date },
            });
            return response.data as IOrderPayload;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || "Error fetching orders");
        }
    }
);

export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchOrders.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchOrders.fulfilled, (state, action: PayloadAction<IOrderPayload>) => {
            state.loading = false;
            state.orders = action.payload.data;
        });
        builder.addCase(fetchOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload!;
        });
    },
});

export default orderSlice.reducer;
