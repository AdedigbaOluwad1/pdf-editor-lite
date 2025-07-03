'use client';
import React, { useEffect, useState } from 'react';
import { useViewerContext } from '@/contexts';
import Tooltip from '../../common/tooltip';
import IconButton from '../../common/icon-button';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Separator } from '../../ui/separator';
import { DOCUMENT_UPLOAD_STATUS } from '@/lib/enums';

export function FloatingToolbar() {
  const {
    updateCanvasScale,
    canvasScale,
    documentUploadStatus,
    pageCount,
    updateCurrentPage,
    currentPage,
  } = useViewerContext();

  const [zoomValue, setZoomValue] = useState(
    `${Math.floor(canvasScale * 100)}%`
  );
  const [currentPageValue, setCurrentPageValue] = useState(`${currentPage}`);

  useEffect(() => {
    setZoomValue(`${Math.floor(canvasScale * 100)}%`);
  }, [canvasScale]);

  useEffect(() => {
    setCurrentPageValue(`${Math.floor(currentPage)}`);
  }, [currentPage]);
  return (
    <div className="px-2 py-2 absolute flex items-center z-[4000] bottom-5 left-1/2 -translate-x-1/2 shadow-lg rounded-md border-[0.5px] border-black/10 bg-white/80 backdrop-blur-md">
      <div className="flex items-center gap-0.5">
        <Tooltip content="Zoom out" side="top" sideOffset={10}>
          <IconButton
            disabled={canvasScale <= 0.3}
            onClick={() => updateCanvasScale(canvasScale / 1.2)}
            className="p-2 hover:bg-[#dae1e8]"
          >
            <ZoomOut
              strokeWidth={1.25}
              style={{ width: '1.5rem', height: '1.5rem' }}
              color="#325167"
            />
          </IconButton>
        </Tooltip>

        <form
          onSubmit={(e) => {
            e.preventDefault();

            if (
              documentUploadStatus !== DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR
            )
              return;

            const formattedFormValue = parseInt(
              zoomValue.replaceAll(/\D/g, '')
            );

            if (30 <= formattedFormValue && formattedFormValue <= 350) {
              setZoomValue(`${formattedFormValue}%`);
              updateCanvasScale(formattedFormValue / 100);
            } else setZoomValue(`${Math.floor(canvasScale * 100)}%`);
          }}
        >
          <input
            className="w-[48px] h-[35px] outline-none border border-black/20 text-center text-sm font-medium rounded-sm p-0.5 mx-1.5"
            onChange={(e) => {
              setZoomValue(e?.target?.value);
            }}
            value={`${zoomValue}`}
            readOnly={
              documentUploadStatus !== DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR
            }
          />
        </form>

        <Tooltip content="Zoom in" side="top" sideOffset={10}>
          <IconButton
            disabled={canvasScale >= 3}
            onClick={() => updateCanvasScale(canvasScale * 1.2)}
            className="p-2 hover:bg-[#dae1e8]"
          >
            <ZoomIn
              strokeWidth={1.25}
              style={{ width: '1.5rem', height: '1.5rem' }}
              color="#325167"
            />
          </IconButton>
        </Tooltip>

        <Separator
          className="bg-[#a5b5c1] min-h-[15px] mx-2"
          orientation="vertical"
        />

        <IconButton
          disabled={currentPage === 1}
          onClick={() => updateCurrentPage(1)}
          className="p-2 hover:bg-[#dae1e8]"
        >
          <ChevronsLeft
            strokeWidth={1.25}
            style={{ width: '1.5rem', height: '1.5rem' }}
            color="#325167"
          />
        </IconButton>

        <IconButton
          disabled={currentPage === 1}
          onClick={() => updateCurrentPage(currentPage - 1)}
          className="p-2 hover:bg-[#dae1e8]"
        >
          <ChevronLeft
            strokeWidth={1.25}
            style={{ width: '1.5rem', height: '1.5rem' }}
            color="#325167"
          />
        </IconButton>

        <form
          className="flex items-center"
          onSubmit={(e) => {
            e.preventDefault();

            if (
              documentUploadStatus !== DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR
            )
              return;

            const formattedFormValue = parseInt(
              currentPageValue.replaceAll(/\D/g, '')
            );

            if (!!formattedFormValue && formattedFormValue <= pageCount) {
              setCurrentPageValue(`${formattedFormValue}`);
              updateCurrentPage(formattedFormValue);
            } else setCurrentPageValue(`${Math.floor(currentPage)}`);
          }}
        >
          <input
            className="w-[32px] h-[28px] outline-none border border-black/20 text-center text-sm font-medium rounded-sm p-0.5 mx-1.5"
            onChange={(e) => {
              setCurrentPageValue(e?.target?.value);
            }}
            value={currentPageValue}
            readOnly={
              documentUploadStatus !== DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR
            }
          />
          <p className="mx-1.5 text-sm">/</p>
          <p className="text-sm ml-1 mr-1.5">{pageCount}</p>
        </form>

        <IconButton
          disabled={currentPage === pageCount}
          onClick={() => updateCurrentPage(currentPage + 1)}
          className="p-2 hover:bg-[#dae1e8]"
        >
          <ChevronRight
            strokeWidth={1.25}
            style={{ width: '1.5rem', height: '1.5rem' }}
            color="#325167"
          />
        </IconButton>

        <IconButton
          disabled={currentPage === pageCount}
          onClick={() => updateCurrentPage(pageCount)}
          className="p-2 hover:bg-[#dae1e8]"
        >
          <ChevronsRight
            strokeWidth={1.25}
            style={{ width: '1.5rem', height: '1.5rem' }}
            color="#325167"
          />
        </IconButton>
      </div>
    </div>
  );
}
