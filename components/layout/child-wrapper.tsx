'use client';
import React, { ReactNode } from 'react';
import { DOCUMENT_UPLOAD_STATUS } from '@/lib/enums';
import { useViewerContext } from '@/contexts';

export default function ChildWrapper({ children }: { children: ReactNode }) {
  const { documentUploadStatus } = useViewerContext();

  return (
    <div
      className={`${
        documentUploadStatus === DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR
          ? 'bg-[radial-gradient(circle,_#ccc_1px,_transparent_1px)] bg-[size:10px_10px]'
          : 'bg-[#fff] py-4'
      }  flex-1 flex overflow-hidden h-[calc(100vh-106px)]`}
    >
      {children}
    </div>
  );
}
