'use client';
import React, { createContext, useContext, useState } from 'react';
import { LEFT_SIDEBAR_ENUMS } from '@/lib/enums';

interface SidebarContextValue {
  activeSidebarBtn: LEFT_SIDEBAR_ENUMS;
  updateActiveSidebarBtn: (param: LEFT_SIDEBAR_ENUMS) => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(
  undefined
);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [activeSidebarBtn, setActiveSidebarBtn] = useState<LEFT_SIDEBAR_ENUMS>(
    LEFT_SIDEBAR_ENUMS.POPULAR
  );

  const updateActiveSidebarBtn = (param: LEFT_SIDEBAR_ENUMS) => {
    setActiveSidebarBtn(param);
  };

  return (
    <SidebarContext.Provider
      value={{ activeSidebarBtn, updateActiveSidebarBtn }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const ctx = useContext(SidebarContext);
  if (!ctx)
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  return ctx;
}
