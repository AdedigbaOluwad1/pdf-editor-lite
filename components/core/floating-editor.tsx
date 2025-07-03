/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useViewerContext } from '../layout/context';
import { throttle } from '@/lib/throttle';

export default function FloatingEditor({
  children,
  start: startExternal,
  pos: posExternal,
  onUpdate,
}: {
  children: ReactNode;
  pos: {
    x: number;
    y: number;
  };
  start: {
    x: number;
    y: number;
  };
  onUpdate: (param: {
    pos?: { x: number; y: number };
    start?: { x: number; y: number };
  }) => void;
}) {
  const { setIsFloatingEditorHovered, isCursorWithinRect } = useViewerContext();
  const [canMove, setCanMove] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef(posExternal);
  const start = useRef(startExternal);
  const lastDX = useRef(0);
  const lastDY = useRef(0);

  const throttledMove = useMemo(
    () =>
      throttle((x: number, y: number) => {
        const dx = x - start.current.x;
        const dy = y - start.current.y;
        const newX = pos.current.x + dx;
        const newY = pos.current.y + dy;

        ref.current!.style.transform = `translate(${newX}px, ${newY}px)`;
      }, 16),
    [pos, start]
  );

  useEffect(() => {
    const editor = ref.current;

    const handleMouseEnter = () => setIsFloatingEditorHovered(true);
    const handleMouseLeave = () => setIsFloatingEditorHovered(false);

    editor?.addEventListener('mouseenter', handleMouseEnter);
    editor?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      editor?.removeEventListener('mouseenter', handleMouseEnter);
      editor?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [setIsFloatingEditorHovered]);

  useEffect(() => {
    // setCanMove(false);
    const editor = ref.current;
    if (!editor || !isCursorWithinRect) return;

    const onStartMouse = (e: MouseEvent) => {
      onStart(e.clientX, e.clientY);
    };
    const onStartTouch = (e: TouchEvent) => {
      onStart(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onStart = (x: number, y: number) => {
      setCanMove(true);
      onUpdate({ start: { x, y } });
      start.current = { x, y };
    };

    const onEnd = () => {
      setCanMove(false);
      throttle(() => {
        onUpdate({
          pos: {
            x: pos.current.x + lastDX.current,
            y: pos.current.y + lastDX.current,
          },
        });
      }, 2000)();
      pos.current.x += lastDX.current;
      pos.current.y += lastDY.current;
    };

    editor.addEventListener('mousedown', onStartMouse);
    editor.addEventListener('mouseup', onEnd);
    editor.addEventListener('touchstart', onStartTouch);
    editor.addEventListener('touchend', onEnd);

    return () => {
      editor.removeEventListener('mousedown', onStartMouse);
      editor.removeEventListener('mouseup', onEnd);
      editor.removeEventListener('touchstart', onStartTouch);
      editor.removeEventListener('touchend', onEnd);
    };
  }, [isCursorWithinRect, pos, start, onUpdate]);

  useEffect(() => {
    const editor = ref.current;
    if (!canMove || !editor || !isCursorWithinRect) return;

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const dx = touch.clientX - start.current.x;
      const dy = touch.clientY - start.current.y;
      lastDX.current = dx;
      lastDY.current = dy;

      throttledMove(touch.clientX, touch.clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - start.current.x;
      const dy = e.clientY - start.current.y;
      lastDX.current = dx;
      lastDY.current = dy;

      throttledMove(e.clientX, e.clientY);
    };

    editor?.addEventListener('mousemove', onMouseMove);
    editor?.addEventListener('touchmove', onTouchMove);

    return () => {
      editor?.removeEventListener('mousemove', onMouseMove);
      editor?.removeEventListener('touchmove', onTouchMove);
    };
  }, [canMove, isCursorWithinRect, throttledMove, pos, start]);

  useEffect(() => {
    pos.current = posExternal;
    start.current = startExternal;

    const newX = pos.current.x + lastDX.current;
    const newY = pos.current.y + lastDY.current;
    ref.current!.style.transform = `translate(${newX}px, ${newY}px)`;
  }, []);

  return (
    <div
      ref={ref}
      className="absolute hover:z-300 select-none hover:select-auto z-20 text-white resize overflow-auto border border-gray-300 p-2 w-64 h-24 text-lg font-sans cursor-[move!important]"
      style={{ transform: 'translate(0px, 0px)' }}
    >
      {children}
    </div>
  );
}
