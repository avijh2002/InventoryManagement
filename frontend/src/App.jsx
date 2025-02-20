import { useState } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Sidebar from "./components/Sidebar";
import NewPackageModal from "./components/Modals/NewPackageModal.jsx";
import NewOrderModal from "./components/Modals/NewOrderModal.jsx";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore.js";
import { Outlet } from "react-router-dom";

const App = () => {
  const { authUser } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openPackageModal, setOpenPackageModal] = useState(false);
  const [openOrderModal, setOpenOrderModal] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
console.log(authUser)
  return (
    <>
      <Toaster />
      <div className="flex h-screen gap-10">
        {authUser && (
          <>
            <Sidebar 
              sidebarOpen={sidebarOpen} 
              setSidebarOpen={setSidebarOpen}
              openOrderModal={openOrderModal}
              openPackageModal={openPackageModal}
              setOpenOrderModal={setOpenOrderModal} 
              setOpenPackageModal={setOpenPackageModal} 
            />

            {/* Toggle Button for Mobile */}
            <button
              className={`sm:hidden fixed bottom-5 right-5 z-20 bg-blue-500 text-white p-3 rounded-full  ${
                sidebarOpen ? "rotate-45" : ""
              }`}
              onClick={handleSidebarToggle}
            >
              <Plus/>
            </button>
          </>
        )}

        {/* Content Area */}
        <div
          className={`flex-1 ${
            authUser ? "sm:ml-[calc(100vw/5)]" : "ml-0"
          } overflow-y-auto transition-all `}
        >
          <Outlet />
        </div>
      </div>
      {openPackageModal && (
            <NewPackageModal
              openPackageModal
              onClose={() => setOpenPackageModal(false)}
            />
          )}

          {openOrderModal && (
            <NewOrderModal
              openOrderModal
              onClose={() => setOpenOrderModal(false)}
            />
          )}
    </>
  );
};

export default App;
