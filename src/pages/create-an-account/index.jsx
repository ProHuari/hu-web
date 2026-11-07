import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";
import InputText from "../../components/input-text";
import PasswordInput from "../../components/password-input";
import Button from "../../components/button";
import { GoogleIcon, GithubIcon, AppleIcon } from "../../components/icons";
import { useApp } from "../../context/AppContext";
import { authService } from "../../services/authService";
import {
    RiUserLine,
    RiMailLine,
    RiShieldCheckLine,
    RiErrorWarningLine,
    RiCheckboxCircleLine,
    RiDoorOpenLine,
    RiUserAddFill,
} from "react-icons/ri";
import "./style.css";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

export default function CreateAnAccount({ onNavigateToLogin, onNavigateToHome }) {
    const navigate = useNavigate();
    const { register: registerContext, loginAsGuest } = useApp() || {};

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!name.trim() || name.trim().length < 3) {
            setError("Please enter your full name.");
            return;
        }

        if (!email.trim() || !email.includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }

        if (password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        try {
            const result = await authService.register({ name, email, password });
            registerContext?.(result.user, result.token);

            if (onNavigateToHome) {
                onNavigateToHome();
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = () => {
        loginAsGuest?.();
        if (onNavigateToHome) {
            onNavigateToHome();
        } else {
            navigate("/dashboard");
        }
    };

    return (
        <div className="create-account-content">
            {/* Tab navigation */}
            <nav className="login-tabs-navigation" aria-label="Toggle authentication tabs">
                <Button
                    title="Sign In"
                    icon={<RiDoorOpenLine size={18} />}
                    identifier="btn-radius-40"
                    active={false}
                    onClick={() => {
                        if (onNavigateToLogin) onNavigateToLogin();
                        else navigate("/login");
                    }}
                    type="button"
                />

                <Button
                    title="Create Account"
                    icon={<RiUserAddFill size={18} />}
                    identifier="btn-radius-40"
                    active={true}
                    type="button"
                />
            </nav>

            {/* Header */}
            <header className="create-account-header">
                <div className="login-security-pill">
                    <RiShieldCheckLine size={15} aria-hidden="true" />
                    <span>Secure Access • Huari Civic Platform</span>
                </div>
                <h1 className="login-title">Join Huari Democracy</h1>
                <p className="create-account-subtitle">
                    Create your free account to track parliamentary voting records, audit quotas, and enroll in civic courses.
                </p>
            </header>

            {/* Error message */}
            {error && (
                <div className="login-alert-error" role="alert">
                    <RiErrorWarningLine size={20} aria-hidden="true" />
                    <span>{error}</span>
                </div>
            )}

            {/* Form */}
            <form className="login-form" onSubmit={handleSubmit} noValidate>
                <div className="login-form-fields">
                    <InputText
                        identifier="input-default"
                        label="Full Name"
                        type="text"
                        placeholder="e.g. Maria Silva"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        iconLeft={<RiUserLine />}
                        required
                    />

                    <InputText
                        identifier="input-default"
                        label="Email Address"
                        type="email"
                        placeholder="yourname@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        iconLeft={<RiMailLine />}
                        required
                    />

                    <PasswordInput
                        label="Password"
                        placeholder="Create a strong password (min. 8 chars)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <PasswordInput
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <Button
                    title={isLoading ? "Creating Account..." : "Create Account"}
                    icon={<RiCheckboxCircleLine size={19} />}
                    identifier="btn-primary btn-radius-40 btn-submit"
                    type="submit"
                    disabled={isLoading}
                />
            </form>

            {/* Social logins */}
            <div className="login-divider">
                <span>or register with</span>
            </div>

            <div className="login-social-grid">
                <button
                    type="button"
                    className="login-social-btn"
                    onClick={handleSocialLogin}
                    disabled={!USE_MOCKS}
                    title={!USE_MOCKS ? "Social login available soon" : "Sign up with Google"}
                    aria-label="Sign up with Google"
                >
                    <GoogleIcon size={20} />
                    <span>Google</span>
                </button>

                <button
                    type="button"
                    className="login-social-btn"
                    onClick={handleSocialLogin}
                    disabled={!USE_MOCKS}
                    title={!USE_MOCKS ? "Social login available soon" : "Sign up with GitHub"}
                    aria-label="Sign up with GitHub"
                >
                    <GithubIcon size={20} />
                    <span>GitHub</span>
                </button>

                <button
                    type="button"
                    className="login-social-btn"
                    onClick={handleSocialLogin}
                    disabled={!USE_MOCKS}
                    title={!USE_MOCKS ? "Social login available soon" : "Sign up with Apple"}
                    aria-label="Sign up with Apple"
                >
                    <AppleIcon size={20} />
                    <span>Apple</span>
                </button>
            </div>

            {/* Footer text */}
            <footer className="login-bottom-prompt">
                <p>
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="login-switch-link"
                        onClick={onNavigateToLogin}
                    >
                        Sign in
                    </Link>
                </p>
            </footer>
        </div>
    );
}

CreateAnAccount.propTypes = {
    onNavigateToLogin: PropTypes.func,
    onNavigateToHome: PropTypes.func,
};
