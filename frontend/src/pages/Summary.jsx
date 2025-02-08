import { useState, useEffect } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import { usePackageStore } from "../store/usePackageStore";

const ITEMS_PER_PAGE = 10;

const Summary = () => {
  const { getQuality, quality } = usePackageStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  useEffect(() => {
    getQuality();
  }, [getQuality]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedQuality = [...quality].sort((a, b) => {
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

  const filteredQuality = sortedQuality.filter((q) =>
    q.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredQuality.length / ITEMS_PER_PAGE);

  const paginatedData = filteredQuality.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      {/* Heading */}
      <div className="w-full max-w-2xl text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Summary Table</h1>
        <p className="text-gray-500">For all Qualities</p>
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-2xl flex justify-center sm:justify-between items-center mb-4">
        <div className="w-full sm:w-1/3 flex items-center bg-white shadow rounded-lg px-4">
          <input
            type="text"
            placeholder="Search Here .."
            className="w-full py-2 border-none text-gray-600 focus:outline-none"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
          <Search className="text-gray-400" />
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left ">
                {[
                  { label: "Quality Name", key: "name" },
                  { label: "In Stock", key: "inStock" },
                  { label: "Dispatched", key: "dispatched" },
                  { label: "Produced", key: "produced" },
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
                paginatedData.map((q, index) => (
                  <tr key={index} className="text-gray-700">
                    <td className="p-3">{q.name}</td>
                    <td className="p-3">{q.inStock}</td>
                    <td className="p-3">{q.dispatched}</td>
                    <td className="p-3">{q.produced}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-gray-500">
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

export default Summary;
