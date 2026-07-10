# Configuration Quick Reference

Fast lookup for common configuration tasks. Full details in `CONFIGURATION.md`.

---

## 🌍 Currency Configuration

### Show/Hide LKR Prices

**File**: `src/lib/config.js`

```javascript
enableLKR: true; // or false to hide LKR
```

### Update Exchange Rate

**Current**: 1 USD = 330 LKR

To change:

```javascript
// In CURRENCY_CONFIG
exchangeRate: 350; // Update this number
```

### Format a Price in Code

```javascript
import { CURRENCY_CONFIG } from "@/lib/config";

CURRENCY_CONFIG.format(99.99, "USD"); // "$99.99"
CURRENCY_CONFIG.format(33000, "LKR"); // "Rs33000"
CURRENCY_CONFIG.toLKR(100); // 33000
```

---

## 🚚 Delivery & Shipping

### Set Free Shipping Threshold

**File**: `src/lib/config.js` → `DELIVERY_CONFIG`

```javascript
freeShippingThresholdUSD: 50.0; // Change to desired amount
```

### Update Base Delivery Fee

```javascript
baseFeeUSD: 5.0; // Change to new fee
```

### Add a New Delivery Region

```javascript
regions: [
  {
    name: "New Region",
    code: "NR",
    fee: 7.0,
    deliveryDays: "3-4",
  },
];
```

### Available Region Codes

- `CMB` - Colombo Area
- `WP` - Western Province
- `SP` - Southern Province
- `CP` - Central Province
- `NP` - Northern Province
- `EP` - Eastern Province

---

## 📱 Contact Information

### Update WhatsApp Number

**File**: `src/lib/config.js` → `CONTACT_CONFIG.whatsapp`

```javascript
phoneNumber: "+94705987654"; // Update here
```

### Change WhatsApp Auto-Message

```javascript
messageTemplate: "Custom message here";
```

### Update Messenger Link

```javascript
facebook: {
  messengerUrl: "https://m.me/your-page-name";
}
```

### Change Support Email

```javascript
email: {
  support: "newemail@example.com";
}
```

### Update Instagram Handle

```javascript
instagram: {
  handle: "@new_handle",
  profileUrl: "https://instagram.com/new_handle"
}
```

### Disable a Contact Method

```javascript
whatsapp: {
  enabled: false; // Set to false to hide
}
```

---

## 🔐 Security & Authentication

### Generate New JWT Secrets

```bash
# In terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Update JWT Secrets

**File**: `.env`

```bash
JWT_SECRET="new-secret-here"
JWT_REFRESH_SECRET="new-refresh-secret-here"
```

### Rotate Secrets Safely

1. Generate new values (use command above)
2. Update `.env` file
3. Deploy/restart app
4. Existing sessions invalidate automatically

### Change Session Timeout

**File**: `src/lib/config.js` → `SECURITY_CONFIG.session`

```javascript
timeout: 60; // Change to minutes (60 = 1 hour)
```

### Change Token Expiry

```javascript
jwt: {
  accessTokenExpiry: "1h",     // Access token lifetime
  refreshTokenExpiry: "7d"     // Refresh token lifetime
}
```

### Add CORS Domain

**File**: `src/lib/config.js`

```javascript
cors: {
  allowedOrigins: [
    "http://localhost:3000",
    "https://new-domain.com", // Add here
  ];
}
```

---

## 🎛️ Feature Flags

### Enable/Disable Features

**File**: `src/lib/config.js` → `FEATURES`

```javascript
showLKRConversion: true,        // Show LKR prices
editDeliveryFees: true,         // Allow admin to edit fees
showWhatsApp: true,             // Show WhatsApp
showMessenger: true,            // Show Messenger
showEmail: true,                // Show Email
enableAnalytics: true,          // Enable tracking
maintenanceMode: false,         // Site open/closed
betaFeatures: false             // Experimental features
```

### Quick Maintenance Mode

```javascript
maintenanceMode: true; // Site shows maintenance notice
```

---

## 📝 Business Information

### Update Business Hours

**File**: `src/lib/config.js` → `APP_CONFIG`

```javascript
businessHours: {
  monday: { open: "09:00", close: "18:00" },
  tuesday: { open: "09:00", close: "18:00" },
  // ... etc
  sunday: { open: "closed", close: "closed" }
}
```

### Change Business Name

```javascript
APP_CONFIG: {
  name: "New Business Name",
  tagline: "New tagline"
}
```

### Update Location

```javascript
location: {
  city: "New City",
  country: "Country",
  timezone: "Asia/Colombo"
}
```

---

## 💡 Common Scenarios

### Scenario: Closed for Holiday

```javascript
// Disable all contacts
CONTACT_CONFIG.whatsapp.enabled = false;
CONTACT_CONFIG.facebook.enabled = false;

// Update email with closure info
email.support: "We'll reopen on July 15!"

// Enable maintenance mode
maintenanceMode: true
```

### Scenario: Special Sale - Increase Free Shipping

```javascript
// Lower the free shipping threshold
freeShippingThresholdUSD: 25.0; // Was 50
```

### Scenario: Expand to New Region

```javascript
// Add region to delivery config
regions: [
  {
    name: "New Region",
    code: "NW",
    fee: 8.0,
    deliveryDays: "4-5",
  },
];
```

### Scenario: Change Currency (USD → LKR Primary)

```javascript
// Modify CURRENCY_CONFIG
primary: "LKR",
displayFormat: (amount) => `Rs${amount}`
```

---

## 📋 All Configuration Locations

| Setting  | File                | Variable          |
| -------- | ------------------- | ----------------- |
| Currency | `src/lib/config.js` | `CURRENCY_CONFIG` |
| Delivery | `src/lib/config.js` | `DELIVERY_CONFIG` |
| Contacts | `src/lib/config.js` | `CONTACT_CONFIG`  |
| Security | `src/lib/config.js` | `SECURITY_CONFIG` |
| App Info | `src/lib/config.js` | `APP_CONFIG`      |
| Features | `src/lib/config.js` | `FEATURES`        |
| Secrets  | `.env`              | `JWT_SECRET`, etc |

---

## 🧪 Test Your Configuration

### Verify All Settings

```bash
# In browser console:
import { verifySecurityConfig, getActiveContacts } from '@/lib/config';
console.log(verifySecurityConfig());
console.log(getActiveContacts());
```

### Test Currency Conversion

```javascript
import { CURRENCY_CONFIG } from "@/lib/config";

console.log("100 USD = " + CURRENCY_CONFIG.toLKR(100) + " LKR");
console.log("33000 LKR = $" + CURRENCY_CONFIG.toUSD(33000) + " USD");
```

### Check Contact Links Work

```javascript
import { CONTACT_CONFIG } from "@/lib/config";

// These should open working links
window.open(CONTACT_CONFIG.whatsapp.getLink());
window.open(CONTACT_CONFIG.facebook.getMessengerLink());
```

---

## ⚠️ Important Reminders

- **Never commit `.env` to Git** - It's in `.gitignore`
- **Restart dev server** after changing config: `npm run dev`
- **Generate strong secrets** - Use the command above
- **Test currency conversion** - Verify exchange rate regularly
- **Backup contact info** - Keep records of previous settings

---

## 🆘 Troubleshooting

| Issue                 | Solution                                           |
| --------------------- | -------------------------------------------------- |
| Config not updating   | Restart: `npm run dev`                             |
| JWT error             | Check `.env` exists and has secrets                |
| Wrong currency symbol | Verify `CURRENCY_CONFIG.symbols`                   |
| Contact link broken   | Check phone numbers & URLs are formatted correctly |
| Build fails           | Run `npm run lint` to check syntax                 |

---

**Last Updated**: 2026-07-09  
**Version**: 1.0
