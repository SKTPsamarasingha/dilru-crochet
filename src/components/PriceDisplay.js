/**
 * PriceDisplay Component
 * Displays prices with optional currency conversion
 * Uses CURRENCY_CONFIG for consistent formatting across the app
 */

"use client";

import { usePriceFormatter } from "@/lib/usePriceFormatter";

/**
 * Display a single price with optional LKR conversion
 *
 * @param {number} price - Price in USD
 * @param {string} size - Display size: 'sm', 'md', 'lg'
 * @param {boolean} showConversion - Whether to show LKR conversion
 * @returns JSX
 */
export function PriceDisplay({
  price,
  size = "md",
  showConversion = true,
  showLKRPrices = true,
  className = "",
}) {
  const { formatPrice } = usePriceFormatter();

  if (!price) return <span className={className}>-</span>;

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg font-bold",
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className={`font-semibold ${sizeClasses[size]} text-[#2C2523]`}>
        {formatPrice(price, "USD")}
      </span>
      {showConversion && showLKRPrices && (
        <span className={`${sizeClasses[size]} text-[#A0958F]`}>
          ({formatPrice((price * 330).toFixed(0), "LKR")})
        </span>
      )}
    </div>
  );
}

/**
 * Compact price display for product cards
 * Shows price in a badge/label style
 */
export function PriceBadge({ price, showLKRPrices = true }) {
  const { formatPrice } = usePriceFormatter();

  return (
    <span className="font-bold text-[#2C2523] whitespace-nowrap text-sm bg-[#F5EFEB] py-0.5 px-2 rounded-lg hover:bg-[#E0A996]/20 transition-colors">
      {formatPrice(price, "USD")}
    </span>
  );
}

/**
 * Checkout summary with detailed pricing breakdown
 */
export function CheckoutSummary({
  subtotal,
  deliveryFee = 0,
  showLKR = true,
  showLKRPrices = true,
}) {
  const { formatPrice, getPriceWithConversion } = usePriceFormatter();

  const subtotalPrices = getPriceWithConversion(subtotal);
  const deliveryPrices = getPriceWithConversion(deliveryFee);
  const totalPrices = getPriceWithConversion(subtotal + deliveryFee);
  const shouldShowLKR = showLKR && showLKRPrices;

  return (
    <div className="space-y-3 bg-[#FDFBF7] p-4 rounded-xl border border-[#EBE5E0]">
      {/* Subtotal */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-[#4A3728]">Subtotal</span>
        <div className="text-right">
          <p className="font-semibold text-[#2C2523]">{subtotalPrices.usd}</p>
          {shouldShowLKR && subtotalPrices.lkr && (
            <p className="text-xs text-[#A0958F]">{subtotalPrices.lkr}</p>
          )}
        </div>
      </div>

      {/* Delivery */}
      <div className="flex justify-between items-center border-t border-[#EBE5E0] pt-3">
        {deliveryFee > 0 ? (
          <>
            <span className="text-sm text-[#4A3728]">Delivery</span>
            <div className="text-right">
              <p className="font-semibold text-[#2C2523]">
                {deliveryPrices.usd}
              </p>
              {shouldShowLKR && deliveryPrices.lkr && (
                <p className="text-xs text-[#A0958F]">{deliveryPrices.lkr}</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex justify-between items-center">
            <span className="text-sm font-semibold text-green-600">
              ✓ Free Delivery
            </span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center border-t border-[#E0A996] pt-3">
        <span className="font-bold text-[#2C2523]">Total</span>
        <div className="text-right">
          <p className="font-bold text-lg text-[#2C2523]">{totalPrices.usd}</p>
          {shouldShowLKR && totalPrices.lkr && (
            <p className="text-xs font-semibold text-[#A0958F]">
              {totalPrices.lkr}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PriceDisplay;
