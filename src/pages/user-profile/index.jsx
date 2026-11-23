import { useRef } from "react";
import { Link } from "react-router-dom";
import { RiArrowLeftLine } from "react-icons/ri";
import { PageTransition } from "../../components/motion/MotionPrimitives";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/useToast";
import { userService } from "../../services/user-service";
import UserProfileHeader from "../../components/user-profile-header";
import UserSettingsForm from "../../components/user-settings-form";
import "./style.css";

export default function UserProfile() {
    const { user, updateUser } = useApp() || {};
    const toast = useToast();
    const fileInputRef = useRef(null);

    const handleSaveUserData = (updatedData) => {
        if (updateUser) {
            updateUser(updatedData);
            toast.success("Dados do perfil atualizados.");
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
                toast.success("Foto de perfil atualizada.");
            }
        } catch (err) {
            console.error("Falha ao enviar foto", err);
            toast.error("Não foi possível atualizar a foto de perfil.");
        }
    };

    return (
        <PageTransition className="user-profile-page-container">
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
                <span>Voltar ao início</span>
            </Link>

            <UserProfileHeader
                user={user}
                onEditAvatar={handleEditAvatar}
            />

            <UserSettingsForm
                key={user?.id || user?.email || "guest"}
                initialData={user}
                onSave={handleSaveUserData}
            />
        </PageTransition>
    );
}
