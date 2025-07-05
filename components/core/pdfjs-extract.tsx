/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import {
  OPS,
  getDocument,
  GlobalWorkerOptions,
  PDFDocumentProxy,
  PDFPageProxy,
} from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface PdfJsExtractDemoProps {
  file: string | ArrayBuffer;
  pageNumber?: number;
  scale?: number;
  rotation?: number;
  onPageLoad?: (param: { numPages: number }) => void;
}

function PdfJsExtract({
  file,
  pageNumber = 1,
  scale = 1.0,
  rotation,
  onPageLoad,
}: PdfJsExtractDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);

  // Load PDF document once
  useEffect(() => {
    let isMounted = true;

    const loadPDF = async () => {
      try {
        const loadingTask = getDocument({
          data: file instanceof ArrayBuffer ? file.slice(0) : file,
        });

        const pdf = await loadingTask.promise;

        if (isMounted) {
          setPdfDoc(pdf);
          onPageLoad?.({ numPages: pdf.numPages });
        }
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPDF();

    return () => {
      isMounted = false;
    };
  }, [file, onPageLoad]);

  // Render page whenever pageNumber or scale changes
  useEffect(() => {
    if (!pdfDoc) return;

    let renderTask: ReturnType<PDFPageProxy['render']> | null = null;
    let cancelled = false;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(pageNumber);
        const viewport = page.getViewport({ scale, rotation: rotation });

        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        context.clearRect(0, 0, canvas.width, canvas.height);

        renderTask = page.render({ canvasContext: context, viewport });
        await renderTask.promise;

        if (cancelled) return;

        // Extract text + image ops (optional)
        const textContent = await page.getTextContent();
        const textItems = textContent.items.map((item: any) => ({
          type: 'text',
          value: item.str,
          remaining: item,
        }));

        const opList = await page.getOperatorList();
        const images = opList.fnArray
          .map((fn, i) =>
            fn === OPS.paintImageXObject || fn === OPS.paintXObject
              ? { type: 'image', index: i }
              : null
          )
          .filter(Boolean) as { type: 'image'; index: number }[];

        const content = [...textItems, ...images];
        console.log('Extracted content:', content);
      } catch (error) {
        console.error('Error rendering page:', error);
      }
    };

    renderPage();

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [pdfDoc, pageNumber, scale, rotation]);

  return (
    <div className="flex items-center justify-center w-fit border bg-white h-fit m-auto">
      <canvas ref={canvasRef} />
    </div>
  );
}

export default React.memo(PdfJsExtract);
