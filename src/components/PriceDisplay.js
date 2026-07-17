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
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className={`font-semibold ${sizeClasses[size]} text-foreground`}>
        {formatPrice(price, "USD")}
      </span>
      {showConversion && showLKRPrices && (
        <span className={`${sizeClasses[size] === "text-lg font-bold" ? "text-xs" : "text-xxs"} text-espresso-light/75 font-medium`}>
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
    <span className="font-bold text-foreground whitespace-nowrap text-sm bg-beige py-1 px-3 rounded-full hover:bg-primary/20 transition-all duration-300">
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
    <div className="space-y-3 bg-[#FFFBF7] p-5 rounded-2xl border border-beige shadow-sm">
      {/* Subtotal */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-espresso-light font-medium">Subtotal</span>
        <div className="text-right">
          <p className="font-semibold text-foreground">{subtotalPrices.usd}</p>
          {shouldShowLKR && subtotalPrices.lkr && (
            <p className="text-xxs text-espresso-light/70 font-medium">{subtotalPrices.lkr}</p>
          )}
        </div>
      </div>

      {/* Delivery */}
      <div className="flex justify-between items-center border-t border-beige pt-3">
        {deliveryFee > 0 ? (
          <>
            <span className="text-sm text-espresso-light font-medium">Delivery</span>
            <div className="text-right">
              <p className="font-semibold text-foreground">
                {deliveryPrices.usd}
              </p>
              {shouldShowLKR && deliveryPrices.lkr && (
                <p className="text-xxs text-espresso-light/70 font-medium">{deliveryPrices.lkr}</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex justify-between items-center">
            <span className="text-sm font-semibold text-accent">
              ✓ Free Delivery
            </span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center border-t border-primary/20 pt-3">
        <span className="font-bold text-foreground">Total</span>
        <div className="text-right">
          <p className="font-bold text-lg text-foreground">{totalPrices.usd}</p>
          {shouldShowLKR && totalPrices.lkr && (
            <p className="text-xs font-semibold text-espresso-light/80">
              {totalPrices.lkr}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PriceDisplay;
