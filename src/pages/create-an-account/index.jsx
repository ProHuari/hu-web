import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";
import InputText from "../../components/input-text";
import PasswordInput from "../../components/password-input";
import Button from "../../components/button";
import { GoogleIcon, GithubIcon, AppleIcon } from "../../components/icons";
import { useApp } from "../../context/AppContext";
import { authService } from "../../services/auth-service";
import {
    RiUserLine,
    RiMailLine,
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
            setError("Informe seu nome completo.");
            return;
        }

        if (!email.trim() || !email.includes("@")) {
            setError("Informe um endereço de e-mail válido.");
            return;
        }

        if (password.length < 8) {
            setError("A senha deve conter no mínimo 8 caracteres.");
            return;
        }

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        setIsLoading(true);
        try {
            const result = await authService.register({ name, email, password });
            registerContext?.(result.user, result.token, result.refreshToken);

            if (onNavigateToHome) {
                onNavigateToHome();
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.message || "Não foi possível concluir o cadastro.");
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
            <nav className="login-tabs-navigation" aria-label="Alternar entre entrar e criar conta">
                <Button
                    title="Entrar"
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
                    title="Criar conta"
                    icon={<RiUserAddFill size={18} />}
                    identifier="btn-radius-40"
                    active={true}
                    type="button"
                />
            </nav>

            <header className="create-account-header">
                <h1 className="login-title">Criar conta na Huari</h1>
                <p className="create-account-subtitle">
                    Cadastre-se gratuitamente para acompanhar parlamentares e registrar seu progresso nas aulas.
                </p>
            </header>

            {error && (
                <div className="login-alert-error" role="alert">
                    <RiErrorWarningLine size={20} aria-hidden="true" />
                    <span>{error}</span>
                </div>
            )}

            <form className="login-form" onSubmit={handleSubmit} noValidate>
                <div className="login-form-fields">
                    <InputText
                        identifier="input-default"
                        label="Nome completo"
                        type="text"
                        placeholder="Ex.: Maria Silva"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        iconLeft={<RiUserLine />}
                        required
                    />

                    <InputText
                        identifier="input-default"
                        label="E-mail"
                        type="email"
                        placeholder="voce@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        iconLeft={<RiMailLine />}
                        required
                    />

                    <PasswordInput
                        label="Senha"
                        placeholder="Mínimo de 8 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <PasswordInput
                        label="Confirmar senha"
                        placeholder="Repita sua senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <Button
                    title={isLoading ? "Criando conta..." : "Criar conta"}
                    icon={<RiCheckboxCircleLine size={19} />}
                    identifier="btn-primary btn-radius-40 btn-submit"
                    type="submit"
                    disabled={isLoading}
                />
            </form>

            {USE_MOCKS && (
                <>
                    <div className="login-divider">
                        <span>ou continue com</span>
                    </div>

                    <div className="login-social-grid">
                        <button
                            type="button"
                            className="login-social-btn"
                            onClick={handleSocialLogin}
                            aria-label="Cadastrar com Google"
                        >
                            <GoogleIcon size={20} />
                            <span>Google</span>
                        </button>

                        <button
                            type="button"
                            className="login-social-btn"
                            onClick={handleSocialLogin}
                            aria-label="Cadastrar com GitHub"
                        >
                            <GithubIcon size={20} />
                            <span>GitHub</span>
                        </button>

                        <button
                            type="button"
                            className="login-social-btn"
                            onClick={handleSocialLogin}
                            aria-label="Cadastrar com Apple"
                        >
                            <AppleIcon size={20} />
                            <span>Apple</span>
                        </button>
                    </div>
                </>
            )}

            <footer className="login-bottom-prompt">
                <p>
                    Já possui conta?{" "}
                    <Link
                        to="/login"
                        className="login-switch-link"
                        onClick={onNavigateToLogin}
                    >
                        Entrar
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
