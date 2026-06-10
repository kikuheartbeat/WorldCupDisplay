import useStore from '../store/useStore';
import GoalPopup from './GoalPopup';

function LiveMatchPill({ match }) {
  return (
    <div className="flex items-center justify-center gap-3 w-full h-full px-5">
      <div className="flex items-center gap-2 flex-1 justify-end">
        <span className="text-lg">{match.homeFlag}</span>
        <span className="text-white font-semibold text-sm truncate max-w-[80px] text-right">
          {match.homeName}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-white text-2xl font-bold tabular-nums tracking-wider">
          {match.homeScore}
        </span>
        <span className="text-white/40 text-lg">-</span>
        <span className="text-white text-2xl font-bold tabular-nums tracking-wider">
          {match.awayScore}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-1">
        <span className="text-white font-semibold text-sm truncate max-w-[80px] text-left">
          {match.awayName}
        </span>
        <span className="text-lg">{match.awayFlag}</span>
      </div>

      <div className="shrink-0 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-red-400 text-xs font-medium tabular-nums">{match.minute}&apos;</span>
      </div>
    </div>
  );
}

function UpcomingPill({ match }) {
  return (
    <div className="flex items-center justify-center gap-3 w-full h-full px-5">
      <div className="flex items-center gap-2 flex-1 justify-end">
        <span className="text-lg">{match.homeFlag}</span>
        <span className="text-white font-semibold text-sm truncate max-w-[80px] text-right">
          {match.homeName}
        </span>
      </div>

      <div className="flex flex-col items-center shrink-0">
        <span className="text-white/50 text-xs">VS</span>
        <span className="text-white/60 text-xs">{match.kickoffTime}</span>
      </div>

      <div className="flex items-center gap-2 flex-1">
        <span className="text-white font-semibold text-sm truncate max-w-[80px] text-left">
          {match.awayName}
        </span>
        <span className="text-lg">{match.awayFlag}</span>
      </div>
    </div>
  );
}

function NoLivePill() {
  return (
    <div className="flex items-center justify-center w-full h-full px-5">
      <span className="text-white/40 text-sm">No live matches</span>
    </div>
  );
}

export default function DynamicIsland({ onExpand }) {
  const matches = useStore((s) => s.matches);
  const loading = useStore((s) => s.loading);
  const currentMatchIndex = useStore((s) => s.currentMatchIndex);
  const goalEvents = useStore((s) => s.goalEvents);
  const dismissGoalEvent = useStore((s) => s.dismissGoalEvent);

  const liveMatches = matches.filter((m) => m.status === 'live');
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming');

  const activeLiveMatch = liveMatches.length > 0
    ? liveMatches[currentMatchIndex % liveMatches.length]
    : null;
  const nextUpcoming = upcomingMatches.length > 0 ? upcomingMatches[0] : null;

  const content = loading && matches.length === 0
    ? 'loading'
    : activeLiveMatch
    ? 'live'
    : nextUpcoming
    ? 'upcoming'
    : 'none';

  return (
    <div className="relative">
      <div
        className="glass rounded-full h-12 overflow-hidden cursor-pointer
                   border border-white/10 shadow-lg shadow-black/30
                   hover:border-white/20 transition-colors duration-300"
        style={{ width: 360 }}
        onClick={onExpand}
        title="Click to expand"
      >
        {content === 'loading' && (
          <div className="flex items-center justify-center w-full h-full px-5">
            <span className="text-white/30 text-sm animate-pulse">Loading...</span>
          </div>
        )}
        {content === 'live' && <LiveMatchPill match={activeLiveMatch} />}
        {content === 'upcoming' && <UpcomingPill match={nextUpcoming} />}
        {content === 'none' && <NoLivePill />}
      </div>

      {goalEvents.map((event, i) => (
        <GoalPopup
          key={`${event.matchId}-${event.minute}-${event.scorer}`}
          event={event}
          index={i}
          onDismiss={() => dismissGoalEvent(i)}
        />
      ))}
    </div>
  );
}
