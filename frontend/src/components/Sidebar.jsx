import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import home from "../assets/home.svg"; 
import logo from "../assets/logo.png";
import dispatch from "../assets/dispatch.svg";
import pending from "../assets/pending.svg";
import summary from "../assets/summary.svg";
import newOrder from "../assets/newOrder.svg";
import newPack from "../assets/newPack.svg";
import logoutIcon from "../assets/logout.svg";
import Settings from "../assets/settings.svg";

const Sidebar = ({ sidebarOpen, setSidebarOpen, openOrderModal,openPackageModal,setOpenOrderModal,setOpenPackageModal }) => {
  const { logout } = useAuthStore();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-red-300 text-red-500"
      : "bg-[#f8f8f8] text-black";

  return (
    <div
      className={`fixed left-0 top-0 h-screen w-3/5 sm:w-1/5 bg-white shadow-md transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0`}
    >
      <div className="flex flex-col items-center">
        <img
          src={logo}
          alt="Home"
          className="w-34"
        />
      </div>

      <div className="w-full h-4/5  flex flex-col justify-around gap-20 ">
        <div className="h-2/3 w-full flex-col gap-12">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `h-1/5 bg-[#f8f8f8] mx-2 my-2 rounded-lg flex items-center justify-start gap-4 pl-5 ${
                isActive ? "bg-red-300" : "bg-[#110505]"
              }`
            }
          >
            <img
              src={home}
              alt="Home"
              className="w-6 h-6 "
              style={{
                filter:
                  location.pathname === "/"
                    ? "invert(22%) sepia(95%) saturate(5775%) hue-rotate(355deg) brightness(99%) contrast(105%)"
                    : "none",
              }}
            />
            <div
              className={` font-medium font-inter  ${
                location.pathname === "/" ? "text-red-500" : "text-black"
              } lg:block`}
            >
              Home
            </div>
          </NavLink>

          <NavLink
            to="/dispatch"
            className={({ isActive }) =>
              `h-1/5 bg-[#f8f8f8] mx-2 my-2 rounded-lg flex items-center justify-start gap-4 pl-5 ${
                isActive || location.pathname.startsWith("/dispatch")
                  ? "bg-red-300"
                  : "bg-[#f8f8f8]"
              }`
            }
          >
            <img
              src={dispatch}
              alt="Dispatch"
              className="w-6 h-6 "
              style={{
                filter: location.pathname.startsWith("/dispatch")
                  ? "invert(22%) sepia(95%) saturate(5775%) hue-rotate(355deg) brightness(99%) contrast(105%)"
                  : "none",
              }}
            />
            <div
              className={` font-medium font-inter  ${
                location.pathname.startsWith("/dispatch")
                  ? "text-red-500"
                  : "text-black"
              } lg:block`}
            >
              Dispatch
            </div>
          </NavLink>

          <NavLink
            to="/pending"
            className={({ isActive }) =>
              `h-1/5 bg-[#f8f8f8] mx-2 my-2 rounded-lg flex items-center justify-start gap-4 pl-5 ${
                isActive ? "bg-red-300" : "bg-[#f8f8f8]"
              }`
            }
          >
            <img
              src={pending}
              alt="Pending"
              className="w-6 h-6 "
              style={{
                filter:
                  location.pathname === "/pending"
                    ? "invert(22%) sepia(95%) saturate(5775%) hue-rotate(355deg) brightness(99%) contrast(105%)"
                    : "none",
              }}
            />
            <div
              className={` font-medium font-inter  ${
                location.pathname === "/pending" ? "text-red-500" : "text-black"
              } lg:block`}
            >
              Pending
            </div>
          </NavLink>

          <NavLink
            to="/summary"
            className={({ isActive }) =>
              `h-1/5 bg-[#f8f8f8] mx-2 rounded-lg flex items-center justify-start gap-4 pl-5 ${
                isActive ? "bg-red-300" : "bg-[#f8f8f8]"
              }`
            }
          >
            <img
              src={summary}
              alt="Summary"
              className="w-6 h-6 "
              style={{
                filter:
                  location.pathname === "/summary"
                    ? "invert(22%) sepia(95%) saturate(5775%) hue-rotate(355deg) brightness(99%) contrast(105%)"
                    : "none",
              }}
            />
            <div
              className={` font-medium font-inter  ${
                location.pathname === "/summary" ? "text-red-500" : "text-black"
              } lg:block`}
            >
              Summary
            </div>
          </NavLink>
        </div>

        <div className="h-2/3 w-full flex-col">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `h-1/5 bg-[#f8f8f8] mx-2 my-2 rounded-lg flex items-center justify-start gap-4 pl-5 ${
                isActive ? "bg-red-300" : "bg-[#f8f8f8]"
              }`
            }
          >
            <img
              src={Settings}
              alt="Settings"
              className="w-6 h-6 "
              style={{
                filter:
                  location.pathname === "/settings"
                    ? "invert(22%) sepia(95%) saturate(5775%) hue-rotate(355deg) brightness(99%) contrast(105%)"
                    : "none",
              }}
            />
            <div
              className={` font-medium font-inter  ${
                location.pathname === "/settings"
                  ? "text-red-500"
                  : "text-[#5E5E5E]"
              } lg:block`}
            >
              Settings
            </div>
          </NavLink>

          <div
            className={`h-1/5 bg-[#f8f8f8] mx-2 my-2 rounded-lg flex items-center justify-start gap-4 pl-5 ${
              openOrderModal ? "bg-red-300" : "bg-[#f8f8f8] cursor-pointer"
            }`}
            onClick={() => setOpenOrderModal(true)}
          >
            <img
              src={newOrder}
              alt="New Order"
              className="w-6 h-6 "
              style={{
                filter: openOrderModal
                  ? "invert(22%) sepia(95%) saturate(5775%) hue-rotate(355deg) brightness(99%) contrast(105%)"
                  : "none",
              }}
            />
            <div
              className={` font-medium font-inter  ${
                openOrderModal ? "text-red-500" : "text-[#5E5E5E]"
              } lg:block`}
            >
              New Order
            </div>
          </div>

          <div
            className={`h-1/5 bg-[#f8f8f8] mx-2 my-2 rounded-lg flex items-center justify-start gap-4 pl-5 ${
              openPackageModal ? "bg-red-300" : "bg-[#f8f8f8] cursor-pointer"
            }`}
            onClick={() => setOpenPackageModal(true)}
          >
            <img
              src={newPack}
              alt="New Packaging"
              className="w-6 h-6 "
              style={{
                filter: openPackageModal
                  ? "invert(22%) sepia(95%) saturate(5775%) hue-rotate(355deg) brightness(99%) contrast(105%)"
                  : "none",
              }}
            />
            <div
              className={` font-medium font-inter  ${
                openPackageModal ? "text-red-500" : "text-[#5E5E5E]"
              } lg:block`}
            >
              New Package
            </div>
          </div>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              `h-1/5 bg-[#f8f8f8] mx-2 my-2 rounded-lg flex items-center justify-start gap-4 pl-5 ${
                isActive ? "bg-red-300" : "bg-[#f8f8f8]"
              }`
            }
            onClick={logout}
          >
            <img
              src={logoutIcon}
              alt="New Packaging"
              className="w-6 h-6 "
              style={{
                filter:
                  location.pathname === "/login"
                    ? "invert(22%) sepia(95%) saturate(5775%) hue-rotate(355deg) brightness(99%) contrast(105%)"
                    : "none",
              }}
            />
            <div
              className={` font-medium font-inter  ${
                location.pathname === "/login"
                  ? "text-red-500"
                  : "text-[#5E5E5E]"
              } lg:block`}
            >
              Logout
            </div>
          </NavLink>

         
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
