import React from "react";
import { Link } from "react-router-dom";
import { RiArrowLeftLine } from "react-icons/ri";
import { useApp } from "../../context/AppContext";
import UserProfileHeader from "../../components/user-profile-header";
import UserSettingsForm from "../../components/user-settings-form";
import "./style.css";

export default function UserProfile() {
    const { user, updateUser } = useApp() || {};

    const handleSaveUserData = (updatedData) => {
        if (updateUser) {
            updateUser(updatedData);
        }
    };

    const handleEditAvatar = () => {
        alert("Profile image upload is currently in preview mode.");
    };

    return (
        <div className="user-profile-page-container">
            <Link to="/dashboard" className="user-profile-back-link">
                <RiArrowLeftLine size={18} aria-hidden="true" />
                <span>Back to Strategic Dashboard</span>
            </Link>

            <UserProfileHeader
                user={user}
                onEditAvatar={handleEditAvatar}
            />

            <UserSettingsForm
                initialData={user}
                onSave={handleSaveUserData}
            />
        </div>
    );
}
