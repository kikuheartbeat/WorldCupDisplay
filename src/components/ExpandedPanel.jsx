import useStore from '../store/useStore';
import MatchCard from './MatchCard';

function formatDate() {
  const d = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

export default function ExpandedPanel({ onCollapse }) {
  const matches = useStore((s) => s.matches);
  const loading = useStore((s) => s.loading);
  const error = useStore((s) => s.error);

  const liveMatches = matches.filter((m) => m.status === 'live');
  const finishedMatches = matches.filter((m) => m.status === 'finished');
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming');

  return (
    <div
      className="glass rounded-3xl border border-white/10 shadow-xl shadow-black/40
                 overflow-hidden flex flex-col animate-fade-in"
      style={{ width: 360, maxHeight: 520 }}
    >
      <div
        className="flex items-center justify-between px-5 py-3.5 border-b border-white/5
                     cursor-pointer shrink-0 hover:bg-white/[0.02] transition-colors"
        onClick={onCollapse}
      >
        <div>
          <h2 className="text-white font-semibold text-sm">World Cup 2026</h2>
          <p className="text-white/40 text-xs mt-0.5">{formatDate()}</p>
        </div>
        <button className="text-white/40 hover:text-white/70 transition-colors text-lg leading-none">
          &#x2715;
        </button>
      </div>

      <div className="overflow-y-auto flex-1 p-3 space-y-2.5">
        {loading && matches.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <span className="text-white/30 text-sm animate-pulse">Loading matches...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-6">
            <span className="text-red-400/70 text-xs">Failed to load matches</span>
          </div>
        )}

        {liveMatches.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 text-xs font-semibold uppercase tracking-wider">Live</span>
              <span className="text-white/20 text-xs">{liveMatches.length} match{liveMatches.length > 1 ? 'es' : ''}</span>
            </div>
            <div className="space-y-2">
              {liveMatches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </div>
        )}

        {finishedMatches.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-white/30 text-xs font-semibold uppercase tracking-wider">Finished</span>
            </div>
            <div className="space-y-2">
              {finishedMatches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </div>
        )}

        {upcomingMatches.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-white/30 text-xs font-semibold uppercase tracking-wider">Upcoming</span>
            </div>
            <div className="space-y-2">
              {upcomingMatches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          </div>
        )}

        {!loading && !error && matches.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <span className="text-white/30 text-sm">No matches today</span>
          </div>
        )}
      </div>
    </div>
  );
}
