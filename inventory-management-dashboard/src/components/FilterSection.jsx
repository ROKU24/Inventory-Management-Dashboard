// src/components/FilterSection.jsx
import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleCategory, setInStockOnly, setSearchTerm, resetFilters } from '../store/filterSlice';

const FilterSection = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { categories: selectedCategories, inStockOnly, search } = useSelector((state) => state.filters);

  // Extract unique categories from products
  const allCategories = useMemo(() => {
    const categorySet = new Set(products.map((product) => product.category));
    return Array.from(categorySet);
  }, [products]);

  // Function to show only out of stock products
  const handleOutOfStockFilter = () => {
    // First reset filters to clear any conflicting filters
    dispatch(resetFilters());
    // Then set inStockOnly to the opposite of what we want (since we'll show items with stock ≤ 0)
    dispatch(setInStockOnly(false));
    // We'll apply a custom filter in ProductTable that checks for stock ≤ 0
    dispatch(setSearchTerm('outofstock:true'));
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Filters</h3>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search Products
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                value={search === 'outofstock:true' ? '' : search}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                className="pl-10 py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-white border-2 hover:border-gray-400 transition-colors duration-200"
                placeholder="Search by product name"
                disabled={search === 'outofstock:true'}
              />
              {search && search !== 'outofstock:true' && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => dispatch(setSearchTerm(''))}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          
          <div className="sm:col-span-2">
            <fieldset>
              <legend className="block text-sm font-medium text-gray-700">Categories</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {allCategories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      id={`category-${category}`}
                      name={`category-${category}`}
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => dispatch(toggleCategory(category))}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      disabled={search === 'outofstock:true'}
                    />
                    <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>
          
          <div className="sm:col-span-2">
            <div className="flex items-center">
              <input
                id="in-stock-only"
                name="in-stock-only"
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => dispatch(setInStockOnly(e.target.checked))}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                disabled={search === 'outofstock:true'}
              />
              <label htmlFor="in-stock-only" className="ml-2 text-sm text-gray-700">
                Show only in-stock products
              </label>
            </div>
          </div>
          
          <div className="sm:col-span-2 flex space-x-4">
            <button
              onClick={() => dispatch(resetFilters())}
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset All Filters
            </button>
            
            <button
              onClick={handleOutOfStockFilter}
              type="button"
              className={`inline-flex items-center px-3 py-2 border shadow-sm text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                search === 'outofstock:true' 
                  ? 'bg-amber-100 text-amber-800 border-amber-400'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Out of Stock Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;