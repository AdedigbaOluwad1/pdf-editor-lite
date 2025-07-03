import { useState, useCallback } from 'react';

interface UndoRedoState<T> {
  state: T;
  setState: (value: T) => void;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
}

export function useUndoRedo<T>(initialValue: T): UndoRedoState<T> {
  const [history, setHistory] = useState<T[]>([initialValue]);
  const [pointer, setPointer] = useState(0);

  const state = history[pointer];

  const setState = useCallback(
    (value: T) => {
      const updatedHistory = history.slice(0, pointer + 1);
      setHistory([...updatedHistory, value]);
      setPointer(updatedHistory.length);
    },
    [history, pointer]
  );

  const canUndo = pointer > 0;
  const canRedo = pointer < history.length - 1;

  const undo = useCallback(() => {
    if (canUndo) setPointer(pointer - 1);
  }, [canUndo, pointer]);

  const redo = useCallback(() => {
    if (canRedo) setPointer(pointer + 1);
  }, [canRedo, pointer]);

  return { state, setState, canUndo, canRedo, undo, redo };
}
