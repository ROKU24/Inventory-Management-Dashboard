// src/store/store.js - Update to include currencyReducer
import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import filterReducer from './filterSlice';
import currencyReducer from './currencySlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    filters: filterReducer,
    currency: currencyReducer,
  },
});