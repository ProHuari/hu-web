import "./style.css";

import SideBar from "../../components/sidebar";
import LessonHeader from "../../components/lesson-header";

export default function LessonDetails({
    lesson,
    onNavigateToLearn,
}) {
    return (
        <main className="lesson-details-layout">
            <SideBar activeItem="Learn" />

            <section className="lesson-details-content">
                <LessonHeader
                    title={lesson?.title}
                    description={lesson?.description}
                />

                <div className="lesson-details-actions">
                    <button onClick={onNavigateToLearn}>
                        Voltar ao Catálogo
                    </button>
                </div>
            </section>
        </main>
    );
}