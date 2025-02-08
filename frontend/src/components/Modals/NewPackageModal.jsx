import React, { useState, useEffect } from "react"; 
import { usePackageStore } from "../../../src/store/usePackageStore.js";
import { formatDate } from "../../lib/utils.js";
import toast from "react-hot-toast";

const NewPackageModal = ({ openPackageModal, onClose }) => {
  const { quality, getQuality, newPackage, getLastProduced } = usePackageStore();
  const [selectedQuality, setSelectedQuality] = useState(""); 
  const [quantity, setQuantity] = useState(""); 
  const timestamp = Date.now();

  useEffect(() => {
    if (openPackageModal) {
      getQuality();
    }
  }, [openPackageModal, getQuality]);

  const sortedQuality = [...quality].sort((a, b) => {
    const extractNumber = (str) => {
      const match = str.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };

    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    const numA = extractNumber(a.name);
    const numB = extractNumber(b.name);

    if (nameA === nameB) return numA - numB;
    return nameA.localeCompare(nameB, undefined, { numeric: true });
  });

  const handleClose = () => {
    onClose();
    setSelectedQuality("");
    setQuantity("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedQuality || !quantity || quantity <= 0) {
      toast.error("Please fill in all required fields.");
      return;
    }

    await newPackage(selectedQuality, quantity);
    await getQuality();
    await getLastProduced();
    handleClose();
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-[#00000055] ${openPackageModal ? "" : "hidden"} z-50`}>
      <div className="w-full max-w-sm md:max-w-lg p-4 md:p-6 bg-white rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold text-black">Create New Packaging</h2>
          <button
            onClick={handleClose}
            className="h-6 w-6 text-xl text-gray-500 hover:text-gray-700 bg-black rounded-full flex items-center justify-center"
          >
            &times;
          </button>
        </div>
        <form className="space-y-3 md:space-y-4">
          <div>
            <label className="mb-1 text-xs md:text-sm font-medium text-gray-700 block">Created on:</label>
            <input
              type="text"
              value={formatDate(timestamp)}
              disabled
              className="w-full px-3 py-2 text-sm md:text-base bg-gray-100 border border-gray-300 rounded-md text-black"
            />
          </div>
          <div>
            <label className="mb-1 text-xs md:text-sm font-medium text-gray-700 block">Quality *</label>
            <select
              className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md text-black"
              value={selectedQuality}
              onChange={(e) => setSelectedQuality(e.target.value)}
            >
              <option value="" disabled>Select a quality</option>
              {sortedQuality.map((q) => (
                <option key={q._id} value={q._id}>
                  {q.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 text-xs md:text-sm font-medium text-gray-700 block">Quantity *</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-md text-black"
            />
          </div>
          <div className="flex flex-col md:flex-row justify-end space-y-2 md:space-y-0 md:space-x-3 mt-4">
            <button type="button" onClick={handleClose} className="w-full md:w-auto px-4 py-2 text-[#C0282E] border border-gray-300 rounded-md">
              Cancel
            </button>
            <button type="submit" onClick={handleSubmit} className="w-full md:w-auto px-4 py-2 bg-[#C0282E] text-white rounded-md hover:bg-red-600">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPackageModal;
