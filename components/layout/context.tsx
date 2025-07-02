'use client';

import * as React from 'react';
import { toast } from '@/components/core/toaster';
import {
	DOCUMENT_UPLOAD_STATUS,
	LEFT_SIDEBAR_ENUMS,
	TOOLBAR_BTNS,
} from '@/lib/enums';
import useHistory from '../../hooks/use-history';
import useKeyboardShortcuts from '@/hooks/use-keyboard-shortcuts';
import { PDFDocument, rgb } from 'pdf-lib';
import useReactor from '@/hooks/use-reactor';
import { IHighlight } from 'react-pdf-highlighter';

export type cursorMode = 'pan' | 'cursor' | 'grabbing';

interface documentProps {
	rotate: number;
	highlights: IHighlight[];
}

const initDocumentProps: documentProps = {
	rotate: 0,
	highlights: [],
};

export interface ToolbarBtn {
	id: TOOLBAR_BTNS;
	onClick: (() => void) | null;
	label: string | null;
	hideCustomCursor?: boolean;
}

export interface ViewerContextValue {
	isFocusModeEnabled: boolean;
	activeToolbarBtn: ToolbarBtn | null;
	activeSidebarBtn: LEFT_SIDEBAR_ENUMS;
	documentUploadStatus: DOCUMENT_UPLOAD_STATUS;
	document: File | null;
	canvasScale: number;
	cursorMode: cursorMode;
	currentPage: number;
	pageCount: number;
	documentProps: documentProps;
	loadedPdfDoc: PDFDocument | null;
	redo: () => void;
	undo: () => void;
	canUndo: boolean;
	canRedo: boolean;
	isFloatingEditorHovered: boolean;
	isCursorWithinRect: boolean;

	setIsCursorWithinRect: React.Dispatch<React.SetStateAction<boolean>>;
	setIsFloatingEditorHovered: React.Dispatch<React.SetStateAction<boolean>>;
	updateActiveToolbarBtn: (param: ToolbarBtn | null) => void;
	updateActiveSidebarBtn: (param: LEFT_SIDEBAR_ENUMS) => void;
	onDocumentDownload: () => void;
	onDocumentUpload: (document: File) => void;
	updateDocumentUploadStatus: (param: DOCUMENT_UPLOAD_STATUS) => void;
	onDocumentUploadCancel: () => void;
	onFocusModeToggle: () => void;
	onDocumentPrint: () => void;
	onFutureFeatClick: () => void;
	updateCanvasScale: (newScale: number) => void;
	updateCursorMode: (newMode: cursorMode) => void;
	updateCurrentPage: (newPage: number) => void;
	updatePageCount: (param: number) => void;
	updateDocumentProps: (
		payload: (
			currentProps: documentProps,
			initProps: documentProps
		) => documentProps | documentProps
	) => void;
	onLoadedPdfDocUpdate: (
		param: Uint8Array<ArrayBufferLike> | undefined
	) => void;
}

export const ViewerContext = React.createContext<ViewerContextValue>({
	isFocusModeEnabled: false,
	activeToolbarBtn: null,
	activeSidebarBtn: LEFT_SIDEBAR_ENUMS.POPULAR,
	documentUploadStatus: DOCUMENT_UPLOAD_STATUS.PRE_UPLOAD,
	cursorMode: 'cursor',
	canvasScale: 1.5,
	document: null,
	currentPage: 1,
	pageCount: 1,
	documentProps: initDocumentProps,
	canRedo: false,
	canUndo: false,
	isFloatingEditorHovered: false,
	isCursorWithinRect: false,
	loadedPdfDoc: null,
	setIsCursorWithinRect: () => false,
	setIsFloatingEditorHovered: () => false,
	undo: () => {},
	redo: () => {},
	updateActiveToolbarBtn: () => {},
	updateActiveSidebarBtn: () => {},
	onDocumentDownload: () => {},
	onDocumentUpload: () => {},
	onDocumentUploadCancel: () => {},
	updateDocumentUploadStatus: () => {},
	onFocusModeToggle: () => {},
	onDocumentPrint: () => {},
	onFutureFeatClick: () => {},
	updateCanvasScale: () => {},
	updateCursorMode: () => {},
	updateCurrentPage: () => {},
	updatePageCount: () => {},
	updateDocumentProps: () => {},
	onLoadedPdfDocUpdate: () => {},
});

interface ViewerContextProviderProps {
	children: React.ReactNode;
}

export default function ViewerContextProvider({
	children,
}: ViewerContextProviderProps): React.JSX.Element {
	const {
		state: documentProps,
		update: setDocumentProps,
		canRedo,
		canUndo,
		redo: redoDocumentPropsUpdate,
		undo: undoDocumentPropsUpdate,
	} = useHistory<documentProps>(initDocumentProps);
	const { loadPdfDoc } = useReactor();

	const [isFocusModeEnabled, setIsFocusModeEnabled] = React.useState(false);
	const [activeToolbarBtn, setActiveToolbarBtn] =
		React.useState<ToolbarBtn | null>(null);

	const [activeSidebarBtn, setActiveSidebarBtn] = React.useState(
		LEFT_SIDEBAR_ENUMS.POPULAR
	);

	const [document, setDocument] = React.useState<File | null>(null);
	const [canvasScale, setCanvasScale] = React.useState(1.5);

	const [cursorMode, setCursorMode] = React.useState<cursorMode>('cursor');
	const [currentPage, setCurrentPage] = React.useState(1);
	const [pageCount, setPageCount] = React.useState(1);

	const [documentUploadStatus, setDocumentUploadStatus] =
		React.useState<DOCUMENT_UPLOAD_STATUS>(
			DOCUMENT_UPLOAD_STATUS.PRE_UPLOAD
		);

	const [isFloatingEditorHovered, setIsFloatingEditorHovered] =
		React.useState(false);

	const [isCursorWithinRect, setIsCursorWithinRect] = React.useState(false);
	const [loadedPdfDoc, setLoadedPdfDoc] = React.useState<PDFDocument | null>(
		null
	);

	const onDocumentDownload = async () => {
		if (!document) return toast.info('Upload a document to continue!');

		toast.info('Document download initiated');
		const pdfDoc = await PDFDocument.load(await document.arrayBuffer());

		const pages = pdfDoc.getPages();

		documentProps.highlights.forEach((highlight) => {
			const page = pages[highlight.position.pageNumber - 1];
			const { x1, y1, width, height } = highlight.position.boundingRect;

			console.log({
				x1,
				y1,
				pageHeight: page.getHeight(),
				pageWidth: page.getWidth(),
				y: y1 - page.getHeight(),
				x: page.getWidth() - x1,
				width,
				height,
				extras: highlight.position,
			});

			page.drawRectangle({
				y: y1 - page.getHeight(),
				x: page.getWidth() - x1,
				color: rgb(1, 1, 0),
				opacity: 0.4,
				width: 200,
				height: 40,
			});
		});

		const pdfBytes = await pdfDoc.save();
		const blob = new Blob([pdfBytes], { type: 'application/pdf' });
		const url = URL.createObjectURL(blob);

		const a = window.document.createElement('a');
		a.href = url;
		a.download = 'highlighted.pdf';
		a.click();
		URL.revokeObjectURL(url);
	};

	const onDocumentUpload = async (document: File) => {
		setDocument(document);
		setLoadedPdfDoc(await loadPdfDoc(document));
		setDocumentUploadStatus(DOCUMENT_UPLOAD_STATUS.UPLOADING);
		toast.info('Document upload initiated');
	};

	const onDocumentUploadCancel = () => {
		setDocument(null);
		setDocumentUploadStatus(DOCUMENT_UPLOAD_STATUS.PRE_UPLOAD);
		toast.info('Document upload cancelled');
	};

	const onDocumentPrint = () => {
		toast.info('Document print initiated');
	};

	const onFutureFeatClick = () => {
		toast.info("📦 This one's still in the box. Stay tuned!");
	};

	const onFocusModeToggle = () => {
		setIsFocusModeEnabled((prev) => !prev);
		toast.info(`Focus mode turned ${isFocusModeEnabled ? 'on' : 'off'}`);
	};

	const updateActiveToolbarBtn = (param: ToolbarBtn | null) => {
		if (documentUploadStatus !== DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR)
			return toast.info('Upload a document to continue!');

		setActiveToolbarBtn((prev) =>
			param ? (prev?.id === param.id ? null : param) : null
		);
	};

	const updateActiveSidebarBtn = (param: LEFT_SIDEBAR_ENUMS) => {
		setActiveSidebarBtn(param);
	};

	const updateDocumentUploadStatus = (param: DOCUMENT_UPLOAD_STATUS) => {
		setDocumentUploadStatus(param);
	};

	const updateCanvasScale = (newScale: number) => {
		if (documentUploadStatus !== DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR)
			return toast.error('Upload a document to continue!');
		setCanvasScale(newScale);
	};

	const updateCursorMode = (newMode: cursorMode) => {
		if (
			newMode === 'pan' &&
			documentUploadStatus !== DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR
		)
			return toast.error('Upload a document to continue!');
		setActiveToolbarBtn(null);
		setCursorMode(newMode);
	};

	const updateCurrentPage = (newPage: number) => {
		if (documentUploadStatus !== DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR)
			return toast.error('Upload a document to continue!');
		setCurrentPage(newPage);
	};

	const updatePageCount = (param: number) => {
		if (documentUploadStatus !== DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR)
			return toast.error('Upload a document to continue!');
		setPageCount(param);
	};

	const updateDocumentProps = (
		payload: (
			currentProps: documentProps,
			initProps: documentProps
		) => documentProps | documentProps
	) => {
		if (documentUploadStatus !== DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR)
			return toast.error('Upload a document to continue!');

		setDocumentProps(
			typeof payload === 'function'
				? payload(documentProps, initDocumentProps)
				: payload
		);
	};

	const undo = () => {
		if (documentUploadStatus !== DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR)
			return toast.error('Upload a document to continue!');

		undoDocumentPropsUpdate();
	};

	const redo = () => {
		if (documentUploadStatus !== DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR)
			return toast.error('Upload a document to continue!');

		redoDocumentPropsUpdate();
	};

	useKeyboardShortcuts({
		undo: undoDocumentPropsUpdate,
		redo: redoDocumentPropsUpdate,
		isEditorModeActive:
			documentUploadStatus === DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR,
	});

	const onLoadedPdfDocUpdate = async (
		updatedDoc: Uint8Array<ArrayBufferLike> | undefined
	) => {
		if (!updatedDoc) return;

		setLoadedPdfDoc(await PDFDocument.load(updatedDoc));
		setDocument(
			(prev) =>
				new File([updatedDoc], prev?.name || '', {
					type: prev?.type || '',
				})
		);
	};

	return (
		<ViewerContext.Provider
			value={{
				isFocusModeEnabled,
				activeToolbarBtn,
				updateActiveToolbarBtn,
				onDocumentDownload,
				onDocumentUpload,
				onFocusModeToggle,
				onDocumentPrint,
				onFutureFeatClick,
				updateActiveSidebarBtn,
				activeSidebarBtn,
				documentUploadStatus,
				document,
				onDocumentUploadCancel,
				updateDocumentUploadStatus,
				canvasScale,
				updateCanvasScale,
				cursorMode,
				updateCursorMode,
				currentPage,
				updateCurrentPage,
				pageCount,
				updatePageCount,
				updateDocumentProps,
				documentProps,
				canRedo,
				canUndo,
				undo,
				redo,
				isFloatingEditorHovered,
				setIsFloatingEditorHovered,
				isCursorWithinRect,
				setIsCursorWithinRect,
				loadedPdfDoc,
				onLoadedPdfDocUpdate,
			}}
		>
			{children}
		</ViewerContext.Provider>
	);
}

export function useViewerContext(): ViewerContextValue {
	return React.useContext(ViewerContext);
}
