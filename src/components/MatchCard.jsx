function StatusBadge({ status, minute }) {
  if (status === 'live') {
    return (
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-red-400 text-xs font-medium">{minute}&apos;</span>
      </div>
    );
  }
  if (status === 'finished') {
    return <span className="text-white/40 text-xs font-medium">FT</span>;
  }
  return <span className="text-white/30 text-xs">{minute}</span>;
}

function ScoreDisplay({ status, homeScore, awayScore }) {
  if (status === 'upcoming') {
    return <span className="text-white/30 text-sm font-medium">VS</span>;
  }
  return (
    <div className="flex items-center gap-2">
      <span className="text-white text-xl font-bold tabular-nums">{homeScore}</span>
      <span className="text-white/30 text-sm">-</span>
      <span className="text-white text-xl font-bold tabular-nums">{awayScore}</span>
    </div>
  );
}

export default function MatchCard({ match }) {
  const { homeName, awayName, homeFlag, awayFlag, homeScore, awayScore, status, minute, kickoffTime, scorers } = match;

  return (
    <div className="glass-card rounded-xl p-3 border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 flex-1 justify-end">
          <span className="text-white font-medium text-sm text-right leading-tight">{homeName}</span>
          <span className="text-xl">{homeFlag}</span>
        </div>

        <div className="flex flex-col items-center mx-3 shrink-0 min-w-[60px]">
          <ScoreDisplay status={status} homeScore={homeScore} awayScore={awayScore} />
          <StatusBadge status={status} minute={status === 'upcoming' ? kickoffTime : minute} />
        </div>

        <div className="flex items-center gap-2.5 flex-1">
          <span className="text-xl">{awayFlag}</span>
          <span className="text-white font-medium text-sm text-left leading-tight">{awayName}</span>
        </div>
      </div>

      {scorers && scorers.length > 0 && (
        <div className="mt-2 pt-2 border-t border-white/5">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {scorers.map((s, i) => (
              <span key={i} className="text-white/50 text-xs">
                <span className="text-white/70">{s.player}</span>
                <span className="text-white/30 ml-1">{s.minute}&apos;</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
