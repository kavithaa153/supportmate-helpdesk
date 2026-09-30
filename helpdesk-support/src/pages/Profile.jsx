import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  Pencil,
  Save,
  X
} from "lucide-react";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState({
    name: "Support Admin",
    email: "supportmate@example.com",
    phone: "",
    department: "Support"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem(
      "supportmateCurrentUser"
    );

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        setProfile((current) => ({
          ...current,
          name: user.name || current.name,
          email: user.email || current.email,
          phone: user.phone || current.phone,
          department:
            user.department || current.department
        }));
      } catch {
        return;
      }
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value
    }));

    setErrors((current) => ({
      ...current,
      [name]: ""
    }));

    setSaved(false);
  };

  const validate = () => {
    const newErrors = {};

    if (!profile.name.trim()) {
      newErrors.name = "Name is required";
    } else if (profile.name.trim().length < 3) {
      newErrors.name =
        "Name must be at least 3 characters";
    }

    if (!profile.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        profile.email
      )
    ) {
      newErrors.email = "Enter a valid email";
    }

    if (
      profile.phone &&
      !/^[0-9+\-\s]{10,15}$/.test(
        profile.phone.trim()
      )
    ) {
      newErrors.phone = "Enter a valid phone number";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    localStorage.setItem(
      "supportmateCurrentUser",
      JSON.stringify(profile)
    );

    setIsEditing(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div>
          <span className="profile-eyebrow">
            ACCOUNT MANAGEMENT
          </span>

          <h1>Profile</h1>

          <p>
            Manage your account information and workspace
            details.
          </p>
        </div>

        {!isEditing ? (
          <button
            type="button"
            className="profile-edit-button"
            onClick={() => setIsEditing(true)}
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        ) : (
          <div className="profile-header-actions">
            <button
              type="button"
              className="profile-cancel-button"
              onClick={() => {
                setIsEditing(false);
                setErrors({});
              }}
            >
              <X size={16} />
              Cancel
            </button>

            <button
              type="button"
              className="profile-save-button"
              onClick={handleSave}
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {saved && (
        <div className="profile-success">
          <ShieldCheck size={17} />
          Profile updated successfully.
        </div>
      )}

      <div className="profile-grid">
        <section className="profile-card profile-main-card">
          <div className="profile-avatar">
            {profile.name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <h2>{profile.name}</h2>

          <span className="profile-role">
            Support Administrator
          </span>

          <span className="profile-email">
            {profile.email}
          </span>
        </section>

        <section className="profile-card">
          <div className="profile-card-heading">
            <div className="profile-card-icon">
              <User size={18} />
            </div>

            <div>
              <span>PERSONAL INFORMATION</span>
              <h2>Account details</h2>
            </div>
          </div>

          <div className="profile-form">
            <label>
              Full Name

              <div className="profile-input-wrapper">
                <User size={16} />

                <input
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              {errors.name && (
                <small>{errors.name}</small>
              )}
            </label>

            <label>
              Email Address

              <div className="profile-input-wrapper">
                <Mail size={16} />

                <input
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              {errors.email && (
                <small>{errors.email}</small>
              )}
            </label>

            <label>
              Phone Number

              <div className="profile-input-wrapper">
                <Phone size={16} />

                <input
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter phone number"
                />
              </div>

              {errors.phone && (
                <small>{errors.phone}</small>
              )}
            </label>

            <label>
              Department

              <div className="profile-input-wrapper">
                <Building2 size={16} />

                <input
                  name="department"
                  value={profile.department}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </label>
          </div>
        </section>

        <section className="profile-card profile-security-card">
          <div className="profile-card-heading">
            <div className="profile-card-icon">
              <ShieldCheck size={18} />
            </div>

            <div>
              <span>SECURITY</span>
              <h2>Account protection</h2>
            </div>
          </div>

          <div className="profile-security-content">
            <div>
              <strong>Password</strong>

              <p>
                Keep your account secure with a strong
                password.
              </p>
            </div>

            <button
              type="button"
              className="profile-security-button"
            >
              Change Password
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;