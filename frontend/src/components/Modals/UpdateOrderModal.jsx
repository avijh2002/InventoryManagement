import React, { useState, useEffect } from "react";
import { useOrderStore } from "../../../src/store/useOrderStore.js";
import { formatDate } from "../../lib/utils.js";
import toast from "react-hot-toast";

const UpdateOrderModal = ({ orderId, onClose }) => {
  const { updateOrder, fetchOrderData, quality, agent, firm, transport, getPendingOrderById } = useOrderStore();
  const [formData, setFormData] = useState({
    selectedQuality: "",
    selectedAgent: "",
    selectedFirm: "",
    selectedTransport: "",
    quantity: "",
    rate: "",
    poNumber: "",
    remark: "",
  });

  useEffect(() => {
    if (orderId) {
      const fetchData = async () => {
        try {
          const order = await getPendingOrderById(orderId);
          setFormData({
            selectedQuality: order.qualityId || "",
            selectedAgent: order.agentId || "",
            selectedFirm: order.firmId || "",
            selectedTransport: order.transportId || "",
            quantity: order.quantity || "",
            rate: order.rate || "",
            poNumber: order.PoNumber || "",
            remark: order.remark || "",
          });
        } catch (error) {
          console.error("Error fetching order:", error);
        }
      };
      fetchData();
      fetchOrderData();
    }
  }, [orderId, fetchOrderData]);

  const handleClose = () => {
    onClose();
    setFormData({
      selectedQuality: "",
      selectedAgent: "",
      selectedFirm: "",
      selectedTransport: "",
      quantity: "",
      rate: "",
      poNumber: "",
      remark: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.selectedQuality || !formData.selectedAgent || !formData.selectedFirm || !formData.selectedTransport || !formData.quantity || !formData.rate) {
      toast.error("Please fill in all required fields.");
      return;
    }
    await updateOrder(orderId, formData);
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-[#00000055] bg-opacity-50 z-50 p-4 overflow-y-auto`}>
      <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Update Order</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Agent Name *</label>
              <select className="w-full px-3 py-2 border rounded-md" name="selectedAgent" value={formData.selectedAgent} onChange={handleChange}>
                <option value="" disabled>Select agent</option>
                {agent.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Firm Name *</label>
              <select className="w-full px-3 py-2 border rounded-md" name="selectedFirm" value={formData.selectedFirm} onChange={handleChange}>
                <option value="" disabled>Select firm</option>
                {firm.map((f) => <option key={f._id} value={f._id}>{f.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Quality *</label>
              <select className="w-full px-3 py-2 border rounded-md" name="selectedQuality" value={formData.selectedQuality} onChange={handleChange}>
                <option value="" disabled>Select quality</option>
                {quality.map((q) => <option key={q._id} value={q._id}>{q.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Quantity *</label>
              <input type="number" min="0" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Transport *</label>
              <select className="w-full px-3 py-2 border rounded-md" name="selectedTransport" value={formData.selectedTransport} onChange={handleChange}>
                <option value="" disabled>Select transport</option>
                {transport.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Rate *</label>
              <input type="text" name="rate" value={formData.rate} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-4">
          <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-[#C0282E] font-semibold border border-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#C0282E] text-white rounded-md hover:bg-red-600"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateOrderModal;
