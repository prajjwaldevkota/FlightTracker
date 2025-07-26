// src/utils.js

/**
 * Formats a number as a currency string based on the provided currency code.
 * @param {number} amount - The numerical amount to format.
 * @param {string} currencyCode - The ISO 4217 currency code (e.g., 'USD', 'EUR', 'NPR').
 * @returns {string} The formatted currency string (e.g., "$1,250.00").
 */
export const formatCurrency = (amount, currencyCode) => {
    // Use 'undefined' for the locale to let the browser use the user's default locale,
    // which correctly handles things like commas vs. periods.
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  };