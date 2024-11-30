import { AxiosInstance } from "axios";
import { IDetail, IStatistic, IStatisticPayload, TDetailData } from "../../types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StatisticState {
    statistics: IStatistic;
    loading: boolean;
    error: string | null;
    selectedDate: string;
    selectedDateRange: [string, string];
    detailData: TDetailData[];
    detail: IDetail[];
}

interface FetchStatisticParams {
    axiosInstance: AxiosInstance;
    startDate?: string;
    endDate?: string;
}

const initialState: StatisticState = {
    statistics: {
        _id: "",
        totalAmountReceived: 0,
        numberOfOrders: 0,
        numberOfProductsSold: 0,
        profit: 0,
        detail: [],
    },
    loading: false,
    error: null,
    selectedDate: "today",
    selectedDateRange: ["", ""],
    detailData: [],
    detail: [],
};

// Helper function for processing detail data
const processDetailData = (details: IDetail[]) => {
    const sortedData = [...details].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sortedData.flatMap((item) => [
        {
            name: "Number Of Orders",
            date: item.date,
            total: item.numOfTransaction,
        },
        {
            name: "Number Of Products Sold",
            date: item.date,
            total: item.numOfProduct,
        },
    ]);
};

// Helper function for creating async thunks
const createFetchStatisticsThunk = (typePrefix: string, endpoint: string) =>
    createAsyncThunk<IStatisticPayload, FetchStatisticParams, { rejectValue: string }>(
        typePrefix,
        async ({ axiosInstance, startDate, endDate }, { rejectWithValue }) => {
            try {
                const response = await axiosInstance.get(endpoint, {
                    params: { startDate, endDate },
                });
                return response.data as IStatisticPayload;
            } catch (err: any) {
                console.error("Error:", err);
                return rejectWithValue(err.response?.data || "Error fetching statistics");
            }
        }
    );

// Async thunks for each endpoint
export const fetchStatisticsToday = createFetchStatisticsThunk(
    "statistic/fetchStatisticsToday",
    "/statistics/today"
);
export const fetchStatisticsYesterday = createFetchStatisticsThunk(
    "statistic/fetchStatisticsYesterday",
    "/statistics/yesterday"
);
export const fetchStatisticsWithinSevenDays = createFetchStatisticsThunk(
    "statistic/fetchStatisticsWithinSevenDays",
    "/statistics/within-7-days"
);
export const fetchStatisticsThisMonth = createFetchStatisticsThunk(
    "statistic/fetchStatisticsThisMonth",
    "/statistics/this-month"
);
export const fetchStatisticsByDate = createFetchStatisticsThunk(
    "statistic/fetchStatisticsByDate",
    "/statistics/date-range"
);

const statisticSlice = createSlice({
    name: "statistic",
    initialState,
    reducers: {
        setStatistic: (state, action: PayloadAction<IStatistic>) => {
            state.statistics = action.payload;
        },
        addStatisticProperties: (state, action) => {
            state.statistics = { ...state.statistics, ...action.payload };
        },
        setSelectedDate: (state, action: PayloadAction<string>) => {
            state.selectedDate = action.payload;
        },
        setDetailData: (state, action: PayloadAction<TDetailData[]>) => {
            state.detailData = action.payload;
        },
        setSelectedDateRange: (state, action: PayloadAction<[string, string]>) => {
            state.selectedDateRange = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Helper function to handle pending state
        const handlePending = (state: StatisticState) => {
            state.loading = true;
            state.error = null;
        };

        // Helper function to handle fulfilled state with detail processing
        const handleFulfilled = (state: StatisticState, action: PayloadAction<IStatisticPayload>) => {
            const details = action.payload.data.detail;
            state.statistics = action.payload.data;
            state.detailData = details.length ? processDetailData(details) : [];
            state.loading = false;
        };

        // Helper function to handle rejected state
        const handleRejected = (state: StatisticState, action: PayloadAction<string | undefined>) => {
            state.loading = false;
            state.error = action.payload || "Failed to fetch data";
        };

        builder
            .addCase(fetchStatisticsToday.pending, handlePending)
            .addCase(fetchStatisticsToday.fulfilled, handleFulfilled)
            .addCase(fetchStatisticsToday.rejected, handleRejected)
            .addCase(fetchStatisticsYesterday.pending, handlePending)
            .addCase(fetchStatisticsYesterday.fulfilled, handleFulfilled)
            .addCase(fetchStatisticsYesterday.rejected, handleRejected)
            .addCase(fetchStatisticsWithinSevenDays.pending, handlePending)
            .addCase(fetchStatisticsWithinSevenDays.fulfilled, handleFulfilled)
            .addCase(fetchStatisticsWithinSevenDays.rejected, handleRejected)
            .addCase(fetchStatisticsThisMonth.pending, handlePending)
            .addCase(fetchStatisticsThisMonth.fulfilled, (state, action) => {
                state.detail = [...action.payload.data.detail].sort(
                    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                );
                state.statistics = action.payload.data;
                state.loading = false;
            })
            .addCase(fetchStatisticsThisMonth.rejected, handleRejected)
            .addCase(fetchStatisticsByDate.pending, handlePending)
            .addCase(fetchStatisticsByDate.fulfilled, (state, action) => {
                state.detail = [...action.payload.data.detail].sort(
                    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                );
                state.loading = false;
                state.statistics = action.payload.data;
            })
            .addCase(fetchStatisticsByDate.rejected, handleRejected);
    },
});

export const { setStatistic, addStatisticProperties, setSelectedDate, setDetailData, setSelectedDateRange } =
    statisticSlice.actions;

export default statisticSlice.reducer;
