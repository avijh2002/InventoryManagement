import { useState, useEffect } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatchStore } from "../store/useDispatchStore";
import DispatchModal from "../components/Modals/DispatchModal";
import Prev from "../components/Prev";
import Next from "../components/Next";

const ITEMS_PER_PAGE = 10;

const DispatchQuality = () => {
  const {
    getPendingOrdersOfSelectedQualityId,
    pendingOrdersOfSelectedQualityId,
  } = useDispatchStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  useEffect(() => {
    getPendingOrdersOfSelectedQualityId(id);
  }, [getPendingOrdersOfSelectedQualityId]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = [...pendingOrdersOfSelectedQualityId].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = a[sortConfig.key]?.toString().toLowerCase() || "";
    const valB = b[sortConfig.key]?.toString().toLowerCase() || "";
    return sortConfig.direction === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const filteredOrders = sortedOrders.filter((ord) =>
    `${ord?.agent || ""} ${ord?.firm || ""} ${ord?.quality || ""} ${ord?.transport || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedData = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-full md:max-w-4xl mb-6 flex flex-wrap items-center gap-4">
        <button
          className="btn btn-circle w-8 h-8 md:w-6 md:h-6 bg-gray-200"
          onClick={() => navigate(`/dispatch/qualities`)}
        >
          <Prev />
        </button>
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold">{paginatedData[0]?.quality}</h1>
          <p className="text-gray-500">Select the order to Dispatch</p>
        </div>
      </div>

      <div className="w-full max-w-full md:max-w-4xl flex flex-wrap justify-between items-center mb-4">
        <div className="w-full md:w-1/3 flex h-10 rounded-lg bg-white">
          <input
            type="text"
            placeholder="Search Here .."
            className="w-full pl-4 pr-10 border-none text-sm md:text-base"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div className="absolute right-3 h-full flex items-center">
            <Search className="text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="w-full max-w-full md:max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-sm md:text-base">
                {[
                  { key: "agent", label: "Agent Name" },
                  { key: "firm", label: "Firm Name" },
                  { key: "rate", label: "Rate" },
                  { key: "quantity", label: "Quantity" },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    className="p-3 cursor-pointer"
                    onClick={() => handleSort(key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {label} <ArrowUpDown className="w-4 h-4 inline" />
                    </span>
                  </th>
                ))}
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((order, index) => (
                  <tr key={index} className="text-[#5E5E5E] text-sm md:text-base">
                    <td className="p-3">{order.agent}</td>
                    <td className="p-3">{order.firm}</td>
                    <td className="p-3">{order.rate}</td>
                    <td className="p-3">{order.quantity}</td>
                    <td className="pl-3">
                      <button
                        className="btn btn-circle w-8 h-8 md:w-6 md:h-6 bg-gray-200"
                        onClick={() => setOrderId(order._id)}
                      >
                        <Next />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
{totalPages > 1 && (
  <div className="mt-4 flex justify-center gap-2">
    <button
      className="px-3 py-1 rounded bg-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
    >
      Prev
    </button>

    <span className="px-3 py-1 rounded bg-red-500 text-white shadow-md">
      {currentPage}
    </span>

    <button
      className="px-3 py-1 rounded bg-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
)}


      {orderId && <DispatchModal orderId={orderId} onClose={() => setOrderId(null)} />}
    </div>
  );
};

export default DispatchQuality;
