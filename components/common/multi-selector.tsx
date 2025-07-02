import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import Tooltip from './tooltip';

interface MultiSelectorProps extends React.ComponentProps<'div'> {
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

export default function MultiSelector({
	onClick,
	tooltip,
	dropdown,
	isActive,
	...props
}: MultiSelectorProps) {
	return (
		<div
			{...props}
			className={twMerge(
				props.className,
				`flex items-center gap-1.5 p-[3px] pr-2 rounded-md group hover:bg-[#e2e8ed] ${
					isActive && 'hover:bg-[#dcdee0!important]'
				} cursor-pointer`
			)}
		>
			<Tooltip
				content={tooltip?.buttonTooltipContent}
				side={tooltip?.side}
			>
				<button
					onClick={onClick}
					className={`${
						isActive &&
						'bg-[#d0e6f2] group-hover:bg-[#d0e6f2!important]'
					} cursor-pointer rounded-sm p-[4px] group-hover:bg-[#eeeff1] `}
				>
					{props.children}
				</button>
			</Tooltip>

			<DropdownMenu modal={false}>
				<Tooltip
					content={tooltip?.dropdownTooltipContent}
					side={tooltip?.side}
				>
					<DropdownMenuTrigger
						asChild
						className='cursor-pointer'
					>
						<ChevronDown
							strokeWidth={1.5}
							style={{ width: '1.25rem', height: '1.25rem' }}
							color='#325167'
						/>
					</DropdownMenuTrigger>
				</Tooltip>

				<DropdownMenuContent
					sideOffset={15}
					side={dropdown?.side}
					align={dropdown?.align}
					className={`${
						dropdown?.align === 'start' && 'ml-[-2.5rem]'
					}`}
					forceMount
				>
					<div className='p-2'>{props.dropdowncontent}</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
