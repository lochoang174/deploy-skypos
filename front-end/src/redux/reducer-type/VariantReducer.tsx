import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IVariant, IVariantPayload } from "../../types";
import { AxiosInstance } from "axios";
import { TablePaginationConfig } from "antd";

interface VariantState {
    variants: IVariant[];
    loading: boolean;
    error: string | null;
    pagination: TablePaginationConfig;
    totalVariants: number;
    searchTerm: string;
    selectedFilters: Record<string, string | undefined>;
}

interface FetchVariantsParams {
    axiosInstance: AxiosInstance;
    page: number;
    limit: number;
    productId?: string;
    barcode: string;
    filters: { [key: string]: string | undefined };
}

const initialState: VariantState = {
    variants: [],

    loading: false,
    error: null,
    pagination: {
        current: 1,
        pageSize: 12,
    },
    totalVariants: 0,
    searchTerm: "",
    selectedFilters: {},
};

export const fetchVariants = createAsyncThunk<
    IVariantPayload,
    AxiosInstance, // Axios is now passed as an argument
    { rejectValue: string } // Define the reject value type
>("variant/fetchVariants", async (axiosInstance, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("/variant");
        return response.data.data as IVariantPayload;
    } catch (err: any) {
        return rejectWithValue(err.response?.data || "Error fetching variants");
    }
});

export const fecthVariantsByProduct = createAsyncThunk<
    IVariantPayload,
    FetchVariantsParams,
    { rejectValue: string }
>(
    "variant/fetchVariantsByProduct",
    async ({ productId, axiosInstance, page, limit, barcode, filters }, { rejectWithValue }) => {
        try {
            if (!filters) {
                filters = {};
            }
            const response = await axiosInstance.get(`/variant/product/${productId}`, {
                params: { page, limit, barcode, ...filters },
            });
            return response.data.data as IVariantPayload;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || "Error fetching variants");
        }
    }
);

const variantSlice = createSlice({
    name: "variant",
    initialState,
    reducers: {
        addVariant: (state, action: PayloadAction<IVariant>) => {
            if (state.variants.length < state.pagination.pageSize!) {
                state.variants.push(action.payload);
                return;
            }
        },
        editVariant: (state, action: PayloadAction<IVariant>) => {
            const index = state.variants.findIndex((variant) => variant._id === action.payload._id);
            state.variants[index] = action.payload;
        },
        deleteVariant: (state, action: PayloadAction<string | undefined>) => {
            state.variants = state.variants.filter((variant) => variant._id !== action.payload);
        },
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
        setSelectedFilters: (state, action: PayloadAction<Record<string, string | undefined>>) => {
            state.selectedFilters = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fecthVariantsByProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fecthVariantsByProduct.fulfilled, (state, action: PayloadAction<IVariantPayload>) => {
                state.variants = action.payload.variants;
                state.totalVariants = action.payload.totalVariants;
                state.loading = false;
            })
            .addCase(fecthVariantsByProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { addVariant, editVariant, deleteVariant, setPagination, setSearchTerm, setSelectedFilters } =
    variantSlice.actions;

export default variantSlice.reducer;
