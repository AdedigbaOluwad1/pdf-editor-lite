'use client';
import React, { createContext, useContext, useState } from 'react';
import { cursorMode } from '@/lib/types/viewer-context';

interface UIContextValue {
  isFocusModeEnabled: boolean;
  setIsFocusModeEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  canvasScale: number;
  setCanvasScale: React.Dispatch<React.SetStateAction<number>>;
  cursorMode: cursorMode;
  setCursorMode: React.Dispatch<React.SetStateAction<cursorMode>>;
  isFloatingEditorHovered: boolean;
  setIsFloatingEditorHovered: React.Dispatch<React.SetStateAction<boolean>>;
  isCursorWithinRect: boolean;
  setIsCursorWithinRect: React.Dispatch<React.SetStateAction<boolean>>;
}

const UIContext = createContext<UIContextValue | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isFocusModeEnabled, setIsFocusModeEnabled] = useState(false);
  const [canvasScale, setCanvasScale] = useState(1.5);
  const [cursorModeState, setCursorMode] = useState<cursorMode>('cursor');
  const [isFloatingEditorHovered, setIsFloatingEditorHovered] = useState(false);
  const [isCursorWithinRect, setIsCursorWithinRect] = useState(false);

  return (
    <UIContext.Provider
      value={{
        isFocusModeEnabled,
        setIsFocusModeEnabled,
        canvasScale,
        setCanvasScale,
        cursorMode: cursorModeState,
        setCursorMode,
        isFloatingEditorHovered,
        setIsFloatingEditorHovered,
        isCursorWithinRect,
        setIsCursorWithinRect,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUIContext() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUIContext must be used within a UIProvider');
  return ctx;
}
