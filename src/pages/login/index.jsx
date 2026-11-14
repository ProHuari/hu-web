import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/button";
import InputText from "../../components/input-text";
import PasswordInput from "../../components/password-input";
import { GoogleIcon, GithubIcon, AppleIcon } from "../../components/icons";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/useToast";
import { authService } from "../../services/authService";
import {
    RiUserAddFill,
    RiDoorOpenLine,
    RiMailLine,
    RiErrorWarningLine,
    RiCheckboxCircleLine,
    RiUserSharedLine,
    RiShieldCheckLine,
} from "react-icons/ri";
import "./style.css";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

export default function Login({
    initialTab = "login",
    onNavigateToRegister,
    onNavigateToRecoverPassword,
    onNavigateToHome,
}) {
    const navigate = useNavigate();
    const { login, loginAsGuest } = useApp() || {};
    const toast = useToast();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const [activeTab, setActiveTab] = useState(initialTab);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !email.includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }

        if (activeTab === "register" && password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        if (activeTab === "login" && !password) {
            setError("Please enter your password.");
            return;
        }

        if (activeTab === "register" && name.trim().length < 3) {
            setError("Please provide your full name.");
            return;
        }

        setIsLoading(true);
        try {
            if (activeTab === "login") {
                const result = await authService.login({ email, password, rememberMe });
                login?.(result.user, result.token, rememberMe);
            } else {
                const result = await authService.register({ name, email, password });
                login?.(result.user, result.token, rememberMe);
            }

            if (onNavigateToHome) {
                onNavigateToHome();
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.message || "Authentication failed. Please verify your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectTab = (tab) => {
        setError("");
        setActiveTab(tab);
        if (tab === "register" && onNavigateToRegister) {
            onNavigateToRegister();
        }
    };

    const handleGuestAccess = () => {
        loginAsGuest?.();
        toast.info("Signed in as Guest Citizen.");
        if (onNavigateToHome) {
            onNavigateToHome();
        } else {
            navigate("/dashboard");
        }
    };

    const handleDemoAdminAccess = async () => {
        setError("");
        setIsLoading(true);
        try {
            const result = await authService.login({
                email: "admin@huari.org",
                password: "demo-admin-password",
                rememberMe: true,
            });
            login?.(result.user, result.token, true);
            toast.success("Signed in as Administrator.");
            if (onNavigateToHome) {
                onNavigateToHome();
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.message || "Demo admin sign-in failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = () => {
        setError("");
        loginAsGuest?.();
        if (onNavigateToHome) {
            onNavigateToHome();
        } else {
            navigate("/dashboard");
        }
    };

    return (
        <div className="login-auth-wrapper">
            {/* Tab navigation */}
            <nav
                className="login-tabs-navigation"
                aria-label="Toggle between Sign In and Registration"
            >
                <Button
                    title="Sign In"
                    icon={<RiDoorOpenLine size={18} />}
                    identifier="btn-radius-40"
                    active={activeTab === "login"}
                    onClick={() => handleSelectTab("login")}
                    type="button"
                />

                <Button
                    title="Create Account"
                    icon={<RiUserAddFill size={18} />}
                    identifier="btn-radius-40"
                    active={activeTab === "register"}
                    onClick={() => handleSelectTab("register")}
                    type="button"
                />
            </nav>

            {/* Header block */}
            <header className="login-header-block">
                <div className="login-security-pill">
                    <RiShieldCheckLine size={15} aria-hidden="true" />
                    <span>Secure Access • Huari Civic Platform</span>
                </div>
                <h1 className="login-title">
                    {activeTab === "login"
                        ? "Welcome back!"
                        : "Create your free account"}
                </h1>
                <p className="login-subtitle">
                    {activeTab === "login"
                        ? "Enter your credentials to track lawmakers, floor votes, and civic courses."
                        : "Join the civic community and audit public spending with data intelligence."}
                </p>
            </header>

            {/* Error banner */}
            {error && (
                <div className="login-alert-error" role="alert">
                    <RiErrorWarningLine size={20} aria-hidden="true" />
                    <span>{error}</span>
                </div>
            )}

            {/* Form */}
            <form className="login-form" onSubmit={handleSubmit} noValidate>
                <div className="login-form-fields">
                    {activeTab === "register" && (
                        <InputText
                            identifier="input-default"
                            label="Full Name"
                            type="text"
                            placeholder="e.g. Maria Silva"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            iconLeft={<RiUserAddFill size={18} />}
                            required
                        />
                    )}

                    <InputText
                        identifier="input-default"
                        label="Email Address"
                        type="email"
                        placeholder="yourname@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        iconLeft={<RiMailLine size={18} />}
                        required
                    />

                    <PasswordInput
                        label="Password"
                        labelAction={
                            activeTab === "login" ? (
                                <Link
                                    to="/recover-password"
                                    className="login-forgot-password"
                                    onClick={onNavigateToRecoverPassword}
                                >
                                    Forgot password?
                                </Link>
                            ) : null
                        }
                        placeholder="Enter your password (min. 8 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {/* Remember me */}
                {activeTab === "login" && (
                    <div className="login-options-row">
                        <label className="login-remember-label">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="login-remember-checkbox"
                            />
                            <span>Keep me signed in on this device</span>
                        </label>
                    </div>
                )}

                {/* Submit and Guest stack */}
                <div className="login-actions-stack">
                    <Button
                        title={
                            isLoading
                                ? "Authenticating..."
                                : activeTab === "login"
                                    ? "Sign In to Huari"
                                    : "Create Huari Account"
                        }
                        icon={<RiCheckboxCircleLine size={19} />}
                        identifier="btn-primary btn-radius-40 btn-submit"
                        type="submit"
                        disabled={isLoading}
                    />

                    {activeTab === "login" && (
                        <Button
                            title="Continue as Guest"
                            icon={<RiUserSharedLine size={18} />}
                            identifier="btn-visitor btn-radius-40"
                            type="button"
                            onClick={handleGuestAccess}
                        />
                    )}

                    {activeTab === "login" && USE_MOCKS && (
                        <Button
                            title="Demo Admin Studio Access"
                            icon={<RiShieldCheckLine size={18} />}
                            identifier="btn-secondary btn-radius-40"
                            type="button"
                            disabled={isLoading}
                            onClick={handleDemoAdminAccess}
                        />
                    )}
                </div>
            </form>

            {/* Social Divider */}
            <div className="login-divider">
                <span>or continue with</span>
            </div>

            {/* Social Logins */}
            <div className="login-social-grid">
                <button
                    type="button"
                    className="login-social-btn"
                    onClick={handleSocialLogin}
                    disabled={!USE_MOCKS}
                    title={!USE_MOCKS ? "Social login available soon" : "Sign in with Google"}
                    aria-label="Sign in with Google"
                >
                    <GoogleIcon size={20} />
                    <span>Google</span>
                </button>

                <button
                    type="button"
                    className="login-social-btn"
                    onClick={handleSocialLogin}
                    disabled={!USE_MOCKS}
                    title={!USE_MOCKS ? "Social login available soon" : "Sign in with GitHub"}
                    aria-label="Sign in with GitHub"
                >
                    <GithubIcon size={20} />
                    <span>GitHub</span>
                </button>

                <button
                    type="button"
                    className="login-social-btn"
                    onClick={handleSocialLogin}
                    disabled={!USE_MOCKS}
                    title={!USE_MOCKS ? "Social login available soon" : "Sign in with Apple"}
                    aria-label="Sign in with Apple"
                >
                    <AppleIcon size={20} />
                    <span>Apple</span>
                </button>
            </div>

            {/* Bottom prompt */}
            <footer className="login-bottom-prompt">
                {activeTab === "login" ? (
                    <p>
                        Don&apos;t have an account yet?{" "}
                        <button
                            type="button"
                            className="login-switch-link"
                            onClick={() => handleSelectTab("register")}
                        >
                            Create an account
                        </button>
                    </p>
                ) : (
                    <p>
                        Already registered?{" "}
                        <button
                            type="button"
                            className="login-switch-link"
                            onClick={() => handleSelectTab("login")}
                        >
                            Sign in
                        </button>
                    </p>
                )}
            </footer>
        </div>
    );
}

Login.propTypes = {
    initialTab: PropTypes.oneOf(["login", "register"]),
    onNavigateToRegister: PropTypes.func,
    onNavigateToRecoverPassword: PropTypes.func,
    onNavigateToHome: PropTypes.func,
};
