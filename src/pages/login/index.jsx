import { useState } from "react";
import './style.css';
import WebsiteInformation from "../../components/web-site-information";
import imageBackground from "../../assets/images/HuariEducationalLibrary.jpg";
import Button from "../../components/button";
import InputText from "../../components/input-text";

import { 
  RiUserAddFill, 
  RiDoorOpenLine, 
  RiMailLine, 
  RiLockLine, 
  RiEyeLine, 
  RiEyeOffLine 
} from "react-icons/ri";

export default function Login({ onNavigateToRegister }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [abaAtiva, setAbaAtiva] = useState("entrar");

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleSelectTab = (tab) => {
        setAbaAtiva(tab);
        if (tab === "criar" && onNavigateToRegister) {
            onNavigateToRegister();
        }
    };

    return (
        <div className="login-container">
            <div className="container-left">
                <WebsiteInformation backgroundImage={imageBackground} />
            </div>

            <div className="container-right">
                <section className="login-tabs-navigation" aria-label="Navegação entre login e cadastro">
                    <Button
                        title="Entrar na Conta"
                        icon={<RiDoorOpenLine />}
                        identifier="btn-radius-40"
                        active={abaAtiva === "entrar"}
                        onClick={() => handleSelectTab("entrar")}
                        type="button"
                    />

                    <Button
                        title="Criar Conta"
                        icon={<RiUserAddFill />}
                        identifier="btn-radius-40"
                        active={abaAtiva === "criar"}
                        onClick={() => handleSelectTab("criar")}
                        type="button"
                    />
                </section>

                <form className="login-form" onSubmit={handleSubmit}>
                    <h2 className="text-h2-bold">
                        {abaAtiva === "entrar" ? "Entrar na Conta" : "Criar Conta"}
                    </h2>

                    <div className="login-form-fields">
                        {abaAtiva === "criar" && (
                            <InputText
                                identifier="input-default"
                                label="Nome completo" 
                                type="text"
                                placeholder="Digite seu nome completo"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                iconLeft={<RiUserAddFill />} 
                                required
                            />
                        )}

                        <InputText
                            identifier="input-default"
                            label="Email" 
                            type="email"
                            placeholder="seuemail@exemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            iconLeft={<RiMailLine />} 
                            required
                        />

                        <InputText 
                            identifier="input-default"
                            label="Senha de acesso"
                            labelAction={abaAtiva === "entrar" ? <a href="#recuperar-senha">Esqueci minha senha</a> : null}
                            type={mostrarSenha ? "text" : "password"}
                            placeholder="Digite sua senha"
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
                    </div>

                    <Button 
                        title={abaAtiva === "entrar" ? "Acessar Plataforma Huari" : "Cadastrar na Plataforma Huari"} 
                        identifier="btn-primary btn-radius-40 btn-submit" 
                        type="submit" 
                    />
                </form>
            </div>
        </div>
    );
}
