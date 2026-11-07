/**
 * Centralized Civic Academy Courses & Curricula Dataset
 * Fully localized in English for the Huari Civic Platform
 */

const RAW_COURSES = [
    {
        id: "intro-to-politics",
        title: "Introduction to the Brazilian Political System",
        description: "Learn how the separation of powers operates, federalism between states and Union, and the constitutional duties of representatives.",
        category: "Beginners",
        level: "Beginner",
        duration: "2h 15m",
        progress: 65,
        lessonsCount: 6,
        instructor: "Dr. Marcos Albuquerque (Political Scientist)",
        objectives: [
            "Understand the constitutional framework of the Federative Republic of Brazil.",
            "Identify the checks and balances among the Executive, Legislative, and Judiciary branches.",
            "Analyze the legal duties of federal deputies, senators, and mayors.",
            "Learn practical mechanisms to monitor and audit public officials.",
        ],
        modules: [
            {
                id: "mod-1",
                title: "Republican Structure & the Three Branches",
                lessons: [
                    {
                        id: "lesson-1",
                        title: "Separation of Powers in the 1988 Constitution",
                        duration: "18 min",
                        completed: true,
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        summary: "Examines how the Executive, Legislative, and Judiciary act under the system of checks and balances, safeguarding democratic institutions.",
                    },
                    {
                        id: "lesson-2",
                        title: "The Federal Pact: Union, States, and Municipalities",
                        duration: "22 min",
                        completed: true,
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        summary: "Understanding the division of tax, administrative, and legislative competencies across Brazilian federative entities.",
                    },
                    {
                        id: "lesson-3",
                        title: "Roles of Federal Deputies vs. Federal Senators",
                        duration: "25 min",
                        completed: false,
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        summary: "Core distinctions between population representation in the Chamber of Deputies and state equality representation in the Federal Senate.",
                    },
                ],
            },
            {
                id: "mod-2",
                title: "Oversight Mechanisms & Active Citizenship",
                lessons: [
                    {
                        id: "lesson-4",
                        title: "Courts of Accounts & External Oversight",
                        duration: "20 min",
                        completed: false,
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        summary: "How the Federal Court of Accounts (TCU) and state audit bodies scrutinize government bids, contracts, and financial statements.",
                    },
                    {
                        id: "lesson-5",
                        title: "Popular Legislative Initiatives & Referendums",
                        duration: "15 min",
                        completed: false,
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        summary: "Learn how citizens can draft bill proposals and vote in plebiscites under direct democracy guarantees.",
                    },
                    {
                        id: "lesson-6",
                        title: "Civic Participation Tools & Digital Town Halls",
                        duration: "35 min",
                        completed: false,
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        summary: "Navigating digital platforms, participatory budgeting portals, and official legislative channels.",
                    },
                ],
            },
        ],
    },
    {
        id: "public-budget-ceap",
        title: "Public Budget & Parliamentary Quotas (CEAP)",
        description: "Understand public revenue, budget laws (PPA, LDO, LOA), and learn how to audit receipts and expenses claimed by congressional offices.",
        category: "Economics",
        level: "Intermediate",
        duration: "3h 40m",
        progress: 25,
        lessonsCount: 8,
        instructor: "Clara Mendonça (Public Finance Auditor)",
        objectives: [
            "Deconstruct the Annual Budget Law (LOA) and multi-year planning (PPA).",
            "Audit Parliamentary Quota (CEAP) expenditures with open data receipt vouchers.",
            "Spot irregular patterns in travel, consultancy, and advertising spending.",
            "Leverage official transparency databases for independent civic auditing.",
        ],
        modules: [
            {
                id: "mod-1",
                title: "Federal Budget Cycle & Planning",
                lessons: [
                    {
                        id: "lesson-1",
                        title: "The Budget Triad: PPA, LDO, and LOA Explained",
                        duration: "24 min",
                        completed: true,
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        summary: "How governments forecast tax revenues and plan federal spending across multi-year cycles.",
                    },
                    {
                        id: "lesson-2",
                        title: "Parliamentary Amendments & Floor Allocation",
                        duration: "30 min",
                        completed: true,
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        summary: "Analysis of individual, bench, and committee amendments, and tracking their execution through SICONV.",
                    },
                ],
            },
            {
                id: "mod-2",
                title: "Deconstructing Parliamentary Quota (CEAP)",
                lessons: [
                    {
                        id: "lesson-3",
                        title: "Permitted vs. Prohibited Mandate Expenses",
                        duration: "28 min",
                        completed: false,
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        summary: "Legal limits governing flights, publicity, fuel, and consultancy reimbursements in the Chamber and Senate.",
                    },
                    {
                        id: "lesson-4",
                        title: "Hands-on Receipt Auditing via Open Data API",
                        duration: "38 min",
                        completed: false,
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        summary: "Step-by-step techniques to download raw receipt files, check CNPJs, and verify service delivery.",
                    },
                ],
            },
        ],
    },
    {
        id: "legislative-process",
        title: "The Legislative Process: How Bills Become Laws",
        description: "From initial introduction to presidential sanction or veto: demystify ordinary bills (PL), constitutional amendments (PEC), and provisional decrees (MPV).",
        category: "Law",
        level: "Advanced",
        duration: "4h 10m",
        progress: 0,
        lessonsCount: 10,
        instructor: "Prof. Arthur Vasconcelos (Constitutional Law)",
        objectives: [
            "Master the legislative journey from introduction to presidential promulgation.",
            "Understand committee review (CCJ, Sectoral) and plenary floor votes.",
            "Differentiate simple majorities, absolute majorities, and 3/5 supermajorities.",
            "Track committee hearings, amendments, and public consultations in real time.",
        ],
        modules: [
            {
                id: "mod-1",
                title: "Types of Legislative Propositions",
                lessons: [
                    {
                        id: "lesson-1",
                        title: "Bills (PL) vs. Complementary Bills (PLP)",
                        duration: "26 min",
                        completed: false,
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        summary: "Quorum differences, constitutional scopes, and standard processing steps.",
                    },
                    {
                        id: "lesson-2",
                        title: "Constitutional Amendments (PEC) & Supermajorities",
                        duration: "32 min",
                        completed: false,
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        summary: "Two-round voting rules in both houses, CCJ admissibility, and immutable clauses (cláusulas pétreas).",
                    },
                ],
            },
            {
                id: "mod-2",
                title: "Floor Voting, Vetoes & Sanction",
                lessons: [
                    {
                        id: "lesson-3",
                        title: "Roll-call Floor Voting & Party Whip Discipline",
                        duration: "28 min",
                        completed: false,
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        summary: "How party leaders orient votes, obstruction tactics, and voting registry interpretation.",
                    },
                    {
                        id: "lesson-4",
                        title: "Executive Veto Overrides in Joint Congress Sessions",
                        duration: "30 min",
                        completed: false,
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        summary: "The dynamic of presidential vetoes and how Chamber and Senate convene jointly to override or sustain them.",
                    },
                ],
            },
        ],
    },
    {
        id: "civic-auditing-foia",
        title: "Civic Auditing & the Freedom of Information Act",
        description: "A practical guide to filing FOIA requests (LAI), auditing municipal and federal procurement contracts, and monitoring the Official Gazette.",
        category: "Beginners",
        level: "Beginner",
        duration: "1h 50m",
        progress: 100,
        lessonsCount: 5,
        instructor: "Juliana Rocha (Investigative Civic Journalist)",
        objectives: [
            "Submit legally sound information requests under Brazilian Law 12,527/2011.",
            "Handle appeals when public agencies withhold non-classified documents.",
            "Read and interpret procurement notices, bids, and contract amendments.",
            "Use automated search alerts on municipal and federal Official Gazettes (DOU).",
        ],
        modules: [
            {
                id: "mod-1",
                title: "The Brazilian Access to Information Law (LAI)",
                lessons: [
                    {
                        id: "lesson-1",
                        title: "Principles of Active vs. Passive Transparency",
                        duration: "20 min",
                        completed: true,
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        summary: "What public bodies are legally mandated to publish online versus what citizens can request.",
                    },
                    {
                        id: "lesson-2",
                        title: "Drafting Effective FOIA Requests on Fala.BR",
                        duration: "25 min",
                        completed: true,
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        summary: "Best practices, legal citations, and framing queries to prevent generic agency refusals.",
                    },
                ],
            },
            {
                id: "mod-2",
                title: "Procurement & Contract Auditing",
                lessons: [
                    {
                        id: "lesson-3",
                        title: "Auditing Contracts on the National Public Bidding Portal",
                        duration: "22 min",
                        completed: true,
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        summary: "Analyzing bidding exemptions (dispensas), price surveys, and corporate beneficiary owners.",
                    },
                ],
            },
        ],
    },
    {
        id: "electoral-system",
        title: "Electoral Systems & Proportional Representation",
        description: "Understand electoral quotients, party seat distribution, surplus vote formulas, and campaign financing rules.",
        category: "Law",
        level: "Intermediate",
        duration: "2h 30m",
        progress: 0,
        lessonsCount: 6,
        instructor: "Prof. Henrique Guimarães (Electoral Law)",
        objectives: [
            "Calculate Electoral Quotient (QE) and Party Quotient (QP) with real numbers.",
            "Understand surplus seat allocation (regra das sobras) and electoral thresholds.",
            "Analyze public campaign financing (Fundo Eleitoral & Fundo Partidário).",
            "Differentiate majoritarian elections (Executive, Senate) from proportional races.",
        ],
        modules: [
            {
                id: "mod-1",
                title: "Proportional vs. Majoritarian Systems",
                lessons: [
                    {
                        id: "lesson-1",
                        title: "How Votes are Counted for Deputies and Councilors",
                        duration: "25 min",
                        completed: false,
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        summary: "Why a candidate with fewer votes can win over a candidate with more votes through party lists.",
                    },
                    {
                        id: "lesson-2",
                        title: "The Math of Quotas: QE, QP, and Highest Average",
                        duration: "30 min",
                        completed: false,
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        summary: "Step-by-step mathematical demonstration of seat distribution in parliamentary elections.",
                    },
                ],
            },
        ],
    },
    {
        id: "public-policy-evaluation",
        title: "Evaluating Public Policies with Empirical Evidence",
        description: "Explore social impact methodologies, cost-effectiveness analysis, and data-driven evaluation of government programs.",
        category: "Economics",
        level: "Advanced",
        duration: "3h 15m",
        progress: 0,
        lessonsCount: 7,
        instructor: "Dr. Beatriz Fontana (Public Policy Evaluator)",
        objectives: [
            "Apply counterfactual and quasi-experimental evaluation methodologies.",
            "Evaluate cost-effectiveness ratios across social welfare and education policies.",
            "Analyze federal microdata from IBGE, Inep, and DataSUS.",
            "Interpret official evaluation reports from Ipea and the Court of Accounts.",
        ],
        modules: [
            {
                id: "mod-1",
                title: "Foundations of Evidence-Based Policy",
                lessons: [
                    {
                        id: "lesson-1",
                        title: "Introduction to Social Program Impact Evaluation",
                        duration: "28 min",
                        completed: false,
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        summary: "Distinguishing correlation from causation when measuring public policy outcomes.",
                    },
                    {
                        id: "lesson-2",
                        title: "Data Sources & Indicators in Health and Education",
                        duration: "34 min",
                        completed: false,
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        summary: "Working with IDEB, SUS hospitalization indices, and federal open metrics.",
                    },
                ],
            },
        ],
    },
];

export const COURSE_CATEGORIES = ["All", "Beginners", "Economics", "Law"];

export function getCourseById(id) {
    return MOCK_COURSES.find((c) => c.id === id) || MOCK_COURSES[0];
}



export const MOCK_COURSES = RAW_COURSES.map((course) => {
    const computedCount = course.modules?.reduce(
        (acc, mod) => acc + (mod.lessons?.length || 0),
        0
    ) || 0;
    return {
        ...course,
        lessonsCount: computedCount > 0 ? computedCount : course.lessonsCount,
    };
});
