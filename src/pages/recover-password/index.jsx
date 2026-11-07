import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";
import InputText from "../../components/input-text";
import Button from "../../components/button";
import {
    RiMailLine,
    RiArrowRightLine,
    RiShieldCheckLine,
    RiCheckboxCircleLine,
    RiErrorWarningLine,
} from "react-icons/ri";
import "./style.css";

export default function RecoverPassword({
    onNavigateToLogin,
    onNavigateToCreateNewPassword,
}) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !email.includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
            if (onNavigateToCreateNewPassword) {
                setTimeout(onNavigateToCreateNewPassword, 1200);
            } else {
                setTimeout(() => navigate("/create-new-password"), 1500);
            }
        }, 600);
    };

    return (
        <div className="recover-password-content">
            <header className="recover-password-header">
                <div className="login-security-pill">
                    <RiShieldCheckLine size={15} aria-hidden="true" />
                    <span>Account Recovery • Huari Civic Platform</span>
                </div>
                <h1 className="text-h2-bold">Reset Your Password</h1>
                <p className="text-p-regular">
                    Enter your registered email address. We will send you instructions to create a new password.
                </p>
            </header>

            {error && (
                <div className="login-alert-error" role="alert">
                    <RiErrorWarningLine size={20} aria-hidden="true" />
                    <span>{error}</span>
                </div>
            )}

            {isSubmitted && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        backgroundColor: "#DCFCE7",
                        border: "1px solid #BBF7D0",
                        color: "#16A34A",
                        fontSize: "0.88rem",
                        fontWeight: 600,
                    }}
                >
                    <RiCheckboxCircleLine size={20} aria-hidden="true" />
                    <span>Instructions sent! Redirecting to password reset...</span>
                </div>
            )}

            <form className="recover-password-form" onSubmit={handleSubmit} noValidate>
                <div className="recover-password-fields">
                    <InputText
                        identifier="input-default"
                        label="Registered Email Address"
                        type="email"
                        placeholder="yourname@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        iconLeft={<RiMailLine />}
                        required
                    />
                </div>

                <Button
                    title={isLoading ? "Sending..." : "Send Reset Link"}
                    icon={<RiArrowRightLine size={18} />}
                    identifier="btn-primary btn-radius-40 recover-password-submit"
                    type="submit"
                    disabled={isLoading || isSubmitted}
                />
            </form>

            <div className="recover-password-divider">
                <span />
                <p>OR</p>
                <span />
            </div>

            <p className="recover-password-back text-p-small-regular">
                Return to{" "}
                <Link
                    to="/login"
                    className="recover-password-link"
                    onClick={onNavigateToLogin}
                >
                    Sign In
                </Link>
            </p>

            <footer className="recover-password-footer">
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
                <a href="#methodology">Open Methodology</a>
            </footer>
        </div>
    );
}

RecoverPassword.propTypes = {
    onNavigateToLogin: PropTypes.func,
    onNavigateToCreateNewPassword: PropTypes.func,
};
