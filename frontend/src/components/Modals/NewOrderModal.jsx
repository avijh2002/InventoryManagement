import React, { useState, useEffect } from "react";
import { useOrderStore } from "../../../src/store/useOrderStore.js";
import { formatDate } from "../../lib/utils.js";
import toast from "react-hot-toast";

const NewOrderModal = ({ openOrderModal, onClose }) => {
  const { fetchOrderData, createOrder, quality, agent, firm, transport, getPendingOrders } = useOrderStore();
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

  const [filteredFirms, setFilteredFirms] = useState([]);
  const [filteredTransport, setFilteredTransport] = useState([]);
  const timestamp = Date.now();
  
  useEffect(() => {
    if (openOrderModal) {
      fetchOrderData();
    }
  }, [fetchOrderData, openOrderModal]);

  useEffect(() => {
    if (formData.selectedAgent) {
      setFilteredFirms(firm.filter(f => f.agent?._id.toString() === formData.selectedAgent));
      setFormData(prev => ({ ...prev, selectedFirm: "", selectedTransport: "" }));
    } else {
      setFilteredFirms(firm);
      setFormData(prev => ({ ...prev, selectedFirm: "", selectedTransport: "" }));
    }
  }, [formData.selectedAgent, firm]);

  useEffect(() => {
    if (formData.selectedFirm) {
      setFilteredTransport(transport.filter(t => t.firm?._id.toString() === formData.selectedFirm));
      setFormData(prev => ({ ...prev, selectedTransport: "" }));
    } else {
      setFilteredTransport(transport);
      setFormData(prev => ({ ...prev, selectedTransport: "" }));
    }
  }, [formData.selectedFirm, transport]);

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
    if (!formData.selectedQuality || !formData.selectedAgent || !formData.selectedFirm || !formData.selectedTransport || !formData.quantity || formData.quantity <= 0 || !formData.rate) {
      toast.error("Please fill in all required fields.");
      return;
    }
    await createOrder(formData);
    await getPendingOrders();
    handleClose();
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-[#00000055] ${openOrderModal ? "" : "hidden"} z-50 overflow-y-auto px-4 sm:p-6`}>      
      <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-xl md:text-2xl">Create new Order</h2>
          <button
            onClick={handleClose}
            className="h-6 w-6 text-xl text-gray-500 hover:text-gray-700 bg-black rounded-full flex items-center justify-center"
          >
            &times;
          </button>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Agent Name *</label>
              <select className="w-full px-3 py-2 border rounded-md" name="selectedAgent" value={formData.selectedAgent} onChange={handleChange}>
                <option value="" disabled>Select agent</option>
                {agent.map((a, index) => (<option key={index} value={a._id}>{a.name}</option>))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Firm Name *</label>
              <select className="w-full px-3 py-2 border rounded-md" name="selectedFirm" value={formData.selectedFirm} onChange={handleChange} disabled={!formData.selectedAgent}>
                <option value="" disabled>Select firm</option>
                {filteredFirms.map((f, index) => (<option key={index} value={f._id}>{f.name}</option>))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Quality *</label>
              <select className="w-full px-3 py-2 border rounded-md" name="selectedQuality" value={formData.selectedQuality} onChange={handleChange}>
                <option value="" disabled>Select quality</option>
                {quality.map((q, index) => (<option key={index} value={q._id}>{q.name}</option>))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Quantity *</label>
              <input type="number" min="0" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Transport *</label>
              <select className="w-full px-3 py-2 border rounded-md" name="selectedTransport" value={formData.selectedTransport} onChange={handleChange} disabled={!formData.selectedFirm}>
                <option value="" disabled>Select transport</option>
                {filteredTransport.map((t, index) => (<option key={index} value={t._id}>{t.name}</option>))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Rate *</label>
              <input type="text" name="rate" value={formData.rate} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="text-sm font-medium">PO Number</label>
              <input type="text" name="poNumber" value={formData.poNumber} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Remark</label>
            <textarea name="remark" value={formData.remark} onChange={handleChange} className="w-full px-3 py-2 border rounded-md"></textarea>
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

export default NewOrderModal;
