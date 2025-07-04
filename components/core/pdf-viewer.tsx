'use client';
import { useMemo, useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { useViewerContext } from '@/contexts';
import { motion } from 'motion/react';
import { DOCUMENT_UPLOAD_STATUS } from '@/lib/enums';
import CustomCursor from './custom-cursor';
import { CommentDialog } from './comment-dialog';
import { usePdfPanZoom } from '@/hooks/use-pdf-pan-zoom';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

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

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    updatePageCount(numPages);
  };

  const pdfViewerOptions = useMemo(
    () => ({
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    }),
    []
  );

  usePdfPanZoom({
    containerId: 'pdfWrapper',
    cursorMode,
    documentUploadStatus,
    loadedStatus: DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR,
    updateCanvasScale,
  });

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
          <motion.div className="relative my-4 w-full bg-[transparent]">
            <Document
              file={file}
              options={pdfViewerOptions}
              rotate={documentProps.rotate}
              onLoadSuccess={handleLoadSuccess}
            >
              <Page
                canvasBackground="transparent"
                scale={canvasScale}
                pageNumber={currentPage}
                renderMode="canvas"
                className={'flex items-center justify-center'}
                rotate={documentProps.rotate}
              />
            </Document>
          </motion.div>
        </motion.div>
      </div>
    );
}
