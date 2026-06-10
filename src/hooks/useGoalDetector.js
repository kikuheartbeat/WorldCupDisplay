import { useEffect, useRef } from 'react';
import useStore from '../store/useStore';

export default function useGoalDetector() {
  const matches = useStore((s) => s.matches);
  const prevScorerCountRef = useRef({});

  useEffect(() => {
    const currentCounts = {};
    matches.forEach((m) => {
      currentCounts[m.id] = m.scorers.length;
    });

    for (const id of Object.keys(currentCounts)) {
      const prev = prevScorerCountRef.current[id] || 0;
      if (currentCounts[id] > prev) {
        const match = matches.find((m) => m.id === id);
        if (match) {
          const newScorers = match.scorers.slice(prev);
          newScorers.forEach((s) => {
            const event = {
              matchId: id,
              homeTeam: match.homeTeam,
              awayTeam: match.awayTeam,
              homeName: match.homeName,
              awayName: match.awayName,
              homeFlag: match.homeFlag,
              awayFlag: match.awayFlag,
              homeScore: match.homeScore,
              awayScore: match.awayScore,
              ...s,
            };
            useStore.setState((state) => ({
              goalEvents: [...state.goalEvents, event],
            }));
          });
        }
      }
    }

    prevScorerCountRef.current = currentCounts;
  }, [matches]);
}
