import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/button";
import InputText from "../../components/input-text";
import PasswordInput from "../../components/password-input";
import { GoogleIcon, GithubIcon, AppleIcon } from "../../components/icons";
import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/useToast";
import { authService } from "../../services/auth-service";
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
            setError("Informe um e-mail válido.");
            return;
        }

        if (activeTab === "register" && password.length < 8) {
            setError("A senha deve ter pelo menos 8 caracteres.");
            return;
        }

        if (activeTab === "login" && !password) {
            setError("Digite sua senha para entrar.");
            return;
        }

        if (activeTab === "register" && name.trim().length < 3) {
            setError("Informe seu nome completo.");
            return;
        }

        setIsLoading(true);
        try {
            if (activeTab === "login") {
                const result = await authService.login({ email, password, rememberMe });
                login?.(result.user, result.token, rememberMe, result.refreshToken);
            } else {
                const result = await authService.register({ name, email, password });
                login?.(result.user, result.token, rememberMe, result.refreshToken);
            }

            if (onNavigateToHome) {
                onNavigateToHome();
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.message || "Falha ao autenticar. Confira seus dados.");
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
        toast.info("Entrando em modo visitante.");
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
            login?.(result.user, result.token, true, result.refreshToken);
            toast.success("Sessão administrativa iniciada.");
            if (onNavigateToHome) {
                onNavigateToHome();
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            setError(err.message || "Não foi possível entrar no modo demonstração.");
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
            <nav
                className="login-tabs-navigation"
                aria-label="Alternar entre entrar e criar conta"
            >
                <Button
                    title="Entrar"
                    icon={<RiDoorOpenLine size={18} />}
                    identifier="btn-radius-40"
                    active={activeTab === "login"}
                    onClick={() => handleSelectTab("login")}
                    type="button"
                />

                <Button
                    title="Criar conta"
                    icon={<RiUserAddFill size={18} />}
                    identifier="btn-radius-40"
                    active={activeTab === "register"}
                    onClick={() => handleSelectTab("register")}
                    type="button"
                />
            </nav>

            <header className="login-header-block">
                <h1 className="login-title">
                    {activeTab === "login"
                        ? "Entrar na Huari"
                        : "Criar sua conta"}
                </h1>
                <p className="login-subtitle">
                    {activeTab === "login"
                        ? "Acesse sua conta para acompanhar parlamentares, notas da cota e progresso nas aulas."
                        : "Crie seu cadastro gratuito para salvar parlamentares e registrar seu avanço nas trilhas."}
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
                    {activeTab === "register" && (
                        <InputText
                            identifier="input-default"
                            label="Nome completo"
                            type="text"
                            placeholder="Ex.: Maria Silva"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            iconLeft={<RiUserAddFill size={18} />}
                            required
                        />
                    )}

                    <InputText
                        identifier="input-default"
                        label="E-mail"
                        type="email"
                        placeholder="voce@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        iconLeft={<RiMailLine size={18} />}
                        required
                    />

                    <PasswordInput
                        label="Senha"
                        labelAction={
                            activeTab === "login" ? (
                                <Link
                                    to="/recover-password"
                                    className="login-forgot-password"
                                    onClick={onNavigateToRecoverPassword}
                                >
                                    Esqueci a senha
                                </Link>
                            ) : null
                        }
                        placeholder="Digite sua senha (mín. 8 caracteres)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {activeTab === "login" && (
                    <div className="login-options-row">
                        <label className="login-remember-label">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="login-remember-checkbox"
                            />
                            <span>Manter sessão conectada neste dispositivo</span>
                        </label>
                    </div>
                )}

                <div className="login-actions-stack">
                    <Button
                        title={
                            isLoading
                                ? "Autenticando..."
                                : activeTab === "login"
                                  ? "Entrar"
                                  : "Criar conta"
                        }
                        icon={<RiCheckboxCircleLine size={19} />}
                        identifier="btn-primary btn-radius-40 btn-submit"
                        type="submit"
                        disabled={isLoading}
                    />

                    {activeTab === "login" && (
                        <Button
                            title="Explorar como visitante"
                            icon={<RiUserSharedLine size={18} />}
                            identifier="btn-visitor btn-radius-40"
                            type="button"
                            onClick={handleGuestAccess}
                        />
                    )}

                    {activeTab === "login" && USE_MOCKS && (
                        <Button
                            title="Acesso demonstração (Admin)"
                            icon={<RiShieldCheckLine size={18} />}
                            identifier="btn-secondary btn-radius-40"
                            type="button"
                            disabled={isLoading}
                            onClick={handleDemoAdminAccess}
                        />
                    )}
                </div>
            </form>

            {USE_MOCKS && (
                <>
                    <div className="login-divider">
                        <span>ou entre com</span>
                    </div>

                    <div className="login-social-grid">
                        <button
                            type="button"
                            className="login-social-btn"
                            onClick={handleSocialLogin}
                            aria-label="Entrar com Google"
                        >
                            <GoogleIcon size={20} />
                            <span>Google</span>
                        </button>

                        <button
                            type="button"
                            className="login-social-btn"
                            onClick={handleSocialLogin}
                            aria-label="Entrar com GitHub"
                        >
                            <GithubIcon size={20} />
                            <span>GitHub</span>
                        </button>

                        <button
                            type="button"
                            className="login-social-btn"
                            onClick={handleSocialLogin}
                            aria-label="Entrar com Apple"
                        >
                            <AppleIcon size={20} />
                            <span>Apple</span>
                        </button>
                    </div>
                </>
            )}

            <footer className="login-bottom-prompt">
                {activeTab === "login" ? (
                    <p>
                        Ainda não tem conta?{" "}
                        <button
                            type="button"
                            className="login-switch-link"
                            onClick={() => handleSelectTab("register")}
                        >
                            Cadastre-se gratuitamente
                        </button>
                    </p>
                ) : (
                    <p>
                        Já possui cadastro?{" "}
                        <button
                            type="button"
                            className="login-switch-link"
                            onClick={() => handleSelectTab("login")}
                        >
                            Entrar na conta
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
