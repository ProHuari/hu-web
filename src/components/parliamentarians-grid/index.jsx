import PropTypes from 'prop-types';
import ParliamentarianCard from '../parliamentarian-card';
import { MOCK_LAWMAKERS } from '../../data/lawmakers';
import './style.css';

export default function ParliamentariansGrid({
    lawmakers,
    className = '',
}) {
    const list = lawmakers || MOCK_LAWMAKERS.slice(0, 4);

    return (
        <section
            className={`parliamentarians-grid ${className}`.trim()}
            aria-label="Featured Lawmakers Grid"
        >
            {list.map((lawmaker) => (
                <ParliamentarianCard
                    key={lawmaker.id}
                    lawmaker={lawmaker}
                />
            ))}
        </section>
    );
}

ParliamentariansGrid.propTypes = {
    lawmakers: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
};
