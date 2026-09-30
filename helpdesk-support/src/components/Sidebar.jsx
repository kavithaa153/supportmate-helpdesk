import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  BarChart3,
  UserCog,
  UserRound,
  Settings,
  Headphones
} from "lucide-react";
import "./Sidebar.css";

function Sidebar() {
  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard
    },
    {
      label: "Tickets",
      path: "/tickets",
      icon: Ticket
    },
    {
      label: "Create Ticket",
      path: "/create-ticket",
      icon: PlusCircle
    },
    {
      label: "Agents",
      path: "/agents",
      icon: UserCog
    },
    {
      label: "Reports",
      path: "/reports",
      icon: BarChart3
    },
    {
      label: "Profile",
      path: "/profile",
      icon: UserRound
    },
    {
      label: "Settings",
      path: "/settings",
      icon: Settings
    }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Headphones size={20} />
        </div>

        <span className="sidebar-brand-name">
          SupportMate
        </span>
      </div>

      <nav className="sidebar-navigation">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-menu-item ${
                  isActive ? "active" : ""
                }`
              }
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-help-card">
        <div className="help-card-icon">
          <Headphones size={17} />
        </div>

        <div className="help-card-content">
          <h3>Need assistance?</h3>

          <p>
            Visit our support resources for quick help.
          </p>

          <button type="button">
            View Resources
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;