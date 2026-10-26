
import './style.css';

import {
    RiArrowRightLine,
    RiSearchLine,
    RiMessage2Line,
} from 'react-icons/ri';

export default function HomeHeader({
    onViewParliamentarians,
    onExploreLearn,
    onOpenChat,
}) {
    return (
        <header className="home-header">
            <div className="home-header-content">
                <h1 className="text-h1-bold">
                    Political transparency at your
                    <br className="home-header-title-break" />
                    fingertips
                </h1>

                <p className="text-p-regular home-header-description">
                    Track public data on lawmakers, learn about politics,
                    and chat with Huari, your political analysis assistant.
                </p>

                <div className="home-header-actions">
                    <button
                        type="button"
                        className="home-header-button home-header-button-light"
                        onClick={onViewParliamentarians}
                    >
                        <span>View Parliamentarians</span>
                        <RiArrowRightLine aria-hidden="true" />
                    </button>

                    <button
                        type="button"
                        className="home-header-button home-header-button-light"
                        onClick={onExploreLearn}
                    >
                        <span>Explore Learn</span>
                        <RiSearchLine aria-hidden="true" />
                    </button>

                    <button
                        type="button"
                        className="home-header-button home-header-button-accent"
                        onClick={onOpenChat}
                    >
                        <span>Speak with Huari</span>
                        <RiMessage2Line aria-hidden="true" />
                    </button>
                </div>
            </div>
        </header>
    );
}
