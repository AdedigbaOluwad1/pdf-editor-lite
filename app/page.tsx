'use client';
import DocumentUploader from '@/components/common/document-uploader';
import { PdfViewer } from '@/components/core/pdf-viewer';
import { useViewerContext } from '@/contexts';
import { AnimatePresence } from 'motion/react';
import React from 'react';

export default function Page() {
  const { cursorMode } = useViewerContext();
  return (
    <div
      className={`flex items-center justify-center flex-1 bg-[transparent] overflow-auto h-[calc(100vh-106px)] ${
        cursorMode === 'pan' && 'cursor-grab'
      }`}
      id="pdfWrapper"
    >
      <AnimatePresence>
        <DocumentUploader key={'documentUploader'} />
        <PdfViewer key={'pdfviewer'} />
      </AnimatePresence>
    </div>
  );
}
