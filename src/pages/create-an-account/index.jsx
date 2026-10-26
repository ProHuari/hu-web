import React from "react";
import WebsiteInformation from "../../components/web-site-information";

import imageBackground from "../../assets/images/HuariEducationLibrary2.jpg"
import InputText from "../../components/input-text";

export default function CreateAnAccout(){
    return(
        <div className="login-container">
                    
                    <div className="container-left">
                        <WebsiteInformation backgroundImage={imageBackground} />
                    </div>

                    <div className="container-right">

                        <h2 className="text-h2-bord">Bem -Vindo!</h2>
                        <p className="text-p-regular">Por favor, insira seus dados para criar sua conta.</p>

                        <form>

                            <InputText
                                label="E-mail"/>
                                
                        </form>

                    </div>
                  
                </div>
    );
}