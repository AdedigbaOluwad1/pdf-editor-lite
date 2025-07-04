'use client';
import React, { createContext, useContext, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { toast } from '@/components/core/toaster';
import { DOCUMENT_UPLOAD_STATUS } from '@/lib/enums';
import { documentProps } from '@/lib/types/viewer-context';
import useReactor from '@/hooks/use-reactor';
import { useUndoRedo } from '@/hooks/use-undo-redo';

interface DocumentContextValue {
  document: File | null;
  loadedPdfDoc: PDFDocument | null;
  documentUploadStatus: DOCUMENT_UPLOAD_STATUS;
  currentPage: number;
  pageCount: number;
  documentProps: documentProps;
  setDocument: React.Dispatch<React.SetStateAction<File | null>>;
  setLoadedPdfDoc: React.Dispatch<React.SetStateAction<PDFDocument | null>>;
  setDocumentUploadStatus: React.Dispatch<
    React.SetStateAction<DOCUMENT_UPLOAD_STATUS>
  >;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setPageCount: React.Dispatch<React.SetStateAction<number>>;
  setDocumentProps: React.Dispatch<React.SetStateAction<documentProps>>;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  onDocumentDownload: () => void;
  onDocumentUpload: (document: File) => void;
  onDocumentUploadCancel: () => void;
  onDocumentPrint: () => void;
  onLoadedPdfDocUpdate: (
    updatedDoc: Uint8Array<ArrayBufferLike> | undefined
  ) => void;
}

const DocumentContext = createContext<DocumentContextValue | undefined>(
  undefined
);

const initDocumentProps: documentProps = {
  rotate: 0,
  highlights: [],
};

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const { loadPdfDoc } = useReactor();
  const [document, setDocument] = useState<File | null>(null);
  const [loadedPdfDoc, setLoadedPdfDoc] = useState<PDFDocument | null>(null);
  const [documentUploadStatus, setDocumentUploadStatus] =
    useState<DOCUMENT_UPLOAD_STATUS>(DOCUMENT_UPLOAD_STATUS.PRE_UPLOAD);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const {
    state: docProps,
    setState: setDocumentProps,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useUndoRedo<documentProps>(initDocumentProps);

  const onDocumentDownload = async () => {
    if (!document) return toast.info('Upload a document to continue!');
    toast.info('Document download initiated');
    const pdfDoc = await PDFDocument.load(await document.arrayBuffer());
    // Highlights logic can be added here if needed
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = 'highlighted.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  const onDocumentUpload = async (file: File) => {
    setDocument(file);
    setLoadedPdfDoc(await loadPdfDoc(file));
    setDocumentUploadStatus(DOCUMENT_UPLOAD_STATUS.UPLOADING);
    toast.info('Document upload initiated');
  };

  const onDocumentUploadCancel = () => {
    setDocument(null);
    setDocumentUploadStatus(DOCUMENT_UPLOAD_STATUS.PRE_UPLOAD);
    toast.info('Document upload cancelled');
  };

  const onDocumentPrint = () => {
    toast.info('Document print initiated');
  };

  const onLoadedPdfDocUpdate = async (
    updatedDoc: Uint8Array<ArrayBufferLike> | undefined
  ) => {
    if (!updatedDoc) return;
    setLoadedPdfDoc(await PDFDocument.load(updatedDoc));
    setDocument(
      (prev) =>
        new File([updatedDoc], prev?.name || '', {
          type: prev?.type || '',
        })
    );
  };

  return (
    <DocumentContext.Provider
      value={{
        document,
        loadedPdfDoc,
        documentUploadStatus,
        currentPage,
        pageCount,
        documentProps: docProps,
        setDocument,
        setLoadedPdfDoc,
        setDocumentUploadStatus,
        setCurrentPage,
        setPageCount,
        setDocumentProps,
        canUndo,
        canRedo,
        undo,
        redo,
        onDocumentDownload,
        onDocumentUpload,
        onDocumentUploadCancel,
        onDocumentPrint,
        onLoadedPdfDocUpdate,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocumentContext() {
  const ctx = useContext(DocumentContext);
  if (!ctx)
    throw new Error(
      'useDocumentContext must be used within a DocumentProvider'
    );
  return ctx;
}
