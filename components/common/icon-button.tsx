import React from 'react';
import { Button, buttonVariants } from '../ui/button';
import { type VariantProps } from 'class-variance-authority';

interface IconButtonProps
	extends React.ComponentProps<'button'>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

export default function IconButton({ children, ...props }: IconButtonProps) {
	return (
		<Button
			{...props}
			variant={'icon'}
			size={'icon'}
		>
			{children}
		</Button>
	);
}
