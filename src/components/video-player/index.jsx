import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { RiPlayCircleFill, RiFilmLine } from 'react-icons/ri';
import './style.css';

/**
 * VideoPlayer - Responsive 16:9 video player supporting YouTube embeds and HTML5 video.
 */
export default function VideoPlayer({
    videoUrl,
    title = 'Lesson Video',
    thumbnail,
    autoPlay = false,
}) {
    const [isPlaying, setIsPlaying] = useState(autoPlay);

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
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
                        Your browser does not support HTML5 video playback.
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
                            aria-label={`Watch lesson: ${title}`}
                        >
                            <RiPlayCircleFill size={68} />
                        </button>
                        <div className="huari-video-meta">
                            <span className="huari-video-badge">
                                <RiFilmLine size={14} />
                                Huari Civic Academy
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
