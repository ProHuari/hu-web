
import { useState } from 'react';
import {
    RiSearchLine,
    RiBookmarkLine,
    RiArrowRightLine,
    RiArrowDownSLine,
} from 'react-icons/ri';

import SideBar from '../../components/sidebar';
import Footer from '../../components/footer';
import InputText from '../../components/input-text';
import Button from '../../components/button';

import './style.css';

const parliamentarians = [
    {
        id: 1,
        name: 'Tabata Amaral',
        position: 'Deputada Federal',
        party: 'PSB',
        state: 'SP',
        attendance: 96,
        bills: 42,
        monthlySpend: 'R$ 31,8 mil',
    },
    {
        id: 2,
        name: 'Randolfe Rodrigues',
        position: 'Senador',
        party: 'PT',
        state: 'AP',
        attendance: 94,
        bills: 38,
        monthlySpend: 'R$ 27,4 mil',
    },
    {
        id: 3,
        name: 'Alessandro Vieira',
        position: 'Senador',
        party: 'MDB',
        state: 'SE',
        attendance: 91,
        bills: 31,
        monthlySpend: 'R$ 29,1 mil',
    },
    {
        id: 4,
        name: 'Erika Hilton',
        position: 'Deputada Federal',
        party: 'PSOL',
        state: 'SP',
        attendance: 97,
        bills: 29,
        monthlySpend: 'R$ 25,6 mil',
    },
];

export default function Parliamentarians({
    onNavigateToHome,
    onViewParliamentarian,
}) {
    const [search, setSearch] = useState('');

    const filteredParliamentarians = parliamentarians.filter(
        (parliamentarian) => {
            const searchableText = [
                parliamentarian.name,
                parliamentarian.position,
                parliamentarian.party,
                parliamentarian.state,
            ]
                .join(' ')
                .toLowerCase();

            return searchableText.includes(search.toLowerCase());
        }
    );

    const handleNavigate = (label) => {
        if (label === 'Home') {
            onNavigateToHome?.();
        }
    };

    return (
        <div className="parliamentarians-layout">
            <SideBar
                activeItem="Lawmakers"
                onNavigate={handleNavigate}
            />

            <main className="parliamentarians-content">
                <header className="parliamentarians-header">
                    <div>
                        <p className="parliamentarians-breadcrumb">
                            <button
                                type="button"
                                onClick={onNavigateToHome}
                            >
                                Home
                            </button>
                            <span>/</span>
                            <span>Lawmakers</span>
                        </p>

                        <h1>Parliamentarians</h1>

                        <p className="parliamentarians-description">
                            Explore public profiles, compare legislative
                            activity and monitor the representatives
                            who matter to you.
                        </p>
                    </div>

                    <Button
                        title="Saved · 12"
                        icon={<RiBookmarkLine />}
                        identifier="btn-saved-parliamentarians"
                        type="button"
                    />
                </header>

                <section
                    className="parliamentarians-filters"
                    aria-label="Search and filters"
                >
                    <div className="parliamentarians-search">
                        <InputText
                            type="search"
                            placeholder="Search by name, party, state or office"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            iconLeft={<RiSearchLine />}
                            identifier="input-search-parliamentarians"
                            aria-label="Search parliamentarians"
                        />

                        <label
                            className="sort-label"
                            htmlFor="parliamentarians-sort"
                        >
                            Sort:
                        </label>

                        <select
                            id="parliamentarians-sort"
                            defaultValue="relevant"
                        >
                            <option value="relevant">Most relevant</option>
                            <option value="attendance">Attendance</option>
                            <option value="bills">Bills</option>
                        </select>
                    </div>

                    <div className="parliamentarians-filter-options">
                        {[
                            'All lawmakers',
                            'Office',
                            'Party',
                            'State',
                            'Attendance',
                        ].map((filter, index) => (
                            <Button
                                key={filter}
                                title={filter}
                                icon={<RiArrowDownSLine />}
                                identifier={
                                    index === 0
                                        ? 'btn-filter-active'
                                        : 'btn-filter'
                                }
                                type="button"
                            />
                        ))}

                        <Button
                            title="Clear filters"
                            identifier="btn-clear-filters"
                            type="button"
                            onClick={() => setSearch('')}
                        />
                    </div>
                </section>

                <div className="parliamentarians-results-heading">
                    <strong>
                        {search
                            ? `${filteredParliamentarians.length} results`
                            : '594 parliamentarians'}
                    </strong>

                    <span>Updated September 20, 2026</span>
                </div>

                <section
                    className="parliamentarians-list"
                    aria-label="Parliamentarians"
                >
                    {filteredParliamentarians.map((parliamentarian) => (
                        <article
                            className="parliamentarian-row"
                            key={parliamentarian.id}
                        >
                            <div className="parliamentarian-identity">
                                <div
                                    className="parliamentarian-avatar"
                                    aria-hidden="true"
                                >
                                    {parliamentarian.name.charAt(0)}
                                </div>

                                <div className="parliamentarian-details">
                                    <h2>{parliamentarian.name}</h2>
                                    <p>{parliamentarian.position}</p>

                                    <span className="parliamentarian-party">
                                        {parliamentarian.party} ·{' '}
                                        {parliamentarian.state}
                                    </span>
                                </div>
                            </div>

                            <div className="parliamentarian-metric">
                                <span>ATTENDANCE</span>
                                <strong className="attendance-value">
                                    {parliamentarian.attendance}%
                                </strong>
                            </div>

                            <div className="parliamentarian-metric">
                                <span>BILLS</span>
                                <strong>{parliamentarian.bills}</strong>
                            </div>

                            <div className="parliamentarian-metric">
                                <span>MONTHLY SPEND</span>
                                <strong>{parliamentarian.monthlySpend}</strong>
                            </div>

                            <div className="parliamentarian-actions">
                                <Button
                                    title=""
                                    icon={<RiBookmarkLine />}
                                    identifier="btn-bookmark-parliamentarian"
                                    type="button"
                                    aria-label={`Save ${parliamentarian.name}`}
                                />

                                <Button
                                    title="View profile"
                                    icon={<RiArrowRightLine />}
                                    identifier="btn-view-parliamentarian"
                                    type="button"
                                    onClick={() =>
                                        onViewParliamentarian?.(
                                            parliamentarian
                                        )
                                    }
                                />
                            </div>
                        </article>
                    ))}

                    {filteredParliamentarians.length === 0 && (
                        <p className="parliamentarians-empty">
                            No parliamentarians found.
                        </p>
                    )}
                </section>

                <nav
                    className="parliamentarians-pagination"
                    aria-label="Pagination"
                >
                    <Button
                        title="Previous"
                        identifier="btn-pagination"
                        type="button"
                        disabled
                    />
                    <Button
                        title="1"
                        identifier="btn-pagination-active"
                        type="button"
                    />
                    <Button title="2" identifier="btn-pagination" type="button" />
                    <Button title="3" identifier="btn-pagination" type="button" />
                    <span>...</span>
                    <Button title="60" identifier="btn-pagination" type="button" />
                    <Button
                        title="Next"
                        identifier="btn-pagination-next"
                        type="button"
                    />
                </nav>

                <Footer />
            </main>
        </div>
    );
}
