/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { useViewerContext } from '@/contexts';
import { motion } from 'motion/react';
import { DOCUMENT_UPLOAD_STATUS, TOOLBAR_BTNS } from '@/lib/enums';
import CustomCursor from './custom-cursor';
import {
  AreaHighlight,
  Content,
  PdfHighlighter,
  PdfLoader,
  Popup,
  ScaledPosition,
  NewHighlight,
  Highlight,
  IHighlight,
} from 'react-pdf-highlighter';

import 'react-pdf-highlighter/dist/style.css';
import { Highlighter, MessageSquareText } from 'lucide-react';
import { CommentDialog } from './comment-dialog';
import { HighlightPopup } from './highlight-popup';
import { usePdfPanZoom } from '@/hooks/use-pdf-pan-zoom';

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
  document.location.hash.slice('#highlight-'.length);

const resetHash = () => {
  document.location.hash = '';
};

export function PdfViewer() {
  const {
    documentUploadStatus,
    canvasScale,
    updateCanvasScale,
    cursorMode,
    activeToolbarBtn,
    document: file,
    documentProps,
    updateDocumentProps,
  } = useViewerContext();

  const url = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);
  const scrollViewerTo = useRef((highlight: IHighlight) => {
    console.log(highlight.id);
  });

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [incompleteHighlightProps, setIncompleteHighlightProps] =
    useState<NewHighlight | null>(null);

  const getHighlightById = useCallback(
    (id: string) => {
      return documentProps.highlights.find((highlight) => highlight.id === id);
    },
    [documentProps.highlights]
  );

  const scrollToHighlightFromHash = useCallback(() => {
    const highlight = getHighlightById(parseIdFromHash());
    if (highlight) {
      console.log('Tried scrolling');
      scrollViewerTo.current(highlight);
    }
  }, [getHighlightById]);

  const addHighlight = (highlight: any) => {
    updateDocumentProps((prev) => ({
      ...prev,
      highlights: [{ ...highlight, id: getNextId() }, ...prev.highlights],
    }));
  };

  const updateHighlight = (
    highlightId: string,
    position: Partial<ScaledPosition>,
    content: Partial<Content>
  ) => {
    updateDocumentProps((prev) => ({
      ...prev,
      highlights: prev.highlights.map((h) => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
          ? {
              id,
              position: { ...originalPosition, ...position },
              content: { ...originalContent, ...content },
              ...rest,
            }
          : h;
      }),
    }));
  };

  const handleSelectionFinished = (
    position: any,
    content: any,
    hideTipAndSelection: any
  ) => {
    if (!activeToolbarBtn) return;

    const isHighlight = activeToolbarBtn.id === TOOLBAR_BTNS.HIGHLIGHT;
    const isComment = activeToolbarBtn.id === TOOLBAR_BTNS.COMMENT;

    if (!isHighlight && !isComment) return;

    const icon = isHighlight ? (
      <Highlighter
        strokeWidth={1.5}
        style={{ width: '1.5rem', height: '1.5rem' }}
        className="text-white/70"
      />
    ) : (
      <MessageSquareText
        strokeWidth={1.5}
        style={{ width: '1.5rem', height: '1.5rem' }}
        className="text-white/70"
      />
    );

    const label = isHighlight ? 'Highlight' : 'Add Comment';

    const handleClick = () => {
      if (isHighlight) {
        addHighlight({
          content,
          position,
          comment: {
            emoji: '',
            text: '',
            color: '#ca2a30',
          },
        });
      } else {
        setIncompleteHighlightProps({
          content,
          position,
          comment: {
            emoji: '',
            text: '',
          },
        });
        setIsCommentModalOpen(true);
      }
      hideTipAndSelection();
    };

    return (
      <button
        onClick={handleClick}
        className="px-3 py-1.5 bg-primary text-white rounded-md cursor-pointer"
      >
        <div className="flex items-center gap-2">
          {icon}
          <p className="text-sm pr-1">{label}</p>
        </div>
      </button>
    );
  };

  usePdfPanZoom({
    containerId: 'pdfWrapper',
    cursorMode,
    documentUploadStatus,
    loadedStatus: DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR,
    updateCanvasScale,
  });

  useEffect(() => {
    window.addEventListener('hashchange', scrollToHighlightFromHash, false);
    return () => {
      window.removeEventListener(
        'hashchange',
        scrollToHighlightFromHash,
        false
      );
    };
  }, [scrollToHighlightFromHash]);

  if (documentUploadStatus === DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR)
    return (
      <div className="w-full flex h-full bg-[transparent]">
        <CustomCursor toolbarBtn={activeToolbarBtn} />
        <CommentDialog
          open={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          onSubmit={(e) => {
            setIsCommentModalOpen(false);
            addHighlight({
              ...incompleteHighlightProps,
              comment: {
                ...incompleteHighlightProps?.comment,
                text: e,
              },
            });

            setIncompleteHighlightProps(null);
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
            <PdfLoader
              url={url}
              beforeLoad={
                <div className="w-full h-full flex items-center justify-center">
                  <p className="">Loading..</p>
                </div>
              }
            >
              {(pdfDocument) => (
                <PdfHighlighter
                  pdfDocument={pdfDocument}
                  enableAreaSelection={(event) => event.altKey}
                  onScrollChange={() => resetHash()}
                  scrollRef={(scrollTo) => {
                    scrollViewerTo.current = scrollTo;
                    scrollToHighlightFromHash();
                  }}
                  onSelectionFinished={handleSelectionFinished}
                  highlightTransform={(
                    highlight,
                    index,
                    setTip,
                    hideTip,
                    viewportToScaled,
                    screenshot,
                    isScrolledTo
                  ) => {
                    const isTextHighlight = !highlight.content?.image;

                    const component = isTextHighlight ? (
                      <Highlight
                        isScrolledTo={isScrolledTo}
                        position={highlight.position}
                        comment={highlight.comment}
                      />
                    ) : (
                      <AreaHighlight
                        isScrolledTo={isScrolledTo}
                        highlight={highlight}
                        onChange={(boundingRect) => {
                          updateHighlight(
                            highlight.id,
                            {
                              boundingRect: viewportToScaled(boundingRect),
                            },
                            {
                              image: screenshot(boundingRect),
                            }
                          );
                        }}
                      />
                    );

                    return (
                      <Popup
                        popupContent={<HighlightPopup {...highlight} />}
                        onMouseOver={(popupContent) =>
                          setTip(highlight, () => popupContent)
                        }
                        onMouseOut={hideTip}
                        key={index}
                      >
                        {component}
                      </Popup>
                    );
                  }}
                  highlights={documentProps.highlights}
                  pdfScaleValue={canvasScale.toString()}
                />
              )}
            </PdfLoader>
          </motion.div>
        </motion.div>
      </div>
    );
}
