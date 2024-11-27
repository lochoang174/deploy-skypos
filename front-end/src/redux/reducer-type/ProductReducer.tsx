import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IProduct, IProductPayload } from "../../types";
import { AxiosInstance } from "axios";
import { TablePaginationConfig } from "antd";

interface ProductState {
    products: IProduct[];
    loading: boolean;
    error: string | null;
    pagination: TablePaginationConfig;
    totalProducts: number;
    selectedCategories: string[];
    searchTerm: string;
}

interface FetchProductsParams {
    axiosInstance: AxiosInstance;
    page: number;
    limit: number;
    productName?: string;
    categories: string[];
}

const initialState: ProductState = {
    products: [],
    loading: false,
    error: null,
    pagination: {
        current: 1,
        pageSize: 8,
    },
    totalProducts: 0,
    selectedCategories: [],
    searchTerm: "",
};

export const fetchProducts = createAsyncThunk<IProductPayload, FetchProductsParams, { rejectValue: string }>(
    "product/fetchProducts",
    async ({ axiosInstance, page, limit, productName, categories }, { rejectWithValue }) => {
        try {
            if (!categories) {
                categories = [];
            }
            const response = await axiosInstance.get("/product", {
                params: { page, limit, productName, category: categories.join(",") },
            });
            return response.data.data as IProductPayload;
        } catch (err: any) {
            console.error("Error:", err);
            return rejectWithValue(err.response?.data || "Error fetching products");
        }
    }
);

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        addProduct: (state, action: PayloadAction<IProduct>) => {
            if (state.products.length < state.pagination.pageSize!) {
                state.products.push(action.payload);
                return;
            }
        },

        editProduct: (state, action: PayloadAction<IProduct>) => {
            const index = state.products.findIndex((product) => product._id === action.payload._id);
            state.products[index] = action.payload;
        },
        deleteProduct: (state, action: PayloadAction<string | undefined>) => {
            state.products = state.products.filter((product) => product._id !== action.payload);
        },
        setPagination: (state, action: PayloadAction<{ page: number; pageSize: number }>) => {
            const { page, pageSize } = action.payload;
            state.pagination = {
                current: page,
                pageSize,
            };
        },
        setSelectedCategories: (state, action: PayloadAction<string[]>) => {
            state.selectedCategories = action.payload; // Update selected categories
        },
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<IProductPayload>) => {
                state.products = action.payload.products;
                state.totalProducts = action.payload.totalProducts;
                state.loading = false;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || (action.payload as string);
            });
    },
});

export const { addProduct, editProduct, deleteProduct, setPagination, setSelectedCategories, setSearchTerm } =
    productSlice.actions;
export default productSlice.reducer;
