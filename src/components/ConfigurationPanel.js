/**
 * Example: Configuration Admin Panel
 *
 * This demonstrates how to create a settings management UI
 * Note: This is an example - integrate into your admin dashboard as needed
 */

"use client";

import { useState } from "react";
import {
  CURRENCY_CONFIG,
  DELIVERY_CONFIG,
  CONTACT_CONFIG,
  SECURITY_CONFIG,
  FEATURES,
} from "@/lib/config";
import { Settings, Copy, CheckCircle, AlertCircle } from "lucide-react";

export function ConfigurationPanel() {
  const [activeTab, setActiveTab] = useState("currency");
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto bg-white rounded-lg shadow">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <Settings className="w-6 h-6 text-blue-600" />
        <h1 className="text-3xl font-bold">Configuration Management</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {[
          { id: "currency", label: "Currency" },
          { id: "delivery", label: "Delivery" },
          { id: "contacts", label: "Contacts" },
          { id: "security", label: "Security" },
          { id: "features", label: "Features" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* CURRENCY TAB */}
        {activeTab === "currency" && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h2 className="font-bold text-lg mb-4">Currency Settings</h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Primary Currency
                  </label>
                  <span className="inline-block bg-blue-100 text-blue-900 px-3 py-1 rounded">
                    {CURRENCY_CONFIG.primary}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    LKR Conversion Enabled
                  </label>
                  <span
                    className={`inline-block px-3 py-1 rounded ${
                      CURRENCY_CONFIG.enableLKR
                        ? "bg-green-100 text-green-900"
                        : "bg-red-100 text-red-900"
                    }`}
                  >
                    {CURRENCY_CONFIG.enableLKR ? "✓ Enabled" : "✗ Disabled"}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Exchange Rate (1 USD = X LKR)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {CURRENCY_CONFIG.exchangeRate}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `${CURRENCY_CONFIG.exchangeRate}`,
                          "rate",
                        )
                      }
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      {copied === "rate" ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Edit in: src/lib/config.js → CURRENCY_CONFIG.exchangeRate
                  </p>
                </div>

                <div className="bg-white p-3 rounded border">
                  <h3 className="font-semibold mb-2">Currency Symbols</h3>
                  <div className="text-sm space-y-1">
                    <p>
                      USD:{" "}
                      <code className="bg-gray-100 px-1">
                        {CURRENCY_CONFIG.symbols.USD}
                      </code>
                    </p>
                    <p>
                      LKR:{" "}
                      <code className="bg-gray-100 px-1">
                        {CURRENCY_CONFIG.symbols.LKR}
                      </code>
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <h3 className="font-semibold mb-2 text-green-900">
                    Test Conversion
                  </h3>
                  <p className="text-sm">
                    $100 USD ={" "}
                    {CURRENCY_CONFIG.format(CURRENCY_CONFIG.toLKR(100), "LKR")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DELIVERY TAB */}
        {activeTab === "delivery" && (
          <div className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h2 className="font-bold text-lg mb-4">Delivery Settings</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Base Delivery Fee
                  </label>
                  <span className="text-2xl font-bold">
                    ${DELIVERY_CONFIG.baseFeeUSD.toFixed(2)}
                  </span>
                  <p className="text-xs text-gray-500">
                    Default fee when no region specified
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Free Shipping Threshold
                  </label>
                  <span className="text-2xl font-bold">
                    ${DELIVERY_CONFIG.freeShippingThresholdUSD.toFixed(2)}
                  </span>
                  <p className="text-xs text-gray-500">
                    Orders above this get free delivery
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Regional Fees</h3>
                <div className="space-y-2">
                  {DELIVERY_CONFIG.regions.map((region) => (
                    <div
                      key={region.code}
                      className="flex justify-between items-center p-2 bg-white rounded border"
                    >
                      <div>
                        <span className="font-semibold">{region.name}</span>
                        <span className="text-xs bg-gray-100 ml-2 px-2 py-0.5 rounded">
                          {region.code}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${region.fee.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {region.deliveryDays} days
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Edit in: src/lib/config.js → DELIVERY_CONFIG
              </p>
            </div>
          </div>
        )}

        {/* CONTACTS TAB */}
        {activeTab === "contacts" && (
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h2 className="font-bold text-lg mb-4">Contact Configuration</h2>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">WhatsApp</h3>
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        CONTACT_CONFIG.whatsapp.enabled
                          ? "bg-green-100 text-green-900"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {CONTACT_CONFIG.whatsapp.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <p className="text-sm">
                    Phone:{" "}
                    <code className="bg-gray-100 px-1">
                      {CONTACT_CONFIG.whatsapp.phoneNumber}
                    </code>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Edit in: CONTACT_CONFIG.whatsapp
                  </p>
                </div>

                <div className="bg-white p-4 rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Facebook Messenger</h3>
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        CONTACT_CONFIG.facebook.enabled
                          ? "bg-green-100 text-green-900"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {CONTACT_CONFIG.facebook.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <p className="text-sm truncate">
                    URL:{" "}
                    <code className="bg-gray-100 px-1 text-xs">
                      {CONTACT_CONFIG.facebook.messengerUrl}
                    </code>
                  </p>
                </div>

                <div className="bg-white p-4 rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Email</h3>
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        CONTACT_CONFIG.email.enabled
                          ? "bg-green-100 text-green-900"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {CONTACT_CONFIG.email.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <p className="text-sm">
                    Support:{" "}
                    <code className="bg-gray-100 px-1">
                      {CONTACT_CONFIG.email.support}
                    </code>
                  </p>
                </div>

                <div className="bg-white p-4 rounded border">
                  <h3 className="font-semibold mb-2">Instagram</h3>
                  <p className="text-sm">
                    Handle:{" "}
                    <code className="bg-gray-100 px-1">
                      {CONTACT_CONFIG.instagram.handle}
                    </code>
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Edit in: src/lib/config.js → CONTACT_CONFIG
              </p>
            </div>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === "security" && (
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h2 className="font-bold text-lg mb-4">Security Settings</h2>

              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded mb-4 flex gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-900">
                  <strong>
                    Secrets are stored in <code>.env</code> file
                  </strong>{" "}
                  (not committed to Git for security)
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-white p-3 rounded border">
                  <h3 className="font-semibold text-sm mb-1">JWT Settings</h3>
                  <p className="text-xs">
                    Access Token Expiry:{" "}
                    <code className="bg-gray-100 px-1">
                      {SECURITY_CONFIG.jwt.accessTokenExpiry}
                    </code>
                  </p>
                  <p className="text-xs">
                    Refresh Token Expiry:{" "}
                    <code className="bg-gray-100 px-1">
                      {SECURITY_CONFIG.jwt.refreshTokenExpiry}
                    </code>
                  </p>
                </div>

                <div className="bg-white p-3 rounded border">
                  <h3 className="font-semibold text-sm mb-1">Session</h3>
                  <p className="text-xs">
                    Timeout:{" "}
                    <strong>{SECURITY_CONFIG.session.timeout} minutes</strong>
                  </p>
                  <p className="text-xs">
                    Auto-refresh:{" "}
                    <strong>
                      {SECURITY_CONFIG.session.autoRefresh
                        ? "Enabled"
                        : "Disabled"}
                    </strong>
                  </p>
                </div>

                <div className="bg-white p-3 rounded border">
                  <h3 className="font-semibold text-sm mb-1">Rate Limiting</h3>
                  <p className="text-xs">
                    Max Login Attempts:{" "}
                    <strong>
                      {SECURITY_CONFIG.rateLimiting.maxLoginAttempts}
                    </strong>
                  </p>
                  <p className="text-xs">
                    Lockout Duration:{" "}
                    <strong>
                      {SECURITY_CONFIG.rateLimiting.lockoutDuration} minutes
                    </strong>
                  </p>
                </div>

                <div className="bg-white p-3 rounded border">
                  <h3 className="font-semibold text-sm mb-1">
                    CORS Allowed Origins
                  </h3>
                  <ul className="text-xs space-y-1">
                    {SECURITY_CONFIG.cors.allowedOrigins.map((origin) => (
                      <li key={origin} className="text-gray-600">
                        • {origin}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Edit in: src/lib/config.js → SECURITY_CONFIG or .env file
              </p>
            </div>
          </div>
        )}

        {/* FEATURES TAB */}
        {activeTab === "features" && (
          <div className="space-y-4">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h2 className="font-bold text-lg mb-4">Feature Flags</h2>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(FEATURES).map(([key, value]) => (
                  <div
                    key={key}
                    className={`p-3 rounded border ${
                      value
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          value
                            ? "bg-green-100 text-green-900"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {value ? "✓" : "✗"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Edit in: src/lib/config.js → FEATURES
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t pt-4 text-xs text-gray-500">
        <p>
          💡 For full configuration details, see{" "}
          <code className="bg-gray-100 px-1">CONFIGURATION.md</code> or{" "}
          <code className="bg-gray-100 px-1">CONFIG_QUICK_REFERENCE.md</code>
        </p>
        <p className="mt-1">
          All changes require editing{" "}
          <code className="bg-gray-100 px-1">src/lib/config.js</code> and
          restarting the dev server.
        </p>
      </div>
    </div>
  );
}

export default ConfigurationPanel;
