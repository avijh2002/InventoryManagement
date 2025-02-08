import { useEffect } from "react";
import { useSettingStore } from '../store/useSettingStore.js';
import TableSection from "../components/TableSection";
import "@fontsource/inter"; 

const Settings = () => {
  const { fetchSettingsData, loading, error } = useSettingStore();

  useEffect(() => {
    fetchSettingsData();
  }, [fetchSettingsData]);

  if (loading) {
    return <div className="p-4 md:p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 md:p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-xl md:text-3xl font-bold font-inter">Settings</h1>
      <p className="text-gray-600 text-sm md:text-base">Update Settings Here</p>

      <div className="mt-4 md:mt-6 space-y-4">
        <TableSection title="Quality" hasStock />
        <TableSection title="Agent" />
        <TableSection title="Firm" />
        <TableSection title="Transport" />
      </div>
    </div>
  );
};

export default Settings;
