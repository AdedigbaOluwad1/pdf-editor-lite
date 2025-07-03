import React from 'react';
import { Eraser, PenTool, Type, Highlighter, Underline } from 'lucide-react';
import HighlightStylePane from '../../core/highlight-style-pane';
import { TOOLBAR_BTNS, LEFT_SIDEBAR_ENUMS } from '@/lib/enums';
import { ToolbarBtn } from '@/lib/types/viewer-context';

type UpdateActiveToolbarBtn = (btn: ToolbarBtn | null) => void;
type OnFutureFeatClick = () => void;

export interface ToolbarButtonConfig {
  tooltip: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  dropdownContent?: React.ReactNode;
}

export const annotateButtons = (
  activeToolbarBtn: ToolbarBtn | null,
  onFutureFeatClick: OnFutureFeatClick
): ToolbarButtonConfig[] => [
  {
    tooltip: 'Erase',
    icon: (
      <Eraser
        strokeWidth={1.5}
        style={{ width: '1.5rem', height: '1.5rem' }}
        color="#325167"
      />
    ),
    label: 'Eraser',
    isActive: activeToolbarBtn?.id === TOOLBAR_BTNS.ERASE,
    onClick: onFutureFeatClick,
    dropdownContent: (
      <div>
        <p>Coming soon!</p>
      </div>
    ),
  },
  {
    tooltip: 'Type',
    icon: (
      <Type
        strokeWidth={1.5}
        style={{ width: '1.5rem', height: '1.5rem' }}
        color="#325167"
      />
    ),
    label: 'Type',
    isActive: activeToolbarBtn?.id === TOOLBAR_BTNS.TYPE,
    onClick: onFutureFeatClick,
    dropdownContent: (
      <div>
        <p>Coming soon!</p>
      </div>
    ),
  },
  {
    tooltip: 'Draw',
    icon: (
      <PenTool
        strokeWidth={1.5}
        style={{ width: '1.5rem', height: '1.5rem' }}
        color="#325167"
      />
    ),
    label: 'Draw',
    isActive: activeToolbarBtn?.id === TOOLBAR_BTNS.DRAW,
    onClick: onFutureFeatClick,
    dropdownContent: (
      <div>
        <p>Coming soon!</p>
      </div>
    ),
  },
];

export const highlightButtons = (
  activeToolbarBtn: ToolbarBtn | null,
  updateActiveToolbarBtn: UpdateActiveToolbarBtn
): ToolbarButtonConfig[] => [
  {
    tooltip: 'Highlight',
    icon: (
      <Highlighter
        strokeWidth={1.5}
        style={{ width: '1.5rem', height: '1.5rem' }}
        color="#325167"
      />
    ),
    label: 'Highlight',
    isActive: activeToolbarBtn?.id === TOOLBAR_BTNS.HIGHLIGHT,
    onClick: () =>
      updateActiveToolbarBtn({
        id: TOOLBAR_BTNS.HIGHLIGHT,
        label: 'Highlight',
        onClick: () => null,
        hideCustomCursor: true,
      }),
    dropdownContent: <HighlightStylePane />,
  },
];

export const underlineButtons = (
  activeToolbarBtn: ToolbarBtn | null,
  onFutureFeatClick: OnFutureFeatClick
): ToolbarButtonConfig[] => [
  {
    tooltip: 'Underline',
    icon: (
      <Underline
        strokeWidth={1.5}
        style={{ width: '1.5rem', height: '1.5rem' }}
        color="#325167"
      />
    ),
    label: 'Underline',
    isActive: activeToolbarBtn?.id === TOOLBAR_BTNS.UNDERLINE,
    onClick: onFutureFeatClick,
    dropdownContent: (
      <div>
        <p>Coming soon!</p>
      </div>
    ),
  },
];

export const toolbarConfig = (
  activeToolbarBtn: ToolbarBtn | null,
  updateActiveToolbarBtn: UpdateActiveToolbarBtn,
  onFutureFeatClick: OnFutureFeatClick
): Partial<Record<LEFT_SIDEBAR_ENUMS, ToolbarButtonConfig[]>> => ({
  [LEFT_SIDEBAR_ENUMS.ANOTATE]: annotateButtons(
    activeToolbarBtn,
    onFutureFeatClick
  ),
  [LEFT_SIDEBAR_ENUMS.HIGHLIGHT]: highlightButtons(
    activeToolbarBtn,
    updateActiveToolbarBtn
  ),
  [LEFT_SIDEBAR_ENUMS.UNDERLINE]: underlineButtons(
    activeToolbarBtn,
    onFutureFeatClick
  ),
});
