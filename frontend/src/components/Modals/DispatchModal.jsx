import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useDispatchStore } from "../../store/useDispatchStore.js";
import { formatDate } from "../../lib/utils.js";
import toast from "react-hot-toast";

const DispatchModal = ({ orderId, onClose }) => {
  const { getPendingOrderById, selectedOrder, dispatchOrder, getPendingOrdersOfSelectedQualityId,
    getPendingOrdersOfSelectedFirmId } = useDispatchStore();
  const { id } = useParams();
  const location = useLocation();

  // Initialize formData with empty strings to ensure controlled inputs from the start
  const [formData, setFormData] = useState({
    selectedQuality: "",
    selectedAgent: "",
    selectedFirm: "",
    selectedTransport: "",
    pendingQuantity: "",
    dispatchQuantity: "",
    rate: "",
    invoiceNumber: "",
    remark: "",
  });


  useEffect(() => {
    if (orderId) {
      getPendingOrderById(orderId);
    }
  }, [orderId]);

  useEffect(() => {
    if (selectedOrder) {
      setFormData({
        selectedQuality: selectedOrder?.quality || "",
        selectedAgent: selectedOrder?.agent || "",
        selectedFirm: selectedOrder?.firm || "",
        selectedTransport: selectedOrder?.transport || "",
        pendingQuantity: selectedOrder?.pendingQuantity || "",
        dispatchQuantity: "",
        invoiceNumber: "",
        rate: selectedOrder?.rate || "",
        remark: selectedOrder?.remark || "",
      });
    }
  }, [selectedOrder]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "dispatchQuantity" ? Number(value) || "" : value,
    }));
  };

  const truncateId = (id) => `${id.slice(0, 5)}...${id.slice(-5)}`;

  const timestamp = Date.now();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { dispatchQuantity, invoiceNumber, remark } = formData;

    if (!dispatchQuantity) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if(dispatchQuantity <= 0){
      toast.error("dispatch quantity cant negative");
      return;
    }

    if(dispatchQuantity > formData.pendingQuantity){
      toast.error("dispatch cant exceed pending quantity");
      return;
    }

    try {
      await dispatchOrder(orderId, { dispatchQuantity, invoiceNumber, remark });

      if (location.pathname.startsWith("/dispatch/firms")) {
        await getPendingOrdersOfSelectedFirmId(id);
      }
      if (location.pathname.startsWith("/dispatch/quality")) {
        await getPendingOrdersOfSelectedQualityId(id);
      }
    } finally {
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      selectedQuality: "",
      selectedAgent: "",
      selectedFirm: "",
      selectedTransport: "",
      pendingQuantity: "",
      dispatchQuantity: "",
      rate: "",
      poNumber: "",
      remark: "",
    });
  };
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-[#00000055] z-40 overflow-y-auto p-4 ${orderId ? "" : "hidden"}`}
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-black text-lg sm:text-2xl">Dispatch for #{truncateId(orderId)}</h2>
          <button
            onClick={handleClose}
            className="h-6 w-6 text-xl text-gray-500 hover:text-gray-700 bg-black rounded-full flex items-center justify-center"
          >
            &times;
          </button>
        </div>
        <form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Agent Name</label>
              <input className="w-full px-3 py-2 border rounded-md bg-[#F8F8F8] text-black" type="text" value={formData.selectedAgent} readOnly />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Firm Name</label>
              <input className="w-full px-3 py-2 border rounded-md bg-[#F8F8F8] text-black" type="text" value={formData.selectedFirm} readOnly />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700">Quality</label>
              <input className="w-full px-3 py-2 border rounded-md bg-[#F8F8F8] text-black" type="text" value={formData.selectedQuality} readOnly />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Rate</label>
              <input className="w-full px-3 py-2 border rounded-md bg-[#F8F8F8] text-black" type="text" name="rate" value={formData.rate} onChange={handleChange} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Pending Qty</label>
              <input className="w-full px-3 py-2 border rounded-md bg-[#F8F8F8] text-black" type="number" value={formData.pendingQuantity} readOnly />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Transport Name</label>
              <input className="w-full px-3 py-2 border rounded-md bg-[#F8F8F8] text-black" type="text" value={formData.selectedTransport} readOnly />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Invoice Number</label>
              <input className="w-full px-3 py-2 border rounded-md bg-[#F8F8F8] text-black" type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Dispatch Quantity *</label>
              <input className="w-full px-3 py-2 border rounded-md bg-[#F8F8F8] text-black" type="number" name="dispatchQuantity" value={formData.dispatchQuantity} min={1} max={formData.pendingQuantity} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Remark</label>
            <textarea className="w-full px-3 py-2 border rounded-md bg-[#F8F8F8] text-black" name="remark" value={formData.remark} onChange={handleChange}></textarea>
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4">
            <button type="button" onClick={handleClose} className="w-full sm:w-auto px-4 py-2 text-[#C0282E] font-semibold border rounded-md">Cancel</button>
            <button type="submit" onClick={handleSubmit} className="w-full sm:w-auto px-4 py-2 bg-[#C0282E] text-white rounded-md hover:bg-red-600">Dispatch</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DispatchModal;
