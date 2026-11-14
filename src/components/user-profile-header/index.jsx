import React from "react";
import PropTypes from "prop-types";
import {
    RiCameraLine,
    RiShieldCheckLine,
    RiCalendarCheckLine,
    RiMailLine,
    RiMapPinLine,
} from "react-icons/ri";
import { useApp } from "../../context/AppContext";
import "./style.css";

export default function UserProfileHeader({ user: propUser, onEditAvatar }) {
    const { user: contextUser } = useApp() || {};
    const user = propUser || contextUser;

    const initials = user?.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()
        : "CA";

    return (
        <section className="user-profile-header-card" aria-label="User Profile Overview">
            <div className="user-profile-avatar-wrapper">
                {user?.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="user-profile-avatar-img"
                        loading="lazy"
                        decoding="async"
                    />
                ) : (
                    <div className="user-profile-avatar-placeholder">
                        <span>{initials}</span>
                    </div>
                )}
                <button
                    type="button"
                    className="user-avatar-edit-btn"
                    onClick={onEditAvatar}
                    title="Change profile picture"
                    aria-label="Change profile picture"
                >
                    <RiCameraLine size={16} />
                </button>
            </div>

            <div className="user-profile-info-block">
                <div className="user-profile-name-row">
                    <h1 className="user-profile-name">{user?.name || "Carlos Oliveira"}</h1>
                    <div className="user-profile-badges">
                        <span className="user-role-badge">{user?.role || "Citizen Auditor"}</span>
                        <span className="user-status-badge">
                            <RiShieldCheckLine size={13} />
                            Verified Account
                        </span>
                    </div>
                </div>

                <p className="user-profile-bio">
                    {user?.bio ||
                        "Citizen auditor passionate about public policy analysis, congressional fiscal oversight, and active civic participation."}
                </p>

                <div className="user-profile-meta-row">
                    <span className="user-meta-item">
                        <RiMailLine size={15} />
                        {user?.email || "carlos.oliveira@huari.org"}
                    </span>
                    <span className="user-meta-item">
                        <RiMapPinLine size={15} />
                        {user?.state || "São Paulo, SP"}
                    </span>
                    <span className="user-meta-item">
                        <RiCalendarCheckLine size={15} />
                        Member since {user?.memberSince || "October 2026"}
                    </span>
                </div>
            </div>
        </section>
    );
}

UserProfileHeader.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        avatar: PropTypes.string,
        role: PropTypes.string,
        bio: PropTypes.string,
        state: PropTypes.string,
        memberSince: PropTypes.string,
    }),
    onEditAvatar: PropTypes.func,
};
