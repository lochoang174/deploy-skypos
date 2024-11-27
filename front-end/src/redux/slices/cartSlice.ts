import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICart, IVariant } from '../../types';

interface Customer {
  fullName: string;
  phoneNumber: string;
  email: string;
  address:string
}
interface CartState {
  items: ICart[];
  total: number;
  customer: Customer;
}

const initialState: CartState = {
  items: [],
  total: 0,
  customer: {
    fullName: '',
    phoneNumber: '',
    email: '',
    address:''
  },
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resestInformation:(state)=>{
      state.customer={
        fullName: '',
        phoneNumber: '',
        email: '',
        address:''
      }
      state.items=[]
      state.total=0
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      state.customer = action.payload;
    },
    addItem: (state, action: PayloadAction<IVariant>) => {
      const existingItemIndex = state.items.findIndex(item => item.variant._id === action.payload._id);
      if (existingItemIndex !== -1) {
        // Item already exists, increase quantity and update total
        state.items[existingItemIndex].quantity += 1;
        state.items[existingItemIndex].total += action.payload.retailPrice;
      } else {
        // New item, add to cart
        state.items.push({ variant: action.payload, quantity: 1, total: action.payload.retailPrice });
      }
      state.total += action.payload.retailPrice;
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const itemIndex = state.items.findIndex(item => item.variant._id === action.payload);
      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        state.total -= item.variant.retailPrice * item.quantity;
        state.items.splice(itemIndex, 1);
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const itemIndex = state.items.findIndex(item => item.variant._id === action.payload.id);
      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        const priceDifference = (action.payload.quantity - item.quantity) * item.variant.retailPrice;
        item.quantity = action.payload.quantity;
        item.total = item.variant.retailPrice * item.quantity;
        state.total += priceDifference;
      }
    },
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const itemIndex = state.items.findIndex(item => item.variant._id === action.payload);
      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        item.quantity += 1;
        item.total += item.variant.retailPrice;
        state.total += item.variant.retailPrice;
      }
    },
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const itemIndex = state.items.findIndex(item => item.variant._id === action.payload);
      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        if (item.quantity > 1) {
          item.quantity -= 1;
          item.total -= item.variant.retailPrice;
          state.total -= item.variant.retailPrice;
        } else {
          state.total -= item.total;
          state.items.splice(itemIndex, 1);
        }
      }
    },
  },
});

export const {resestInformation,updateCustomer, addItem, removeItem, updateQuantity, increaseQuantity, decreaseQuantity } = cartSlice.actions;
export default cartSlice.reducer;
