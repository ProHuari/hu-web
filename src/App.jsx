import { useState } from "react";

import Login from "./pages/login";
import CreateAnAccount from "./pages/create-an-account";
import RecoverPassword from "./pages/recover-password";
import CreateNewPassword from "./pages/create-new-password";
import Home from "./pages/home";
import Parliamentarians from "./pages/parliamentarians";
import ParliamentarianAnalysis from "./pages/parliamentarian-analysis";
import Learn from "./pages/learn";
import LessonDetails from "./pages/lesson-details";
import Dashboard from "./pages/dashboard";
import ChatHuari from "./pages/chat-huari";
import UserProfile from "./pages/user-profile";

export default function App() {
    const [currentPage, setCurrentPage] = useState("dashboard");

    const [selectedParliamentarian, setSelectedParliamentarian] =
        useState(null);

    const [selectedLesson, setSelectedLesson] = useState(null);

    if (currentPage === "dashboard") {
        return (
            <Dashboard
                onNavigate={(page) => {
                    if (page === "Home") setCurrentPage("dashboard");
                    if (page === "Lawmakers") setCurrentPage("parliamentarians");
                    if (page === "Learn") setCurrentPage("learn");
                    if (page === "Chat Huari") setCurrentPage("chat-huari");
                    if (page === "Config") setCurrentPage("user-profile");
                    if (page === "Logout") setCurrentPage("login");
                }}
                onViewParliamentarian={(parliamentarian) => {
                    setSelectedParliamentarian(parliamentarian);
                    setCurrentPage("parliamentarian-analysis");
                }}
                onLogout={() => setCurrentPage("login")}
            />
        );
    }

    if (currentPage === "user-profile") {
        return (
            <UserProfile
                onNavigateToHome={() => setCurrentPage("dashboard")}
                onNavigateToParliamentarians={() =>
                    setCurrentPage("parliamentarians")
                }
                onNavigateToLearn={() => setCurrentPage("learn")}
                onNavigateToChat={() => setCurrentPage("chat-huari")}
                onNavigateToLogin={() => setCurrentPage("login")}
            />
        );
    }

    if (currentPage === "chat-huari") {
        return (
            <ChatHuari
                onNavigateToHome={() => setCurrentPage("dashboard")}
                onNavigateToParliamentarians={() =>
                    setCurrentPage("parliamentarians")
                }
                onNavigateToLearn={() => setCurrentPage("learn")}
                onNavigateToLogin={() => setCurrentPage("login")}
            />
        );
    }

    if (currentPage === "home") {
        return (
            <Home
                onNavigateToLogin={() => setCurrentPage("login")}
                onNavigateToParliamentarians={() =>
                    setCurrentPage("parliamentarians")
                }
                onNavigateToLearn={() => setCurrentPage("learn")}
            />
        );
    }

    if (currentPage === "parliamentarians") {
        return (
            <Parliamentarians
                onNavigateToHome={() => setCurrentPage("dashboard")}
                onViewParliamentarian={(parliamentarian) => {
                    setSelectedParliamentarian(parliamentarian);
                    setCurrentPage("parliamentarian-analysis");
                }}
            />
        );
    }

    if (currentPage === "parliamentarian-analysis") {
        return (
            <ParliamentarianAnalysis
                parliamentarian={selectedParliamentarian}
                onNavigateToParliamentarians={() =>
                    setCurrentPage("parliamentarians")
                }
                onNavigateToHome={() => setCurrentPage("dashboard")}
                onNavigateToLearn={() => setCurrentPage("learn")}
                onNavigateToLogin={() => setCurrentPage("login")}
                onNavigateToChat={() => setCurrentPage("chat-huari")}
            />
        );
    }

    if (currentPage === "recover-password") {
        return (
            <RecoverPassword
                onNavigateToLogin={() => setCurrentPage("login")}
                onNavigateToCreateNewPassword={() =>
                    setCurrentPage("create-new-password")
                }
            />
        );
    }

    if (currentPage === "create-new-password") {
        return (
            <CreateNewPassword
                onNavigateToLogin={() => setCurrentPage("login")}
            />
        );
    }

    if (currentPage === "create-account") {
        return (
            <CreateAnAccount
                onNavigateToLogin={() => setCurrentPage("login")}
            />
        );
    }

    if (currentPage === "learn") {
        return (
            <Learn
                onNavigateToHome={() => setCurrentPage("dashboard")}
                onViewLesson={(lesson) => {
                    setSelectedLesson(lesson);
                    setCurrentPage("lesson-details");
                }}
            />
        );
    }

    if (currentPage === "lesson-details") {
        return (
            <LessonDetails
                lesson={selectedLesson}
                onNavigateToLearn={() => setCurrentPage("learn")}
            />
        );
    }

    return (
        <Login
            onNavigateToRegister={() => setCurrentPage("create-account")}
            onNavigateToRecoverPassword={() =>
                setCurrentPage("recover-password")
            }
            onNavigateToHome={() => setCurrentPage("dashboard")}
        />
    );
}
