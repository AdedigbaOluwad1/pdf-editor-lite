'use client';
import IconButton from '@/components/common/icon-button';
import React from 'react';
import { Download, Printer, Search } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Tooltip from '@/components/common/tooltip';
import { useViewerContext } from '@/contexts';

export function RightSidebar() {
  const { onDocumentDownload, onDocumentPrint } = useViewerContext();
  return (
    <div className="p-1 hidden lg:flex flex-col gap-3">
      <Tooltip content="Search" side="left" sideOffset={10}>
        <IconButton>
          <Search
            size={'1.5rem'}
            strokeWidth={1.25}
            style={{ width: '1.5rem', height: '1.5rem' }}
          />
        </IconButton>
      </Tooltip>

      <Separator orientation="horizontal" />

      <Tooltip content="Download" side="left" sideOffset={10}>
        <IconButton onClick={onDocumentDownload}>
          <Download
            strokeWidth={1.25}
            style={{ width: '1.5rem', height: '1.5rem' }}
          />
        </IconButton>
      </Tooltip>

      <Tooltip content="Print" side="left" sideOffset={10}>
        <IconButton onClick={onDocumentPrint}>
          <Printer
            strokeWidth={1.25}
            style={{ width: '1.5rem', height: '1.5rem' }}
          />
        </IconButton>
      </Tooltip>
    </div>
  );
}
