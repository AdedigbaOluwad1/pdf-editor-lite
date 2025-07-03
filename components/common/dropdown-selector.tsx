import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import Tooltip from './tooltip';

interface DropdownSelectorProps extends React.ComponentProps<'div'> {
  onClick?: () => void;
  isActive?: boolean;
  dropdowncontent?: React.ReactNode;
  tooltip?: {
    dropdownTooltipContent?: string;
    side?: 'top' | 'right' | 'bottom' | 'left';
    buttonTooltipContent?: string;
  };
  dropdown?: {
    align?: 'center' | 'end' | 'start';
    side?: 'top' | 'right' | 'bottom' | 'left';
  };
}

export default function DropdownSelector({
  onClick,
  dropdown,
  tooltip,
  isActive,
  ...props
}: DropdownSelectorProps) {
  return (
    <div
      {...props}
      className={twMerge(
        props.className,
        `flex items-center gap-1.5 p-2 rounded-md group hover:bg-[#dcdee0] ${
          isActive && 'bg-[#d0e6f2] hover:bg-[#d0e6f2!important]'
        } cursor-pointer`
      )}
    >
      <DropdownMenu modal={false}>
        <Tooltip content={tooltip?.dropdownTooltipContent} side={tooltip?.side}>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <button onClick={onClick} className={`cursor-pointer`}>
              {props.children}
            </button>
          </DropdownMenuTrigger>
        </Tooltip>

        <DropdownMenuContent
          sideOffset={15}
          side={dropdown?.side}
          align={dropdown?.align}
          className={`${dropdown?.align === 'start' && 'ml-[-2.5rem]'}`}
          forceMount
        >
          <div className="p-2">{props.dropdowncontent}</div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
