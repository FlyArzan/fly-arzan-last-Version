import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { Layout, Settings, User } from "lucide-react";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <>
      <div
        className={`tw:fixed tw:inset-0 tw:z-20 tw:bg-black/10 tw:transition-opacity lg:tw:hidden ${
          isSidebarOpen ? "tw:block" : "tw:hidden"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      <div
        className={`tw:fixed tw:inset-y-0 tw:left-0 tw:z-30 tw:w-64 tw:transform tw:bg-white tw:shadow-lg tw:transition-transform lg:tw:relative lg:tw:translate-x-0 ${
          isSidebarOpen ? "tw:translate-x-0" : "tw:-translate-x-full"
        }`}
      >
        <div className="tw:flex tw:items-center tw:justify-center tw:py-4">
          <img src="/logo.png" alt="Fly Arzan" />
        </div>
        <nav>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `tw:flex tw:items-center tw:gap-2 tw:px-4 tw:!text-gray-700 tw:!no-underline tw:text-lg tw:text-medium tw:py-2 tw:mt-2 tw:duration-200 ${
                isActive
                  ? "tw:!bg-primary tw:!text-white"
                  : "tw:hover:!bg-gray-200"
              }`
            }
          >
            <Layout size={20} />
            <span>Admin</span>
          </NavLink>
          <NavLink
            to="/users"
            end
            className={({ isActive }) =>
              `tw:flex tw:items-center tw:gap-2 tw:px-4 tw:!text-gray-700 tw:!no-underline tw:text-lg tw:text-medium tw:py-2 tw:mt-2 tw:duration-200 ${
                isActive
                  ? "tw:!bg-primary tw:!text-white"
                  : "tw:hover:!bg-gray-200"
              }`
            }
          >
            <User size={20} />
            <span>Users</span>
          </NavLink>
          <NavLink
            to="/settings"
            end
            className={({ isActive }) =>
              `tw:flex tw:items-center tw:gap-2 tw:px-4 tw:!text-gray-700 tw:!no-underline tw:text-lg tw:text-medium tw:py-2 tw:mt-2 tw:duration-200 ${
                isActive
                  ? "tw:!bg-primary tw:!text-white"
                  : "tw:hover:!bg-gray-200"
              }`
            }
          >
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired,
};

export default Sidebar;
