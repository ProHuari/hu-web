import "./style.css";

export default function LessonHeader({
    title,
    description,
    backgroundImage,
}) {
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