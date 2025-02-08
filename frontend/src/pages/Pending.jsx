import { useState, useEffect } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { useOrderStore } from "../store/useOrderStore";
import { formatDate } from "../lib/utils";

const ITEMS_PER_PAGE = 10;

const Pending = () => {
  const { getPendingOrders, pendingOrders } = useOrderStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  useEffect(() => {
    getPendingOrders();
  }, [getPendingOrders]);

  const filteredOrders = pendingOrders.filter((ord) =>
    `${ord?.agent || ""} ${ord?.firm || ""} ${ord?.quality || ""} ${
      ord?.transport
    }`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key]?.toString() || "";
      const bValue = b[sortConfig.key]?.toString() || "";

      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        : bValue.localeCompare(aValue, undefined, {
            numeric: true,
            sensitivity: "base",
          });
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE);
  const paginatedData = sortedOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex flex-col items-center">
      {/* Heading */}
      <div className="w-full max-w-4xl mb-4 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold">Pending Orders</h1>
        <p className="text-gray-500">Pending</p>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="w-full sm:w-1/3 flex h-10 rounded-lg bg-white shadow">
          <input
            type="text"
            placeholder="Search Here .."
            className="w-full pl-5 border-none outline-none"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset pagination on search
            }}
          />
          <div className="h-full flex items-center pr-4">
            <Search className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table Container (Adds horizontal scroll on small screens) */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr className="text-left">
              {[
                { label: "Date", key: "date" },
                { label: "Agent", key: "agent" },
                { label: "Firm Name", key: "firm" },
                { label: "Rate", key: "rate" },
                { label: "Quality", key: "quality" },
                { label: "Quantity", key: "pendingQuantity" },
              ].map(({ label, key }) => (
                <th
                  key={key}
                  className="p-3 cursor-pointer hover:bg-gray-300 whitespace-nowrap"
                  onClick={() => handleSort(key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {label} <ArrowUpDown className="w-4 h-4 inline" />
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((order, index) => (
                <tr key={index} className="text-[#5E5E5E]">
                  <td className="p-3">{formatDate(order.date)}</td>
                  <td className="p-3">{order.agent}</td>
                  <td className="p-3">{order.firm}</td>
                  <td className="p-3">{order.rate}</td>
                  <td className="p-3">{order.quality}</td>
                  <td className="p-3">{order.pendingQuantity}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-3 text-center text-gray-500">
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
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Pending;
