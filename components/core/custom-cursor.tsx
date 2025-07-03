import { useViewerContext } from '@/contexts';
import { ToolbarBtn } from '@/lib/types/viewer-context';
import { useEffect, useState } from 'react';

export default function CustomCursor({
  toolbarBtn,
}: {
  toolbarBtn: ToolbarBtn | null;
}) {
  const {
    canvasScale,
    currentPage,
    isFloatingEditorHovered,
    isCursorWithinRect,
    setIsCursorWithinRect,
  } = useViewerContext();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = document.getElementsByClassName('textLayer')?.[0];

    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const mouseEnter = () => {
      console.log('Hey');
      setIsCursorWithinRect(true);
    };

    const mouseLeave = () => {
      setIsCursorWithinRect(false);
    };

    window.addEventListener('mousemove', move);
    container?.addEventListener('mouseenter', mouseEnter);
    container?.addEventListener('mouseleave', mouseLeave);

    return () => {
      window.removeEventListener('mousemove', move);
      container?.classList.remove('cursor-crosshair');
      container?.removeEventListener('mouseenter', mouseEnter);
      container?.removeEventListener('mouseleave', mouseLeave);
    };
  }, [canvasScale, setIsCursorWithinRect, currentPage]);

  useEffect(() => {
    const container = document.getElementsByClassName('textLayer')?.[0];
    if (toolbarBtn && !toolbarBtn.hideCustomCursor) {
      container?.classList.add('cursor-crosshair');
    } else {
      container?.classList.remove('cursor-crosshair');
    }

    const handleClick = () => {
      if (!isCursorWithinRect || isFloatingEditorHovered) return;
      toolbarBtn?.onClick?.();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleClick();
      }
    };

    window?.addEventListener('click', handleClick);
    window?.addEventListener('keydown', handleKeyDown);
    return () => {
      window?.removeEventListener('click', handleClick);
      window?.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCursorWithinRect, toolbarBtn, isFloatingEditorHovered]);

  if (!isFloatingEditorHovered && toolbarBtn && !toolbarBtn?.hideCustomCursor)
    return (
      <div
        className="bg-primary"
        style={{
          position: 'fixed',
          left: position.x + 10,
          top: position.y + 10,
          pointerEvents: 'none',
          zIndex: 9999,
          fontSize: '12px',
          color: '#fff',
          padding: '4px 8px',
          borderRadius: '4px',
          whiteSpace: 'nowrap',
          fontFamily: 'sans-serif',
        }}
      >
        <p
          className="text-white text-sm"
          style={{ fontFamily: 'var(--font-nunito)' }}
        >
          {toolbarBtn?.label}
        </p>
      </div>
    );
}
