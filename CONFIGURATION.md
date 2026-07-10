# Configuration Guide: Crochet with Dilru

This guide explains how to manage currency, delivery, contacts, security, and app settings in your Crochet with Dilru storefront.

---

## 1. Currency Configuration

### Overview

The app supports USD as the primary currency with optional Sri Lankan Rupee (LKR) conversion.

### Location

- **File**: `src/lib/config.js` → `CURRENCY_CONFIG`
- **Hook**: `src/lib/usePriceFormatter.js`

### Configuration Options

```javascript
{
  primary: "USD",              // Primary currency code
  enableLKR: true,             // Toggle LKR conversion on/off
  exchangeRate: 330,           // 1 USD = X LKR (update as needed)
  decimals: 2,                 // Decimal places for formatting
  symbols: {
    USD: "$",
    LKR: "Rs"
  }
}
```

### How to Use

#### In React Components

```javascript
import { usePriceFormatter } from "@/lib/usePriceFormatter";

export function ProductCard({ price }) {
  const { formatPrice, getPriceWithConversion } = usePriceFormatter();

  // Format single price
  const usdPrice = formatPrice(price, "USD"); // "$49.99"

  // Get both currencies
  const prices = getPriceWithConversion(price);
  // {
  //   usd: "$49.99",
  //   lkr: "Rs16,470",
  //   amountUSD: 49.99,
  //   amountLKR: 16470
  // }

  return (
    <div>
      <p>{prices.usd}</p>
      {prices.lkr && <p className="text-sm text-gray-500">{prices.lkr}</p>}
    </div>
  );
}
```

#### Direct Import

```javascript
import { CURRENCY_CONFIG } from "@/lib/config";

const formatted = CURRENCY_CONFIG.format(99.99, "USD"); // "$99.99"
const lkrAmount = CURRENCY_CONFIG.toLKR(99.99); // 32967
const usdAmount = CURRENCY_CONFIG.toUSD(32967); // "99.99"
```

### Updating Exchange Rate

1. Open `src/lib/config.js`
2. Locate `CURRENCY_CONFIG.exchangeRate`
3. Update the value to the current USD → LKR rate
4. Example: If 1 USD = 330 LKR, set `exchangeRate: 330`

---

## 2. Delivery & Shipping Configuration

### Overview

Manage delivery fees, free shipping thresholds, and regional delivery settings.

### Location

- **File**: `src/lib/config.js` → `DELIVERY_CONFIG`

### Configuration Options

```javascript
{
  baseFeeUSD: 5.0,                    // Default delivery fee
  freeShippingThresholdUSD: 50.0,     // Orders >= this get free delivery
  expressFeeUSD: 12.0,                // Express delivery surcharge
  regions: [
    {
      name: "Region Name",
      code: "RGN",
      fee: 2.0,                       // Override for this region
      deliveryDays: "1-2"             // Estimated delivery time
    }
  ]
}
```

### Available Regions

- **CMB**: Colombo Area (1-2 days)
- **WP**: Western Province (2-3 days)
- **SP**: Southern Province (3-4 days)
- **CP**: Central Province (3-4 days)
- **NP**: Northern Province (4-5 days)
- **EP**: Eastern Province (3-4 days)

### How to Use

#### Calculate Delivery Fee

```javascript
import { DELIVERY_CONFIG } from "@/lib/config";

const orderTotal = 45; // USD
const region = "CMB";

// Calculate delivery fee
const fee = DELIVERY_CONFIG.calculateFee(orderTotal, region); // $2.0

// Check if free shipping applies
const isFreeShipping = orderTotal >= DELIVERY_CONFIG.freeShippingThresholdUSD;

// Get delivery estimate
const days = DELIVERY_CONFIG.getDeliveryDays(region); // "1-2"
```

#### Add to Checkout

```javascript
const subtotal = 45;
const deliveryFee = DELIVERY_CONFIG.calculateFee(subtotal, "CMB");
const total = subtotal + deliveryFee;

console.log(`Subtotal: $${subtotal.toFixed(2)}`);
console.log(`Delivery: $${deliveryFee.toFixed(2)}`);
console.log(`Total: $${total.toFixed(2)}`);
// Output:
// Subtotal: $45.00
// Delivery: $2.00
// Total: $47.00
```

### Adding a New Region

1. Open `src/lib/config.js`
2. Locate `DELIVERY_CONFIG.regions` array
3. Add a new region object:
   ```javascript
   {
     name: "Uva Province",
     code: "UP",
     fee: 6.5,
     deliveryDays: "3-4"
   }
   ```

### Adjusting Free Shipping Threshold

1. Open `src/lib/config.js`
2. Find `DELIVERY_CONFIG.freeShippingThresholdUSD`
3. Update the value (in USD)
4. Example: `freeShippingThresholdUSD: 75.0` means orders over $75 ship free

---

## 3. Contact & Communication Configuration

### Overview

Centralized management of WhatsApp, Facebook Messenger, Email, and social media links.

### Location

- **File**: `src/lib/config.js` → `CONTACT_CONFIG`

### Configuration Options

```javascript
{
  whatsapp: {
    enabled: true,
    phoneNumber: "+94705123456",           // Your WhatsApp Business number
    messageTemplate: "Hi! I'm interested..."
  },
  facebook: {
    enabled: true,
    pageId: "61553942184584",
    pageUrl: "https://...",
    messengerUrl: "https://m.me/..."
  },
  email: {
    enabled: true,
    address: "hello@...",                  // General contact
    support: "support@..."                 // Support email
  },
  instagram: {
    enabled: true,
    handle: "@crochet_with_dilru",
    profileUrl: "https://..."
  }
}
```

### How to Use

#### Get Active Contacts

```javascript
import { getActiveContacts, CONTACT_CONFIG } from "@/lib/config";

// Get all enabled contact methods
const contacts = getActiveContacts();
// [
//   { type: "whatsapp", label: "WhatsApp", link: "https://wa.me/...", icon: "whatsapp" },
//   { type: "messenger", label: "Facebook Messenger", link: "https://m.me/...", icon: "messenger" },
//   { type: "email", label: "Email", link: "mailto:support@...", icon: "email" },
//   { type: "instagram", label: "Instagram", link: "https://...", icon: "instagram" }
// ]

// Render contact links
contacts.forEach((contact) => {
  console.log(`${contact.label}: ${contact.link}`);
});
```

#### Direct Links

```javascript
import { CONTACT_CONFIG } from "@/lib/config";

// WhatsApp
const whatsappLink = CONTACT_CONFIG.whatsapp.getLink();
// https://wa.me/94705123456?text=Hi%21%20I%27m%20interested...

// Facebook Messenger
const messengerLink = CONTACT_CONFIG.facebook.getMessengerLink();
// https://m.me/crochetwith.dilru

// Email
const supportEmail = CONTACT_CONFIG.email.support;
// support@crochetwith-dilru.com
```

### Updating Contact Information

#### Change WhatsApp Number

1. Open `src/lib/config.js`
2. Find `CONTACT_CONFIG.whatsapp.phoneNumber`
3. Update with your number (include country code)
4. Example: `"+94715987654"` (Sri Lanka)

#### Update WhatsApp Message

1. Open `src/lib/config.js`
2. Find `CONTACT_CONFIG.whatsapp.messageTemplate`
3. Customize the message
4. Example: `"Hi! I'd like to order a custom cardigan in sage green."`

#### Change Messenger Link

1. Open `src/lib/config.js`
2. Update `CONTACT_CONFIG.facebook.messengerUrl`
3. Find your page's messenger URL from Facebook

#### Update Email Addresses

1. Open `src/lib/config.js`
2. Update `CONTACT_CONFIG.email.address` (general inquiries)
3. Update `CONTACT_CONFIG.email.support` (support requests)

#### Update Instagram Handle

1. Open `src/lib/config.js`
2. Update `CONTACT_CONFIG.instagram.handle`
3. Update `CONTACT_CONFIG.instagram.profileUrl`

### Disabling Contact Methods

To disable a contact method (e.g., to hide WhatsApp temporarily):

```javascript
CONTACT_CONFIG.whatsapp.enabled = false;
```

---

## 4. Security & Authentication Configuration

### Overview

Manage JWT tokens, session timeouts, rate limiting, and CORS settings.

### Location

- **File**: `src/lib/config.js` → `SECURITY_CONFIG`
- **Environment File**: `.env` (secrets storage)

### Configuration Options

```javascript
{
  jwt: {
    accessTokenExpiry: "1h",              // Access token lifetime
    refreshTokenExpiry: "7d",             // Refresh token lifetime
    getAccessTokenSecret: () => process.env.JWT_SECRET,
    getRefreshTokenSecret: () => process.env.JWT_REFRESH_SECRET
  },
  session: {
    timeout: 60,                          // Inactivity timeout (minutes)
    autoRefresh: true                     // Auto-refresh on page load
  },
  rateLimiting: {
    enabled: true,
    maxLoginAttempts: 5,                  // Before lockout
    lockoutDuration: 15                   // Minutes
  },
  cors: {
    allowedOrigins: [
      "http://localhost:3000",
      "https://..."
    ]
  }
}
```

### Environment Variables

#### Required Secrets (.env file)

```bash
# JWT Secrets - Generate unique, strong values
JWT_SECRET="your-unique-access-token-secret-here"
JWT_REFRESH_SECRET="your-unique-refresh-token-secret-here"

# Firebase Configuration (already in .env)
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
# ... other Firebase vars
```

#### ⚠️ SECURITY BEST PRACTICES

1. **Never commit secrets to Git**
   - `.env` is in `.gitignore`
   - Environment variables are used in production

2. **Generate Strong Secrets**

   ```bash
   # Generate a random secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Update Secrets Periodically**
   - Update JWT secrets monthly
   - Keep refresh tokens shorter-lived than access tokens

4. **Production Deployment**
   - Set environment variables in your hosting platform (Vercel, AWS, etc.)
   - Never paste secrets in code or version control

### How to Use

#### Verify Security Configuration

```javascript
import { verifySecurityConfig } from "@/lib/config";

const check = verifySecurityConfig();
if (!check.valid) {
  console.error("Security configuration issues:", check.errors);
}
```

#### Access Token Configuration in API Routes

```javascript
import { SECURITY_CONFIG } from "@/lib/config";

const secret = SECURITY_CONFIG.jwt.getAccessTokenSecret();
const expiry = SECURITY_CONFIG.jwt.accessTokenExpiry;

// Use in JWT signing
```

#### Session Timeout Configuration

```javascript
import { SECURITY_CONFIG } from "@/lib/config";

const timeout = SECURITY_CONFIG.session.timeout; // 60 minutes
const willAutoRefresh = SECURITY_CONFIG.session.autoRefresh; // true
```

### Updating JWT Secrets

⚠️ **Steps to rotate JWT secrets safely:**

1. Generate new secrets:

   ```bash
   # Access token secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

   # Refresh token secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. Update `.env` file with new values

3. For production:
   - Update environment variables in your hosting platform
   - Existing sessions will invalidate after refresh token expiry
   - Users will need to log in again

4. Commit the change (`.env` won't be committed due to `.gitignore`)

### Adding CORS Origins

To allow authentication from new domains:

1. Open `src/lib/config.js`
2. Find `SECURITY_CONFIG.cors.allowedOrigins`
3. Add new domain:
   ```javascript
   allowedOrigins: [
     "http://localhost:3000",
     "https://www.crochetwith-dilru.com",
     "https://new-domain.com", // Add here
   ];
   ```

---

## 5. Feature Flags

### Overview

Enable/disable features without code changes.

### Location

- **File**: `src/lib/config.js` → `FEATURES`

### Available Flags

```javascript
{
  showLKRConversion: true,        // Display LKR prices
  editDeliveryFees: true,         // Admin can edit delivery fees
  showWhatsApp: true,             // Display WhatsApp contact
  showMessenger: true,            // Display Messenger contact
  showEmail: true,                // Display email contact
  enableAnalytics: true,          // Track user behavior
  maintenanceMode: false,         // Disable store access
  betaFeatures: false             // New experimental features
}
```

### How to Use

```javascript
import { FEATURES } from "@/lib/config";

if (FEATURES.showLKRConversion) {
  // Display LKR prices in UI
}

if (FEATURES.maintenanceMode) {
  // Redirect to maintenance page
}
```

### Enabling Maintenance Mode

1. Open `src/lib/config.js`
2. Change `maintenanceMode: false` to `maintenanceMode: true`
3. Restart dev server
4. Users will see a maintenance notice

---

## 6. App Metadata

### Overview

Business information, social proof, and operating hours.

### Location

- **File**: `src/lib/config.js` → `APP_CONFIG`

### Configuration Options

```javascript
{
  name: "Crochet with Dilru",
  url: "https://www.crochetwith-dilru.com",
  businessHours: {
    monday: { open: "09:00", close: "18:00" },
    sunday: { open: "closed", close: "closed" }
  },
  location: {
    city: "Colombo",
    country: "Sri Lanka",
    timezone: "Asia/Colombo"
  }
}
```

### Updating Business Hours

1. Open `src/lib/config.js`
2. Find `APP_CONFIG.businessHours`
3. Update hours for each day:
   ```javascript
   monday: { open: "10:00", close: "19:00" },
   ```

---

## Common Tasks

### Task: Change All Contact Information for a Holiday

```javascript
// In src/lib/config.js
const CONTACT_CONFIG = {
  whatsapp: {
    enabled: false, // Disabled during holiday
    // ...
  },
  facebook: {
    enabled: false, // Disabled during holiday
    // ...
  },
  email: {
    enabled: true,
    address: "closed@crochetwith-dilru.com",
    support: "We're back on [date]!",
  },
};
```

### Task: Increase Prices in LKR

Since prices are stored in USD and converted to LKR:

1. Update exchange rate: `CURRENCY_CONFIG.exchangeRate: 350`
2. All LKR prices auto-update

### Task: Launch in a New Market with Different Pricing

```javascript
// Create region-specific config
const REGION_PRICING = {
  SL: {
    // Sri Lanka
    currency: "USD",
    exchangeRate: 330,
    baseFee: 5.0,
  },
  US: {
    // United States
    currency: "USD",
    exchangeRate: 1,
    baseFee: 8.0,
  },
};
```

---

## Testing Your Configuration

### Run Configuration Validation

```javascript
import { verifySecurityConfig } from "@/lib/config";

const validation = verifySecurityConfig();
console.log(validation);
// { valid: true, errors: [] }
```

### Test Currency Conversion

```javascript
import { CURRENCY_CONFIG } from "@/lib/config";

console.log(CURRENCY_CONFIG.toLKR(100)); // Should be ~33000
console.log(CURRENCY_CONFIG.toUSD(33000)); // Should be ~100
```

### Test Contact Links

```javascript
import { getActiveContacts, CONTACT_CONFIG } from "@/lib/config";

const contacts = getActiveContacts();
console.log(contacts);

// Open links in browser
window.open(CONTACT_CONFIG.whatsapp.getLink());
window.open(CONTACT_CONFIG.facebook.getMessengerLink());
```

---

## Troubleshooting

### Issue: Configuration not updating in browser

**Solution**: Restart the dev server

```bash
npm run dev
```

### Issue: JWT secrets showing as undefined

**Solution**: Check `.env` file exists and is in the project root

```bash
cat .env
```

### Issue: Currency formatting showing wrong symbols

**Solution**: Verify `CURRENCY_CONFIG.symbols` in config.js

### Issue: Contact links not working

**Solution**: Verify phone numbers include country codes and are formatted correctly

---

## Support & Questions

For issues or questions about configuration:

1. Check the relevant section in this guide
2. Verify environment variables are set correctly
3. Test configuration import: `node -e "require('./src/lib/config.js').verifySecurityConfig()"`
4. Contact support via configured channels

---

**Last Updated**: 2026-07-09  
**Configuration Version**: 1.0
