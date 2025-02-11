import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatchStore } from "../store/useDispatchStore";
import { formatDate } from "../lib/utils";
import Prev from "../components/Prev";
import Next from "../components/Next";

const ITEMS_PER_PAGE = 10;

const DispatchByQuality = () => {
  const { getPendingOrders, pendingOrders } = useDispatchStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getPendingOrders();
  }, [getPendingOrders]);

  const filteredOrders = pendingOrders.filter((ord) =>
    `${ord?.agent || ""} ${ord?.firm || ""} ${ord?.quality || ""} ${ord?.transport}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const uniqueQualities = Array.from(
    new Map(filteredOrders.map((order) => [order.quality, order.qualityId])).entries()
  );

  const sortedQualities = uniqueQualities.sort((a, b) =>
    a[0].localeCompare(b[0], undefined, { numeric: true })
  );

  const totalPages = Math.ceil(sortedQualities.length / ITEMS_PER_PAGE);
  const paginatedData = sortedQualities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrevClick = () => {
    navigate(`/dispatch`);
  };

  const handleQualityClick = (id) => {
    navigate(`/dispatch/qualities/${id}`);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex flex-col items-center">
      
      {/* Header & Back Button */}
      <div className="w-full max-w-4xl mb-6 flex items-center gap-4 flex-wrap">
        <button
          className="btn btn-circle w-8 h-8 bg-gray-200"
          onClick={handlePrevClick}
        >
          <Prev />
        </button>
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold">Dispatch By Quality</h1>
          <p className="text-gray-500 text-sm md:text-base">Select a quality to Dispatch</p>
        </div>
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

      {/* Table */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full border-collapse min-w-[400px]">
          <thead>
            <tr className="text-left  text-sm md:text-base">
              <th className="p-3">Quality Name</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map(([quality, id], index) => (
                <tr key={index} className="text-[#5E5E5E] border-b border-gray-200">
                  <td className="p-3">{quality}</td>
                  <td className="p-3 text-right">
                    <button
                      className="btn btn-circle w-8 h-8 bg-gray-200"
                      onClick={() => handleQualityClick(id)}
                    >
                      <Next />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="p-3 text-center text-gray-500">
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

export default DispatchByQuality;
