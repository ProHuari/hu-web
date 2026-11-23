import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import PasswordInput from "../../components/password-input";
import Button from "../../components/button";
import { authService } from "../../services/auth-service";
import {
    RiArrowRightLine,
    RiErrorWarningLine,
    RiCheckboxCircleLine,
} from "react-icons/ri";
import "./style.css";

export default function CreateNewPassword({ onNavigateToLogin }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const resetToken = searchParams.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 8) {
            setError("A senha deve ter no mínimo 8 caracteres.");
            return;
        }

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        if (!resetToken) {
            setError("Token de redefinição ausente ou expirado. Solicite um novo link.");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            await authService.resetPassword({ token: resetToken, newPassword: password });
            setIsSuccess(true);
            setTimeout(() => {
                if (onNavigateToLogin) {
                    onNavigateToLogin();
                } else {
                    navigate("/login");
                }
            }, 1500);
        } catch (err) {
            setError(err.message || "Não foi possível redefinir a senha. O link pode ter expirado.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="new-password-content">
            <header className="new-password-header">
                <h1 className="text-h2-bold">Definir nova senha</h1>
                <p className="text-p-regular">
                    Escolha uma senha com pelo menos 8 caracteres para acessar sua conta.
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
                    <span>Senha atualizada com sucesso! Redirecionando para o login...</span>
                </div>
            )}

            <form className="new-password-form" onSubmit={handleSubmit} noValidate>
                <div className="new-password-fields">
                    <PasswordInput
                        label="Nova senha"
                        placeholder="Mínimo de 8 caracteres"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                        }}
                        required
                    />

                    <PasswordInput
                        label="Confirmar nova senha"
                        placeholder="Repita a nova senha"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setError("");
                        }}
                        required
                    />
                </div>

                <Button
                    title={isLoading ? "Atualizando..." : "Salvar nova senha"}
                    icon={<RiArrowRightLine size={18} />}
                    identifier="btn-primary btn-radius-40 new-password-submit"
                    type="submit"
                    disabled={isLoading || isSuccess}
                />
            </form>

            <div className="new-password-divider">
                <span />
                <p>OU</p>
                <span />
            </div>

            <p className="new-password-back text-p-small-regular">
                Voltar para{" "}
                <Link
                    to="/login"
                    className="new-password-link"
                    onClick={onNavigateToLogin}
                >
                    Entrar na conta
                </Link>
            </p>

            <footer className="new-password-footer">
                <a href="#privacidade">Privacidade</a>
                <a href="#termos">Termos</a>
                <a href="#metodologia">Metodologia</a>
            </footer>
        </div>
    );
}

CreateNewPassword.propTypes = {
    onNavigateToLogin: PropTypes.func,
};
