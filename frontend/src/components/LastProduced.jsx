import { useEffect } from "react";
import { formatDate } from "../lib/utils";
import { usePackageStore } from "../store/usePackageStore";

const LastProduced = () => {
  const { getLastProduced, lastProduced } = usePackageStore();

  useEffect(() => {
    getLastProduced();
  }, [getLastProduced]);

  return (
    <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-x-auto p-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[400px]">
          <thead>
            <tr className="text-left text-sm md:text-base">
              <th className="p-3 whitespace-nowrap">Date</th>
              <th className="p-3 whitespace-nowrap">Quality</th>
              <th className="p-3 whitespace-nowrap">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(lastProduced) && lastProduced.length > 0 ? (
              lastProduced.map((q, index) => (
                <tr key={index} className="text-gray-700 text-sm md:text-base ">
                  <td className="p-3 break-words">{formatDate(q.date)}</td>
                  <td className="p-3 break-words">{q.name}</td>
                  <td className="p-3 break-words">{q.produced}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-3 text-center text-gray-500">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LastProduced;
