import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  Clock3,
  Globe,
  Monitor,
  Moon,
  Palette,
  Save,
  ShieldCheck,
  Sun
} from "lucide-react";
import "./Settings.css";

const SETTINGS_KEY = "supportmateSettings";

const defaultSettings = {
  emailNotifications: true,
  assignmentNotifications: true,
  slaAlerts: true,
  weeklySummary: false,
  theme: "Light",
  language: "English",
  timezone: "Asia/Kolkata",
  dateFormat: "DD/MM/YYYY",
  defaultPriority: "Medium",
  defaultCategory: "Technical",
  autoRefresh: true
};

function getSavedSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);

    if (!saved) {
      return defaultSettings;
    }

    return {
      ...defaultSettings,
      ...JSON.parse(saved)
    };
  } catch {
    return defaultSettings;
  }
}

function getSystemTheme() {
  return window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  const finalTheme =
    theme === "System"
      ? getSystemTheme()
      : theme.toLowerCase();

  document.documentElement.setAttribute(
    "data-theme",
    finalTheme
  );

  document.body.classList.remove(
    "theme-light",
    "theme-dark"
  );

  document.body.classList.add(
    `theme-${finalTheme}`
  );
}

function Settings() {
  const [settings, setSettings] = useState(
    getSavedSettings()
  );

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    if (settings.theme !== "System") {
      return;
    }

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleSystemTheme = () => {
      applyTheme("System");
    };

    mediaQuery.addEventListener(
      "change",
      handleSystemTheme
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleSystemTheme
      );
    };
  }, [settings.theme]);

  const updateToggle = (key) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key]
    }));

    setSaved(false);
  };

  const updateSelect = (key, value) => {
    setSettings((current) => ({
      ...current,
      [key]: value
    }));

    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(settings)
    );

    applyTheme(settings.theme);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="settings-page">
      <div className="settings-page-header">
        <div>
          <span className="settings-eyebrow">
            WORKSPACE SETTINGS
          </span>

          <h1>Settings</h1>

          <p>
            Manage your SupportMate workspace preferences
            and notifications.
          </p>
        </div>

        <button
          type="button"
          className="settings-save-button"
          onClick={handleSave}
        >
          {saved ? (
            <>
              <Check size={17} />
              Saved
            </>
          ) : (
            <>
              <Save size={17} />
              Save Changes
            </>
          )}
        </button>
      </div>

      {saved && (
        <div className="settings-success">
          <ShieldCheck size={18} />
          Settings saved successfully.
        </div>
      )}

      <div className="settings-grid">
        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-heading-icon">
              <Bell size={18} />
            </div>

            <div>
              <span>NOTIFICATIONS</span>
              <h2>Stay informed</h2>
              <p>
                Choose which support activities should
                generate notifications.
              </p>
            </div>
          </div>

          <div className="settings-list">
            <div className="settings-row">
              <div className="settings-row-icon">
                <Bell size={16} />
              </div>

              <div className="settings-row-text">
                <strong>Email Notifications</strong>
                <span>
                  Receive important workspace updates.
                </span>
              </div>

              <button
                type="button"
                className={`settings-switch ${
                  settings.emailNotifications
                    ? "on"
                    : ""
                }`}
                onClick={() =>
                  updateToggle("emailNotifications")
                }
              >
                <span />
              </button>
            </div>

            <div className="settings-row">
              <div className="settings-row-icon">
                <Bell size={16} />
              </div>

              <div className="settings-row-text">
                <strong>
                  Assignment Notifications
                </strong>
                <span>
                  Get notified when tickets are assigned.
                </span>
              </div>

              <button
                type="button"
                className={`settings-switch ${
                  settings.assignmentNotifications
                    ? "on"
                    : ""
                }`}
                onClick={() =>
                  updateToggle(
                    "assignmentNotifications"
                  )
                }
              >
                <span />
              </button>
            </div>

            <div className="settings-row">
              <div className="settings-row-icon">
                <Clock3 size={16} />
              </div>

              <div className="settings-row-text">
                <strong>SLA Alerts</strong>
                <span>
                  Receive alerts for SLA warnings and
                  breaches.
                </span>
              </div>

              <button
                type="button"
                className={`settings-switch ${
                  settings.slaAlerts ? "on" : ""
                }`}
                onClick={() =>
                  updateToggle("slaAlerts")
                }
              >
                <span />
              </button>
            </div>

            <div className="settings-row">
              <div className="settings-row-icon">
                <Bell size={16} />
              </div>

              <div className="settings-row-text">
                <strong>Weekly Summary</strong>
                <span>
                  Receive a weekly support performance
                  summary.
                </span>
              </div>

              <button
                type="button"
                className={`settings-switch ${
                  settings.weeklySummary ? "on" : ""
                }`}
                onClick={() =>
                  updateToggle("weeklySummary")
                }
              >
                <span />
              </button>
            </div>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-heading-icon">
              <Palette size={18} />
            </div>

            <div>
              <span>APPEARANCE</span>
              <h2>Workspace look</h2>
              <p>
                Adjust the interface experience for your
                workspace.
              </p>
            </div>
          </div>

          <div className="settings-theme-grid">
            <button
              type="button"
              className={`settings-theme-option ${
                settings.theme === "Light"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                updateSelect("theme", "Light")
              }
            >
              <Sun size={21} />
              <strong>Light</strong>
              <span>
                Clean professional interface
              </span>
            </button>

            <button
              type="button"
              className={`settings-theme-option ${
                settings.theme === "System"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                updateSelect("theme", "System")
              }
            >
              <Monitor size={21} />
              <strong>System</strong>
              <span>
                Follow device preference
              </span>
            </button>

            <button
              type="button"
              className={`settings-theme-option ${
                settings.theme === "Dark"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                updateSelect("theme", "Dark")
              }
            >
              <Moon size={21} />
              <strong>Dark</strong>
              <span>
                Dark workspace appearance
              </span>
            </button>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-heading-icon">
              <Globe size={18} />
            </div>

            <div>
              <span>REGIONAL SETTINGS</span>
              <h2>Localization</h2>
              <p>
                Select how language, timezone and dates are
                displayed.
              </p>
            </div>
          </div>

          <div className="settings-form">
            <label>
              Language

              <select
                value={settings.language}
                onChange={(event) =>
                  updateSelect(
                    "language",
                    event.target.value
                  )
                }
              >
                <option>English</option>
                <option>Tamil</option>
              </select>
            </label>

            <label>
              Timezone

              <select
                value={settings.timezone}
                onChange={(event) =>
                  updateSelect(
                    "timezone",
                    event.target.value
                  )
                }
              >
                <option>Asia/Kolkata</option>
                <option>Asia/Dubai</option>
                <option>Asia/Singapore</option>
                <option>Europe/London</option>
              </select>
            </label>

            <label>
              Date Format

              <select
                value={settings.dateFormat}
                onChange={(event) =>
                  updateSelect(
                    "dateFormat",
                    event.target.value
                  )
                }
              >
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </label>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-heading-icon">
              <ShieldCheck size={18} />
            </div>

            <div>
              <span>SUPPORT PREFERENCES</span>
              <h2>Ticket defaults</h2>
              <p>
                Configure default settings used during ticket
                creation.
              </p>
            </div>
          </div>

          <div className="settings-form">
            <label>
              Default Priority

              <select
                value={settings.defaultPriority}
                onChange={(event) =>
                  updateSelect(
                    "defaultPriority",
                    event.target.value
                  )
                }
              >
                <option>Critical</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </label>

            <label>
              Default Category

              <select
                value={settings.defaultCategory}
                onChange={(event) =>
                  updateSelect(
                    "defaultCategory",
                    event.target.value
                  )
                }
              >
                <option>Technical</option>
                <option>Billing</option>
                <option>Account</option>
              </select>
            </label>

            <div className="settings-row settings-form-row">
              <div className="settings-row-icon">
                <Clock3 size={16} />
              </div>

              <div className="settings-row-text">
                <strong>Auto Refresh</strong>
                <span>
                  Automatically refresh ticket information.
                </span>
              </div>

              <button
                type="button"
                className={`settings-switch ${
                  settings.autoRefresh ? "on" : ""
                }`}
                onClick={() =>
                  updateToggle("autoRefresh")
                }
              >
                <span />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;