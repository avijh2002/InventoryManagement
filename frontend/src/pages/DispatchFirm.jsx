import { useState, useEffect } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatchStore } from "../store/useDispatchStore";
import DispatchModal from "../components/Modals/DispatchModal";
import Prev from "../components/Prev";
import Next from "../components/Next";

const ITEMS_PER_PAGE = 10;

const DispatchFirm = () => {
  const { getPendingOrdersOfSelectedFirmId, pendingOrdersOfSelectedFirmId } = useDispatchStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getPendingOrdersOfSelectedFirmId(id);
  }, [getPendingOrdersOfSelectedFirmId]);

  const filteredOrders = pendingOrdersOfSelectedFirmId.filter((ord) =>
    `${ord?.agent || ""} ${ord?.firm || ""} ${ord?.quality || ""} ${ord?.transport || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = a[sortConfig.key]?.toString().toLowerCase() || "";
    const valB = b[sortConfig.key]?.toString().toLowerCase() || "";
    return sortConfig.direction === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const totalPages = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE);
  const paginatedData = sortedOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      {/* Heading Section */}
      <div className="w-full max-w-4xl mb-6 flex flex-wrap items-center gap-4 md:gap-8">
        <button className="btn btn-circle w-8 h-8 bg-gray-200" onClick={() => navigate(`/dispatch/firms`)}>
          <Prev />
        </button>
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold">{paginatedData[0]?.firm}</h1>
          <p className="text-gray-500 text-sm md:text-base">Select the order to Dispatch</p>
        </div>
      </div>

      {/* Search Box */}
      <div className="w-full max-w-4xl flex flex-wrap justify-between items-center mb-4">
        <div className="w-full sm:w-1/2 flex h-10 rounded-lg bg-white shadow-sm">
          <input
            type="text"
            placeholder="Search Here .."
            className="w-full pl-4 pr-2 border-none outline-none text-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div className="h-full flex items-center pr-4">
            <Search className="text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr className="text-left  text-sm md:text-base">
              {[
                { key: "agent", label: "Agent Name" },
                { key: "quality", label: "Quality Name" },
                { key: "rate", label: "Rate" },
                { key: "quantity", label: "Quantity" },
              ].map(({ key, label }) => (
                <th key={key} className="p-3 cursor-pointer" onClick={() => handleSort(key)}>
                  <span className="inline-flex items-center gap-1">
                    {label} <ArrowUpDown className="w-4 h-4" />
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
                  <td className="p-3">{order.quality}</td>
                  <td className="p-3">{order.rate}</td>
                  <td className="p-3">{order.quantity}</td>
                  <td className="pl-3">
                    <button className="btn btn-circle w-6 h-6 bg-gray-200" onClick={() => setOrderId(order._id)}>
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

export default DispatchFirm;
