import React from 'react';
import IconButton from '../../common/icon-button';
import Tooltip from '../../common/tooltip';
import { UndoDot, RedoDot } from 'lucide-react';

interface ToolbarRotateControlsProps {
  onRotateLeft: () => void;
  onRotateRight: () => void;
}

export default function ToolbarRotateControls({
  onRotateLeft,
  onRotateRight,
}: ToolbarRotateControlsProps) {
  return (
    <>
      <Tooltip content="Rotate left" side="bottom" sideOffset={10}>
        <IconButton onClick={onRotateLeft} className="p-2 hover:bg-[#dae1e8]">
          <UndoDot
            strokeWidth={1.5}
            style={{ width: '1.5rem', height: '1.5rem' }}
            color="#325167"
          />
        </IconButton>
      </Tooltip>
      <Tooltip content="Rotate right" side="bottom" sideOffset={10}>
        <IconButton onClick={onRotateRight} className="p-2 hover:bg-[#dae1e8]">
          <RedoDot
            strokeWidth={1.5}
            style={{ width: '1.5rem', height: '1.5rem' }}
            color="#325167"
          />
        </IconButton>
      </Tooltip>
    </>
  );
}
