import { create } from 'zustand';
import { getMatches, getGoalEvents } from '../services/api';

const useStore = create((set, get) => ({
  matches: [],
  goalEvents: [],
  expanded: false,
  currentMatchIndex: 0,
  initialized: false,
  loading: true,
  error: null,

  init: () => {
    if (get().initialized) return;
    set({ initialized: true });

    const fetchMatches = async () => {
      try {
        const matches = await getMatches();
        set({ matches, loading: false, error: null });
      } catch (err) {
        console.error('Failed to fetch matches:', err.message);
        set({ error: err.message, loading: false });
      }
    };

    fetchMatches();

    setInterval(fetchMatches, 30000);

    setInterval(() => {
      const events = getGoalEvents();
      if (events.length > 0) {
        set((state) => ({
          goalEvents: [...state.goalEvents, ...events],
        }));
      }
    }, 5000);

    setInterval(() => {
      const { matches: current, currentMatchIndex } = get();
      const liveMatches = current.filter((m) => m.status === 'live');
      if (liveMatches.length > 1) {
        set({ currentMatchIndex: (currentMatchIndex + 1) % liveMatches.length });
      }
    }, 8000);
  },

  toggleExpanded: () => {
    set((state) => ({ expanded: !state.expanded }));
  },

  setExpanded: (value) => {
    set({ expanded: value });
  },

  dismissGoalEvent: (index) => {
    set((state) => ({
      goalEvents: state.goalEvents.filter((_, i) => i !== index),
    }));
  },

  cleanup: () => {
    set({ initialized: false });
  },
}));

export default useStore;
