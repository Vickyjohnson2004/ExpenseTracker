import React, { useEffect, useRef, useState } from "react";
import { sidebarStyles, cn } from "../assets/dummyStyles.js";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const MENU_ITEMS = [
  { text: "Dashboard", path: "/", icon: <Home size={20} /> },
  { text: "Income", path: "/income", icon: <ArrowUp size={20} /> },
  { text: "Expenses", path: "/expense", icon: <ArrowDown size={20} /> },
  { text: "Profile", path: "/profile", icon: <User size={20} /> },
];

const Sidebar = ({ user, isCollapsed, setIsCollapsed }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHover, setActiveHover] = useState(null);

  const { name: userName = "User", email = "userEmail@example.com" } =
    user || {};
  const initial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        mobileOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const renderMenuItem = ({ text, path, icon }) => {
    const isActive = pathname === path;

    return (
      <motion.li
        key={text}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link
          to={path}
          className={cn(
            sidebarStyles.menuItem.base,
            isActive
              ? sidebarStyles.menuItem.active
              : sidebarStyles.menuItem.inactive,
            isCollapsed
              ? sidebarStyles.menuItem.collapsed
              : sidebarStyles.menuItem.expanded,
          )}
          onMouseEnter={() => setActiveHover(text)}
          onMouseLeave={() => setActiveHover(null)}
        >
          <span
            className={
              isActive
                ? sidebarStyles.menuIcon.active
                : sidebarStyles.menuIcon.inactive
            }
          >
            {icon}
          </span>

          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              {text}
            </motion.span>
          )}

          {activeHover === text && !isActive && !isCollapsed && (
            <span className={sidebarStyles.activeIndicator}></span>
          )}
        </Link>
      </motion.li>
    );
  };

  return (
    <>
      <motion.div
        ref={sidebarRef}
        className={sidebarStyles.sidebarContainer.base}
        initial={{ x: -100, opacity: 0 }}
        animate={{
          x: 0,
          opacity: 1,
          width: isCollapsed ? 80 : 256,
        }}
        transition={{
          type: "spring",
          damping: 25,
        }}
      >
        <div className={sidebarStyles.sidebarInner.base}>
          <button
            onClick={toggleSidebar}
            className={sidebarStyles.toggleButton.base}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline
                  points={isCollapsed ? "9 18 15 12 9 6" : "15 18 9 12 15 6"}
                ></polyline>
              </svg>
            </motion.div>
          </button>

          <div
            className={cn(
              sidebarStyles.userProfileContainer.base,
              isCollapsed
                ? sidebarStyles.userProfileContainer.collapsed
                : sidebarStyles.userProfileContainer.expanded,
            )}
          >
            <div className="flex items-center">
              <div className={sidebarStyles.userInitials.base}>{initial}</div>
              {!isCollapsed && (
                <motion.div
                  className="ml-3 overflow-hidden"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <h2 className="text-sm font-bold text-gray-800 truncate">
                    {userName}
                  </h2>
                  <p className="text-xs text-gray-500 truncate"> {email}</p>
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
            <ul className={sidebarStyles.menuList.base}>
              {MENU_ITEMS.map(renderMenuItem)}
            </ul>
          </div>

          <div
            className={cn(
              sidebarStyles.footerContainer.base,
              isCollapsed
                ? sidebarStyles.footerContainer.collapsed
                : sidebarStyles.footerContainer.expanded,
            )}
          >
            <Link
              className={cn(
                sidebarStyles.footerLink.base,
                isCollapsed && sidebarStyles.footerLink.collapsed,
              )}
              to="https://github.com/Vickyjohnson2004"
            >
              <HelpCircle size={20} className="text-gray-500" />
              {!isCollapsed && (
                <span className={sidebarStyles.footerText}>Support</span>
              )}
            </Link>
            <button
              onClick={handleLogout}
              className={cn(
                sidebarStyles.logoutButton.base,
                isCollapsed && sidebarStyles.logoutButton.collapsed,
              )}
            >
              <LogOut size={20} className="text-gray-500" />
              {!isCollapsed && (
                <span className={sidebarStyles.footerText}>Logout</span>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      <motion.button
        onClick={() => setMobileOpen((prev) => !prev)}
        className={sidebarStyles.mobileMenuButton}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {mobileOpen ? <X size={24} /> : <Menu />}
      </motion.button>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={sidebarStyles.mobileOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className={sidebarStyles.mobileBackdrop}
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Sidebar */}
            <motion.div
              className="fixed top-0 left-0 h-full w-72 bg-white shadow-2xl flex flex-col z-50"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* HEADER */}
              <div className="flex items-center justify-between px-4 sm:py-4 md:pt-20 border-b">
                <div className="flex items-center gap-3">
                  <div className={sidebarStyles.userInitials.base}>
                    {initial}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-800 truncate">
                      {userName}
                    </h2>
                    <p className="text-xs text-gray-500 truncate">{email}</p>
                  </div>
                </div>

                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <X size={22} />
                </button>
              </div>

              {/* MENU */}
              <div className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-2 px-3">
                  {MENU_ITEMS.map(({ text, path, icon }) => (
                    <motion.li key={text} whileTap={{ scale: 0.97 }}>
                      <Link
                        to={path}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg transition",
                          pathname === path
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:bg-gray-100",
                        )}
                      >
                        <span
                          className={
                            pathname === path
                              ? "text-blue-600"
                              : "text-gray-500"
                          }
                        >
                          {icon}
                        </span>
                        <span className="text-sm font-medium">{text}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* FOOTER */}
              <div className="border-t p-4 space-y-3">
                <Link
                  onClick={() => setMobileOpen(false)}
                  to="https://github.com/Vickyjohnson2004"
                  className={sidebarStyles.footerLink}
                >
                  <HelpCircle size={20} className="text-gray-500" />
                  <span className="text-sm">Support</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className={sidebarStyles.mobileLogoutButton}
                >
                  <LogOut size={20} text-gray-500 />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
