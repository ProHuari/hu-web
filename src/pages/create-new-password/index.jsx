import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";
import PasswordInput from "../../components/password-input";
import Button from "../../components/button";
import {
    RiArrowRightLine,
    RiShieldCheckLine,
    RiErrorWarningLine,
    RiCheckboxCircleLine,
} from "react-icons/ri";
import "./style.css";

export default function CreateNewPassword({ onNavigateToLogin }) {
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        setError("");
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            setTimeout(() => {
                if (onNavigateToLogin) {
                    onNavigateToLogin();
                } else {
                    navigate("/login");
                }
            }, 1500);
        }, 600);
    };

    return (
        <div className="new-password-content">
            <header className="new-password-header">
                <div className="login-security-pill">
                    <RiShieldCheckLine size={15} aria-hidden="true" />
                    <span>Password Security • Huari Platform</span>
                </div>
                <h1 className="text-h2-bold">Create New Password</h1>
                <p className="text-p-regular">
                    Choose a strong password containing at least 8 characters to secure your civic account.
                </p>
            </header>

            {error && (
                <div className="login-alert-error" role="alert">
                    <RiErrorWarningLine size={20} aria-hidden="true" />
                    <span>{error}</span>
                </div>
            )}

            {isSuccess && (
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
                    <span>Password successfully updated! Redirecting to login...</span>
                </div>
            )}

            <form className="new-password-form" onSubmit={handleSubmit} noValidate>
                <div className="new-password-fields">
                    <PasswordInput
                        label="New Password"
                        placeholder="Enter your new password (min. 8 characters)"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                        }}
                        required
                    />

                    <PasswordInput
                        label="Confirm New Password"
                        placeholder="Re-enter your new password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setError("");
                        }}
                        required
                    />
                </div>

                <Button
                    title={isLoading ? "Updating..." : "Reset Password"}
                    icon={<RiArrowRightLine size={18} />}
                    identifier="btn-primary btn-radius-40 new-password-submit"
                    type="submit"
                    disabled={isLoading || isSuccess}
                />
            </form>

            <div className="new-password-divider">
                <span />
                <p>OR</p>
                <span />
            </div>

            <p className="new-password-back text-p-small-regular">
                Return to{" "}
                <Link
                    to="/login"
                    className="new-password-link"
                    onClick={onNavigateToLogin}
                >
                    Sign In
                </Link>
            </p>

            <footer className="new-password-footer">
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
                <a href="#methodology">Open Methodology</a>
            </footer>
        </div>
    );
}

CreateNewPassword.propTypes = {
    onNavigateToLogin: PropTypes.func,
};
