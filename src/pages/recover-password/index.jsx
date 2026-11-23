import { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import InputText from "../../components/input-text";
import Button from "../../components/button";
import { authService } from "../../services/auth-service";
import {
    RiMailLine,
    RiArrowRightLine,
    RiCheckboxCircleLine,
    RiErrorWarningLine,
} from "react-icons/ri";
import "./style.css";

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

export default function RecoverPassword({
    onNavigateToLogin,
    onNavigateToCreateNewPassword,
}) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !email.includes("@")) {
            setError("Informe um e-mail válido.");
            return;
        }

        setIsLoading(true);
        try {
            await authService.requestPasswordReset(email);
            setIsSubmitted(true);
            if (USE_MOCKS) {
                setTimeout(() => {
                    if (onNavigateToCreateNewPassword) {
                        onNavigateToCreateNewPassword();
                    } else {
                        navigate("/create-new-password?token=demo-reset-token");
                    }
                }, 1500);
            }
        } catch (err) {
            setError(err.message || "Não foi possível enviar as instruções de recuperação.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="recover-password-content">
            <header className="recover-password-header">
                <h1 className="text-h2-bold">Recuperar senha</h1>
                <p className="text-p-regular">
                    Informe o e-mail cadastrado na plataforma para receber as instruções de redefinição.
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
                    <span>
                        Se o e-mail estiver cadastrado, você receberá um link para criar uma nova senha.
                    </span>
                </div>
            )}

            <form className="recover-password-form" onSubmit={handleSubmit} noValidate>
                <div className="recover-password-fields">
                    <InputText
                        identifier="input-default"
                        label="E-mail cadastrado"
                        type="email"
                        placeholder="voce@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        iconLeft={<RiMailLine />}
                        required
                    />
                </div>

                <Button
                    title={isLoading ? "Enviando..." : "Enviar instruções"}
                    icon={<RiArrowRightLine size={18} />}
                    identifier="btn-primary btn-radius-40 recover-password-submit"
                    type="submit"
                    disabled={isLoading || isSubmitted}
                />
            </form>

            <div className="recover-password-divider">
                <span />
                <p>OU</p>
                <span />
            </div>

            <p className="recover-password-back text-p-small-regular">
                Voltar para{" "}
                <Link
                    to="/login"
                    className="recover-password-link"
                    onClick={onNavigateToLogin}
                >
                    Entrar na conta
                </Link>
            </p>

            <footer className="recover-password-footer">
                <a href="#privacidade">Privacidade</a>
                <a href="#termos">Termos</a>
                <a href="#metodologia">Metodologia</a>
            </footer>
        </div>
    );
}

RecoverPassword.propTypes = {
    onNavigateToLogin: PropTypes.func,
    onNavigateToCreateNewPassword: PropTypes.func,
};
