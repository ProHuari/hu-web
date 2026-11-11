import React, { useState } from "react";
import './style.css';
import WebsiteInformation from "../../components/WebsiteInformation";
import imageBackground from "../../assets/images/HuariEducationalLibrary.jpg";
import Button from "../../components/Button";
import InputText from "../../components/InputText";

import { 
  RiUserAddFill, 
  RiDoorOpenLine, 
  RiMailLine, 
  RiLockLine, 
  RiEyeLine, 
  RiEyeOffLine,
  RiAlertLine
} from "react-icons/ri";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password: senha,
                }),
            });

            if (response.ok) {
                const data = await response.json();

                // Extração e armazenamento do token e dados de sessão
                if (data.token) {
                    localStorage.setItem('huari_token', data.token);
                }
                if (data.refreshToken) {
                    localStorage.setItem('huari_refresh_token', data.refreshToken);
                }
                if (data.role) {
                    localStorage.setItem('huari_user_role', data.role);
                }

                // Redirecionamento para a página interna/dashboard
                window.location.href = '/dashboard';
            } else {
                let message = 'E-mail ou senha inválidos.';
                try {
                    const errorData = await response.json();
                    if (response.status === 401) {
                        message = 'E-mail ou senha incorretos. Verifique suas credenciais.';
                    } else if (response.status === 429) {
                        message = 'Muitas tentativas incorretas. Aguarde alguns instantes antes de tentar novamente.';
                    } else if (errorData && errorData.message) {
                        message = errorData.message;
                    }
                } catch {
                    if (response.status >= 500) {
                        message = 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.';
                    }
                }
                setErrorMessage(message);
            }
        } catch (error) {
            console.error('Falha de conexão com a API de login:', error);
            setErrorMessage('Não foi possível conectar ao servidor. Verifique sua conexão ou se o back-end está ativo na porta 8080.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="container-left">
                <WebsiteInformation backgroundImage={imageBackground} />
            </div>

            <div className="container-right">
                <section className="login-tabs-navigation">
                    <Button title="Entrar na Conta" icon={<RiDoorOpenLine />} identifier="btn-tab-active" />
                    <Button title="Criar Conta" icon={<RiUserAddFill />} identifier="btn-tab-inactive" />
                </section>

                <form className="login-form" onSubmit={handleSubmit}>
                    <h2 className="text-h2-bold">Entrar na Conta</h2>

                    {errorMessage && (
                        <div className="login-error-alert" role="alert">
                            <RiAlertLine size={18} className="login-error-icon" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <InputText 
                        label="Email" 
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        iconLeft={<RiMailLine />} 
                        required
                        disabled={loading}
                    />

                    <InputText 
                        label="Senha de acesso" 
                        type={mostrarSenha ? "text" : "password"} 
                        placeholder="Digite sua senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        labelAction={<a href="/recuperar-senha">Esqueci minha senha</a>} 
                        iconLeft={<RiLockLine />}  
                        iconRight={
                          <button 
                            type="button" 
                            onClick={() => setMostrarSenha(!mostrarSenha)} 
                            className="btn-toggle-eye"
                            disabled={loading}
                          >
                            {mostrarSenha ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                          </button>
                        }
                        required
                        disabled={loading}
                    />

                    <Button 
                        title={loading ? "Entrando..." : "Acessar Plataforma Huari"} 
                        identifier="btn-login-submit" 
                        type="submit" 
                        disabled={loading}
                    />
                </form>
            </div>
        </div>
    );
}
