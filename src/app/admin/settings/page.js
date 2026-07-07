import { Settings, Sparkles, Save } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="bg-white border border-[#FBEFEA] rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xxs mt-8">
      <div className="w-16 h-16 bg-gray-50 text-gray-600 flex items-center justify-center rounded-2xl mx-auto mb-6">
        <Settings className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-[#2C2523] mb-2 font-serif">Boutique Settings</h2>
      <p className="text-sm text-[#4A3728] max-w-md mx-auto mb-8 leading-relaxed">
        Configure shop rules, edit local currency configurations, adjust delivery fees, and update contact links.
      </p>

      {/* Under Construction Notice */}
      <div className="bg-[#FDFBF7] border border-[#F5EFEB] p-6 rounded-2xl text-left max-w-md mx-auto mb-8 space-y-3">
        <h3 className="text-xs font-bold text-[#2C2523] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#E0A996]" />
          Upcoming Features
        </h3>
        <ul className="text-xxs text-[#4A3728] space-y-2 list-disc list-inside">
          <li>Toggle local currency codes and Sri Lankan Rupee conversions.</li>
          <li>Set base delivery fees and free shipping parameters.</li>
          <li>Edit WhatsApp, Facebook Messenger, and custom request linkages.</li>
          <li>Update security keys and token configurations safely.</li>
        </ul>
      </div>

      <button className="py-2.5 px-6 bg-[#E0A996] text-[#2C2523] font-semibold rounded-xl text-xs inline-flex items-center gap-2 opacity-50 cursor-not-allowed">
        <Save className="w-4 h-4" /> Save Configuration
      </button>
    </div>
  );
}
