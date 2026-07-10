/**
 * usePrice - Currency formatting hook
 * Provides consistent price formatting across the app with USD/LKR support
 */

import { CURRENCY_CONFIG } from "@/lib/config";

export function usePriceFormatter() {
  /**
   * Format a single price
   * @param {number} amount - Price in USD
   * @param {string} currency - Currency code ('USD' or 'LKR')
   * @returns {string} Formatted price
   */
  const formatPrice = (amount, currency = "USD") => {
    if (!amount) return `${CURRENCY_CONFIG.symbols.USD}0.00`;
    return CURRENCY_CONFIG.format(amount, currency);
  };

  /**
   * Get both USD and LKR formatted prices
   * @param {number} amountUSD - Price in USD
   * @returns {object} Object with formatted USD and LKR prices
   */
  const getPriceWithConversion = (amountUSD) => {
    return {
      usd: formatPrice(amountUSD, "USD"),
      lkr: CURRENCY_CONFIG.enableLKR
        ? formatPrice(CURRENCY_CONFIG.toLKR(amountUSD), "LKR")
        : null,
      amountUSD,
      amountLKR: CURRENCY_CONFIG.enableLKR
        ? CURRENCY_CONFIG.toLKR(amountUSD)
        : null,
    };
  };

  /**
   * Get current currency setting
   * @returns {string} Current primary currency
   */
  const getCurrentCurrency = () => CURRENCY_CONFIG.primary;

  /**
   * Check if LKR conversion is enabled
   * @returns {boolean}
   */
  const isLKREnabled = () => CURRENCY_CONFIG.enableLKR;

  return {
    formatPrice,
    getPriceWithConversion,
    getCurrentCurrency,
    isLKREnabled,
    config: CURRENCY_CONFIG,
  };
}

export default usePriceFormatter;
