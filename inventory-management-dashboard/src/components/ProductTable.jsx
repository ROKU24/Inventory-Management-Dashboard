// src/components/ProductTable.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSelectProduct, selectAllProducts, clearSelectedProducts } from '../store/productSlice';
import { setSortField, setCurrentPage, setItemsPerPage } from '../store/filterSlice';
import { ChevronUpIcon, ChevronDownIcon, PencilIcon, TrashIcon } from '@heroicons/react/solid';

const ProductTable = ({ onEditProduct, onDeleteProduct }) => {
  const dispatch = useDispatch();
  const { products, selectedProducts } = useSelector((state) => state.products);
  const { 
    categories, 
    inStockOnly, 
    search, 
    sortField, 
    sortDirection, 
    currentPage, 
    itemsPerPage 
  } = useSelector((state) => state.filters);

  // Filter products based on current filters
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (categories.length > 0 && !categories.includes(product.category)) {
      return false;
    }
    
    // Special case for out of stock filter
    if (search === 'outofstock:true') {
      return product.stockQuantity <= 0;
    }
    
    // In-stock filter
    if (inStockOnly && product.stockQuantity <= 0) {
      return false;
    }
    
    // Search filter
    if (search && search !== 'outofstock:true' && !product.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  
  // Handle select all visible products
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      dispatch(selectAllProducts(paginatedProducts.map(p => p.id)));
    } else {
      dispatch(clearSelectedProducts());
    }
  };

  // Check if all visible products are selected
  const allSelected = paginatedProducts.length > 0 && 
    paginatedProducts.every(product => selectedProducts.includes(product.id));

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => dispatch(setSortField('name'))}
              >
                <div className="flex items-center">
                  <span>Name</span>
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? 
                    <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => dispatch(setSortField('category'))}
              >
                <div className="flex items-center">
                  <span>Category</span>
                  {sortField === 'category' && (
                    sortDirection === 'asc' ? 
                    <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => dispatch(setSortField('stockQuantity'))}
              >
                <div className="flex items-center">
                  <span>Stock</span>
                  {sortField === 'stockQuantity' && (
                    sortDirection === 'asc' ? 
                    <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => dispatch(setSortField('price'))}
              >
                <div className="flex items-center">
                  <span>Price</span>
                  {sortField === 'price' && (
                    sortDirection === 'asc' ? 
                    <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProducts.map((product) => (
              <tr key={product.id} className={selectedProducts.includes(product.id) ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => dispatch(toggleSelectProduct(product.id))}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.stockQuantity <= 0 
                      ? 'bg-red-100 text-red-800' 
                      : product.stockQuantity <= 10 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {product.stockQuantity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditProduct(product)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedProducts.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination controls */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => dispatch(setCurrentPage(Math.max(1, currentPage - 1)))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => dispatch(setCurrentPage(Math.min(totalPages, currentPage + 1)))}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, sortedProducts.length)}
              </span>{' '}
              of <span className="font-medium">{sortedProducts.length}</span> results
            </p>
          </div>
          <div className="flex items-center">
            <select
              value={itemsPerPage}
              onChange={(e) => dispatch(setItemsPerPage(Number(e.target.value)))}
              className="mr-4 px-3 py-1 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
            </select>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => dispatch(setCurrentPage(Math.max(1, currentPage - 1)))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Previous</span>
                <ChevronDownIcon className="h-5 w-5 transform rotate-90" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => dispatch(setCurrentPage(page))}
                  className={`relative inline-flex items-center px-4 py-2 border ${
                    page === currentPage
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                      : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                  } text-sm font-medium`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => dispatch(setCurrentPage(Math.min(totalPages, currentPage + 1)))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <ChevronDownIcon className="h-5 w-5 transform -rotate-90" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;