'use client';
import React from 'react';
import Tooltip from '../../common/tooltip';
import IconButton from '../../common/icon-button';
import {
  Hand,
  MessageSquareText,
  MousePointer2,
  Redo2,
  Signature,
  StickyNote,
  Undo2,
} from 'lucide-react';
import { useViewerContext } from '@/contexts';
import { Separator } from '../../ui/separator';
import MultiSelector from '../../common/multi-selector';
import { TOOLBAR_BTNS, LEFT_SIDEBAR_ENUMS } from '@/lib/enums';
import DropdownSelector from '../../common/dropdown-selector';
import CommentViewer from '../../core/comment-viewer';
import ToolbarButton from './button';
import { toolbarConfig, ToolbarButtonConfig } from './config';
import ToolbarZoomControls from './zoom-controls';
import ToolbarRotateControls from './rotate-controls';

export function StandardToolBar() {
  const {
    onFutureFeatClick,
    activeToolbarBtn,
    updateActiveToolbarBtn,
    activeSidebarBtn,
    updateCanvasScale,
    canvasScale,
    cursorMode,
    updateCursorMode,
    undo,
    redo,
    updateDocumentProps,
    canRedo,
    canUndo,
  } = useViewerContext();

  const config: Partial<Record<LEFT_SIDEBAR_ENUMS, ToolbarButtonConfig[]>> =
    toolbarConfig(activeToolbarBtn, updateActiveToolbarBtn, onFutureFeatClick);

  return (
    <div className="h-[48px] p-[8px] flex items-center justify-between">
      <div className="hidden xl:flex items-center gap-0.5">
        <MultiSelector
          tooltip={{
            buttonTooltipContent: 'Thumbnails',
            side: 'bottom',
          }}
          dropdown={{ align: 'start', side: 'bottom' }}
          dropdowncontent={
            <div>
              <p>Coming soon!</p>
            </div>
          }
          onClick={onFutureFeatClick}
          isActive={activeToolbarBtn?.id === TOOLBAR_BTNS.THUMBNAILS}
        >
          <StickyNote
            strokeWidth={1.5}
            style={{ width: '1.5rem', height: '1.5rem' }}
            color="#325167"
          />
        </MultiSelector>

        <Separator
          className="bg-[#a5b5c1] min-h-[15px] mx-2"
          orientation="vertical"
        />

        <ToolbarZoomControls
          canvasScale={canvasScale}
          updateCanvasScale={updateCanvasScale}
        />

        <Separator
          className="bg-[#a5b5c1] min-h-[15px] mx-2"
          orientation="vertical"
        />

        <ToolbarRotateControls
          onRotateLeft={() =>
            updateDocumentProps((prev) => ({
              ...prev,
              rotate: prev.rotate - 90,
            }))
          }
          onRotateRight={() =>
            updateDocumentProps((prev) => ({
              ...prev,
              rotate: prev.rotate + 90,
            }))
          }
        />
        {/* <Tooltip content="Rotate left" side="bottom" sideOffset={10}>
          <IconButton
            onClick={onFutureFeatClick}
            className="p-2 hover:bg-[#dae1e8]"
          >
            <UndoDot
              strokeWidth={1.5}
              style={{ width: '1.5rem', height: '1.5rem' }}
              color="#325167"
            />
          </IconButton>
        </Tooltip>

        <Tooltip content="Rotate right" side="bottom" sideOffset={10}>
          <IconButton
            onClick={onFutureFeatClick}
            className="p-2 hover:bg-[#dae1e8]"
          >
            <RedoDot
              strokeWidth={1.5}
              style={{ width: '1.5rem', height: '1.5rem' }}
              color="#325167"
            />
          </IconButton>
        </Tooltip> */}

        <Separator
          className="bg-[#a5b5c1] min-h-[15px] mx-2"
          orientation="vertical"
        />

        <Tooltip content="Pan" side="bottom" sideOffset={10}>
          <IconButton
            onClick={() => updateCursorMode('cursor')}
            className={`p-2 hover:bg-[#dae1e8] ${
              cursorMode === 'cursor' &&
              'hover:bg-[#d0e6f2!important] bg-[#d0e6f2]'
            }`}
          >
            <MousePointer2
              strokeWidth={1.5}
              style={{ width: '1.5rem', height: '1.5rem' }}
              color="#325167"
            />
          </IconButton>
        </Tooltip>

        <Tooltip content="Pan" side="bottom" sideOffset={10}>
          <IconButton
            onClick={() => updateCursorMode('pan')}
            className={`p-2 hover:bg-[#dae1e8] ${
              cursorMode === 'pan' &&
              'hover:bg-[#d0e6f2!important] bg-[#d0e6f2]'
            }`}
          >
            <Hand
              strokeWidth={1.5}
              style={{ width: '1.5rem', height: '1.5rem' }}
              color="#325167"
            />
          </IconButton>
        </Tooltip>

        <Separator
          className="bg-[#a5b5c1] min-h-[15px] mx-2"
          orientation="vertical"
        />

        <Tooltip content="Undo" side="bottom" sideOffset={10}>
          <IconButton
            onClick={undo}
            disabled={!canUndo}
            className="p-1 hover:bg-[#dae1e8]"
          >
            <Undo2
              strokeWidth={1.5}
              style={{ width: '1.5rem', height: '1.5rem' }}
              color="#325167"
            />
          </IconButton>
        </Tooltip>

        <Tooltip content="Redo" side="bottom" sideOffset={10}>
          <IconButton
            onClick={redo}
            disabled={!canRedo}
            className="p-1 hover:bg-[#dae1e8]"
          >
            <Redo2
              strokeWidth={1.55}
              style={{ width: '1.5rem', height: '1.5rem' }}
              color="#325167"
            />
          </IconButton>
        </Tooltip>
      </div>

      <div className="flex ml-auto items-center gap-0.5">
        {/* Render toolbar group buttons dynamically */}
        {(config[activeSidebarBtn] || []).map((btn: ToolbarButtonConfig) => (
          <ToolbarButton key={btn.label} {...btn} />
        ))}

        <Separator
          className="bg-[#a5b5c1] min-h-[15px] mx-2"
          orientation="vertical"
        />

        <MultiSelector
          tooltip={{
            buttonTooltipContent: 'Add comments',
            side: 'bottom',
          }}
          dropdown={{ align: 'end', side: 'bottom' }}
          dropdowncontent={<CommentViewer />}
          onClick={onFutureFeatClick}
          // todo: feat/add-comments
          // updateActiveToolbarBtn({
          //   id: TOOLBAR_BTNS.COMMENT,
          //   onClick: onFutureFeatClick,
          //   label: 'Add comment',
          //   hideCustomCursor: true,
          // })
          isActive={activeToolbarBtn?.id === TOOLBAR_BTNS.COMMENT}
        >
          <div className="flex items-center gap-2">
            <MessageSquareText
              strokeWidth={1.5}
              style={{ width: '1.5rem', height: '1.5rem' }}
              color="#325167"
            />

            <p className="text-sm hidden xxl:block pr-1">Add Comment</p>
          </div>
        </MultiSelector>

        <Separator
          className="bg-[#a5b5c1] min-h-[15px] mx-2"
          orientation="vertical"
        />

        <DropdownSelector
          tooltip={{
            buttonTooltipContent: 'Signature',
            side: 'bottom',
          }}
          dropdown={{ align: 'end', side: 'bottom' }}
          dropdowncontent={
            <div>
              <p>Coming soon!</p>
            </div>
          }
          onClick={onFutureFeatClick}
          isActive={activeToolbarBtn?.id === TOOLBAR_BTNS.SIGN}
        >
          <div className="flex items-center gap-2">
            <Signature
              strokeWidth={1.5}
              style={{ width: '1.5rem', height: '1.5rem' }}
              color="#325167"
            />

            <p className="text-sm pr-1">Signature</p>
          </div>
        </DropdownSelector>
      </div>
    </div>
  );
}
