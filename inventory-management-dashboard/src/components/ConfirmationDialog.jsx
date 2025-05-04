import React from 'react';
import { XIcon } from '@heroicons/react/solid';

const ConfirmationDialog = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-10">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {title}
          </h3>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <p className="text-sm text-gray-500">
            {message}
          </p>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {cancelLabel || 'Cancel'}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {confirmLabel || 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;