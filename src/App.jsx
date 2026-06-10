import { useEffect, useState, useCallback } from 'react';
import useStore from './store/useStore';
import DynamicIsland from './components/DynamicIsland';
import ExpandedPanel from './components/ExpandedPanel';
import useGoalDetector from './hooks/useGoalDetector';

export default function App() {
  const expanded = useStore((s) => s.expanded);
  const init = useStore((s) => s.init);
  const [animating, setAnimating] = useState(false);
  const [showExpanded, setShowExpanded] = useState(false);

  useEffect(() => {
    init();
    return () => useStore.getState().cleanup();
  }, []);

  const handleToggle = useCallback(() => {
    if (animating) return;
    setAnimating(true);

    if (!expanded) {
      if (window.electronAPI) {
        window.electronAPI.setWindowSize({ width: 380, height: 520 });
      }
      setTimeout(() => {
        setShowExpanded(true);
        useStore.getState().setExpanded(true);
        setAnimating(false);
      }, 150);
    } else {
      setShowExpanded(false);
      useStore.getState().setExpanded(false);
      setTimeout(() => {
        if (window.electronAPI) {
          window.electronAPI.setWindowSize({ width: 380, height: 64 });
        }
        setAnimating(false);
      }, 200);
    }
  }, [expanded, animating]);

  useGoalDetector();

  return (
    <div className="w-full h-screen flex items-center justify-end p-2">
      {showExpanded ? (
        <ExpandedPanel onCollapse={handleToggle} />
      ) : (
        <DynamicIsland onExpand={handleToggle} />
      )}
    </div>
  );
}
