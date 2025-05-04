// src/components/CurrencySelector.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrency } from '../store/currencySlice';

const CurrencySelector = () => {
  const dispatch = useDispatch();
  const currentCurrency = useSelector((state) => state.currency);
  
  // List of common currencies
  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  ];

  const handleCurrencyChange = (e) => {
    const selectedCode = e.target.value;
    const selectedCurrency = currencies.find(c => c.code === selectedCode);
    if (selectedCurrency) {
      dispatch(setCurrency(selectedCurrency));
    }
  };

  return (
    <div className="flex items-center">
      <label htmlFor="currency" className="mr-2 text-sm text-gray-600">
        Currency:
      </label>
      <select
        id="currency"
        value={currentCurrency.code}
        onChange={handleCurrencyChange}
        className="border border-gray-300 rounded-md shadow-sm py-1 pl-3 pr-10 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      >
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.code} ({currency.symbol})
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;