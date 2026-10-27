import './style.css';

import {
    RiGraduationCapFill,
    RiArrowRightLine,
} from 'react-icons/ri';

export default function EducationalBanner({ onAccessLessons }) {
    return (
        <section className="educational-banner">
            <div className="educational-banner-icon">
                <RiGraduationCapFill aria-hidden="true" />
            </div>

            <h2 className="text-h2-bold">
                Quer entender melhor como funciona a política?
            </h2>

            <p className="text-p-regular">
                Acesse nosso portal educativo com conteúdos didáticos,
                infográficos e trilhas sobre o sistema político brasileiro.
            </p>

            <button
                type="button"
                className="educational-banner-button"
                onClick={onAccessLessons}
            >
                Acessa Aulas
                <RiArrowRightLine aria-hidden="true" />
            </button>
        </section>
    );
}
