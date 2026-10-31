import { useState } from "react";
import "./style.css";
import WebsiteInformation from "../../components/web-site-information";
import imageBackground from "../../assets/images/HuariEducationalLibrary.jpg";
import Button from "../../components/button";
import InputText from "../../components/input-text";
import { GoogleIcon, GithubIcon, AppleIcon } from "../../components/icons";

import {
    RiUserAddFill,
    RiDoorOpenLine,
    RiMailLine,
    RiLockLine,
    RiEyeLine,
    RiEyeOffLine,
    RiErrorWarningLine,
    RiCheckboxCircleLine,
    RiUserSharedLine,
    RiShieldCheckLine,
} from "react-icons/ri";

export default function Login({
    onNavigateToRegister,
    onNavigateToRecoverPassword,
    onNavigateToHome,
}) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [lembrarMe, setLembrarMe] = useState(true);
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [abaAtiva, setAbaAtiva] = useState("entrar");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErro("");

        if (!email.trim() || !email.includes("@")) {
            setErro("Por favor, insira um endereço de e-mail válido.");
            return;
        }

        if (senha.length < 6) {
            setErro("A senha deve ter pelo menos 6 caracteres.");
            return;
        }

        if (abaAtiva === "criar" && nome.trim().length < 3) {
            setErro("Por favor, informe seu nome completo.");
            return;
        }

        setCarregando(true);
        setTimeout(() => {
            setCarregando(false);
            if (onNavigateToHome) {
                onNavigateToHome();
            }
        }, 450);
    };

    const handleSelectTab = (tab) => {
        setErro("");
        setAbaAtiva(tab);
        if (tab === "criar" && onNavigateToRegister) {
            onNavigateToRegister();
        }
    };

    const handleSocialLogin = (provider) => {
        setErro("");
        if (onNavigateToHome) {
            onNavigateToHome();
        } else {
            console.log(`Login com ${provider}`);
        }
    };

    return (
        <div className="login-container">
            {/* Painel Esquerdo: Hero Institucional */}
            <div className="container-left">
                <WebsiteInformation backgroundImage={imageBackground} />
            </div>

            {/* Painel Direito: Card de Autenticação */}
            <div className="container-right">
                <div className="login-auth-wrapper">
                    {/* Seletor de Abas */}
                    <section
                        className="login-tabs-navigation"
                        aria-label="Navegação entre login e cadastro"
                    >
                        <Button
                            title="Entrar na Conta"
                            icon={<RiDoorOpenLine size={18} />}
                            identifier="btn-radius-40"
                            active={abaAtiva === "entrar"}
                            onClick={() => handleSelectTab("entrar")}
                            type="button"
                        />

                        <Button
                            title="Criar Conta"
                            icon={<RiUserAddFill size={18} />}
                            identifier="btn-radius-40"
                            active={abaAtiva === "criar"}
                            onClick={() => handleSelectTab("criar")}
                            type="button"
                        />
                    </section>

                    {/* Cabeçalho de Boas-Vindas */}
                    <header className="login-header-block">
                        <div className="login-security-pill">
                            <RiShieldCheckLine size={15} />
                            <span>Acesso Seguro • Plataforma Cívica Huari</span>
                        </div>
                        <h2 className="login-title">
                            {abaAtiva === "entrar"
                                ? "Bem-vindo de volta!"
                                : "Crie sua conta gratuita"}
                        </h2>
                        <p className="login-subtitle">
                            {abaAtiva === "entrar"
                                ? "Insira suas credenciais para acompanhar parlamentares, votações e trilhas educativas."
                                : "Junte-se à comunidade e fiscalize o poder público com inteligência de dados."}
                        </p>
                    </header>

                    {/* Alerta de Erro / Validação */}
                    {erro && (
                        <div className="login-alert-error" role="alert">
                            <RiErrorWarningLine size={20} />
                            <span>{erro}</span>
                        </div>
                    )}

                    {/* Formulário Principal */}
                    <form className="login-form" onSubmit={handleSubmit} noValidate>
                        <div className="login-form-fields">
                            {abaAtiva === "criar" && (
                                <InputText
                                    identifier="input-default"
                                    label="Nome completo"
                                    type="text"
                                    placeholder="Digite seu nome completo"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    iconLeft={<RiUserAddFill size={18} />}
                                    required
                                />
                            )}

                            <InputText
                                identifier="input-default"
                                label="E-mail"
                                type="email"
                                placeholder="seuemail@exemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                iconLeft={<RiMailLine size={18} />}
                                required
                            />

                            <InputText
                                identifier="input-default"
                                label="Senha de acesso"
                                labelAction={
                                    abaAtiva === "entrar" ? (
                                        <button
                                            type="button"
                                            className="login-forgot-password"
                                            onClick={onNavigateToRecoverPassword}
                                        >
                                            Esqueci minha senha
                                        </button>
                                    ) : null
                                }
                                type={mostrarSenha ? "text" : "password"}
                                placeholder="Digite sua senha (mín. 6 caracteres)"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                iconLeft={<RiLockLine size={18} />}
                                iconRight={
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMostrarSenha(!mostrarSenha)
                                        }
                                        className="btn-toggle-eye"
                                        aria-label={
                                            mostrarSenha
                                                ? "Ocultar senha"
                                                : "Ver senha"
                                        }
                                    >
                                        {mostrarSenha ? (
                                            <RiEyeOffLine size={18} />
                                        ) : (
                                            <RiEyeLine size={18} />
                                        )}
                                    </button>
                                }
                                required
                            />
                        </div>

                        {/* Opções Extras: Lembrar-me */}
                        {abaAtiva === "entrar" && (
                            <div className="login-options-row">
                                <label className="login-remember-label">
                                    <input
                                        type="checkbox"
                                        checked={lembrarMe}
                                        onChange={(e) =>
                                            setLembrarMe(e.target.checked)
                                        }
                                        className="login-remember-checkbox"
                                    />
                                    <span>Manter conectado neste dispositivo</span>
                                </label>
                            </div>
                        )}

                        {/* Botão Principal de Submissão */}
                        <div className="login-actions-stack">
                            <Button
                                title={
                                    carregando
                                        ? "Autenticando..."
                                        : abaAtiva === "entrar"
                                        ? "Acessar Plataforma Huari"
                                        : "Cadastrar na Plataforma Huari"
                                }
                                icon={<RiCheckboxCircleLine size={19} />}
                                identifier="btn-primary btn-radius-40 btn-submit"
                                type="submit"
                                disabled={carregando}
                            />

                            {abaAtiva === "entrar" && (
                                <Button
                                    title="Continuar como Visitante"
                                    icon={<RiUserSharedLine size={18} />}
                                    identifier="btn-visitor btn-radius-40"
                                    type="button"
                                    onClick={onNavigateToHome}
                                />
                            )}
                        </div>
                    </form>

                    {/* Divisor de Login Social */}
                    <div className="login-divider">
                        <span>ou acesse rapidamente com</span>
                    </div>

                    {/* Botões de Login Social */}
                    <div className="login-social-grid">
                        <button
                            type="button"
                            className="login-social-btn"
                            onClick={() => handleSocialLogin("Google")}
                            aria-label="Entrar com Google"
                        >
                            <GoogleIcon size={20} />
                            <span>Google</span>
                        </button>

                        <button
                            type="button"
                            className="login-social-btn"
                            onClick={() => handleSocialLogin("GitHub")}
                            aria-label="Entrar com GitHub"
                        >
                            <GithubIcon size={20} />
                            <span>GitHub</span>
                        </button>

                        <button
                            type="button"
                            className="login-social-btn"
                            onClick={() => handleSocialLogin("Apple")}
                            aria-label="Entrar com Apple"
                        >
                            <AppleIcon size={20} />
                            <span>Apple</span>
                        </button>
                    </div>

                    {/* Rodapé de Alternância Rápida */}
                    <footer className="login-bottom-prompt">
                        {abaAtiva === "entrar" ? (
                            <p>
                                Ainda não faz parte da Huari?{" "}
                                <button
                                    type="button"
                                    className="login-switch-link"
                                    onClick={() => handleSelectTab("criar")}
                                >
                                    Crie uma conta agora
                                </button>
                            </p>
                        ) : (
                            <p>
                                Já possui uma conta cadastrada?{" "}
                                <button
                                    type="button"
                                    className="login-switch-link"
                                    onClick={() => handleSelectTab("entrar")}
                                >
                                    Fazer login
                                </button>
                            </p>
                        )}
                    </footer>
                </div>
            </div>
        </div>
    );
}
