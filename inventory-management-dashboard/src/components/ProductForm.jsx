import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, updateProduct } from '../store/productSlice';
import { XIcon } from '@heroicons/react/solid';

const ProductForm = ({ product, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  
  // Extract unique categories from products for the dropdown
  const categories = [...new Set(products.map(p => p.category))];
  
  const [formData, setFormData] = useState({
    name: '',
    category: categories[0] || '',
    stockQuantity: 0,
    price: 0,
    newCategory: '',
  });
  
  const [errors, setErrors] = useState({});
  const [showNewCategoryField, setShowNewCategoryField] = useState(false);
  
  // Set initial form data if editing an existing product
  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        category: product.category,
        stockQuantity: product.stockQuantity,
        price: product.price,
        newCategory: '',
      });
    }
  }, [product]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (showNewCategoryField && !formData.newCategory.trim()) {
      newErrors.newCategory = 'Category name is required';
    } else if (!showNewCategoryField && !formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (isNaN(formData.stockQuantity) || formData.stockQuantity < 0) {
      newErrors.stockQuantity = 'Stock quantity must be a positive number';
    }
    
    if (isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'stockQuantity' || name === 'price' ? parseFloat(value) : value,
    }));
  };
  
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === 'new') {
      setShowNewCategoryField(true);
      setFormData(prev => ({
        ...prev,
        category: '',
      }));
    } else {
      setShowNewCategoryField(false);
      setFormData(prev => ({
        ...prev,
        category: value,
      }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const submittedData = {
      ...formData,
      category: showNewCategoryField ? formData.newCategory : formData.category,
    };
    
    // Remove unnecessary properties
    delete submittedData.newCategory;
    
    if (product) {
      dispatch(updateProduct(submittedData));
    } else {
      dispatch(addProduct(submittedData));
    }
    
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-10">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={showNewCategoryField ? 'new' : formData.category}
                onChange={handleCategoryChange}
                className={`mt-1 block w-full border ${errors.category ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
                <option value="new">+ Add New Category</option>
              </select>
              {errors.category && !showNewCategoryField && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>
            
            {showNewCategoryField && (
              <div>
                <label htmlFor="newCategory" className="block text-sm font-medium text-gray-700">
                  New Category Name
                </label>
                <input
                  type="text"
                  name="newCategory"
                  id="newCategory"
                  value={formData.newCategory}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${errors.newCategory ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.newCategory && (
                  <p className="mt-1 text-sm text-red-600">{errors.newCategory}</p>
                )}
              </div>
            )}
            
            <div>
              <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stockQuantity"
                id="stockQuantity"
                min="0"
                step="1"
                value={formData.stockQuantity}
                onChange={handleChange}
                className={`mt-1 block w-full border ${errors.stockQuantity ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.stockQuantity && (
                <p className="mt-1 text-sm text-red-600">{errors.stockQuantity}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                id="price"
                min="0.01"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className={`mt-1 block w-full border ${errors.price ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {product ? 'Update' : 'Add'} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;