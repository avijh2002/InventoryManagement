import { Search,ArrowUpDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useOrderStore } from "../store/useOrderStore";
import UpdateOrderModal from "../components/Modals/UpdateOrderModal";
import Prev from "../components/Prev";
import Next from "../components/Next";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../lib/utils";

const ITEMS_PER_PAGE = 10;

const AllOrders = () => {
  const { getAllOrders, allOrders } = useOrderStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const navigate = useNavigate();

  useEffect(() => {
    getAllOrders();
  }, [getAllOrders]);

  // Sorting function
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

  const sortedOrders = [...allOrders].sort((a, b) => {
    if (!sortColumn) return 0;
    const valueA = a[sortColumn] || "";
    const valueB = b[sortColumn] || "";
  
    return sortOrder === "asc"
      ? collator.compare(valueA.toString(), valueB.toString())
      : collator.compare(valueB.toString(), valueA.toString());
  });
  

  const filteredOrders = sortedOrders.filter((ord) =>
    `${ord?.agent || ""} ${ord?.firm || ""} ${ord?.quality || ""} ${
      ord?.transport
    }`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const paginatedData = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleButtonClick = () => {
    navigate(`/dispatch`);
  };

  const handlePrevClick = () => {
    navigate(`/`);
  };

  const handleNextClick = (id) => {
    setOrderId(id);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-semibold flex flex-col items-center">
      {/* Header Section */}
      <div className="w-full max-w-4xl mb-10 flex items-center gap-8">
        <button
          className="btn btn-circle w-6 h-6 bg-gray-200"
          onClick={handlePrevClick}
        >
          <Prev />
        </button>
        <h1 className="text-3xl font-bold">All Orders</h1>
      </div>

      {/* Search Bar & Add Order Button */}
      <div className="w-full max-w-4xl h-10 flex justify-between items-center mb-4">
        <div className="w-1/3 flex max-w-xl h-full rounded-lg bg-white">
          <input
            type="text"
            placeholder="Search Here .."
            className="w-full pl-5 border-none font-light text-gray-400"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div className="h-full flex items-center mr-4">
            <Search className="text-gray-400" />
          </div>
        </div>
        <button
          className="bg-red-300 text-[#C0282E] font-semibold px-4 py-1 rounded-lg flex items-center gap-2 text-center"
          onClick={handleButtonClick}
        >
          <p className="text-3xl relative bottom-0.5">+</p> Dispatch
        </button>
      </div>

      {/* Orders Table */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-max">
            <thead>
              <tr className="text-left ">
                {[
                  { label: "Date", key: "date" },
                  { label: "Agent", key: "agent" },
                  { label: "Firm", key: "firm" },
                  { label: "Transport", key: "transport" },
                  { label: "Quality", key: "quality" },
                  { label: "Pending Qty", key: "pendingQuantity" },
                  { label: "Dispatched Qty", key: "dispatchedQuantity" },
                  { label: "Status", key: "status" }
                ].map(({ label, key }) => (
                  <th
                    key={key}
                    className="p-3 cursor-pointer hover:bg-gray-300"
                    onClick={() => handleSort(key)}
                  >
                    {label}{" "}
                    {<ArrowUpDown className="w-4 h-4 inline" /> }
                  </th>
                ))}
                <th className="p-3">update</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((order, index) => (
                  <tr key={index} className="text-[#5E5E5E]">
                    <td className="p-3">{formatDate(order.date)}</td>
                    <td className="p-3">{order.agent}</td>
                    <td className="p-3">{order.firm}</td>
                    <td className="p-3">{order.transport}</td>
                    <td className="p-3">{order.quality}</td>
                    <td className="p-3">{order.pendingQuantity}</td>
                    <td className="p-3">{order.dispatchedQuantity}</td>
                    <td className="p-3">{order.status}</td>
                    <td className="p-3">
                      {order.status === "pending" && (
                        <button
                          className="btn btn-circle w-6 h-6 bg-gray-200"
                          onClick={() => handleNextClick(order._id)}
                        >
                          <Next />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-3 text-center text-gray-500">
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


      {orderId && <UpdateOrderModal orderId={orderId} onClose={() => setOrderId(null)} />}
    </div>
  );
};

export default AllOrders;
