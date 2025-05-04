import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import filterReducer from './filterSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    filters: filterReducer,
  },
});