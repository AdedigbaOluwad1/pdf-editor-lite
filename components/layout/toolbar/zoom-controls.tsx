import React from 'react';
import IconButton from '../../common/icon-button';
import Tooltip from '../../common/tooltip';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface ToolbarZoomControlsProps {
  canvasScale: number;
  updateCanvasScale: (scale: number) => void;
}

export default function ToolbarZoomControls({
  canvasScale,
  updateCanvasScale,
}: ToolbarZoomControlsProps) {
  return (
    <>
      <Tooltip content="Zoom out" side="bottom" sideOffset={10}>
        <IconButton
          disabled={canvasScale <= 0.3}
          onClick={() => updateCanvasScale(canvasScale / 1.2)}
          className="p-2 hover:bg-[#dae1e8]"
        >
          <ZoomOut
            strokeWidth={1.5}
            style={{ width: '1.5rem', height: '1.5rem' }}
            color="#325167"
          />
        </IconButton>
      </Tooltip>
      <Tooltip content="Zoom in" side="bottom" sideOffset={10}>
        <IconButton
          disabled={canvasScale >= 3}
          onClick={() => updateCanvasScale(canvasScale * 1.2)}
          className="p-2 hover:bg-[#dae1e8]"
        >
          <ZoomIn
            strokeWidth={1.5}
            style={{ width: '1.5rem', height: '1.5rem' }}
            color="#325167"
          />
        </IconButton>
      </Tooltip>
    </>
  );
}
