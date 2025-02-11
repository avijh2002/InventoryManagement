import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatchStore } from "../store/useDispatchStore";
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

  const uniqueFirms = Array.from(
    new Map(filteredOrders.map((order) => [order.firm, order.firmId])).entries()
  );

  const sortedFirms = uniqueFirms.sort((a, b) =>
    a[0].localeCompare(b[0], undefined, { numeric: true })
  );

  const totalPages = Math.ceil(sortedFirms.length / ITEMS_PER_PAGE);
  const paginatedData = sortedFirms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrevClick = () => {
    navigate(`/dispatch`);
  };

  const handleQualityClick = (id) => {
    navigate(`/dispatch/firms/${id}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-4xl mb-6 flex items-center gap-4 sm:gap-8 flex-wrap">
        <button
          className="btn btn-circle w-8 h-8 bg-gray-200 flex items-center justify-center"
          onClick={handlePrevClick}
        >
          <Prev />
        </button>
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-bold">Dispatch By Firm</h1>
          <p className="text-gray-500">Select a firm to Dispatch</p>
        </div>
      </div>

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

      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-gray-200">
              <th className="p-3">Firm Name</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map(([firm, id], index) => (
                <tr
                  key={index}
                  className="text-[#5E5E5E] border-b border-gray-200 flex justify-between items-center flex-wrap p-3"
                >
                  <td className="flex-1">{firm}</td>
                  <td>
                    <button
                      className="btn btn-circle w-6 h-6 bg-gray-200"
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
