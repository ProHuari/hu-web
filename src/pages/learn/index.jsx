
import { useState } from 'react';

import SideBar from '../../components/sidebar';
import Button from '../../components/button';
import InputText from '../../components/input-text';
import Footer from '../../components/footer';

import {
    RiTimeLine,
    RiBookmarkLine,
    RiCheckLine,
    RiArrowRightLine,
} from 'react-icons/ri';

import './style.css';

const lessonCategories = [
    'Todos',
    'O Básico',
    'Seu Voto',
    'Seu Dinheiro',
    'Seus Direitos',
];

const lessons = [
    {
        id: 1,
        category: 'O Básico',
        duration: '3 H',
        level: 'INICIANTE',
        title: 'O que faz um vereador de verdade?',
        topics: [
            'Diferença real entre legislar e fiscalizar a prefeitura',
            'O que o vereador pode e o que não pode fazer no seu bairro',
            'Como identificar se um Projeto de Lei traz benefícios reais para a cidade',
            'Como acompanhar os gastos de gabinete, presença e votações na Câmara',
        ],
        image: '/images/learn/politica-brasileira.jpg',
    },
    {
        id: 2,
        category: 'Seu Voto',
        duration: '1H 10MIN',
        level: 'INTERMEDIÁRIO',
        title: 'O Poder do Seu Voto',
        description:
            'Descubra como suas escolhas nas urnas influenciam as decisões e os rumos do país.',
        image: '/images/learn/poder-do-voto.jpg',
    },
    {
        id: 3,
        category: 'Seu Dinheiro',
        duration: '50 MIN',
        level: 'INICIANTE',
        title: 'Para Onde Vai o Dinheiro Público?',
        description:
            'Aprenda como os recursos públicos são arrecadados, distribuídos e utilizados.',
        image: '/images/learn/dinheiro-publico.jpg',
    },
    {
        id: 4,
        category: 'Seus Direitos',
        duration: '1H',
        level: 'INICIANTE',
        title: 'Conheça Seus Direitos',
        description:
            'Entenda seus direitos fundamentais e saiba como buscar informações e serviços públicos.',
        image: '/images/learn/seus-direitos.jpg',
    },
    {
        id: 5,
        category: 'O Básico',
        duration: '1H 10MIN',
        level: 'INTERMEDIÁRIO',
        title: 'Os Três Poderes',
        description:
            'Entenda as funções do Executivo, Legislativo e Judiciário e como eles se relacionam.',
        image: '/images/learn/tres-poderes.jpg',
    },
    {
        id: 6,
        category: 'Seu Voto',
        duration: '35 MIN',
        level: 'INICIANTE',
        title: 'Como Acompanhar um Parlamentar',
        description:
            'Aprenda a acompanhar votações, projetos de lei e a atuação dos representantes eleitos.',
        image: '/images/learn/acompanhar-parlamentar.jpg',
    },
];

export default function Learn({
    onNavigateToHome,
    onViewLesson,
}) {
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');

    const handleNavigate = (label) => {
        if (label === 'Home') {
            onNavigateToHome?.();
        }
    };

    const filteredLessons = lessons.filter((lesson) => {
        const matchesCategory =
            activeCategory === 'Todos' ||
            lesson.category === activeCategory;

        const searchableContent = [
            lesson.title,
            lesson.description,
            ...(lesson.topics ?? []),
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

        const matchesSearch = searchableContent.includes(
            searchTerm.trim().toLowerCase()
        );

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="learn-layout">
            <SideBar
                activeItem="Learn"
                onNavigate={handleNavigate}
            />

            <main className="learn-content">
                <section className="learn-hero">
                    <div className="learn-hero-content">
                        <span className="learn-eyebrow">
                            HUARI EDUCAÇÃO CÍVICA
                        </span>

                        <h1 className="text-h1-bold">
                            Catálogo de Aulas &amp; Trilhas Práticas
                        </h1>

                        <p className="text-p-regular">
                            Aprenda sobre política, cidadania e transparência.
                            Explore conteúdos práticos para entender melhor o
                            funcionamento do poder público.
                        </p>

                        <div className="learn-search">
                            <InputText
                                identifier="input-search"
                                type="text"
                                placeholder="Buscar aulas..."
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                            />

                            <Button
                                title="Filtrar Aulas"
                                identifier="btn-primary btn-radius-10"
                                onClick={() => {}}
                            />
                        </div>
                    </div>
                </section>

                <section className="learn-catalog">
                    <div className="learn-catalog-heading">
                        <div>
                            <h2 className="text-h2-bold">
                                Explore as Aulas
                            </h2>

                            <p className="text-p-regular">
                                Encontre conteúdos para aprender no seu ritmo.
                            </p>
                        </div>

                        <span className="learn-results-count">
                            {filteredLessons.length}{' '}
                            {filteredLessons.length === 1 ? 'aula' : 'aulas'}
                        </span>
                    </div>

                    <div className="learn-categories">
                        {lessonCategories.map((category) => (
                            <Button
                                key={category}
                                title={category}
                                identifier={
                                    activeCategory === category
                                        ? 'btn-active'
                                        : 'btn-secondary'
                                }
                                active={activeCategory === category}
                                onClick={() => setActiveCategory(category)}
                            />
                        ))}
                    </div>

                    <div className="learn-lessons-grid">
                        {filteredLessons.map((lesson) => (
                            <article
                                className="learn-card"
                                key={lesson.id}
                            >
                                <div className="learn-card-image-wrapper">
                                    <img
                                        className="learn-card-image"
                                        src={lesson.image}
                                        alt=""
                                    />

                                    <div className="learn-card-badges">
                                        <span className="learn-card-duration">
                                            <RiTimeLine aria-hidden="true" />
                                            {lesson.duration}
                                        </span>

                                        <span className="learn-card-level">
                                            {lesson.level}
                                        </span>

                                        <button
                                            type="button"
                                            className="learn-card-bookmark"
                                            aria-label={`Salvar aula: ${lesson.title}`}
                                            onClick={() =>
                                                console.log(
                                                    `Aula salva: ${lesson.title}`
                                                )
                                            }
                                        >
                                            <RiBookmarkLine aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>

                                <div className="learn-card-content">
                                    <h3 className="text-h3-bold">
                                        {lesson.title}
                                    </h3>

                                    <ul className="learn-card-topics">
                                        {(lesson.topics ?? [
                                            lesson.description,
                                        ])
                                            .filter(Boolean)
                                            .map((topic, index) => (
                                                <li key={index}>
                                                    <span className="learn-topic-check">
                                                        <RiCheckLine aria-hidden="true" />
                                                    </span>

                                                    <span>{topic}</span>
                                                </li>
                                            ))}
                                    </ul>

                                    <Button
                                        title="Entrar na Aula"
                                        icon={<RiArrowRightLine />}
                                        identifier="btn-primary btn-radius-10"
                                        onClick={() => onViewLesson?.(lesson)}
                                    />
                                </div>
                            </article>
                        ))}
                    </div>

                    {filteredLessons.length === 0 && (
                        <p className="learn-empty-state text-p-regular">
                            Nenhuma aula encontrada. Tente outra busca ou categoria.
                        </p>
                    )}
                </section>

                <Footer />
            </main>
        </div>
    );
}
