import axios from 'axios';

const API_TOKEN = import.meta.env.VITE_FOOTBALL_DATA_TOKEN || '';
const BASE_URL = 'https://api.football-data.org/v4';

const TEAM_FLAGS = {
  ARG: '🇦🇷', BRA: '🇧🇷', FRA: '🇫🇷', GER: '🇩🇪', ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  ESP: '🇪🇸', POR: '🇵🇹', NED: '🇳🇱', ITA: '🇮🇹', USA: '🇺🇸',
  MEX: '🇲🇽', CAN: '🇨🇦', JPN: '🇯🇵', KOR: '🇰🇷', MAR: '🇲🇦',
  SEN: '🇸🇳', URU: '🇺🇾', URY: '🇺🇾', COL: '🇨🇴', CRO: '🇭🇷',
  BEL: '🇧🇪', DEN: '🇩🇰', SUI: '🇨🇭', AUS: '🇦🇺', KSA: '🇸🇦',
  RSA: '🇿🇦', CZE: '🇨🇿', BIH: '🇧🇦', PAR: '🇵🇾', QAT: '🇶🇦',
  HAI: '🇭🇹', SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', TUR: '🇹🇷', CUW: '🇨🇼', CIV: '🇨🇮',
  ECU: '🇪🇨', SWE: '🇸🇪', TUN: '🇹🇳', CPV: '🇨🇻', EGY: '🇪🇬',
  IRN: '🇮🇷', NZL: '🇳🇿', IRQ: '🇮🇶', NOR: '🇳🇴', ALG: '🇩🇿',
  AUT: '🇦🇹', JOR: '🇯🇴', COD: '🇨🇩', GHA: '🇬🇭', PAN: '🇵🇦',
  UZB: '🇺🇿',
};

let rateLimitInfo = { available: null, resetSeconds: null };

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'X-Auth-Token': API_TOKEN },
});

client.interceptors.response.use((response) => {
  rateLimitInfo = {
    available: parseInt(response.headers['x-requests-available-minute'], 10),
    resetSeconds: parseInt(response.headers['x-requestcounter-reset'], 10),
  };
  return response;
}, (error) => {
  if (error.response?.status === 429) {
    console.warn('Rate limited by Football-Data.org, backing off...');
  }
  return Promise.reject(error);
});

function mapStatus(apiStatus) {
  switch (apiStatus) {
    case 'IN_PLAY':
    case 'PAUSED':
      return 'live';
    case 'FINISHED':
      return 'finished';
    default:
      return 'upcoming';
  }
}

function formatKickoffTime(utcDate) {
  const d = new Date(utcDate);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function mapMatch(apiMatch) {
  const homeTLA = apiMatch.homeTeam.tla;
  const awayTLA = apiMatch.awayTeam.tla;
  const status = mapStatus(apiMatch.status);

  return {
    id: String(apiMatch.id),
    homeTeam: homeTLA,
    awayTeam: awayTLA,
    homeName: apiMatch.homeTeam.shortName || apiMatch.homeTeam.name,
    awayName: apiMatch.awayTeam.shortName || apiMatch.awayTeam.name,
    homeFlag: TEAM_FLAGS[homeTLA] || '🌐',
    awayFlag: TEAM_FLAGS[awayTLA] || '🌐',
    kickoffTime: formatKickoffTime(apiMatch.utcDate),
    status,
    homeScore: apiMatch.score?.fullTime?.home ?? null,
    awayScore: apiMatch.score?.fullTime?.away ?? null,
    minute: status === 'live' ? (apiMatch.minute ?? null) : null,
    scorers: (apiMatch.goals || []).map((g) => ({
      team: g.team?.tla || (g.team?.id === apiMatch.homeTeam.id ? homeTLA : awayTLA),
      player: g.scorer?.name || 'Unknown',
      minute: g.minute,
      assist: g.assist?.name || null,
    })),
  };
}

function todayStr() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

export async function getMatches() {
  const from = todayStr();
  const to = daysFromNow(7);

  const { data } = await client.get('/competitions/WC/matches', {
    params: { dateFrom: from, dateTo: to },
  });

  return data.matches.map(mapMatch);
}

export function getGoalEvents() {
  return [];
}

export function getRateLimitInfo() {
  return { ...rateLimitInfo };
}
