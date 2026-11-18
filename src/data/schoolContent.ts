export interface CoreValueItem {
  id: string;
  title: string;
  description: string;
  iconName:
    | 'Cross'
    | 'BookOpen'
    | 'ShieldCheck'
    | 'HeartHandshake'
    | 'Leaf'
    | 'Compass'
    | 'Award'
    | 'Smile'
    | 'Flag';
}

export const CORE_VALUES: CoreValueItem[] = [
  {
    id: 'faith',
    title: 'Faith in God',
    description: 'Anchoring daily study, gratitude, and service in a living relationship with God.',
    iconName: 'Cross',
  },
  {
    id: 'excellence',
    title: 'Academic excellence',
    description: 'Cultivating disciplined curiosity, critical inquiry, and thorough mastery across subjects.',
    iconName: 'BookOpen',
  },
  {
    id: 'character',
    title: 'Character formation',
    description: 'Shaping young women of honesty, self-restraint, humility, and steady moral courage.',
    iconName: 'ShieldCheck',
  },
  {
    id: 'social-concern',
    title: 'Social concern',
    description: 'Noticing the needs of neighbours and responding through active parish and community service.',
    iconName: 'HeartHandshake',
  },
  {
    id: 'eco-friendliness',
    title: 'Eco-friendliness',
    description: 'Caring for our Nairobi campus and environment through conservation and stewardship.',
    iconName: 'Leaf',
  },
  {
    id: 'leadership',
    title: 'Leadership',
    description: 'Preparing articulate, servant-hearted leaders ready to guide homes, churches, and society.',
    iconName: 'Compass',
  },
  {
    id: 'confidence',
    title: 'Self-confidence & responsibility',
    description: 'Encouraging each student to take ownership of her voice, choices, and gifts.',
    iconName: 'Award',
  },
  {
    id: 'emotional',
    title: 'Emotional development',
    description: 'Nurturing resilience, empathy, and healthy self-awareness through guided mentorship.',
    iconName: 'Smile',
  },
  {
    id: 'patriotism',
    title: 'Patriotism',
    description: 'Inspiring civic integrity, national unity, and dedication to the common good of Kenya.',
    iconName: 'Flag',
  },
];

export const CARMEL_FAMILY_SCHOOLS = [
  'Apostolic Carmel Primary, Buru Buru',
  'Carmelvale Catholic Primary, Buru Buru',
  'Mount Carmel Girls, Mombasa',
  'Apostolic Carmel Academy, Kisumu',
  'Carmel Convent Schools, East Africa & India',
];

export interface TermFeeRow {
  item: string;
  dayAmount: string;
  boardingAmount: string;
}

export const FEE_SCHEDULE_BY_TERM: Array<{
  termId: string;
  termTitle: string;
  dayTotal: string;
  boardingTotal: string;
  rows: TermFeeRow[];
}> = [
  {
    termId: 'term-1',
    termTitle: 'Term I Fee Structure (January – April)',
    dayTotal: 'Ksh 26,500',
    boardingTotal: 'Ksh 44,500',
    rows: [
      { item: 'Tuition & Academic Resources', dayAmount: 'Ksh 15,000', boardingAmount: 'Ksh 15,000' },
      { item: 'Boarding & Catering (Breakfast, Lunch, Supper)', dayAmount: 'Ksh 6,500 (Lunch)', boardingAmount: 'Ksh 22,500' },
      { item: 'Laboratory, Library & ICT Access', dayAmount: 'Ksh 2,500', boardingAmount: 'Ksh 2,500' },
      { item: 'Activity, Pastoral & Co-Curricular Levy', dayAmount: 'Ksh 1,500', boardingAmount: 'Ksh 2,000' },
      { item: 'Medical & Dormitory Care', dayAmount: 'Ksh 1,000', boardingAmount: 'Ksh 2,500' },
    ],
  },
  {
    termId: 'term-2',
    termTitle: 'Term II Fee Structure (May – August)',
    dayTotal: 'Ksh 24,500',
    boardingTotal: 'Ksh 42,000',
    rows: [
      { item: 'Tuition & Academic Resources', dayAmount: 'Ksh 14,500', boardingAmount: 'Ksh 14,500' },
      { item: 'Boarding & Catering', dayAmount: 'Ksh 6,500 (Lunch)', boardingAmount: 'Ksh 22,000' },
      { item: 'Laboratory, Library & ICT Access', dayAmount: 'Ksh 2,000', boardingAmount: 'Ksh 2,500' },
      { item: 'Activity & National Festival Levy', dayAmount: 'Ksh 1,500', boardingAmount: 'Ksh 2,000' },
      { item: 'Medical & Campus Maintenance', dayAmount: '—', boardingAmount: 'Ksh 1,000' },
    ],
  },
  {
    termId: 'term-3',
    termTitle: 'Term III Fee Structure (September – November)',
    dayTotal: 'Ksh 21,500',
    boardingTotal: 'Ksh 38,500',
    rows: [
      { item: 'Tuition & Academic Revision', dayAmount: 'Ksh 13,000', boardingAmount: 'Ksh 13,000' },
      { item: 'Boarding & Catering', dayAmount: 'Ksh 6,000 (Lunch)', boardingAmount: 'Ksh 21,000' },
      { item: 'Assessment & Practical Consumables', dayAmount: 'Ksh 1,500', boardingAmount: 'Ksh 2,500' },
      { item: 'Pastoral & Welfare Support', dayAmount: 'Ksh 1,000', boardingAmount: 'Ksh 2,000' },
    ],
  },
];

export const ADMISSIONS_FAQS = [
  {
    q: 'Are non-Catholic students welcome to apply?',
    a: 'Yes. While Apostolic Carmel is a Catholic convent school rooted in Christian values, we warmly welcome girls of all faiths who respect the school’s ethos and morning assembly traditions.',
  },
  {
    q: 'Can a student switch between Day and Boarding?',
    a: 'Yes, subject to dormitory bed availability. Parents may submit a written request to the Principal’s office at least one month before the start of a new term.',
  },
  {
    q: 'What does the Ksh 2,500 registration fee cover?',
    a: 'The one-time, non-refundable Ksh 2,500 fee covers application processing, placement assessment materials, and the scheduled parent-student admissions interview.',
  },
  {
    q: 'How are Grade 10 CBE pathways selected?',
    a: 'During interviews and orientation, teachers review each student’s Junior School assessment profile and personal interests to guide her placement into STEM, Social Sciences, or Arts & Sports Science.',
  },
  {
    q: 'When are school visits and interviews held?',
    a: 'Campus visits take place Monday to Friday from 8:30 AM to 3:30 PM, and on select Saturdays by prior appointment through the Admissions Office.',
  },
];

export const MAP_EMBED_URL =
  'https://www.openstreetmap.org/export/embed.html?bbox=36.8745%2C-1.2925%2C36.8905%2C-1.2795&layer=mapnik&marker=-1.2860%2C36.8825';
export const MAP_DIRECTIONS_URL =
  'https://www.google.com/maps/search/?api=1&query=Apostolic+Carmel+Girls+Secondary+School+Buru+Buru+Phase+5+Nairobi';
