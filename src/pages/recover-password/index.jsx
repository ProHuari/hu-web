import { useState } from "react";
import "./style.css";

import WebsiteInformation from "../../components/web-site-information";
import InputText from "../../components/input-text";
import Button from "../../components/button";

import imageBackground from "../../assets/images/HuariEducationLibrary3.jpg";

import {
    RiMailLine,
    RiArrowRightLine,
} from "react-icons/ri";

export default function RecoverPassword({ 
    onNavigateToLogin,
    onNavigateToCreateNewPassword }) {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // A lógica de envio do e-mail 
    };

    return (
        <div className="recover-password-container">
            <div className="recover-password-left">
                <WebsiteInformation
                    backgroundImage={imageBackground}
                />
            </div>

            <div className="recover-password-right">
                <div className="recover-password-content">

                    <header className="recover-password-header">
                        <h2 className="text-h2-bold">
                            Recuperar Senha
                        </h2>

                        <p className="text-p-regular">
                            Insira o e-mail cadastrado. Enviaremos um
                            link com as instruções para criar uma nova senha.
                        </p>
                    </header>

                    <form
                        className="recover-password-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="recover-password-fields">
                            <InputText
                                identifier="input-default"
                                label="E-mail"
                                type="email"
                                placeholder="seuemail@exemplo.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                iconLeft={<RiMailLine />}
                                required
                            />
                        </div>

                        <Button
                            title={
                                <>
                                    Enviar
                                    <RiArrowRightLine size={20} />
                                </>
                            }
                            identifier="btn-primary btn-radius-40 recover-password-submit"
                            onClick={onNavigateToCreateNewPassword}
                            type="submit"
                        />
                    </form>

                    <div className="recover-password-divider">
                        <span></span>
                        <p>OU</p>
                        <span></span>
                    </div>

                    <p className="recover-password-back text-p-small-regular">
                        Voltar para{" "}
                        <button
                            type="button"
                            className="recover-password-link"
                            onClick={onNavigateToLogin}
                        >
                            Login
                        </button>
                    </p>

                    <footer className="recover-password-footer">
                        <a href="#privacidade">Privacidade</a>
                        <a href="#termos">Termos de Uso</a>
                        <a href="#metodologia">Metodologia Aberta</a>
                    </footer>

                </div>
            </div>
        </div>
    );
}
