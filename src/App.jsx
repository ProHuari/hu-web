
import { useState } from "react";

import Login from "./pages/login";
import CreateAnAccount from "./pages/create-an-account";
import RecoverPassword from "./pages/recover-password";
import CreateNewPassword from "./pages/create-new-password";
import Home from "./pages/home";

export default function App() {
    const [currentPage, setCurrentPage] = useState("create-account");

    if (currentPage === "home") {
    return (
        <Home
            onNavigateToLogin={() => setCurrentPage("login")}
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

    return (
        <Login
            onNavigateToRegister={() => setCurrentPage("create-account")}
            onNavigateToRecoverPassword={() =>
                setCurrentPage("recover-password")
            }
            onNavigateToHome={() => setCurrentPage("home")}
        />
    );
}
