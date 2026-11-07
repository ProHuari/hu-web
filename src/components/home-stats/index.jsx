import { useState, useEffect } from 'react';
import Card from '../card';
import { lawmakersService } from '../../services/lawmakersService';
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
    const [stats, setStats] = useState(CONGRESSIONAL_STATS);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        lawmakersService.getCongressionalStats()
            .then((data) => {
                if (isMounted && Array.isArray(data) && data.length > 0) {
                    setStats(data);
                }
            })
            .catch((err) => {
                console.error('Failed to fetch congressional stats from service', err);
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <section
            className={`home-stats ${isLoading ? 'home-stats-loading' : ''}`}
            aria-label="Platform Civic Indicators"
        >
            {stats.map((stat) => {
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
