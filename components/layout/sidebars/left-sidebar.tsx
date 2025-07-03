'use client';
import React from 'react';
import {
  ChevronFirst,
  Highlighter,
  NotebookPen,
  Puzzle,
  Underline,
} from 'lucide-react';
import Tooltip from '@/components/common/tooltip';
import { useViewerContext } from '@/contexts';
import { LEFT_SIDEBAR_ENUMS } from '@/lib/enums';

interface MenuButtonProps {
  icon: React.ReactNode;
  title?: string;
  onClick?: () => void;
  isActive?: boolean;
}

function MenuButton({ icon, title, onClick, isActive }: MenuButtonProps) {
  return (
    <button
      className="cursor-pointer flex items-center flex-col group"
      onClick={onClick}
    >
      <div
        className={`group-hover:bg-[#e2e8ed] w-[40px] aspect-square flex items-center justify-center rounded-md ${
          isActive && 'bg-[#c4f0fd] group-hover:bg-[#c4f0fd!important]'
        }`}
      >
        {icon}
      </div>
      {title && (
        <p className={`text-sm ${isActive && 'text-[#087191]'}`}>{title}</p>
      )}
    </button>
  );
}

export function LeftSidebar() {
  const {
    onFocusModeToggle,
    isFocusModeEnabled,
    updateActiveSidebarBtn,
    activeSidebarBtn,
  } = useViewerContext();
  return (
    <div className="p-1 flex flex-col gap-4 items-center">
      <MenuButton
        icon={
          <Puzzle
            size={'1.5rem'}
            strokeWidth={1.25}
            style={{ width: '1.5rem', height: '1.5rem' }}
          />
        }
        onClick={() => updateActiveSidebarBtn(LEFT_SIDEBAR_ENUMS.POPULAR)}
        title="Popular"
        isActive={activeSidebarBtn === LEFT_SIDEBAR_ENUMS.POPULAR}
      />

      <MenuButton
        icon={
          <NotebookPen
            size={'1.5rem'}
            strokeWidth={1.25}
            style={{ width: '1.5rem', height: '1.5rem' }}
          />
        }
        onClick={() => updateActiveSidebarBtn(LEFT_SIDEBAR_ENUMS.ANOTATE)}
        title="Anotate"
        isActive={activeSidebarBtn === LEFT_SIDEBAR_ENUMS.ANOTATE}
      />

      <MenuButton
        icon={
          <Underline
            size={'1.5rem'}
            strokeWidth={1.25}
            style={{ width: '1.5rem', height: '1.5rem' }}
          />
        }
        onClick={() => updateActiveSidebarBtn(LEFT_SIDEBAR_ENUMS.UNDERLINE)}
        title="Underline"
        isActive={activeSidebarBtn === LEFT_SIDEBAR_ENUMS.UNDERLINE}
      />

      <MenuButton
        icon={
          <Highlighter
            size={'1.5rem'}
            strokeWidth={1.25}
            style={{ width: '1.5rem', height: '1.5rem' }}
          />
        }
        onClick={() => updateActiveSidebarBtn(LEFT_SIDEBAR_ENUMS.HIGHLIGHT)}
        title="Highlight"
        isActive={activeSidebarBtn === LEFT_SIDEBAR_ENUMS.HIGHLIGHT}
      />

      <div className="mt-auto pb-4">
        <MenuButton
          onClick={onFocusModeToggle}
          icon={
            <Tooltip
              content={
                isFocusModeEnabled ? 'Disable focus mode' : 'Enable focus mode'
              }
              side="right"
              sideOffset={20}
            >
              <ChevronFirst
                size={'1.5rem'}
                strokeWidth={1.25}
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  transform: !isFocusModeEnabled
                    ? 'rotate(-180deg)'
                    : undefined,
                  transition: 'ease all 0.5s',
                }}
              />
            </Tooltip>
          }
        />
      </div>
    </div>
  );
}
