import React, { useState } from "react";
import {
    RiArrowLeftLine,
    RiShieldUserLine,
} from "react-icons/ri";

import SideBar from "../../components/sidebar";
import Footer from "../../components/footer";
import UserProfileHeader from "../../components/user-profile-header";
import UserSettingsForm from "../../components/user-settings-form";
import "./style.css";

export default function UserProfile({
    user = {
        name: "Carlos Oliveira",
        email: "carlos.oliveira@huari.org",
        phone: "(11) 98765-4321",
        state: "SP",
        city: "São Paulo",
        bio: "Interessado em políticas públicas, transparência fiscal do Congresso Nacional e acompanhamento de proposições legislativas.",
        memberSince: "Outubro de 2026",
    },
    onNavigateToHome,
    onNavigateToParliamentarians,
    onNavigateToLearn,
    onNavigateToChat,
    onNavigateToLogin,
}) {
    const [currentUser, setCurrentUser] = useState(user);

    const handleSidebarNavigate = (label) => {
        if (label === "Home") onNavigateToHome?.();
        else if (label === "Lawmakers") onNavigateToParliamentarians?.();
        else if (label === "Learn") onNavigateToLearn?.();
        else if (label === "Chat Huari") onNavigateToChat?.();
    };

    const handleSaveUserData = (updatedData) => {
        setCurrentUser((prev) => ({
            ...prev,
            ...updatedData,
        }));
    };

    const handleEditAvatar = () => {
        alert("Funcionalidade de upload de foto em desenvolvimento!");
    };

    return (
        <div className="user-profile-layout">
            {/* Sidebar Fixa à Esquerda */}
            <div className="user-profile-sidebar-wrapper">
                <SideBar
                    activeItem=""
                    userName={currentUser.name}
                    userEmail={currentUser.email}
                    onNavigate={handleSidebarNavigate}
                    onLogout={onNavigateToLogin}
                    onSettings={() => {}}
                />
            </div>

            {/* Conteúdo Principal à Direita */}
            <main className="user-profile-main">
                <div className="user-profile-container">
                    {/* Botão Voltar */}
                    <button
                        type="button"
                        className="user-profile-back-link"
                        onClick={onNavigateToHome}
                    >
                        <RiArrowLeftLine size={18} />
                        <span>Voltar ao Painel Principal</span>
                    </button>

                    {/* Componente 1: Cabeçalho com Avatar, Identificação e Badges */}
                    <UserProfileHeader
                        user={currentUser}
                        onEditAvatar={handleEditAvatar}
                    />

                    {/* Componente 2: Formulário com Abas de Configuração, Favoritos e Segurança */}
                    <UserSettingsForm
                        initialData={currentUser}
                        onSave={handleSaveUserData}
                    />
                </div>

                {/* Footer Institucional Huari */}
                <Footer />
            </main>
        </div>
    );
}
