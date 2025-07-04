export type cursorMode = 'pan' | 'cursor' | 'grabbing';

export interface documentProps {
  rotate: number;
  highlights: import('react-pdf-highlighter').IHighlight[];
}

export interface ToolbarBtn {
  id: import('@/lib/enums').TOOLBAR_BTNS;
  onClick: (() => void) | null;
  label: string | null;
  hideCustomCursor?: boolean;
}

export interface ViewerContextValue {
  isFocusModeEnabled: boolean;
  activeToolbarBtn: ToolbarBtn | null;
  activeSidebarBtn: import('@/lib/enums').LEFT_SIDEBAR_ENUMS;
  documentUploadStatus: import('@/lib/enums').DOCUMENT_UPLOAD_STATUS;
  document: File | null;
  canvasScale: number;
  cursorMode: cursorMode;
  currentPage: number;
  pageCount: number;
  documentProps: documentProps;
  loadedPdfDoc: import('pdf-lib').PDFDocument | null;
  canUndo: boolean;
  canRedo: boolean;
  isFloatingEditorHovered: boolean;
  isCursorWithinRect: boolean;
  redo: () => void;
  undo: () => void;
  setIsCursorWithinRect: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFloatingEditorHovered: React.Dispatch<React.SetStateAction<boolean>>;
  updateActiveToolbarBtn: (param: ToolbarBtn | null) => void;
  updateActiveSidebarBtn: (
    param: import('@/lib/enums').LEFT_SIDEBAR_ENUMS
  ) => void;
  onDocumentDownload: () => void;
  onDocumentUpload: (document: File) => void;
  updateDocumentUploadStatus: (
    param: import('@/lib/enums').DOCUMENT_UPLOAD_STATUS
  ) => void;
  onDocumentUploadCancel: () => void;
  onFocusModeToggle: () => void;
  onDocumentPrint: () => void;
  onFutureFeatClick: () => void;
  updateCanvasScale: (newScale: number) => void;
  updateCursorMode: (newMode: cursorMode) => void;
  updateCurrentPage: (newPage: number) => void;
  updatePageCount: (param: number) => void;
  updateDocumentProps: (
    payload: (
      currentProps: documentProps,
      initProps: documentProps
    ) => documentProps
  ) => void;
  onLoadedPdfDocUpdate: (
    param: Uint8Array<ArrayBufferLike> | undefined
  ) => void;
}

export interface ViewerContextProviderProps {
  children: React.ReactNode;
}
