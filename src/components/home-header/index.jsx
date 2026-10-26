
import './style.css';
import Button from '../button';

import {
    RiArrowRightLine,
    RiSearchLine,
    RiMessage3Line
} from 'react-icons/ri';

export default function HomeHeader({
    onNavigateToLawmakers,
    onNavigateToLearn,
    onNavigateToChat
}) {
    return (
        <header className="home-header">
            <div className="home-header-content">
                <h1 className="text-h1-bold">
                    Political transparency at your
                    <br />
                    fingertips
                </h1>

                <p className="text-p-regular home-header-description">
                    Track public data on lawmakers, learn about politics, and chat with
                    Huari, your political analysis assistant.
                </p>

                <nav
                    className="home-header-actions"
                    aria-label="Main actions"
                >
                    <Button
                        title="View Parliamentarians"
                        icon={<RiArrowRightLine />}
                        identifier="btn-radius-10 home-header-button home-header-button-light"
                        onClick={onNavigateToLawmakers}
                        type="button"
                    />

                    <Button
                        title="Exploit Learn"
                        icon={<RiSearchLine />}
                        identifier="btn-radius-10 home-header-button home-header-button-light"
                        onClick={onNavigateToLearn}
                        type="button"
                    />

                    <Button
                        title="Speak with Huari"
                        icon={<RiMessage3Line />}
                        identifier="btn-radius-10 home-header-button home-header-button-accent"
                        onClick={onNavigateToChat}
                        type="button"
                    />
                </nav>
            </div>
        </header>
    );
}
