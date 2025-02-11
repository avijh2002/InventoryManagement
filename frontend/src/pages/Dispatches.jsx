import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatchStore } from "../store/useDispatchStore";
import Prev from "../components/Prev";
import Next from "../components/Next";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../lib/utils";

const ITEMS_PER_PAGE = 10;

const Dispatches = () => {
  const { getDispatchedOrders, dispatchedOrders } = useDispatchStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    getDispatchedOrders();
  }, [getDispatchedOrders]);

  const filteredOrders = dispatchedOrders.filter((ord) =>
    `${ord?.agent || ""} ${ord?.firm || ""} ${ord?.quality || ""} ${ord?.transport || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn] || "";
    const valB = b[sortColumn] || "";
    return sortOrder === "asc"
      ? valA.toString().localeCompare(valB.toString())
      : valB.toString().localeCompare(valA.toString());
  });

  const totalPages = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE);
  const paginatedData = sortedOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSort = (column) => {
    setSortOrder(sortColumn === column && sortOrder === "asc" ? "desc" : "asc");
    setSortColumn(column);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen font-semibold flex flex-col items-center">
      <div className="w-full max-w-4xl mb-6 flex items-center gap-4 flex-wrap">
        <button className="btn btn-circle w-8 h-8 bg-gray-200" onClick={() => navigate(`/dispatch`)}>
          <Prev />
        </button>
        <h1 className="text-2xl font-bold">All Dispatches</h1>
      </div>
      <div className="w-full max-w-4xl flex flex-wrap justify-between items-center mb-4 gap-2">
        <div className="w-full sm:w-1/3 flex h-10 rounded-lg bg-white shadow-sm">
          <input
            type="text"
            placeholder="Search Here .."
            className="w-full pl-4 border-none font-light text-gray-600 outline-none"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div className="h-full flex items-center px-3">
            <Search className="text-gray-500" />
          </div>
        </div>
        <button className="bg-red-400 text-white font-semibold px-4 py-2 rounded-lg" onClick={() => navigate(`/dispatch`)}>
          + Dispatch
        </button>
      </div>
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full border-collapse min-w-max">
          <thead>
            <tr className=" text-left text-sm">
              {['dispatchedDate', 'agent', 'firm', 'rate', 'quality', 'quantity'].map((col) => (
                <th key={col} className="p-3 cursor-pointer" onClick={() => handleSort(col)}>
                  {col.charAt(0).toUpperCase() + col.slice(1)} ↑↓
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((order, index) => (
                <tr key={index} className="text-gray-700 text-sm">
                  <td className="p-3">{formatDate(order.dispatchedDate)}</td>
                  <td className="p-3">{order.agent}</td>
                  <td className="p-3">{order.firm}</td>
                  <td className="p-3">{order.rate}</td>
                  <td className="p-3">{order.quality}</td>
                  <td className="p-3">{order.quantity}</td>
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
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
)}

    </div>
  );
};

export default Dispatches;
