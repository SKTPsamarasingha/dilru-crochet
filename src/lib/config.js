/**
 * Application Configuration
 * Central location for currency, delivery, contacts, and app settings
 *
 * Security Note: Sensitive values (API keys, secrets) should be in .env files,
 * not in this config file. Only reference them via process.env.
 */

// ============================================================================
// CURRENCY & LOCALIZATION
// ============================================================================
export const CURRENCY_CONFIG = {
  // Primary currency for the storefront
  primary: "USD",

  // Enable Sri Lankan Rupee conversion
  enableLKR: true,

  // Exchange rate (USD to LKR) - update periodically
  exchangeRate: 330, // 1 USD = 330 LKR

  // Display format
  symbols: {
    USD: "$",
    LKR: "Rs",
  },

  // Decimal places
  decimals: 2,

  // Format helper
  format: (amount, currency = "USD") => {
    const symbol = CURRENCY_CONFIG.symbols[currency] || "$";
    const formatted = parseFloat(amount).toFixed(CURRENCY_CONFIG.decimals);
    return `${symbol}${formatted}`;
  },

  // Convert USD to LKR
  toLKR: (usdAmount) => {
    return Math.round(usdAmount * CURRENCY_CONFIG.exchangeRate);
  },

  // Convert LKR to USD
  toUSD: (lkrAmount) => {
    return (lkrAmount / CURRENCY_CONFIG.exchangeRate).toFixed(
      CURRENCY_CONFIG.decimals,
    );
  },
};

// ============================================================================
// DELIVERY & SHIPPING
// ============================================================================
export const DELIVERY_CONFIG = {
  // Base delivery fee in USD
  baseFeeUSD: 5.0,

  // Free shipping threshold in USD (orders above this get free shipping)
  freeShippingThresholdUSD: 50.0,

  // Express delivery fee (USD)
  expressFeeUSD: 12.0,

  // Delivery regions
  regions: [
    {
      name: "Colombo Area",
      code: "CMB",
      fee: 2.0, // Override base fee for this region
      deliveryDays: "1-2",
    },
    {
      name: "Western Province",
      code: "WP",
      fee: 4.0,
      deliveryDays: "2-3",
    },
    {
      name: "Southern Province",
      code: "SP",
      fee: 6.0,
      deliveryDays: "3-4",
    },
    {
      name: "Central Province",
      code: "CP",
      fee: 7.0,
      deliveryDays: "3-4",
    },
    {
      name: "Northern Province",
      code: "NP",
      fee: 10.0,
      deliveryDays: "4-5",
    },
    {
      name: "Eastern Province",
      code: "EP",
      fee: 8.0,
      deliveryDays: "3-4",
    },
  ],

  // Calculate delivery fee based on order total
  calculateFee: (orderTotalUSD, region = null) => {
    if (orderTotalUSD >= DELIVERY_CONFIG.freeShippingThresholdUSD) {
      return 0;
    }

    if (region) {
      const regionConfig = DELIVERY_CONFIG.regions.find(
        (r) => r.code === region,
      );
      return regionConfig ? regionConfig.fee : DELIVERY_CONFIG.baseFeeUSD;
    }

    return DELIVERY_CONFIG.baseFeeUSD;
  },

  // Get delivery estimate
  getDeliveryDays: (region) => {
    const regionConfig = DELIVERY_CONFIG.regions.find((r) => r.code === region);
    return regionConfig ? regionConfig.deliveryDays : "3-5";
  },
};

// ============================================================================
// CONTACT & COMMUNICATION
// ============================================================================
export const CONTACT_CONFIG = {
  // WhatsApp Business
  whatsapp: {
    enabled: true,
    phoneNumber: "+94705123456", // Change to your WhatsApp Business number
    messageTemplate: "Hi! I'm interested in custom crochet orders.",
    // Generate full WhatsApp link
    getLink: () => {
      const message = encodeURIComponent(
        CONTACT_CONFIG.whatsapp.messageTemplate,
      );
      const phone = CONTACT_CONFIG.whatsapp.phoneNumber.replace(/\D/g, "");
      return `https://wa.me/${phone}?text=${message}`;
    },
  },

  // Facebook Messenger
  facebook: {
    enabled: true,
    pageId: "61553942184584",
    pageUrl: "https://web.facebook.com/p/Crochet-with-dilru-61553942184584/",
    messengerUrl: "https://m.me/crochetwith.dilru",
    // Generate messenger link
    getMessengerLink: () => CONTACT_CONFIG.facebook.messengerUrl,
  },

  // Email
  email: {
    enabled: true,
    address: "hello@crochetwith-dilru.com",
    support: "support@crochetwith-dilru.com",
  },

  // Instagram
  instagram: {
    enabled: true,
    handle: "@crochet_with_dilru",
    profileUrl: "https://instagram.com/crochet_with_dilru",
  },

  // General inquiry form
  inquiryForm: {
    enabled: true,
    googleFormUrl: "", // Add Google Form URL if available
  },
};

// ============================================================================
// SECURITY & AUTHENTICATION
// ============================================================================
export const SECURITY_CONFIG = {
  // JWT Configuration
  jwt: {
    // Access token expires in 1 hour
    accessTokenExpiry: "1h",
    // Refresh token expires in 7 days
    refreshTokenExpiry: "7d",
    // Secrets are read from environment variables
    getAccessTokenSecret: () => process.env.JWT_SECRET,
    getRefreshTokenSecret: () => process.env.JWT_REFRESH_SECRET,
  },

  // Session configuration
  session: {
    // Session timeout in minutes (for inactivity)
    timeout: 60,
    // Refresh session on page load
    autoRefresh: true,
  },

  // Rate limiting
  rateLimiting: {
    enabled: true,
    // Max login attempts before lockout
    maxLoginAttempts: 5,
    // Lockout duration in minutes
    lockoutDuration: 15,
  },

  // CORS settings
  cors: {
    allowedOrigins: [
      "http://localhost:3000",
      "https://crochet-with-dilru.vercel.app",
      "https://www.crochetwith-dilru.com",
    ],
  },
};

// ============================================================================
// APP METADATA
// ============================================================================
export const APP_CONFIG = {
  name: "Crochet with Dilru",
  tagline: "Handcrafted premium boutique creations",
  description:
    "Custom-order crochet cardigans, accessories, and bouquets made to order.",
  url: "https://www.crochetwith-dilru.com",

  // Social proof
  socialProof: {
    yearsInBusiness: 3,
    productsAvailable: 12,
    customersServed: 500,
  },

  // Business hours (in Asia/Colombo timezone)
  businessHours: {
    monday: { open: "09:00", close: "18:00" },
    tuesday: { open: "09:00", close: "18:00" },
    wednesday: { open: "09:00", close: "18:00" },
    thursday: { open: "09:00", close: "18:00" },
    friday: { open: "09:00", close: "18:00" },
    saturday: { open: "10:00", close: "16:00" },
    sunday: { open: "closed", close: "closed" },
  },

  // Location
  location: {
    city: "Colombo",
    country: "Sri Lanka",
    timezone: "Asia/Colombo",
  },
};

// ============================================================================
// FEATURE FLAGS
// ============================================================================
export const FEATURES = {
  // Currency toggle for LKR display
  showLKRConversion: CURRENCY_CONFIG.enableLKR,

  // Delivery configuration UI (admin)
  editDeliveryFees: true,

  // Contact method visibility
  showWhatsApp: CONTACT_CONFIG.whatsapp.enabled,
  showMessenger: CONTACT_CONFIG.facebook.enabled,
  showEmail: CONTACT_CONFIG.email.enabled,

  // Analytics & tracking
  enableAnalytics: true,

  // Maintenance mode
  maintenanceMode: false,

  // Beta features
  betaFeatures: false,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get complete contact information with all enabled methods
 */
export const getActiveContacts = () => {
  const contacts = [];

  if (CONTACT_CONFIG.whatsapp.enabled) {
    contacts.push({
      type: "whatsapp",
      label: "WhatsApp",
      link: CONTACT_CONFIG.whatsapp.getLink(),
      icon: "whatsapp",
    });
  }

  if (CONTACT_CONFIG.facebook.enabled) {
    contacts.push({
      type: "messenger",
      label: "Facebook Messenger",
      link: CONTACT_CONFIG.facebook.getMessengerLink(),
      icon: "messenger",
    });
  }

  if (CONTACT_CONFIG.email.enabled) {
    contacts.push({
      type: "email",
      label: "Email",
      link: `mailto:${CONTACT_CONFIG.email.support}`,
      icon: "email",
    });
  }

  if (CONTACT_CONFIG.instagram.enabled) {
    contacts.push({
      type: "instagram",
      label: "Instagram",
      link: CONTACT_CONFIG.instagram.profileUrl,
      icon: "instagram",
    });
  }

  return contacts;
};

/**
 * Verify security configuration is properly set
 */
export const verifySecurityConfig = () => {
  const errors = [];

  if (!process.env.JWT_SECRET) {
    errors.push("JWT_SECRET environment variable is not set");
  }

  if (!process.env.JWT_REFRESH_SECRET) {
    errors.push("JWT_REFRESH_SECRET environment variable is not set");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

const config = {
  CURRENCY_CONFIG,
  DELIVERY_CONFIG,
  CONTACT_CONFIG,
  SECURITY_CONFIG,
  APP_CONFIG,
  FEATURES,
  getActiveContacts,
  verifySecurityConfig,
};

export default config;
