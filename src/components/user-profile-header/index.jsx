import React from "react";
import {
    RiCameraLine,
    RiShieldCheckLine,
    RiCalendarCheckLine,
    RiMailLine,
    RiMapPinLine,
} from "react-icons/ri";
import "./style.css";

export default function UserProfileHeader({ user, onEditAvatar }) {
    const initials = user?.name
        ? user.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()
        : "UH";

    return (
        <section className="user-profile-header-card">
            <div className="user-profile-avatar-wrapper">
                {user?.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="user-profile-avatar-img"
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
                >
                    <RiCameraLine size={16} />
                </button>
            </div>

            <div className="user-profile-info-block">
                <div className="user-profile-name-row">
                    <h1 className="user-profile-name">{user?.name || "Carlos Oliveira"}</h1>
                    <div className="user-profile-badges">
                        <span className="user-role-badge">Cidadão Auditor</span>
                        <span className="user-status-badge">
                            <RiShieldCheckLine size={13} />
                            Conta Verificada
                        </span>
                    </div>
                </div>

                <p className="user-profile-bio">
                    {user?.bio ||
                        "Interessado em políticas públicas, transparência fiscal do Congresso Nacional e acompanhamento de proposições legislativas."}
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
                        Membro desde {user?.memberSince || "Outubro de 2026"}
                    </span>
                </div>
            </div>
        </section>
    );
}
