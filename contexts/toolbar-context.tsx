'use client';
import React, { createContext, useContext, useState } from 'react';
import { ToolbarBtn } from '@/lib/types/viewer-context';
import { DOCUMENT_UPLOAD_STATUS } from '@/lib/enums';
import { toast } from '@/components/core/toaster';
import { useDocumentContext } from './document-context';

interface ToolbarContextValue {
  activeToolbarBtn: ToolbarBtn | null;
  updateActiveToolbarBtn: (param: ToolbarBtn | null) => void;
}

const ToolbarContext = createContext<ToolbarContextValue | undefined>(
  undefined
);

export function ToolbarProvider({ children }: { children: React.ReactNode }) {
  const { documentUploadStatus } = useDocumentContext();
  const [activeToolbarBtn, setActiveToolbarBtn] = useState<ToolbarBtn | null>(
    null
  );

  const updateActiveToolbarBtn = (param: ToolbarBtn | null) => {
    if (documentUploadStatus !== DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR)
      return toast.info('Upload a document to continue!');
    setActiveToolbarBtn((prev) =>
      param ? (prev?.id === param.id ? null : param) : null
    );
  };

  return (
    <ToolbarContext.Provider
      value={{ activeToolbarBtn, updateActiveToolbarBtn }}
    >
      {children}
    </ToolbarContext.Provider>
  );
}

export function useToolbarContext() {
  const ctx = useContext(ToolbarContext);
  if (!ctx)
    throw new Error('useToolbarContext must be used within a ToolbarProvider');
  return ctx;
}
