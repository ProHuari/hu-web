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

const ROLE_LABELS = {
    ADMIN: "Administrador",
    ADMINISTRATOR: "Administrador",
    STUDENT: "Cidadão",
};

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
        : "HU";

    const roleLabel = ROLE_LABELS[String(user?.role || "").toUpperCase()] || "Cidadão";

    return (
        <section className="user-profile-header-card" aria-label="Resumo do perfil">
            <div className="user-profile-avatar-wrapper">
                {user?.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="user-profile-avatar-img"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/images/default-avatar.png";
                        }}
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
                    title="Alterar foto de perfil"
                    aria-label="Alterar foto de perfil"
                >
                    <RiCameraLine size={16} />
                </button>
            </div>

            <div className="user-profile-info-block">
                <div className="user-profile-name-row">
                    <h1 className="user-profile-name">{user?.name || "Conta Huari"}</h1>
                    <div className="user-profile-badges">
                        <span className="user-role-badge">{roleLabel}</span>
                        {user?.verified && (
                            <span className="user-status-badge">
                                <RiShieldCheckLine size={13} />
                                Conta verificada
                            </span>
                        )}
                    </div>
                </div>

                <p className="user-profile-bio">
                    {user?.bio || "Sem descrição cadastrada. Edite seus interesses cívicos abaixo."}
                </p>

                <div className="user-profile-meta-row">
                    {user?.email && (
                        <span className="user-meta-item">
                            <RiMailLine size={15} />
                            {user.email}
                        </span>
                    )}
                    {user?.state && (
                        <span className="user-meta-item">
                            <RiMapPinLine size={15} />
                            {user.city ? `${user.city}, ${user.state}` : user.state}
                        </span>
                    )}
                    <span className="user-meta-item">
                        <RiCalendarCheckLine size={15} />
                        Membro desde {user?.memberSince || "2026"}
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
        city: PropTypes.string,
        state: PropTypes.string,
        verified: PropTypes.bool,
        memberSince: PropTypes.string,
    }),
    onEditAvatar: PropTypes.func,
};
