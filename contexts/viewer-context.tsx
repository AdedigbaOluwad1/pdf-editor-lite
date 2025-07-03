'use client';

import * as React from 'react';
import { toast } from '@/components/core/toaster';
import { DOCUMENT_UPLOAD_STATUS, LEFT_SIDEBAR_ENUMS } from '@/lib/enums';
import useKeyboardShortcuts from '@/hooks/use-keyboard-shortcuts';
import {
  cursorMode,
  documentProps,
  ViewerContextValue,
  ViewerContextProviderProps,
} from '@/lib/types/viewer-context';
import { useDocumentContext } from './document-context';
import { noop } from '@/lib/utils';
import { useSidebarContext } from './sidebar-context';
import { useUIContext } from './ui-context';

const initDocumentProps: documentProps = {
  rotate: 0,
  highlights: [],
};

export const ViewerContext = React.createContext<ViewerContextValue>({
  isFocusModeEnabled: false,
  activeToolbarBtn: null,
  activeSidebarBtn: LEFT_SIDEBAR_ENUMS.POPULAR,
  documentUploadStatus: DOCUMENT_UPLOAD_STATUS.PRE_UPLOAD,
  cursorMode: 'cursor',
  canvasScale: 1.5,
  document: null,
  currentPage: 1,
  pageCount: 1,
  documentProps: initDocumentProps,
  canRedo: false,
  canUndo: false,
  isFloatingEditorHovered: false,
  isCursorWithinRect: false,
  loadedPdfDoc: null,
  setIsCursorWithinRect: noop,
  setIsFloatingEditorHovered: noop,
  undo: noop,
  redo: noop,
  updateActiveToolbarBtn: noop,
  updateActiveSidebarBtn: noop,
  onDocumentDownload: noop,
  onDocumentUpload: noop,
  onDocumentUploadCancel: noop,
  updateDocumentUploadStatus: noop,
  onFocusModeToggle: noop,
  onDocumentPrint: noop,
  onFutureFeatClick: noop,
  updateCanvasScale: noop,
  updateCursorMode: noop,
  updateCurrentPage: noop,
  updatePageCount: noop,
  updateDocumentProps: noop,
  onLoadedPdfDocUpdate: noop,
});

export function ViewerContextProvider({
  children,
}: ViewerContextProviderProps): React.JSX.Element {
  // Document context
  const {
    document,
    loadedPdfDoc,
    documentUploadStatus,
    currentPage,
    pageCount,
    documentProps,
    setDocumentUploadStatus,
    setCurrentPage,
    setPageCount,
    setDocumentProps,
    onDocumentDownload,
    onDocumentUpload,
    onDocumentUploadCancel,
    onDocumentPrint,
    onLoadedPdfDocUpdate,
  } = useDocumentContext();

  // Sidebar context
  const { activeSidebarBtn, updateActiveSidebarBtn } = useSidebarContext();

  // UI context
  const {
    isFocusModeEnabled,
    setIsFocusModeEnabled,
    canvasScale,
    setCanvasScale,
    cursorMode,
    setCursorMode,
    isFloatingEditorHovered,
    setIsFloatingEditorHovered,
    isCursorWithinRect,
    setIsCursorWithinRect,
  } = useUIContext();

  const onFocusModeToggle = () => {
    setIsFocusModeEnabled((prev) => !prev);
    toast.info(`Focus mode turned ${isFocusModeEnabled ? 'on' : 'off'}`);
  };

  const updateActiveToolbarBtn = () => {
    if (documentUploadStatus !== DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR)
      return toast.info('Upload a document to continue!');
    setIsFloatingEditorHovered(false);
    // No direct setCursorMode here; handled elsewhere if needed
  };

  const updateCanvasScale = (newScale: number) => {
    if (documentUploadStatus !== DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR)
      return toast.error('Upload a document to continue!');
    setCanvasScale(newScale);
  };

  const updateCursorMode = (newMode: cursorMode) => {
    if (
      newMode === 'pan' &&
      documentUploadStatus !== DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR
    )
      return toast.error('Upload a document to continue!');
    setIsFloatingEditorHovered(false);
    setCursorMode(newMode);
  };

  const updateCurrentPage = (newPage: number) => {
    if (documentUploadStatus !== DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR)
      return toast.error('Upload a document to continue!');
    setCurrentPage(newPage);
  };

  const updatePageCount = (param: number) => {
    if (documentUploadStatus !== DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR)
      return toast.error('Upload a document to continue!');
    setPageCount(param);
  };

  const updateDocumentProps = (
    payload: (
      currentProps: documentProps,
      initProps: documentProps
    ) => documentProps | documentProps
  ) => {
    if (documentUploadStatus !== DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR)
      return toast.error('Upload a document to continue!');

    setDocumentProps(
      typeof payload === 'function'
        ? payload(documentProps, initDocumentProps)
        : payload
    );
  };

  const undo = () => {
    if (documentUploadStatus !== DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR)
      return toast.error('Upload a document to continue!');

    setDocumentProps(initDocumentProps);
  };

  const redo = () => {
    if (documentUploadStatus !== DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR)
      return toast.error('Upload a document to continue!');

    setDocumentProps(initDocumentProps);
  };

  useKeyboardShortcuts({
    undo: undo,
    redo: redo,
    isEditorModeActive:
      documentUploadStatus === DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR,
  });

  const onFutureFeatClick = () => {
    toast.info("📦 This one's still in the box. Stay tuned!");
  };

  return (
    <ViewerContext.Provider
      value={{
        isFocusModeEnabled,
        activeToolbarBtn: null,
        updateActiveToolbarBtn,
        onDocumentDownload,
        onDocumentUpload,
        onFocusModeToggle,
        onDocumentPrint,
        onFutureFeatClick,
        updateActiveSidebarBtn,
        activeSidebarBtn,
        documentUploadStatus,
        document,
        onDocumentUploadCancel,
        updateDocumentUploadStatus: setDocumentUploadStatus,
        canvasScale,
        updateCanvasScale,
        cursorMode,
        updateCursorMode,
        currentPage,
        updateCurrentPage,
        pageCount,
        updatePageCount,
        updateDocumentProps,
        documentProps,
        canRedo: true,
        canUndo: true,
        undo,
        redo,
        isFloatingEditorHovered,
        setIsFloatingEditorHovered,
        isCursorWithinRect,
        setIsCursorWithinRect,
        loadedPdfDoc,
        onLoadedPdfDocUpdate,
      }}
    >
      {children}
    </ViewerContext.Provider>
  );
}

export function useViewerContext(): ViewerContextValue {
  return React.useContext(ViewerContext);
}
