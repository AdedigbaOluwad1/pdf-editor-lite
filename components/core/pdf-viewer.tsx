/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useCallback, useEffect, useState } from 'react';

import { useViewerContext } from '@/contexts';
import { motion } from 'motion/react';
import { DOCUMENT_UPLOAD_STATUS } from '@/lib/enums';
import CustomCursor from './custom-cursor';
import { CommentDialog } from './comment-dialog';
import { usePdfPanZoom } from '@/hooks/use-pdf-pan-zoom';
import dynamic from 'next/dynamic';

// Load only on the client to avoid SSR errors from browser-only APIs like DOMMatrix
const PdfJsExtract = dynamic(() => import('./pdfjs-extract'), { ssr: false });

export function PdfViewer() {
  const {
    documentUploadStatus,
    canvasScale,
    updateCanvasScale,
    cursorMode,
    activeToolbarBtn,
    document: file,
    documentProps,
    currentPage,
    updatePageCount,
  } = useViewerContext();

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [arrayBuffer, setArrayBuffer] = useState<ArrayBuffer | null>(null);

  const handleLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      updatePageCount(numPages);
    },
    [documentUploadStatus]
  );

  usePdfPanZoom({
    containerId: 'pdfWrapper',
    cursorMode,
    documentUploadStatus,
    loadedStatus: DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR,
    updateCanvasScale,
  });

  useEffect(() => {
    if (file instanceof File) {
      file.arrayBuffer().then(setArrayBuffer);
    } else if (typeof file === 'string') {
      setArrayBuffer(file);
    }
  }, [file]);

  if (documentUploadStatus === DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR)
    return (
      <div className="w-full flex h-full bg-[transparent]">
        <CustomCursor toolbarBtn={activeToolbarBtn} />
        <CommentDialog
          open={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          onSubmit={() => {
            setIsCommentModalOpen(false);
          }}
        />

        <motion.div
          key="pdfViewer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="pdf-container flex relative flex-1 bg-[transparent]"
        >
          <motion.div className="relative my-4 flex flex-1 w-full bg-[transparent]">
            <PdfJsExtract
              file={arrayBuffer as ArrayBuffer}
              pageNumber={currentPage}
              scale={canvasScale}
              rotation={documentProps.rotate}
              onPageLoad={handleLoadSuccess}
            />
          </motion.div>
        </motion.div>
      </div>
    );
}
