import "./style.css";

import Button from "../button";

import { RiArrowLeftLine } from "react-icons/ri";

export default function LessonHeader({
    title,
    description,
    level,
    backgroundImage,
    onNavigateToLearn,
}) {
    const formattedLevel = level
        ? level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()
        : "Iniciante";

    return (
        <header
            className="lesson-header"
            style={
                backgroundImage
                    ? {
                          backgroundImage: `linear-gradient(
                              rgba(0, 0, 0, 0.55),
                              rgba(0, 0, 0, 0.55)
                          ), url(${backgroundImage})`,
                      }
                    : {}
            }
        >
            <div className="lesson-header-top">
                <div className="lesson-header-tags">
                    <span className="lesson-header-tag lesson-header-tag-primary text-p-small-regular">
                        TRILHA FUNDAMENTAL
                    </span>

                    <span className="lesson-header-tag text-p-small-regular">
                        Nível {formattedLevel}
                    </span>

                    <span className="lesson-header-tag text-p-small-regular">
                        100% Gratuito &amp; Aberto
                    </span>
                </div>

                <Button
                    title="Voltar ao Catálogo"
                    icon={<RiArrowLeftLine />}
                    iconPosition="left"
                    identifier="lesson-header-back"
                    onClick={onNavigateToLearn}
                />
            </div>

            <div className="lesson-header-content">
                <span className="lesson-header-eyebrow text-p-small-regular">
                    PODER LEGISLATIVO MUNICIPAL MANDATO &amp; FISCALIZAÇÃO
                </span>

                <h1 className="text-h1-bold">
                    {title || "Título da aula"}
                </h1>

                <p className="text-p-regular">
                    {description ||
                        "Conheça o conteúdo desta aula e aprenda mais sobre o tema."}
                </p>
            </div>
        </header>
    );
}