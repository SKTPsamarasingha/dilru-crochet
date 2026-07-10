/**
 * useFeatureSettings Hook
 * Fetch and manage editable feature settings from Firestore
 */

"use client";

import { useState, useEffect } from "react";

export function useFeatureSettings() {
  const [settings, setSettings] = useState({
    showLKRPrices: true,
    allowDeliveryEditing: true,
    showContactMethods: true,
    maintenanceMode: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/settings");

      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }

      const data = await response.json();
      setSettings(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching settings:", err);
      setError(err.message);
      // Keep defaults on error
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      setError(null);

      // Optimistic update
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);

      // Send to API
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSettings),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update settings");
      }
    } catch (err) {
      console.error("Error updating settings:", err);
      setError(err.message);

      // Revert on error
      fetchSettings();
    }
  };

  return {
    settings,
    loading,
    error,
    updateSetting,
    refetch: fetchSettings,
  };
}

export default useFeatureSettings;
