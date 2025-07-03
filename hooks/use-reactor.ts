import { PDFDocument } from 'pdf-lib';

export default function useReactor() {
  const getPage = (pdfDoc: PDFDocument, pageNum: number) => {
    const page = pdfDoc.getPage(pageNum);
    return page;
  };

  const getPageSize = (pdfDoc: PDFDocument, pageNum: number) => {
    const size = getPage(pdfDoc, pageNum).getSize();
    return size;
  };

  const loadPdfDoc = async (document: File) => {
    const pdfDoc = await PDFDocument.load(await document?.arrayBuffer());
    return pdfDoc;
  };

  const savePdfDoc = async (pdfDoc: PDFDocument) => {
    const updatedPdfDoc = await pdfDoc.save();
    return updatedPdfDoc;
  };

  return { getPageSize, loadPdfDoc, savePdfDoc, getPage };
}
