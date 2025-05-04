import { createSlice } from '@reduxjs/toolkit';
import { initialProducts } from '../data/initialProducts';

// Load products from localStorage or use initialProducts if nothing is saved
const loadSavedProducts = () => {
  try {
    const savedProducts = localStorage.getItem('inventoryProducts');
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  } catch (error) {
    console.error('Error loading products from localStorage:', error);
    return initialProducts;
  }
};

const initialState = {
  products: loadSavedProducts(),
  selectedProducts: [],
};

// Helper function to save products to localStorage
const saveProductsToLocalStorage = (products) => {
  try {
    localStorage.setItem('inventoryProducts', JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products to localStorage:', error);
  }
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const newProduct = {
        ...action.payload,
        id: Math.max(0, ...state.products.map(p => p.id)) + 1,
      };
      state.products.push(newProduct);
      saveProductsToLocalStorage(state.products);
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
        saveProductsToLocalStorage(state.products);
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload);
      state.selectedProducts = state.selectedProducts.filter(id => id !== action.payload);
      saveProductsToLocalStorage(state.products);
    },
    deleteMultipleProducts: (state, action) => {
      const idsToDelete = new Set(action.payload);
      state.products = state.products.filter(p => !idsToDelete.has(p.id));
      state.selectedProducts = [];
      saveProductsToLocalStorage(state.products);
    },
    toggleSelectProduct: (state, action) => {
      const productId = action.payload;
      const index = state.selectedProducts.indexOf(productId);
      if (index === -1) {
        state.selectedProducts.push(productId);
      } else {
        state.selectedProducts.splice(index, 1);
      }
    },
    selectAllProducts: (state, action) => {
      const visibleProductIds = action.payload;
      state.selectedProducts = visibleProductIds;
    },
    clearSelectedProducts: (state) => {
      state.selectedProducts = [];
    },
    resetToInitialProducts: (state) => {
      state.products = initialProducts;
      saveProductsToLocalStorage(initialProducts);
    },
  },
});

export const {
  addProduct,
  updateProduct,
  deleteProduct,
  deleteMultipleProducts,
  toggleSelectProduct,
  selectAllProducts,
  clearSelectedProducts,
  resetToInitialProducts,
} = productSlice.actions;

export default productSlice.reducer;