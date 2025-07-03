import React from 'react';
import {
  AvatarFallback,
  AvatarImage,
  Avatar as AvatarRoot,
} from '../ui/avatar';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

interface AvatarProps
  extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  alt?: string;
  src?: string;
  fallback?: string;
}

export default function Avatar(props: AvatarProps) {
  return (
    <AvatarRoot {...props}>
      <AvatarImage src={props?.src} alt={props?.alt} />
      <AvatarFallback>{props?.fallback}</AvatarFallback>
    </AvatarRoot>
  );
}
