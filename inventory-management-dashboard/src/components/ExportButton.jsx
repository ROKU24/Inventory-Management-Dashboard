// src/components/ExportButton.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ExportButton = () => {
  const { products } = useSelector((state) => state.products);
  const { 
    categories, 
    inStockOnly, 
    search,
    sortField,
    sortDirection 
  } = useSelector((state) => state.filters);
  const { symbol, code, name } = useSelector((state) => state.currency);

  // Function to get filtered products based on current filters
  const getFilteredProducts = () => {
    // Apply filters
    let filteredProducts = [...products];
    
    // Special case for out of stock filter
    if (search === 'outofstock:true') {
      return filteredProducts.filter(product => product.stockQuantity <= 0);
    }
    
    // Category filter
    if (categories.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        categories.includes(product.category)
      );
    }
    
    // In-stock filter
    if (inStockOnly) {
      filteredProducts = filteredProducts.filter(product => 
        product.stockQuantity > 0
      );
    }
    
    // Search filter
    if (search && search !== 'outofstock:true') {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    filteredProducts.sort((a, b) => {
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
    
    return filteredProducts;
  };

  // Function to get currency symbol that works in PDF
  const getCurrencySymbol = (currencyCode, originalSymbol) => {
    // Special handling for currencies with Unicode symbols that might not render properly
    switch(currencyCode) {
      case 'INR':
        return 'Rs.'; // Use 'Rs.' instead of '₹' for Indian Rupee
      case 'JPY':
        return '¥'; // Japanese Yen
      case 'CNY':
        return 'CN¥'; // Use 'CN¥' for Chinese Yuan to differentiate
      default:
        return originalSymbol;
    }
  };

  const generatePDF = async () => {
    // Get filtered products
    const filteredProducts = getFilteredProducts();
    
    // Get PDF-safe currency symbol
    const pdfCurrencySymbol = getCurrencySymbol(code, symbol);
    
    // Show loading indicator
    const loadingToast = document.createElement('div');
    loadingToast.className = 'fixed top-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded shadow-lg z-50';
    loadingToast.textContent = 'Generating PDF...';
    document.body.appendChild(loadingToast);

    try {
      // Create new document
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Add title
      doc.setFontSize(18);
      doc.setTextColor(79, 70, 229); // Indigo color
      doc.text('Inventory Management Dashboard', 20, 20);
      
      // Add date
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
      
      // Add filter information
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      let yPos = 40;
      
      // Add currency information
      doc.text(`Currency: ${code} (${pdfCurrencySymbol}) - ${name}`, 20, yPos);
      yPos += 8;
      
      // Show which filters are active
      if (search === 'outofstock:true') {
        doc.text('Filter: Out of Stock Products Only', 20, yPos);
        yPos += 8;
      } else {
        if (categories.length > 0) {
          doc.text(`Categories: ${categories.join(', ')}`, 20, yPos);
          yPos += 8;
        }
        
        if (inStockOnly) {
          doc.text('Showing only in-stock items', 20, yPos);
          yPos += 8;
        }
        
        if (search && search !== 'outofstock:true') {
          doc.text(`Search: "${search}"`, 20, yPos);
          yPos += 8;
        }
      }
      
      doc.text(`Sorted by: ${sortField} (${sortDirection === 'asc' ? 'Ascending' : 'Descending'})`, 20, yPos);
      yPos += 8;
      
      doc.text(`Total products: ${filteredProducts.length}`, 20, yPos);
      yPos += 8;
      
      // Add table header
      yPos += 8;
      doc.setFillColor(240, 240, 240);
      doc.setDrawColor(200, 200, 200);
      doc.rect(20, yPos, 170, 10, 'FD');
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text('ID', 25, yPos + 7);
      doc.text('Name', 40, yPos + 7);
      doc.text('Category', 90, yPos + 7);
      doc.text('Stock', 140, yPos + 7);
      doc.text('Price', 160, yPos + 7);
      
      // Add table rows
      yPos += 10;
      let isAlternate = false;
      
      for (const product of filteredProducts) {
        // Check if we need a new page
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
          
          // Add table header on new page
          doc.setFillColor(240, 240, 240);
          doc.rect(20, yPos, 170, 10, 'FD');
          
          doc.setFontSize(10);
          doc.text('ID', 25, yPos + 7);
          doc.text('Name', 40, yPos + 7);
          doc.text('Category', 90, yPos + 7);
          doc.text('Stock', 140, yPos + 7);
          doc.text('Price', 160, yPos + 7);
          
          yPos += 10;
          isAlternate = false;
        }
        
        // Alternate row background
        if (isAlternate) {
          doc.setFillColor(245, 245, 245);
          doc.rect(20, yPos, 170, 8, 'F');
        }
        isAlternate = !isAlternate;
        
        // Add row data
        doc.text(product.id.toString(), 25, yPos + 5);
        doc.text(product.name.substring(0, 30), 40, yPos + 5);
        doc.text(product.category, 90, yPos + 5);
        
        // Highlight low stock
        if (product.stockQuantity <= 0) {
          doc.setTextColor(220, 38, 38); // Red color for out of stock
          doc.text(product.stockQuantity.toString(), 140, yPos + 5);
          doc.setTextColor(0, 0, 0); // Reset to black
        } else if (product.stockQuantity <= 10) {
          doc.setTextColor(217, 119, 6); // Amber color for low stock
          doc.text(product.stockQuantity.toString(), 140, yPos + 5);
          doc.setTextColor(0, 0, 0); // Reset to black
        } else {
          doc.text(product.stockQuantity.toString(), 140, yPos + 5);
        }
        
        // Use the PDF-safe currency symbol for price
        doc.text(`${pdfCurrencySymbol}${product.price.toFixed(2)}`, 160, yPos + 5);
        
        yPos += 8;
      }
      
      // Add chart
      yPos += 10;
      if (yPos > 200) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.text('Category Distribution', 20, yPos);
      yPos += 10;
      
      // Get chart element
      const chartElement = document.querySelector('.recharts-wrapper');
      if (chartElement) {
        const canvas = await html2canvas(chartElement, {
          scale: 2,
          useCORS: true,
          logging: false
        });
        
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 20, yPos, 170, 80);
      }
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 20, 290);
        doc.text('Generated by Inventory Management Dashboard', 105, 290, { align: 'center' });
      }
      
      // Create filename with current date and filter info
      const dateStr = new Date().toISOString().split('T')[0];
      let filename = `inventory-report-${dateStr}`;
      
      // Add filter info to filename
      if (search === 'outofstock:true') {
        filename += '-outofstock';
      } else if (inStockOnly) {
        filename += '-instock';
      }
      
      // Add currency code to filename
      filename += `-${code.toLowerCase()}`;
      
      // Save the PDF
      doc.save(`${filename}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Show error notification
      loadingToast.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50';
      loadingToast.textContent = 'Error generating PDF. Please try again.';
      
      // Remove error notification after 3 seconds
      setTimeout(() => {
        if (document.body.contains(loadingToast)) {
          document.body.removeChild(loadingToast);
        }
      }, 3000);
      return;
    }
    
    // Remove loading indicator and show success
    document.body.removeChild(loadingToast);
    const successToast = document.createElement('div');
    successToast.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50';
    successToast.textContent = 'PDF exported successfully!';
    document.body.appendChild(successToast);
    
    // Remove success notification after 3 seconds
    setTimeout(() => {
      if (document.body.contains(successToast)) {
        document.body.removeChild(successToast);
      }
    }, 3000);
  };

  return (
    <button
      onClick={generatePDF}
      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Export PDF
    </button>
  );
};

export default ExportButton;