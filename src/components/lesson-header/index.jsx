import React from "react";
import PropTypes from "prop-types";
import { RiArrowLeftLine } from "react-icons/ri";
import Button from "../Button";
import "./style.css";

/**
 * LessonHeader - Componente de cabeçalho temático para a página de detalhes da aula.
 */
export default function LessonHeader({
    title,
    description,
    level,
    category = "TRILHA FUNDAMENTAL",
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
                        {category}
                    </span>

                    <span className="lesson-header-tag text-p-small-regular">
                        Nível {formattedLevel}
                    </span>

                    <span className="lesson-header-tag text-p-small-regular">
                        100% Gratuito &amp; Aberto
                    </span>
                </div>

                {onNavigateToLearn && (
                    <Button
                        title="Voltar ao Catálogo"
                        icon={<RiArrowLeftLine />}
                        iconPosition="left"
                        identifier="lesson-header-back"
                        onClick={onNavigateToLearn}
                    />
                )}
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

LessonHeader.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    level: PropTypes.string,
    category: PropTypes.string,
    backgroundImage: PropTypes.string,
    onNavigateToLearn: PropTypes.func,
};
