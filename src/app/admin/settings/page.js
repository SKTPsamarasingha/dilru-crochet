"use client";

import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";
import FeatureToggles from "@/components/FeatureToggles";
import { CURRENCY_CONFIG, DELIVERY_CONFIG, CONTACT_CONFIG } from "@/lib/config";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#F5EFEB] transition-colors hover:bg-[#EBE5E0]"
        >
          <ArrowLeft className="h-5 w-5 text-[#2C2523]" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2C2523]">
            Settings
          </h1>
          <p className="text-sm text-[#A0958F]">
            Manage storefront features from the dashboard
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#FBEFEA] bg-white shadow-xs">
        <div className="flex items-center gap-3 border-b border-[#F5EFEB] p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E0A996]/20 bg-[#E0A996]/10">
            <Settings className="h-5 w-5 text-[#E0A996]" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2C2523]">
              Feature Toggles
            </h3>
            <p className="text-xs text-[#A0958F]">
              Toggle storefront features instantly without editing code
            </p>
          </div>
        </div>
        <div className="p-6">
          <FeatureToggles />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#FBEFEA] bg-white p-6 shadow-xs">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#A0958F]">
            Currency
          </p>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-[#A0958F]">Primary</p>
              <p className="font-semibold text-[#2C2523]">
                {CURRENCY_CONFIG.primary}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#A0958F]">Exchange Rate</p>
              <p className="font-semibold text-[#2C2523]">
                1 USD = {CURRENCY_CONFIG.exchangeRate} LKR
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#FBEFEA] bg-white p-6 shadow-xs">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#A0958F]">
            Delivery
          </p>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-[#A0958F]">Base Fee</p>
              <p className="font-semibold text-[#2C2523]">
                ${DELIVERY_CONFIG.baseFeeUSD}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#A0958F]">Free Shipping</p>
              <p className="font-semibold text-[#2C2523]">
                ${DELIVERY_CONFIG.freeShippingThresholdUSD}+
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#FBEFEA] bg-white p-6 shadow-xs">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#A0958F]">
            Contact
          </p>
          <div className="space-y-2">
            {CONTACT_CONFIG.whatsapp.enabled && (
              <p className="text-xs text-[#2C2523]">✓ WhatsApp</p>
            )}
            {CONTACT_CONFIG.facebook.enabled && (
              <p className="text-xs text-[#2C2523]">✓ Messenger</p>
            )}
            {CONTACT_CONFIG.email.enabled && (
              <p className="text-xs text-[#2C2523]">✓ Email</p>
            )}
            {CONTACT_CONFIG.instagram.enabled && (
              <p className="text-xs text-[#2C2523]">✓ Instagram</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
