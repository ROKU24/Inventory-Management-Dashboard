// src/components/Dashboard.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProductTable from './ProductTable';
import FilterSection from './FilterSection';
import ProductForm from './ProductForm';
import ConfirmationDialog from './ConfirmationDialog';
import CategoryChart from './CategoryChart';
import ExportButton from './ExportButton';
import CurrencySelector from './CurrencySelector';
import { deleteProduct, deleteMultipleProducts, clearSelectedProducts, resetToInitialProducts } from '../store/productSlice';
import { resetFilters } from '../store/filterSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const selectedProducts = useSelector((state) => state.products.selectedProducts);
  
  const handleAddNewClick = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setIsDeleteDialogOpen(true);
  };

  const handleBatchDeleteClick = () => {
    if (selectedProducts.length > 0) {
      setProductToDelete(null);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete));
    } else {
      dispatch(deleteMultipleProducts(selectedProducts));
    }
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleResetDataClick = () => {
    setIsResetDialogOpen(true);
  };

  const handleConfirmReset = () => {
    dispatch(resetToInitialProducts());
    dispatch(resetFilters());
    setIsResetDialogOpen(false);
  };

  const handleCancelReset = () => {
    setIsResetDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <FilterSection />
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center">
            <h2 className="text-lg font-medium text-gray-900 mr-4">Product Inventory</h2>
            <CurrencySelector />
          </div>
          <div className="flex space-x-2">
            {selectedProducts.length > 0 && (
              <button
                onClick={handleBatchDeleteClick}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete Selected ({selectedProducts.length})
              </button>
            )}
            <ExportButton />
            <button
              onClick={handleAddNewClick}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add New Product
            </button>
            <button
              onClick={handleResetDataClick}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset to Default Data
            </button>
          </div>
        </div>
        <ProductTable onEditProduct={handleEditProduct} onDeleteProduct={handleDeleteClick} />
      </div>
      
      <div className="bg-white shadow sm:rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Category Distribution</h2>
        <CategoryChart />
      </div>

      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          isOpen={isFormOpen}
          onClose={handleCloseForm}
        />
      )}

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        title={productToDelete ? "Delete Product" : "Delete Selected Products"}
        message={
          productToDelete
            ? "Are you sure you want to delete this product? This action cannot be undone."
            : `Are you sure you want to delete ${selectedProducts.length} selected products? This action cannot be undone.`
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <ConfirmationDialog
        isOpen={isResetDialogOpen}
        title="Reset to Default Data"
        message="Are you sure you want to reset all data to the default values? This will remove all your custom products and filters. This action cannot be undone."
        confirmLabel="Reset"
        cancelLabel="Cancel"
        onConfirm={handleConfirmReset}
        onCancel={handleCancelReset}
      />
    </div>
  );
};

export default Dashboard;