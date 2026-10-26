import { useState } from "react";
import './style.css';
import WebsiteInformation from "../../components/web-site-information";
import imageBackground from "../../assets/images/HuariEducationLibrary2.jpg";
import InputText from "../../components/input-text";
import Button from "../../components/button";
import { 
  RiUserLine, 
  RiMailLine, 
  RiLockLine, 
  RiEyeLine, 
  RiEyeOffLine 
} from "react-icons/ri";

export default function CreateAnAccount({ onNavigateToLogin }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="login-container">
            <div className="container-left">
                <WebsiteInformation backgroundImage={imageBackground} />
            </div>

            <div className="container-right">
                <div className="create-account-content">
                    <div className="create-account-header">
                        <h2 className="text-h2-bold">Bem-vindo!</h2>
                        <p className="text-p-regular create-account-subtitle">
                            Por favor, insira seus dados para criar sua conta.
                        </p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="login-form-fields">
                            <InputText
                                identifier="input-default"
                                label="Nome completo"
                                type="text"
                                placeholder="Digite seu nome completo"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                iconLeft={<RiUserLine />}
                                required
                            />

                            <InputText
                                identifier="input-default"
                                label="E-mail"
                                type="email"
                                placeholder="seuemail@exemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                iconLeft={<RiMailLine />}
                                required
                            />

                            <InputText
                                identifier="input-default"
                                label="Senha"
                                type={mostrarSenha ? "text" : "password"}
                                placeholder="Crie uma senha forte"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                iconLeft={<RiLockLine />}
                                iconRight={
                                    <button
                                        type="button"
                                        onClick={() => setMostrarSenha(!mostrarSenha)}
                                        className="btn-toggle-eye"
                                        aria-label={mostrarSenha ? "Ocultar senha" : "Ver senha"}
                                    >
                                        {mostrarSenha ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                                    </button>
                                }
                                required
                            />

                            <InputText
                                identifier="input-default"
                                label="Confirmar senha"
                                type={mostrarConfirmarSenha ? "text" : "password"}
                                placeholder="Confirme sua senha"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                iconLeft={<RiLockLine />}
                                iconRight={
                                    <button
                                        type="button"
                                        onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                                        className="btn-toggle-eye"
                                        aria-label={mostrarConfirmarSenha ? "Ocultar confirmação de senha" : "Ver confirmação de senha"}
                                    >
                                        {mostrarConfirmarSenha ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                                    </button>
                                }
                                required
                            />
                        </div>

                        <Button
                            title="Criar Conta"
                            identifier="btn-primary btn-radius-40 btn-submit"
                            type="submit"
                        />

                        {onNavigateToLogin && (
                            <p className="login-footer-text text-p-small-regular">
                                Já tem uma conta?{" "}
                                <button
                                    type="button"
                                    onClick={onNavigateToLogin}
                                    className="link-btn"
                                >
                                    Entrar
                                </button>
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
