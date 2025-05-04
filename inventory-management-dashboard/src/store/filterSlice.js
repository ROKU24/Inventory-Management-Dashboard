import { createSlice } from '@reduxjs/toolkit';

// Load filters from localStorage or use defaults
const loadSavedFilters = () => {
  try {
    const savedFilters = localStorage.getItem('inventoryFilters');
    return savedFilters ? JSON.parse(savedFilters) : {
      categories: [],
      inStockOnly: false,
      search: '',
      sortField: 'name',
      sortDirection: 'asc',
      currentPage: 1,
      itemsPerPage: 5,
    };
  } catch (error) {
    console.error('Error loading filters from localStorage:', error);
    return {
      categories: [],
      inStockOnly: false,
      search: '',
      sortField: 'name',
      sortDirection: 'asc',
      currentPage: 1,
      itemsPerPage: 5,
    };
  }
};

const initialState = loadSavedFilters();

// Helper function to save filters to localStorage
const saveFiltersToLocalStorage = (filters) => {
  try {
    localStorage.setItem('inventoryFilters', JSON.stringify(filters));
  } catch (error) {
    console.error('Error saving filters to localStorage:', error);
  }
};

export const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    toggleCategory: (state, action) => {
      const category = action.payload;
      const index = state.categories.indexOf(category);
      if (index === -1) {
        state.categories.push(category);
      } else {
        state.categories.splice(index, 1);
      }
      state.currentPage = 1;
      saveFiltersToLocalStorage(state);
    },
    setInStockOnly: (state, action) => {
      state.inStockOnly = action.payload;
      state.currentPage = 1;
      saveFiltersToLocalStorage(state);
    },
    setSearchTerm: (state, action) => {
      state.search = action.payload;
      state.currentPage = 1;
      saveFiltersToLocalStorage(state);
    },
    setSortField: (state, action) => {
      if (state.sortField === action.payload) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortField = action.payload;
        state.sortDirection = 'asc';
      }
      saveFiltersToLocalStorage(state);
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
      saveFiltersToLocalStorage(state);
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1;
      saveFiltersToLocalStorage(state);
    },
    resetFilters: (state) => {
      state.categories = [];
      state.inStockOnly = false;
      state.search = '';
      state.currentPage = 1;
      saveFiltersToLocalStorage(state);
    },
  },
});

export const {
  toggleCategory,
  setInStockOnly,
  setSearchTerm,
  setSortField,
  setCurrentPage,
  setItemsPerPage,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;