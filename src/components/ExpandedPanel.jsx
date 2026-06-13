import { useState, useMemo } from 'react';
import useStore from '../store/useStore';
import MatchCard from './MatchCard';

function formatDate() {
  const d = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

function localDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function todayStr() {
  return localDateStr(new Date());
}

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return localDateStr(d);
}

const STAGE_ORDER = [
  'GROUP_STAGE',
  'ROUND_OF_32',
  'ROUND_OF_16',
  'QUARTER_FINALS',
  'QUARTER_FINAL',
  'SEMI_FINALS',
  'SEMI_FINAL',
  'THIRD_PLACE',
  'FINAL',
];

const STAGE_LABEL = {
  GROUP_STAGE: 'Group Stage',
  ROUND_OF_32: 'Round of 32',
  ROUND_OF_16: 'Round of 16',
  QUARTER_FINALS: 'Quarter-finals',
  QUARTER_FINAL: 'Quarter-finals',
  SEMI_FINALS: 'Semi-finals',
  SEMI_FINAL: 'Semi-finals',
  THIRD_PLACE: 'Third Place',
  FINAL: 'Final',
};

const KNOCKOUT_STAGES = [
  'ROUND_OF_32', 'ROUND_OF_16', 'QUARTER_FINALS', 'QUARTER_FINAL',
  'SEMI_FINALS', 'SEMI_FINAL', 'THIRD_PLACE', 'FINAL',
];

function getActiveKnockoutStage(matches) {
  const knockoutMatches = matches.filter((m) => KNOCKOUT_STAGES.includes(m.stage));
  if (knockoutMatches.length === 0) return null;

  const live = knockoutMatches.find((m) => m.status === 'live');
  if (live) return live.stage;

  const upcomingStages = [...new Set(
    knockoutMatches.filter((m) => m.status === 'upcoming').map((m) => m.stage)
  )];
  for (const stage of STAGE_ORDER) {
    if (upcomingStages.includes(stage)) return stage;
  }

  const finishedStages = [...new Set(
    knockoutMatches.filter((m) => m.status === 'finished').map((m) => m.stage)
  )];
  const reversed = [...STAGE_ORDER].reverse();
  for (const stage of reversed) {
    if (finishedStages.includes(stage)) return stage;
  }

  return null;
}

function MatchesSection({ label, labelColor, count, children }) {
  if (!children) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className={`${labelColor || 'text-white/30'} text-xs font-semibold uppercase tracking-wider`}>
          {label}
        </span>
        {count != null && (
          <span className="text-white/20 text-xs">{count} match{count !== 1 ? 'es' : ''}</span>
        )}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export default function ExpandedPanel({ onCollapse }) {
  const matches = useStore((s) => s.matches);
  const loading = useStore((s) => s.loading);
  const error = useStore((s) => s.error);
  const [viewMode, setViewMode] = useState('filtered');

  const filteredMatches = useMemo(() => {
    const today = todayStr();
    const day2 = daysFromNow(2);

    // Group stage is "active" if there are live/upcoming group matches,
    // OR there are finished group matches today while no knockout is active yet
    const groupLiveUpcoming = matches.some(
      (m) => m.stage === 'GROUP_STAGE' && (m.status === 'live' || m.status === 'upcoming')
    );
    const groupFinishedToday = matches.some(
      (m) => m.stage === 'GROUP_STAGE' && m.status === 'finished' && m.date === today
    );
    const knockoutLiveUpcoming = matches.some(
      (m) => KNOCKOUT_STAGES.includes(m.stage) && (m.status === 'live' || m.status === 'upcoming')
    );

    // Stay in group stage mode as long as knockout hasn't started
    if ((groupLiveUpcoming || groupFinishedToday) && !knockoutLiveUpcoming) {
      const result = matches.filter((m) => {
        if (m.status === 'live') return true;
        if (m.status === 'finished') return m.date === today;
        if (m.status === 'upcoming') return m.date >= today && m.date <= day2;
        return false;
      });
      console.log('[ExpandedPanel] groupStage today=%s day2=%s groupLive/Up=%s groupFinToday=%s koActive=%s',
        today, day2, groupLiveUpcoming, groupFinishedToday, knockoutLiveUpcoming);
      console.table(
        matches.map((m) => ({
          id: m.id,
          home: m.homeTeam,
          away: m.awayTeam,
          status: m.status,
          stage: m.stage,
          date: m.date,
          shown: result.includes(m),
        }))
      );
      return result;
    }

    // Knockout stage is active
    if (knockoutLiveUpcoming) {
      const activeKnockout = getActiveKnockoutStage(matches);
      console.log('[ExpandedPanel] knockoutActive=%s', activeKnockout);
      if (activeKnockout) {
        return matches.filter(
          (m) => m.stage === activeKnockout || m.status === 'live'
        );
      }
    }

    // Fallback: show all matches
    console.log('[ExpandedPanel] fallback: showing all %d matches', matches.length);
    return matches;
  }, [matches]);

  const liveMatches = filteredMatches.filter((m) => m.status === 'live');
  const finishedMatches = filteredMatches.filter((m) => m.status === 'finished');
  const upcomingMatches = filteredMatches.filter((m) => m.status === 'upcoming');

  const categorizedMatches = useMemo(() => {
    const cats = [];

    for (const stage of STAGE_ORDER) {
      const stageMatches = matches.filter((m) => m.stage === stage);
      if (stageMatches.length === 0) continue;

      if (stage === 'GROUP_STAGE') {
        const groups = {};
        stageMatches.forEach((m) => {
          const g = m.group || 'Unknown Group';
          if (!groups[g]) groups[g] = [];
          groups[g].push(m);
        });
        const sortedGroups = Object.keys(groups).sort();
        sortedGroups.forEach((g) => {
          cats.push({ key: g, label: g, matches: groups[g] });
        });
      } else {
        const label = STAGE_LABEL[stage] || stage;
        cats.push({ key: stage, label, matches: stageMatches });
      }
    }
    return cats;
  }, [matches]);

  const groupLiveUpcoming = matches.some(
    (m) => m.stage === 'GROUP_STAGE' && (m.status === 'live' || m.status === 'upcoming')
  );
  const groupFinishedToday = matches.some(
    (m) => m.stage === 'GROUP_STAGE' && m.status === 'finished' && m.date === todayStr()
  );
  const knockoutLiveUpcoming = matches.some(
    (m) => KNOCKOUT_STAGES.includes(m.stage) && (m.status === 'live' || m.status === 'upcoming')
  );
  const isGroupStage = (groupLiveUpcoming || groupFinishedToday) && !knockoutLiveUpcoming;
  const activeKnockout = isGroupStage ? null : getActiveKnockoutStage(matches);
  const viewTitle = isGroupStage
    ? 'Group Stage'
    : activeKnockout
      ? (STAGE_LABEL[activeKnockout] || activeKnockout)
      : 'All Matches';

  return (
    <div
      className="glass rounded-3xl border border-white/10 shadow-xl shadow-black/40
                 overflow-hidden flex flex-col animate-fade-in"
      style={{ width: 360, maxHeight: 520 }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5 border-b border-white/5
                     cursor-pointer shrink-0 hover:bg-white/[0.02] transition-colors"
        onClick={onCollapse}
      >
        <div>
          <h2 className="text-white font-semibold text-sm">World Cup 2026</h2>
          <p className="text-white/40 text-xs mt-0.5">
            {viewMode === 'filtered' ? viewTitle : 'All Matches'} · {formatDate()}
          </p>
        </div>
        <button className="text-white/40 hover:text-white/70 transition-colors text-lg leading-none">
          &#x2715;
        </button>
      </div>

      {/* Toggle button */}
      <div className="px-3 pt-2 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setViewMode((v) => (v === 'filtered' ? 'all' : 'filtered'));
          }}
          className="w-full py-2 rounded-xl text-xs font-medium transition-all
                     border border-white/10 hover:border-white/20 text-white/50 hover:text-white/70"
        >
          {viewMode === 'filtered' ? 'View All Matches' : 'Back to Current'}
        </button>
      </div>

      <div className="overflow-y-auto flex-1 p-3 space-y-2.5">
        {/* Loading */}
        {loading && matches.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <span className="text-white/30 text-sm animate-pulse">Loading matches...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center justify-center py-6">
            <span className="text-red-400/70 text-xs">Failed to load matches</span>
          </div>
        )}

        {/* Filtered view */}
        {viewMode === 'filtered' && (
          <>
            {liveMatches.length > 0 && (
              <MatchesSection label="Live" labelColor="text-red-400" count={liveMatches.length}>
                {liveMatches.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </MatchesSection>
            )}

            {finishedMatches.length > 0 && (
              <MatchesSection label="Finished" count={finishedMatches.length}>
                {finishedMatches.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </MatchesSection>
            )}

            {upcomingMatches.length > 0 && (
              <MatchesSection label="Upcoming" count={upcomingMatches.length}>
                {upcomingMatches.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </MatchesSection>
            )}

            {!loading && !error && filteredMatches.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <span className="text-white/30 text-sm">No matches in this window</span>
              </div>
            )}
          </>
        )}

        {/* All matches view */}
        {viewMode === 'all' && (
          <>
            {categorizedMatches.map((cat) => (
              <MatchesSection key={cat.key} label={cat.label} count={cat.matches.length}>
                {cat.matches.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </MatchesSection>
            ))}
            {!loading && !error && categorizedMatches.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <span className="text-white/30 text-sm">No matches available</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
