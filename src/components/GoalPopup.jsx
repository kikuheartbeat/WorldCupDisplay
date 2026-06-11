import { useEffect, useState } from 'react';

export default function GoalPopup({ event, index, onDismiss }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onDismiss, 500);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`absolute left-0 right-0 z-50 ${exiting ? 'animate-slide-up' : 'animate-slide-down'}`}
      style={{ top: index * 80 + 52 }}
    >
      <div className="glass-light rounded-2xl p-3 mx-1 border border-white/10 shadow-lg shadow-black/30">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xl">⚽</span>
          <span className="text-white font-bold text-sm">GOAL!</span>
          <span className="text-red-400 text-xs ml-auto">{event.minute}&apos;</span>
        </div>

        <div className="flex items-center gap-2 mb-1.5">
          {event.homeFlag ? (
            <img src={event.homeFlag} alt={event.homeName} className="w-5 h-3.5 object-cover rounded-sm" />
          ) : (
            <span className="text-base">🌐</span>
          )}
          <span className="text-white/70 text-xs">{event.homeName}</span>
          <span className="text-white font-bold text-lg ml-auto tabular-nums">{event.homeScore}</span>
          <span className="text-white/40 text-sm">-</span>
          <span className="text-white font-bold text-lg tabular-nums">{event.awayScore}</span>
          <span className="text-white/70 text-xs mr-0">{event.awayName}</span>
          {event.awayFlag ? (
            <img src={event.awayFlag} alt={event.awayName} className="w-5 h-3.5 object-cover rounded-sm" />
          ) : (
            <span className="text-base">🌐</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-white font-semibold text-sm">{event.scorer}</span>
          {event.assist && (
            <>
              <span className="text-white/30 text-xs">assist:</span>
              <span className="text-white/60 text-xs">{event.assist}</span>
            </>
          )}
          <span className="text-xs text-white/30 ml-auto">
            {event.team === event.homeTeam ? event.homeName : event.awayName}
          </span>
        </div>
      </div>
    </div>
  );
}
