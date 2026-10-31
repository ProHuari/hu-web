import "./style.css";

import SideBar from "../../components/sidebar";

export default function LessonDetails({
    lesson,
    onNavigateToLearn,
}) {
    return (
        <main className="lesson-details-layout">
            <SideBar activeItem="Learn" />

            <section className="lesson-details-content">
                <h1>Descrição da Aula</h1>

                <p>
                    {lesson?.title || "Título da aula"}
                </p>

                <button onClick={onNavigateToLearn}>
                    Voltar ao Catálogo
                </button>
            </section>
        </main>
    );
}