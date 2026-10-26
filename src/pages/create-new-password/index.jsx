
import { useState } from "react";
import "./style.css";

import WebsiteInformation from "../../components/web-site-information";
import InputText from "../../components/input-text";
import Button from "../../components/button";

import imageBackground from "../../assets/images/HuariEducationLibrary4.jpg";

import {
    RiLockLine,
    RiEyeLine,
    RiEyeOffLine,
    RiArrowRightLine,
} from "react-icons/ri";

export default function CreateNewPassword({ onNavigateToLogin }) {
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] =
        useState(false);

    const [erro, setErro] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        if (senha.length < 8) {
            setErro("A senha deve ter pelo menos 8 caracteres.");
            return;
        }

        setErro("");

        // A redefinição real deverá ser conectada ao backend
        // ou ao serviço de autenticação.
    };

    return (
        <div className="new-password-container">
            <div className="new-password-left">
                <WebsiteInformation
                    backgroundImage={imageBackground}
                />
            </div>

            <div className="new-password-right">
                <div className="new-password-content">

                    <header className="new-password-header">
                        <h2 className="text-h2-bold">
                            Criar Nova Senha
                        </h2>
                    </header>

                    <form
                        className="new-password-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="new-password-fields">
                            <InputText
                                identifier="input-default"
                                label="Nova Senha"
                                type={mostrarSenha ? "text" : "password"}
                                placeholder="Digite sua Senha..."
                                value={senha}
                                onChange={(e) => {
                                    setSenha(e.target.value);
                                    setErro("");
                                }}
                                iconLeft={<RiLockLine />}
                                iconRight={
                                    <button
                                        type="button"
                                        className="new-password-toggle"
                                        onClick={() =>
                                            setMostrarSenha(!mostrarSenha)
                                        }
                                        aria-label={
                                            mostrarSenha
                                                ? "Ocultar senha"
                                                : "Mostrar senha"
                                        }
                                    >
                                        {mostrarSenha
                                            ? <RiEyeOffLine size={20} />
                                            : <RiEyeLine size={20} />}
                                    </button>
                                }
                                required
                            />

                            <InputText
                                identifier="input-default"
                                label="Confirmar Senha"
                                type={
                                    mostrarConfirmarSenha
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Digite sua Senha..."
                                value={confirmarSenha}
                                onChange={(e) => {
                                    setConfirmarSenha(e.target.value);
                                    setErro("");
                                }}
                                iconLeft={<RiLockLine />}
                                iconRight={
                                    <button
                                        type="button"
                                        className="new-password-toggle"
                                        onClick={() =>
                                            setMostrarConfirmarSenha(
                                                !mostrarConfirmarSenha
                                            )
                                        }
                                        aria-label={
                                            mostrarConfirmarSenha
                                                ? "Ocultar confirmação de senha"
                                                : "Mostrar confirmação de senha"
                                        }
                                    >
                                        {mostrarConfirmarSenha
                                            ? <RiEyeOffLine size={20} />
                                            : <RiEyeLine size={20} />}
                                    </button>
                                }
                                required
                            />
                        </div>

                        {erro && (
                            <p
                                className="new-password-error"
                                role="alert"
                            >
                                {erro}
                            </p>
                        )}

                        <Button
                            title="Redefinir Senha"
                            icon={<RiArrowRightLine size={20} />}
                            identifier="btn-primary btn-radius-40 new-password-submit"
                            type="submit"
                        />
                    </form>

                    <div className="new-password-divider">
                        <span></span>
                        <p>OU</p>
                        <span></span>
                    </div>

                    <p className="new-password-back text-p-small-regular">
                        Voltar para{" "}
                        <button
                            type="button"
                            className="new-password-link"
                            onClick={onNavigateToLogin}
                        >
                            Login
                        </button>
                    </p>

                    <footer className="new-password-footer">
                        <a href="#privacidade">Privacidade</a>
                        <a href="#termos">Termos de Uso</a>
                        <a href="#metodologia">Metodologia Aberta</a>
                    </footer>

                </div>
            </div>
        </div>
    );
}
