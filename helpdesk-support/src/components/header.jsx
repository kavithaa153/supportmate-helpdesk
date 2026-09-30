import { useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  UserRound
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
function Header() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("supportmateCurrentUser") || "null"
  );

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const userName = currentUser?.name || "Support Admin";
  const userRole = currentUser?.role || "Administrator";

  return (
    <header className="header">
      <div className="header-left">
        <button
          type="button"
          className="header-menu-button"
        >
          <Menu size={20} />
        </button>

        <div className="header-search">
          <Search size={17} />

          <input
            type="text"
            placeholder="Search tickets, users, or anything..."
          />
        </div>
      </div>

      <div className="header-right">
        <div className="header-notification-wrapper">
          <button
            type="button"
            className="header-icon-button"
            onClick={() => {
              setNotificationsOpen(
                (current) => !current
              );
              setProfileOpen(false);
            }}
          >
            <Bell size={18} />

            <span className="notification-count">
              3
            </span>
          </button>

          {notificationsOpen && (
            <div className="header-notification-panel">
              <div className="header-notification-header">
                <strong>Notifications</strong>
                <span>3 new</span>
              </div>

              <button type="button">
                <strong>
                  New ticket assigned
                </strong>

                <span>
                  TCK-1005 has been assigned to you.
                </span>
              </button>

              <button type="button">
                <strong>
                  SLA warning
                </strong>

                <span>
                  A high priority ticket is approaching SLA.
                </span>
              </button>

              <button type="button">
                <strong>
                  Ticket updated
                </strong>

                <span>
                  TCK-1002 status was changed.
                </span>
              </button>
            </div>
          )}
        </div>

        <div className="header-profile-wrapper">
          <button
            type="button"
            className="header-profile-button"
            onClick={() => {
              setProfileOpen(
                (current) => !current
              );
              setNotificationsOpen(false);
            }}
          >
            <div className="header-avatar">
              {userName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="header-profile-info">
              <strong>{userName}</strong>
              <span>{userRole}</span>
            </div>

            <ChevronDown
              size={16}
              className={
                profileOpen
                  ? "header-chevron-open"
                  : ""
              }
            />
          </button>

          {profileOpen && (
            <div className="header-profile-menu">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/profile");
                }}
              >
                <UserRound size={16} />
                Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/settings");
                }}
              >
                <Settings size={16} />
                Settings
              </button>

              <div className="header-menu-divider" />

              <button
                type="button"
                className="header-logout-button"
                onClick={() => {
                  localStorage.removeItem(
                    "supportmateCurrentUser"
                  );

                  navigate("/login");
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;