/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from 'react';

function useHistory<T>(initialState: T) {
  const [present, setPresent] = useState<T>(initialState);
  const past = useRef<any>([]);
  const future = useRef<any>([]);

  const update = (newState: T) => {
    past.current.push(present);
    setPresent(newState);
    future.current = [];
  };

  const undo = () => {
    if (past.current.length === 0) return;
    const prev = past.current.pop();
    future.current.push(present);
    setPresent(prev);
  };

  const redo = () => {
    if (future.current.length === 0) return;
    const next = future.current.pop();
    past.current.push(present);
    setPresent(next);
  };

  return {
    state: present,
    update,
    undo,
    redo,
    canUndo: past.current.length > 0,
    canRedo: future.current.length > 0,
  };
}

export default useHistory;
