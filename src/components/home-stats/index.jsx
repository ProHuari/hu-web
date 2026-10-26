
import './style.css';
import Card from '../card';

import {
    RiTeamFill,
    RiMoneyDollarCircleLine,
    RiLineChartLine,
    RiFileList3Line,
} from 'react-icons/ri';

const stats = [
    {
        id: 1,
        title: 'Parlamentares Monitorados',
        value: '594',
        description: 'Deputados e senadores',
        icon: RiTeamFill,
    },
    {
        id: 2,
        title: 'Gastos Totais',
        value: 'R$ 29,2M',
        description: 'Cota parlamentar neste mês',
        icon: RiMoneyDollarCircleLine,
    },
    {
        id: 3,
        title: 'Presença Média',
        value: '88,4%',
        description: 'Presença nas votações',
        icon: RiLineChartLine,
    },
    {
        id: 4,
        title: 'Projetos de Lei',
        value: '1.240',
        description: 'Em tramitação prioritária',
        icon: RiFileList3Line,
    },
];

export default function HomeStats() {
    return (
        <section
            className="home-stats"
            aria-label="Indicadores da plataforma"
        >
            {stats.map((stat) => (
                <Card
                    key={stat.id}
                    title={stat.title}
                    value={stat.value}
                    description={stat.description}
                    icon={stat.icon}
                />
            ))}
        </section>
    );
}
