import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { RiPlayCircleFill, RiFilmLine } from 'react-icons/ri';
import './style.css';

/**
 * VideoPlayer - Átomo para renderização de player de vídeo com proporção fixa 16:9.
 * Suporta embed do YouTube, link de vídeo HTML5 (.mp4) ou placeholder interativo.
 *
 * @param {string} videoUrl - URL do vídeo ou embed
 * @param {string} title - Título da aula / vídeo
 * @param {string} thumbnail - Imagem de capa opcional
 * @param {boolean} autoPlay - Iniciar automaticamente
 */
export default function VideoPlayer({
    videoUrl,
    title = 'Vídeo da Aula',
    thumbnail,
    autoPlay = false,
}) {
    const [isPlaying, setIsPlaying] = useState(autoPlay);

    // Identifica se é um link do YouTube para gerar o iframe seguro
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11
            ? `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=1`
            : null;
    };

    const youtubeEmbed = getYouTubeEmbedUrl(videoUrl);

    return (
        <div className="huari-video-player-container" aria-label={title}>
            <div className="huari-video-aspect-ratio">
                {isPlaying && youtubeEmbed ? (
                    <iframe
                        className="huari-video-frame"
                        src={youtubeEmbed}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : isPlaying && videoUrl && !youtubeEmbed ? (
                    <video
                        className="huari-video-element"
                        src={videoUrl}
                        controls
                        autoPlay
                    >
                        Seu navegador não suporta a tag de vídeo.
                    </video>
                ) : (
                    <div
                        className="huari-video-placeholder"
                        style={thumbnail ? { backgroundImage: `url(${thumbnail})` } : {}}
                    >
                        <div className="huari-video-overlay" />
                        <button
                            type="button"
                            className="huari-play-btn"
                            onClick={() => setIsPlaying(true)}
                            aria-label={`Assistir aula: ${title}`}
                        >
                            <RiPlayCircleFill size={68} />
                        </button>
                        <div className="huari-video-meta">
                            <span className="huari-video-badge">
                                <RiFilmLine size={14} />
                                Aula Huari
                            </span>
                            <h3 className="huari-video-title">{title}</h3>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

VideoPlayer.propTypes = {
    videoUrl: PropTypes.string,
    title: PropTypes.string,
    thumbnail: PropTypes.string,
    autoPlay: PropTypes.bool,
};
