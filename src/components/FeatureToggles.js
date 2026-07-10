/**
 * FeatureToggles Component
 * Editable feature flags for admin dashboard
 */

"use client";

import { useState } from "react";
import { useFeatureSettings } from "@/lib/useFeatureSettings";
import { AlertCircle, Check, Loader2 } from "lucide-react";

const FEATURES_LIST = [
  {
    key: "showLKRPrices",
    label: "Show LKR Prices",
    description: "Display Sri Lankan Rupee conversion on product prices",
    icon: "💷",
  },
  {
    key: "allowDeliveryEditing",
    label: "Allow Delivery Editing",
    description: "Let customers edit delivery location at checkout",
    icon: "📍",
  },
  {
    key: "showContactMethods",
    label: "Show Contact Methods",
    description: "Display WhatsApp, Messenger, Email in storefront",
    icon: "💬",
  },
  {
    key: "maintenanceMode",
    label: "Maintenance Mode",
    description: "Temporarily disable the storefront (admin still accessible)",
    icon: "🔧",
  },
];

export function FeatureToggles() {
  const { settings, loading, error, updateSetting } = useFeatureSettings();
  const [updating, setUpdating] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleToggle = async (key) => {
    setUpdating(key);
    await updateSetting(key, !settings[key]);
    setUpdating(null);
    setSuccessMessage(
      `${FEATURES_LIST.find((f) => f.key === key).label} updated`,
    );
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-[#E0A996] animate-spin" />
        <span className="ml-2 text-sm text-[#A0958F]">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div>
            <p className="text-sm font-semibold text-red-700">
              Error updating settings
            </p>
            <p className="text-xs text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-3 animate-in fade-in">
          <Check className="w-5 h-5 text-green-600" />
          <p className="text-sm font-semibold text-green-700">
            {successMessage}
          </p>
        </div>
      )}

      {/* Feature Toggles */}
      <div className="space-y-3">
        {FEATURES_LIST.map((feature) => (
          <div
            key={feature.key}
            className="bg-white border border-[#FBEFEA] rounded-xl p-4 flex items-center justify-between hover:border-[#E0A996]/50 transition-colors"
          >
            <div className="flex items-start gap-3 flex-1">
              <span className="text-xl mt-1">{feature.icon}</span>
              <div>
                <p className="font-semibold text-[#2C2523]">{feature.label}</p>
                <p className="text-xs text-[#A0958F] mt-1">
                  {feature.description}
                </p>
              </div>
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => handleToggle(feature.key)}
              disabled={updating === feature.key}
              className={`relative ml-4 inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors ${
                settings[feature.key]
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-[#E0E0E0] hover:bg-[#D0D0D0]"
              } ${updating === feature.key ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {updating === feature.key ? (
                <Loader2 className="w-4 h-4 text-white animate-spin absolute left-2" />
              ) : (
                <div
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                    settings[feature.key] ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mt-6">
        <p className="text-xs font-semibold text-blue-900 mb-2">
          💡 Settings Tip
        </p>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>✓ Enable maintenance mode to perform updates</li>
          <li>✓ Disable LKR prices for USD-only regions</li>
          <li>✓ Toggle contact methods based on availability</li>
        </ul>
      </div>
    </div>
  );
}

export default FeatureToggles;
