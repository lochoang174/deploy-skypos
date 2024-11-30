import { configureStore } from "@reduxjs/toolkit";
import accountSlice from "./reducer-type/AccountReducer";
import productSlice from "./reducer-type/ProductReducer";
import variantSlice from "./reducer-type/VariantReducer";
import customerSlice from "./reducer-type/CustomerReducer";
import transactionSlice from "./reducer-type/TransactionReducer";
import cartSlice from "./slices/cartSlice";
import statisticSlice from "./reducer-type/StatisticReducer";
import orderSlice from "./reducer-type/OrderReducer";
import customerTransactionsSlice from "./reducer-type/CustomerTransactionsReducer";
import staffTransactionsSlice from "./reducer-type/StaffTransactionReducer"
export const store = configureStore({
    reducer: {
        account: accountSlice,
        customer: customerSlice,
        transaction: transactionSlice,
        product: productSlice,
        variant: variantSlice,
        cart: cartSlice,
        statistic: statisticSlice,
        order: orderSlice,
        customerTransaction: customerTransactionsSlice,
        staffTransaction: staffTransactionsSlice
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
