
import './style.css';
import ParliamentarianCard from '../parliamentarian-card';

const parliamentarians = [
    {
        id: 1,
        name: 'Parlamentar',
        position: 'Deputado Federal',
        party: 'PL',
        state: 'SP',
        attendance: '00',
        projects: '00',
        expenses: '00',
    },
    {
        id: 2,
        name: 'Parlamentar',
        position: 'Deputado Federal',
        party: 'PL',
        state: 'SP',
        attendance: '00',
        projects: '00',
        expenses: '00',
    },
    {
        id: 3,
        name: 'Parlamentar',
        position: 'Deputado Federal',
        party: 'PL',
        state: 'SP',
        attendance: '00',
        projects: '00',
        expenses: '00',
    },
    {
        id: 4,
        name: 'Parlamentar',
        position: 'Deputado Federal',
        party: 'PL',
        state: 'SP',
        attendance: '00',
        projects: '00',
        expenses: '00',
    },
];

export default function ParliamentariansGrid() {
    const handleView = (name) => {
        console.log(`Visualizar parlamentar: ${name}`);
    };

    return (
        <section
            className="parliamentarians-grid"
            aria-label="Lista de parlamentares"
        >
            {parliamentarians.map((parliamentarian) => (
                <ParliamentarianCard
                    key={parliamentarian.id}
                    {...parliamentarian}
                    onView={() => handleView(parliamentarian.name)}
                />
            ))}
        </section>
    );
}
