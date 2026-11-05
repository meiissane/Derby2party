export const BRAND_INFO = {
  name: 'DERBY2PARTY',
  experienceTitle: 'DERBY2PARTY VIP EXPERIENCE',
  headline: 'WELCOME TO YOUR VIP EXPERIENCE.',
  subtitle: 'Your culture. Your game. Your access.',
  edition: 'Culture Drop 001',
  utility: 'Exclusive VIP access',
  defaultSerial: 'D2P-CD001-0842',
  defaultMemberName: 'VIP Founder #0842',
};

export const MEMBERSHIP_BENEFITS = [
  {
    id: 'experiences',
    title: 'Exclusive Experiences',
    tag: 'LIVE ACCESS',
    description:
      'Priority entry to Derby2Party matchday watch parties, stadium hospitality suites, Afro-football cultural pop-ups, and private afterparties across flagship cities.',
    highlights: ['VIP Watch Party Table Access', 'Private Cultural Pop-Ups', 'Guestlist Priority'],
    icon: 'sparkles',
  },
  {
    id: 'prediction-club',
    title: 'Prediction Club Access',
    tag: 'COMPETE & WIN',
    description:
      'Full entry into the official Derby2Party Prediction Club. Call the scores on marquee African & global derbies every matchweek to climb the official VIP table.',
    highlights: ['3 Pts Exact Score System', 'Live VIP Leaderboard', 'Weekly Derby Fixtures'],
    icon: 'trophy',
  },
  {
    id: 'vip-community',
    title: 'VIP Community',
    tag: 'INNER CIRCLE',
    description:
      'Connect with an international collective of football creatives, jersey collectors, DJs, athletes, and culture shapers uniting African football heritage and nightlife.',
    highlights: ['Private Member Lounge', 'Culture Drop Voting Rights', 'City Chapter Meetups'],
    icon: 'users',
  },
  {
    id: 'rewards',
    title: 'Rewards & Drops',
    tag: 'MEMBER PERKS',
    description:
      'Redeem your Prediction Club points and VIP status for limited-edition Derby2Party jerseys, Culture Drop 001 physical collectibles, and backstage passes.',
    highlights: ['Limited Jersey Drops', 'Event Drink & Merch Tokens', 'Season Champion Trophy Box'],
    icon: 'gift',
  },
];

export const INITIAL_MATCHES = [
  {
    id: 'match-1',
    competition: 'AFCON CONTINENTAL SHOWDOWN',
    stage: 'Matchday 1 • Featured Derby',
    date: 'SAT • 20:00 GMT',
    venue: 'Stade Abdoulaye Wade, Dakar',
    homeTeam: {
      name: 'Senegal',
      code: 'SEN',
      nickname: 'Lions of Teranga',
      flag: '🇸🇳',
      colors: ['#00853F', '#FDEF42'],
    },
    awayTeam: {
      name: 'Morocco',
      code: 'MAR',
      nickname: 'Atlas Lions',
      flag: '🇲🇦',
      colors: ['#C1272D', '#006233'],
    },
    // Official / Simulated result used when results are revealed
    officialResult: { home: 2, away: 1 },
    status: 'OPEN',
    spotlight: true,
  },
  {
    id: 'match-2',
    competition: 'WEST AFRICAN SUPER DERBY',
    stage: 'Matchday 1 • Heavyweight Clash',
    date: 'SAT • 22:00 GMT',
    venue: 'Stade Alassane Ouattara, Abidjan',
    homeTeam: {
      name: 'Nigeria',
      code: 'NGA',
      nickname: 'Super Eagles',
      flag: '🇳🇬',
      colors: ['#008751', '#FFFFFF'],
    },
    awayTeam: {
      name: "Côte d'Ivoire",
      code: 'CIV',
      nickname: 'The Elephants',
      flag: '🇨🇮',
      colors: ['#F77F00', '#009E60'],
    },
    officialResult: { home: 2, away: 2 },
    status: 'OPEN',
    spotlight: true,
  },
  {
    id: 'match-3',
    competition: 'CAF CHAMPIONS DERBY',
    stage: 'Continental Club Classic',
    date: 'SUN • 19:00 GMT',
    venue: 'Cairo International Stadium',
    homeTeam: {
      name: 'Al Ahly SC',
      code: 'AHL',
      nickname: 'Club of the Century',
      flag: '🇪🇬',
      colors: ['#E30613', '#D4AF37'],
    },
    awayTeam: {
      name: 'Wydad AC',
      code: 'WAC',
      nickname: 'Red Castle',
      flag: '🇲🇦',
      colors: ['#D90429', '#FFFFFF'],
    },
    officialResult: { home: 1, away: 0 },
    status: 'OPEN',
    spotlight: false,
  },
  {
    id: 'match-4',
    competition: 'AFCON LEGENDS FIXTURE',
    stage: 'Matchday 1 • North vs Central',
    date: 'SUN • 21:00 GMT',
    venue: 'Stade d’Olembé, Yaoundé',
    homeTeam: {
      name: 'Egypt',
      code: 'EGY',
      nickname: 'The Pharaohs',
      flag: '🇪🇬',
      colors: ['#CE1126', '#D4AF37'],
    },
    awayTeam: {
      name: 'Cameroon',
      code: 'CMR',
      nickname: 'Indomitable Lions',
      flag: '🇨🇲',
      colors: ['#007A5E', '#FCD116'],
    },
    officialResult: { home: 1, away: 2 },
    status: 'OPEN',
    spotlight: false,
  },
  {
    id: 'match-5',
    competition: 'CULTURE DROP EXHIBITION',
    stage: 'Matchday 2 • Gold Coast Clash',
    date: 'TUE • 19:30 GMT',
    venue: 'Baba Yara Stadium, Kumasi',
    homeTeam: {
      name: 'Ghana',
      code: 'GHA',
      nickname: 'Black Stars',
      flag: '🇬🇭',
      colors: ['#FCD116', '#006B3F'],
    },
    awayTeam: {
      name: 'South Africa',
      code: 'RSA',
      nickname: 'Bafana Bafana',
      flag: '🇿🇦',
      colors: ['#007749', '#FFB81C'],
    },
    officialResult: { home: 3, away: 1 },
    status: 'OPEN',
    spotlight: false,
  },
  {
    id: 'match-6',
    competition: 'SOWETO DERBY SPECIAL',
    stage: 'Matchday 2 • Johannesburg',
    date: 'WED • 18:00 GMT',
    venue: 'FNB Stadium, Johannesburg',
    homeTeam: {
      name: 'Orlando Pirates',
      code: 'PIR',
      nickname: 'The Buccaneers',
      flag: '🇿🇦',
      colors: ['#111111', '#E63946'],
    },
    awayTeam: {
      name: 'Kaizer Chiefs',
      code: 'KZC',
      nickname: 'Amakhosi',
      flag: '🇿🇦',
      colors: ['#F4A261', '#000000'],
    },
    officialResult: { home: 1, away: 1 },
    status: 'OPEN',
    spotlight: false,
  },
];

// Default demo predictions so the user immediately sees how predictions & scoring work,
// while being able to modify any match or add more predictions!
export const DEFAULT_DEMO_PREDICTIONS = {
  'match-1': {
    home: 2,
    away: 1,
    submittedAt: 'Today, 18:45',
  },
  'match-2': {
    home: 1,
    away: 1,
    submittedAt: 'Today, 18:47',
  },
  'match-3': {
    home: 2,
    away: 0,
    submittedAt: 'Today, 18:50',
  },
};

export const SAMPLE_LEADERBOARD_MEMBERS = [
  {
    id: 'member-1',
    name: 'Kofi Mensah',
    city: 'Accra, GH 🇬🇭',
    passId: 'D2P-001-0104',
    edition: 'Culture Drop 001',
    points: 14,
    exactScores: 4,
    correctOutcomes: 2,
    predictionsCount: 6,
    avatarBg: 'from-amber-500 to-yellow-700',
  },
  {
    id: 'member-2',
    name: 'Amara Diallo',
    city: 'Dakar, SN 🇸🇳',
    passId: 'D2P-001-0219',
    edition: 'Culture Drop 001',
    points: 11,
    exactScores: 3,
    correctOutcomes: 2,
    predictionsCount: 6,
    avatarBg: 'from-emerald-500 to-green-800',
  },
  {
    id: 'member-3',
    name: 'Tariq El-Masri',
    city: 'Casablanca, MA 🇲🇦',
    passId: 'D2P-001-0388',
    edition: 'Culture Drop 001',
    points: 9,
    exactScores: 2,
    correctOutcomes: 3,
    predictionsCount: 6,
    avatarBg: 'from-yellow-500 to-amber-800',
  },
  {
    id: 'member-4',
    name: 'Chidi Okafor',
    city: 'Lagos, NG 🇳🇬',
    passId: 'D2P-001-0512',
    edition: 'Culture Drop 001',
    points: 6,
    exactScores: 1,
    correctOutcomes: 3,
    predictionsCount: 5,
    avatarBg: 'from-teal-500 to-emerald-900',
  },
  {
    id: 'member-5',
    name: 'Zainab Touré',
    city: 'Abidjan, CI 🇨🇮',
    passId: 'D2P-001-0677',
    edition: 'Culture Drop 001',
    points: 4,
    exactScores: 1,
    correctOutcomes: 1,
    predictionsCount: 5,
    avatarBg: 'from-orange-500 to-amber-800',
  },
  {
    id: 'member-6',
    name: 'Youssef Benali',
    city: 'Cairo, EG 🇪🇬',
    passId: 'D2P-001-0901',
    edition: 'Culture Drop 001',
    points: 2,
    exactScores: 0,
    correctOutcomes: 2,
    predictionsCount: 4,
    avatarBg: 'from-emerald-600 to-slate-800',
  },
];

export const REWARDS_CATALOG = [
  {
    id: 'reward-1',
    title: 'Culture Drop 001 Digital Crest & Priority RSVP',
    tier: 'TIER 01 • STARTER VIP',
    pointsRequired: 3,
    category: 'VIP ACCESS',
    description:
      'Unlock guaranteed priority RSVP for the next Derby2Party Watch Party + verified Culture Drop 001 Prediction Club badge on your pass.',
    perks: ['Instant Priority Event RSVP', 'Verified Predictor Pass Badge'],
  },
  {
    id: 'reward-2',
    title: 'VIP Lounge Wristband & Matchday Hospitality Token',
    tier: 'TIER 02 • CLUB INSIDER',
    pointsRequired: 6,
    category: 'EVENT HOSPITALITY',
    description:
      'Skip the line at any Derby2Party venue with fast-track VIP table access and 2 complimentary signature pitchside drinks.',
    perks: ['Fast-Track VIP Entry', '2x Complimentary Bar Tokens', 'DJ Booth Side Access'],
  },
  {
    id: 'reward-3',
    title: 'Official Derby2Party Collector Jersey (Culture Drop 001)',
    tier: 'TIER 03 • ELITE PREDICTOR',
    pointsRequired: 12,
    category: 'PHYSICAL MERCH',
    description:
      'Claim the official Derby2Party limited-edition jersey featuring embedded QR VIP authentication and bespoke African woven trim.',
    perks: ['Numbered Culture Drop Jersey', 'Embedded QR VIP Tag', 'Worldwide Express Shipping'],
  },
  {
    id: 'reward-4',
    title: 'Golden Ticket: Continental Finale All-Access VIP Box',
    tier: 'TIER 04 • SEASON CHAMPION',
    pointsRequired: 16,
    category: 'GRAND PRIZE',
    description:
      'Reserved for top leaderboard finishers: private hospitality box for you + 3 guests at the Derby2Party Finale Night plus the Gold VIP Card.',
    perks: ['VIP Box for 4 Guests', 'Physical Brushed-Gold Pass', 'Meet & Greet with Special Guests'],
  },
];

export function calculatePredictionPoints(predHome, predAway, actualHome, actualAway) {
  if (
    predHome === undefined ||
    predAway === undefined ||
    actualHome === undefined ||
    actualAway === undefined ||
    predHome === null ||
    predAway === null
  ) {
    return { points: 0, label: 'PENDING', type: 'pending' };
  }
  const ph = Number(predHome);
  const pa = Number(predAway);
  const ah = Number(actualHome);
  const aa = Number(actualAway);

  if (ph === ah && pa === aa) {
    return { points: 3, label: 'EXACT SCORE (+3 PTS)', type: 'exact' };
  }

  const predOutcome = ph > pa ? 'H' : ph < pa ? 'A' : 'D';
  const actualOutcome = ah > aa ? 'H' : ah < aa ? 'A' : 'D';

  if (predOutcome === actualOutcome) {
    return { points: 1, label: 'CORRECT OUTCOME (+1 PT)', type: 'outcome' };
  }

  return { points: 0, label: 'INCORRECT (0 PTS)', type: 'miss' };
}
