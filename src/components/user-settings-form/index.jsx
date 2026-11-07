import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
    RiUserLine,
    RiLockLine,
    RiBookmarkLine,
    RiNotification3Line,
    RiSave3Line,
    RiCheckLine,
    RiDeleteBinLine,
    RiToggleLine,
    RiToggleFill,
    RiExternalLinkLine,
} from "react-icons/ri";
import { useApp } from "../../context/AppContext";
import { getLawmakerById, UF_OPTIONS } from "../../data/lawmakers";
import PasswordInput from "../password-input";
import Badge from "../badge";
import Avatar from "../avatar";
import "./style.css";

export default function UserSettingsForm({ initialData = {}, onSave }) {
    const {
        user = {},
        updateUser,
        bookmarkedLawmakerIds = [],
        toggleBookmark,
    } = useApp() || {};

    const [activeTab, setActiveTab] = useState("profile");
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [passwordSaved, setPasswordSaved] = useState(false);

    // Form data state
    const [formData, setFormData] = useState({
        name: user.name || initialData.name || "Carlos Oliveira",
        email: user.email || initialData.email || "carlos.oliveira@huari.org",
        phone: user.phone || initialData.phone || "+55 (11) 98765-4321",
        state: user.state || initialData.state || "SP",
        bio:
            user.bio ||
            initialData.bio ||
            "Citizen auditor passionate about public policy analysis, congressional fiscal oversight, and active civic participation.",
    });

    // Password fields
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // Notifications state
    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        votingAlerts: true,
        weeklyDigest: false,
        laiUpdates: true,
    });

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handlePasswordChange = (field, value) => {
        setPasswords((prev) => ({ ...prev, [field]: value }));
    };

    const handleToggleNotification = (key) => {
        setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (updateUser) {
            updateUser(formData);
        }
        onSave?.(formData);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        setPasswordSaved(true);
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setPasswordSaved(false), 3000);
    };

    // Resolve bookmarked lawmakers
    const savedLawmakers = bookmarkedLawmakerIds
        .map((id) => getLawmakerById(id))
        .filter(Boolean);

    return (
        <section className="user-settings-card" aria-label="Account and Preference Settings">
            {/* Tab navigation */}
            <div className="user-settings-tabs" role="tablist">
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "profile"}
                    className={`settings-tab-btn ${activeTab === "profile" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("profile")}
                >
                    <RiUserLine size={18} aria-hidden="true" />
                    <span>Personal Details</span>
                </button>

                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "bookmarks"}
                    className={`settings-tab-btn ${activeTab === "bookmarks" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("bookmarks")}
                >
                    <RiBookmarkLine size={18} aria-hidden="true" />
                    <span>Saved Lawmakers ({savedLawmakers.length})</span>
                </button>

                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "notifications"}
                    className={`settings-tab-btn ${activeTab === "notifications" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("notifications")}
                >
                    <RiNotification3Line size={18} aria-hidden="true" />
                    <span>Notifications &amp; Alerts</span>
                </button>

                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === "security"}
                    className={`settings-tab-btn ${activeTab === "security" ? "is-active" : ""}`}
                    onClick={() => setActiveTab("security")}
                >
                    <RiLockLine size={18} aria-hidden="true" />
                    <span>Security &amp; Password</span>
                </button>
            </div>

            {/* Tab: Personal Details */}
            {activeTab === "profile" && (
                <form className="settings-form-panel" onSubmit={handleFormSubmit}>
                    <div className="settings-form-grid">
                        <div className="form-field-group">
                            <label className="field-label">Full Name</label>
                            <input
                                type="text"
                                className="field-input"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-field-group">
                            <label className="field-label">Registered Email</label>
                            <input
                                type="email"
                                className="field-input"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-field-group">
                            <label className="field-label">Phone / WhatsApp</label>
                            <input
                                type="tel"
                                className="field-input"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                            />
                        </div>

                        <div className="form-field-group">
                            <label className="field-label">Primary State of Interest</label>
                            <select
                                className="field-select"
                                value={formData.state}
                                onChange={(e) => handleInputChange("state", e.target.value)}
                            >
                                {UF_OPTIONS.filter((opt) => opt.value !== "").map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-field-group full-width">
                        <label className="field-label">Bio / Civic Interests</label>
                        <textarea
                            className="field-textarea"
                            rows={3}
                            value={formData.bio}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                        />
                        <span className="field-hint">
                            Helps personalize suggested bills, voting alerts, and oversight reports.
                        </span>
                    </div>

                    <div className="settings-form-footer">
                        {savedSuccess && (
                            <span className="save-success-msg">
                                <RiCheckLine size={18} aria-hidden="true" />
                                Information updated successfully!
                            </span>
                        )}
                        <button type="submit" className="btn-save-settings">
                            <RiSave3Line size={18} aria-hidden="true" />
                            <span>Save Changes</span>
                        </button>
                    </div>
                </form>
            )}

            {/* Tab: Saved Lawmakers */}
            {activeTab === "bookmarks" && (
                <div className="settings-saved-panel">
                    <div className="saved-panel-header">
                        <h3>Followed Lawmakers</h3>
                        <p>Receive weekly voting alerts and CEAP expense audit digests for these representatives.</p>
                    </div>

                    {savedLawmakers.length === 0 ? (
                        <div className="empty-bookmarks">
                            <RiBookmarkLine size={36} aria-hidden="true" />
                            <p>You are not currently following any lawmakers.</p>
                            <Link to="/lawmakers" className="btn-save-settings" style={{ textDecoration: "none" }}>
                                Explore Lawmakers Directory
                            </Link>
                        </div>
                    ) : (
                        <div className="saved-lawmakers-list">
                            {savedLawmakers.map((lawmaker) => (
                                <div key={lawmaker.id} className="saved-lawmaker-item">
                                    <div className="saved-lawmaker-info">
                                        <div className="saved-lawmaker-name">
                                            <Avatar name={lawmaker.name} size="sm" />
                                            <strong>{lawmaker.name}</strong>
                                            <Badge variant="party">{lawmaker.party}</Badge>
                                            <Badge variant="state">{lawmaker.state}</Badge>
                                        </div>
                                        <span className="saved-lawmaker-role">{lawmaker.role}</span>
                                    </div>

                                    <div className="saved-lawmaker-actions">
                                        <Link
                                            to={`/lawmakers/${lawmaker.id}`}
                                            className="btn-view-profile"
                                            title="View Lawmaker Profile"
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "4px",
                                                padding: "6px 12px",
                                                borderRadius: "8px",
                                                border: "1px solid #E5E7EB",
                                                backgroundColor: "#FFFFFF",
                                                color: "#374151",
                                                fontSize: "0.8rem",
                                                fontWeight: 600,
                                                textDecoration: "none",
                                            }}
                                        >
                                            <span>Profile</span>
                                            <RiExternalLinkLine size={14} />
                                        </Link>

                                        <button
                                            type="button"
                                            className="btn-remove-bookmark"
                                            onClick={() => toggleBookmark(lawmaker.id)}
                                            title="Unfollow lawmaker"
                                        >
                                            <RiDeleteBinLine size={16} aria-hidden="true" />
                                            <span>Remove</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Tab: Notifications */}
            {activeTab === "notifications" && (
                <div className="settings-notifications-panel">
                    <div className="notification-row">
                        <div className="notification-text">
                            <strong>Real-Time Floor Voting Alerts</strong>
                            <p>Receive notifications when followed lawmakers cast roll-call votes.</p>
                        </div>
                        <button
                            type="button"
                            className="toggle-btn"
                            onClick={() => handleToggleNotification("votingAlerts")}
                            aria-label="Toggle voting alerts"
                        >
                            {notifications.votingAlerts ? (
                                <RiToggleFill size={36} className="toggle-active" />
                            ) : (
                                <RiToggleLine size={36} className="toggle-inactive" />
                            )}
                        </button>
                    </div>

                    <div className="notification-row">
                        <div className="notification-text">
                            <strong>Monthly Parliamentary Quota (CEAP) Audit</strong>
                            <p>Receive an email summary when audited expense receipts are published.</p>
                        </div>
                        <button
                            type="button"
                            className="toggle-btn"
                            onClick={() => handleToggleNotification("emailAlerts")}
                            aria-label="Toggle email alerts"
                        >
                            {notifications.emailAlerts ? (
                                <RiToggleFill size={36} className="toggle-active" />
                            ) : (
                                <RiToggleLine size={36} className="toggle-inactive" />
                            )}
                        </button>
                    </div>

                    <div className="notification-row">
                        <div className="notification-text">
                            <strong>Weekly Civic Academy Digest</strong>
                            <p>Stay informed about new courses, infographics, and policy breakdowns.</p>
                        </div>
                        <button
                            type="button"
                            className="toggle-btn"
                            onClick={() => handleToggleNotification("weeklyDigest")}
                            aria-label="Toggle weekly digest"
                        >
                            {notifications.weeklyDigest ? (
                                <RiToggleFill size={36} className="toggle-active" />
                            ) : (
                                <RiToggleLine size={36} className="toggle-inactive" />
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Tab: Security */}
            {activeTab === "security" && (
                <form className="settings-security-panel" onSubmit={handlePasswordSubmit}>
                    <PasswordInput
                        label="Current Password"
                        value={passwords.currentPassword}
                        onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                        placeholder="Enter your current password"
                        required
                    />

                    <PasswordInput
                        label="New Password"
                        value={passwords.newPassword}
                        onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                        placeholder="Minimum 8 characters"
                        required
                    />

                    <PasswordInput
                        label="Confirm New Password"
                        value={passwords.confirmPassword}
                        onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                        placeholder="Confirm your new password"
                        required
                    />

                    <div className="settings-form-footer">
                        {passwordSaved && (
                            <span className="save-success-msg">
                                <RiCheckLine size={18} aria-hidden="true" />
                                Password updated successfully!
                            </span>
                        )}
                        <button type="submit" className="btn-save-settings">
                            <RiLockLine size={18} aria-hidden="true" />
                            <span>Update Password</span>
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}

UserSettingsForm.propTypes = {
    initialData: PropTypes.object,
    onSave: PropTypes.func,
};
