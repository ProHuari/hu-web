import Card from '../card';
import { CONGRESSIONAL_STATS } from '../../data/lawmakers';
import {
    RiTeamFill,
    RiMoneyDollarCircleLine,
    RiArrowRightUpLine,
    RiFileList3Line,
} from 'react-icons/ri';
import './style.css';

const STAT_ICONS = {
    'monitored-lawmakers': RiTeamFill,
    'total-expenses': RiMoneyDollarCircleLine,
    'average-attendance': RiArrowRightUpLine,
    'bills-proposed': RiFileList3Line,
    'priority-bills': RiFileList3Line,
};

export default function HomeStats() {
    return (
        <section
            className="home-stats"
            aria-label="Platform Civic Indicators"
        >
            {CONGRESSIONAL_STATS.map((stat) => {
                const IconComponent = STAT_ICONS[stat.id] || RiFileList3Line;
                return (
                    <Card
                        key={stat.id}
                        title={stat.title}
                        value={stat.value}
                        footer={stat.footer}
                        trend={stat.trend}
                        highlightColor={stat.highlightColor}
                        icon={IconComponent}
                    />
                );
            })}
        </section>
    );
}
