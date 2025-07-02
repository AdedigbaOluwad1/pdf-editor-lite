import React from 'react';
import {
	TooltipContent,
	TooltipProvider,
	Tooltip as TooltipRoot,
	TooltipTrigger,
} from '../ui/tooltip';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';

interface TooltipProps
	extends React.ComponentProps<typeof TooltipPrimitive.Provider> {
	content?: string;
	side?: 'top' | 'right' | 'bottom' | 'left';
	sideOffset?: number;
}

export default function Tooltip(props: TooltipProps) {
	return (
		<TooltipProvider>
			<TooltipRoot>
				<TooltipTrigger asChild>{props.children}</TooltipTrigger>
				<TooltipContent
					side={props?.side}
					sideOffset={props?.sideOffset || 10}
					className={props.content ? undefined : 'hidden'}
				>
					<p className='text-sm'>{props.content}</p>
				</TooltipContent>
			</TooltipRoot>
		</TooltipProvider>
	);
}
