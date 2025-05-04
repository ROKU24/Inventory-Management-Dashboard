// src/store/currencySlice.js
import { createSlice } from '@reduxjs/toolkit';

// Load currency from localStorage or use default
const loadSavedCurrency = () => {
  try {
    const savedCurrency = localStorage.getItem('inventoryCurrency');
    return savedCurrency ? JSON.parse(savedCurrency) : {
      code: 'USD',
      symbol: '$',
      name: 'US Dollar'
    };
  } catch (error) {
    console.error('Error loading currency from localStorage:', error);
    return {
      code: 'USD',
      symbol: '$',
      name: 'US Dollar'
    };
  }
};

const initialState = loadSavedCurrency();

// Helper function to save currency to localStorage
const saveCurrencyToLocalStorage = (currency) => {
  try {
    localStorage.setItem('inventoryCurrency', JSON.stringify(currency));
  } catch (error) {
    console.error('Error saving currency to localStorage:', error);
  }
};

export const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.code = action.payload.code;
      state.symbol = action.payload.symbol;
      state.name = action.payload.name;
      saveCurrencyToLocalStorage(action.payload);
    }
  }
});

export const { setCurrency } = currencySlice.actions;

export default currencySlice.reducer;