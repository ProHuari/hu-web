
import React from 'react';
import { useParams, NavLink } from 'react-router-dom';
import {
    RiArrowLeftLine,
    RiArrowRightLine,
    RiBookOpenLine,
    RiTimeLine,
    RiGraduationCapLine,
    RiPlayCircleLine,
    RiFileTextLine,
    RiQuestionnaireLine,
    RiCheckboxCircleLine,
    RiUserLine,
} from 'react-icons/ri';

import SideBar from '../../components/sidebar';
import Footer from '../../components/footer';
import './style.css';

const COURSE_DATA = {
    'introducao-politica': {
        title: 'Introdução ao Sistema Político Brasileiro',
        category: 'INICIANTES',
        level: 'BÁSICO',
        duration: '2h 15min',
        instructor: 'Dr. Marcos Albuquerque',
        description:
            'Aprenda como funciona a organização política brasileira, conheça a divisão dos Três Poderes e compreenda as responsabilidades dos representantes eleitos. Uma formação introdutória para desenvolver sua participação e consciência cidadã.',
        objectives: [
            'Compreender a organização política do Brasil.',
            'Identificar as funções dos Três Poderes.',
            'Conhecer as responsabilidades dos representantes políticos.',
            'Entender como acompanhar e fiscalizar a atuação pública.',
        ],
        modules: [
            {
                id: 'mod-1',
                title: 'Estrutura Republicana e os Três Poderes',
                lessons: [
                    {
                        id: 'aula-1',
                        title: 'A Divisão de Poderes na Constituição de 1988',
                        duration: '18 min',
                    },
                    {
                        id: 'aula-2',
                        title: 'O Pacto Federativo: União, Estados e Municípios',
                        duration: '22 min',
                    },
                    {
                        id: 'aula-3',
                        title: 'O Papel do Deputado Federal e do Senador',
                        duration: '25 min',
                    },
                ],
            },
            {
                id: 'mod-2',
                title: 'Mecanismos de Controle e Cidadania',
                lessons: [
                    {
                        id: 'aula-4',
                        title: 'Tribunais de Contas e Fiscalização Externa',
                        duration: '20 min',
                    },
                    {
                        id: 'aula-5',
                        title: 'Iniciativa Popular de Leis e Plebiscitos',
                        duration: '15 min',
                    },
                ],
            },
        ],
    },
};

const DEFAULT_COURSE = {
    title: 'Formação Cidadã',
    category: 'FORMAÇÃO',
    level: 'BÁSICO',
    duration: 'A definir',
    instructor: 'Equipe Huari',
    description:
        'Conheça os principais conceitos desta formação e desenvolva seus conhecimentos sobre cidadania e política brasileira.',
    objectives: [
        'Conhecer os principais conceitos do curso.',
        'Compreender os temas apresentados nas aulas.',
        'Desenvolver conhecimentos para o exercício da cidadania.',
    ],
    modules: [],
};

export default function LessonOverview() {
    const { courseId, lessonId } = useParams();

    const course = COURSE_DATA[courseId] || DEFAULT_COURSE;

    const lessons = course.modules.flatMap((module) =>
        module.lessons.map((lesson) => ({
            ...lesson,
            moduleTitle: module.title,
        }))
    );

    const activeLesson =
        lessons.find((lesson) => lesson.id === lessonId) || lessons[0];

    if (!activeLesson) {
        return (
            <div className="lesson-overview-layout">
                <div className="lesson-overview-sidebar">
                    <SideBar />
                </div>

                <main className="lesson-overview-main">
                    <div className="lesson-overview-container">
                        <h1>Conteúdo não encontrado</h1>
                        <p>Não foi possível localizar esta aula.</p>
                        <NavLink to="/learn" className="overview-back-link">
                            Voltar ao catálogo
                        </NavLink>
                    </div>
                    <Footer />
                </main>
            </div>
        );
    }

    const totalLessons = lessons.length;

    return (
        <div className="lesson-overview-layout">
            <div className="lesson-overview-sidebar">
                <SideBar />
            </div>

            <main className="lesson-overview-main">
                <div className="lesson-overview-container">

                    <NavLink to="/learn" className="overview-back-link">
                        <RiArrowLeftLine size={18} />
                        Voltar ao catálogo
                    </NavLink>

                    <section className="overview-hero">
                        <div className="overview-hero-content">
                            <div className="overview-badges">
                                <span>{course.category}</span>
                                <span>{course.level}</span>
                            </div>

                            <span className="overview-eyebrow">
                                ACADEMIA CÍVICA HUARI
                            </span>

                            <h1>{activeLesson.title}</h1>

                            <p className="overview-hero-description">
                                {course.description}
                            </p>

                            <div className="overview-hero-meta">
                                <span>
                                    <RiTimeLine size={17} />
                                    {activeLesson.duration}
                                </span>

                                <span>
                                    <RiBookOpenLine size={17} />
                                    {totalLessons} aulas na trilha
                                </span>

                                <span>
                                    <RiUserLine size={17} />
                                    {course.instructor}
                                </span>
                            </div>

                            <NavLink
                                to={`/learn/${courseId}/${activeLesson.id}`}
                                className="overview-start-button"
                            >
                                Acessar Aula Agora
                                <RiArrowRightLine size={19} />
                            </NavLink>
                        </div>

                        <div className="overview-hero-image">
                            <div className="overview-image-overlay" />
                            <div className="overview-image-icon">
                                <RiGraduationCapLine size={58} />
                            </div>
                        </div>
                    </section>

                    <section className="overview-section">
                        <div className="overview-section-heading">
                            <span className="overview-section-label">
                                SOBRE A AULA
                            </span>
                            <h2>O que você vai aprender?</h2>
                            <p>
                                Conheça os principais assuntos abordados
                                nesta formação.
                            </p>
                        </div>

                        <div className="overview-objectives-grid">
                            {course.objectives.map((objective, index) => (
                                <div
                                    className="overview-objective-card"
                                    key={index}
                                >
                                    <RiCheckboxCircleLine size={22} />
                                    <span>{objective}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="overview-section">
                        <div className="overview-section-heading">
                            <span className="overview-section-label">
                                METODOLOGIA
                            </span>
                            <h2>Como você vai aprender?</h2>
                            <p>
                                Diferentes formatos para facilitar sua
                                compreensão e aprendizado.
                            </p>
                        </div>

                        <div className="overview-formats-grid">
                            <article className="overview-format-card">
                                <div className="overview-format-icon">
                                    <RiPlayCircleLine size={25} />
                                </div>
                                <h3>Videoaulas</h3>
                                <p>
                                    Conteúdos explicativos apresentados
                                    em aulas gravadas.
                                </p>
                            </article>

                            <article className="overview-format-card">
                                <div className="overview-format-icon">
                                    <RiFileTextLine size={25} />
                                </div>
                                <h3>Materiais de apoio</h3>
                                <p>
                                    Informações complementares para
                                    aprofundar seus conhecimentos.
                                </p>
                            </article>

                            <article className="overview-format-card">
                                <div className="overview-format-icon">
                                    <RiQuestionnaireLine size={25} />
                                </div>
                                <h3>Atividades práticas</h3>
                                <p>
                                    Exercícios para revisar e fixar
                                    os conteúdos apresentados.
                                </p>
                            </article>
                        </div>
                    </section>

                    <section className="overview-section overview-curriculum">
                        <div className="overview-section-heading">
                            <span className="overview-section-label">
                                CONTEÚDO PROGRAMÁTICO
                            </span>
                            <h2>O que você vai estudar?</h2>
                            <p>
                                Confira a organização dos módulos e das
                                aulas desta trilha.
                            </p>
                        </div>

                        <div className="overview-modules-list">
                            {course.modules.map((module, index) => (
                                <article
                                    className="overview-module-card"
                                    key={module.id}
                                >
                                    <div className="overview-module-header">
                                        <div>
                                            <span>
                                                MÓDULO {index + 1}
                                            </span>
                                            <h3>{module.title}</h3>
                                        </div>

                                        <span className="overview-module-count">
                                            {module.lessons.length} aulas
                                        </span>
                                    </div>

                                    <div className="overview-module-lessons">
                                        {module.lessons.map((lesson) => (
                                            <div
                                                className={`overview-lesson-item ${
                                                    lesson.id === activeLesson.id
                                                        ? 'is-active'
                                                        : ''
                                                }`}
                                                key={lesson.id}
                                            >
                                                <RiPlayCircleLine size={19} />
                                                <span>{lesson.title}</span>
                                                <small>{lesson.duration}</small>
                                            </div>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="overview-bottom-cta">
                        <div>
                            <h2>Pronto para começar?</h2>
                            <p>
                                Acesse o conteúdo e continue sua jornada
                                de aprendizado com a Huari.
                            </p>
                        </div>

                        <NavLink
                            to={`/learn/${courseId}/${activeLesson.id}`}
                            className="overview-start-button"
                        >
                            Começar aula
                            <RiArrowRightLine size={19} />
                        </NavLink>
                    </section>
                </div>

                <Footer />
            </main>
        </div>
    );
}
