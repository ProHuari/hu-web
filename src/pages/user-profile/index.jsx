import { useRef } from "react";
import { Link } from "react-router-dom";
import { RiArrowLeftLine } from "react-icons/ri";
import { useApp } from "../../context/AppContext";
import { userService } from "../../services/userService";
import UserProfileHeader from "../../components/user-profile-header";
import UserSettingsForm from "../../components/user-settings-form";
import "./style.css";

export default function UserProfile() {
    const { user, updateUser } = useApp() || {};
    const fileInputRef = useRef(null);

    const handleSaveUserData = (updatedData) => {
        if (updateUser) {
            updateUser(updatedData);
        }
    };

    const handleEditAvatar = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const result = await userService.uploadAvatar(file);
            if (result.avatarUrl && updateUser) {
                updateUser({ avatar: result.avatarUrl });
            }
        } catch (err) {
            console.error("Avatar upload failed", err);
            alert("Could not upload profile picture. Please try again.");
        }
    };

    return (
        <div className="user-profile-page-container">
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleFileChange}
                aria-hidden="true"
            />

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
