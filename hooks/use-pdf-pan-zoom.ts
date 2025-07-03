import { useEffect } from 'react';

/**
 * Custom hook to enable panning and pinch-to-zoom on a PDF container.
 * @param options - Configuration options
 *   - containerId: The DOM id of the PDF container
 *   - cursorMode: The current cursor mode (should be 'pan' to enable)
 *   - documentUploadStatus: Status to check if PDF is loaded
 *   - updateCanvasScale: Callback to update the canvas scale
 */
export interface UsePdfPanZoomOptions {
  containerId: string;
  cursorMode: string;
  documentUploadStatus: string | number;
  loadedStatus: string | number;
  updateCanvasScale: (scale: number) => void;
}

export function usePdfPanZoom({
  containerId,
  cursorMode,
  documentUploadStatus,
  loadedStatus,
  updateCanvasScale,
}: UsePdfPanZoomOptions) {
  useEffect(() => {
    const wrapper = document.getElementById(containerId);
    if (!wrapper || documentUploadStatus !== loadedStatus) return;

    let isPanning = false;
    let startX: number, startY: number, scrollLeft: number, scrollTop: number;
    let scale = 1;
    let initialDistance: number | null = null;
    let lastScale = 1;

    const getDistance = (touches: TouchList) => {
      const [touch1, touch2] = [touches[0], touches[1]];
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.hypot(dx, dy);
    };

    const disablePointerEvents = () => wrapper.classList.add('disable-pointer');
    const enablePointerEvents = () => wrapper.classList.remove('disable-pointer');

    const handleMouseDown = (e: MouseEvent) => {
      if (cursorMode !== 'pan') return;
      isPanning = true;
      wrapper.classList.add('grabbing');
      startX = e.pageX - wrapper.offsetLeft;
      startY = e.pageY - wrapper.offsetTop;
      scrollLeft = wrapper.scrollLeft;
      scrollTop = wrapper.scrollTop;
    };

    const handleMouseLeaveOrUp = () => {
      if (cursorMode !== 'pan') return;
      isPanning = false;
      wrapper.classList.remove('grabbing');
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning || cursorMode !== 'pan') return;
      e.preventDefault();
      const x = e.pageX - wrapper.offsetLeft;
      const y = e.pageY - wrapper.offsetTop;
      wrapper.scrollLeft = scrollLeft - (x - startX);
      wrapper.scrollTop = scrollTop - (y - startY);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (cursorMode !== 'pan') return;
      if (e.touches.length === 2) {
        disablePointerEvents();
        initialDistance = getDistance(e.touches);
        lastScale = scale;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (cursorMode !== 'pan') return;
      if (e.touches.length === 2 && initialDistance) {
        e.preventDefault();
        const currentDistance = getDistance(e.touches);
        const zoomFactor = currentDistance / initialDistance;
        scale = Math.max(0.1, Math.min(zoomFactor * lastScale, 5));
        updateCanvasScale(scale);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (cursorMode !== 'pan') return;
      if (e.touches.length < 2) {
        initialDistance = null;
        enablePointerEvents();
      }
    };

    wrapper.addEventListener('mousedown', handleMouseDown);
    wrapper.addEventListener('mouseleave', handleMouseLeaveOrUp);
    wrapper.addEventListener('mouseup', handleMouseLeaveOrUp);
    wrapper.addEventListener('mousemove', handleMouseMove);
    wrapper.addEventListener('touchstart', handleTouchStart, { passive: false });
    wrapper.addEventListener('touchmove', handleTouchMove, { passive: false });
    wrapper.addEventListener('touchend', handleTouchEnd);

    return () => {
      wrapper.removeEventListener('mousedown', handleMouseDown);
      wrapper.removeEventListener('mouseleave', handleMouseLeaveOrUp);
      wrapper.removeEventListener('mouseup', handleMouseLeaveOrUp);
      wrapper.removeEventListener('mousemove', handleMouseMove);
      wrapper.removeEventListener('touchstart', handleTouchStart);
      wrapper.removeEventListener('touchmove', handleTouchMove);
      wrapper.removeEventListener('touchend', handleTouchEnd);
    };
  }, [containerId, cursorMode, documentUploadStatus, loadedStatus, updateCanvasScale]);
} 