/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { useViewerContext } from '../layout/context';
import { motion } from 'motion/react';
import { DOCUMENT_UPLOAD_STATUS, TOOLBAR_BTNS } from '@/lib/enums';
import CustomCursor from './custom-cursor';
import {
	AreaHighlight,
	Content,
	PdfHighlighter,
	PdfLoader,
	Popup,
	ScaledPosition,
	NewHighlight,
	Highlight,
	IHighlight,
} from 'react-pdf-highlighter';

import 'react-pdf-highlighter/dist/style.css';
import { Highlighter, MessageSquareText } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () =>
	document.location.hash.slice('#highlight-'.length);

const resetHash = () => {
	document.location.hash = '';
};

export function PdfViewer() {
	const {
		documentUploadStatus,
		canvasScale,
		updateCanvasScale,
		cursorMode,
		activeToolbarBtn,
		document: file,
		documentProps,
		updateDocumentProps,
	} = useViewerContext();

	const url = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);
	const scrollViewerTo = useRef((highlight: IHighlight) => {
		console.log(highlight.id);
	});

	const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
	const [incompleteHighlightProps, setIncompleteHighlightProps] =
		useState<NewHighlight | null>(null);

	const getHighlightById = useCallback(
		(id: string) => {
			return documentProps.highlights.find(
				(highlight) => highlight.id === id
			);
		},
		[documentProps.highlights]
	);

	const scrollToHighlightFromHash = useCallback(() => {
		const highlight = getHighlightById(parseIdFromHash());
		if (highlight) {
			console.log('Tried scrolling');
			scrollViewerTo.current(highlight);
		}
	}, [getHighlightById]);

	const addHighlight = (highlight: any) => {
		updateDocumentProps((prev) => ({
			...prev,
			highlights: [{ ...highlight, id: getNextId() }, ...prev.highlights],
		}));
	};

	const updateHighlight = (
		highlightId: string,
		position: Partial<ScaledPosition>,
		content: Partial<Content>
	) => {
		updateDocumentProps((prev) => ({
			...prev,
			highlights: prev.highlights.map((h) => {
				const {
					id,
					position: originalPosition,
					content: originalContent,
					...rest
				} = h;
				return id === highlightId
					? {
							id,
							position: { ...originalPosition, ...position },
							content: { ...originalContent, ...content },
							...rest,
					  }
					: h;
			}),
		}));
	};

	const HighlightPopup = ({
		comment,
	}: {
		comment: { text: string; emoji: string };
	}) =>
		comment.text ? (
			<div className='bg-primary text-white py-2 px-3 rounded-md'>
				{comment.emoji} {comment.text}
			</div>
		) : null;

	const handleSelectionFinished = (
		position: any,
		content: any,
		hideTipAndSelection: any
	) => {
		if (!activeToolbarBtn) return;

		const isHighlight = activeToolbarBtn.id === TOOLBAR_BTNS.HIGHLIGHT;
		const isComment = activeToolbarBtn.id === TOOLBAR_BTNS.COMMENT;

		if (!isHighlight && !isComment) return;

		const icon = isHighlight ? (
			<Highlighter
				strokeWidth={1.5}
				style={{ width: '1.5rem', height: '1.5rem' }}
				className='text-white/70'
			/>
		) : (
			<MessageSquareText
				strokeWidth={1.5}
				style={{ width: '1.5rem', height: '1.5rem' }}
				className='text-white/70'
			/>
		);

		const label = isHighlight ? 'Highlight' : 'Add Comment';

		const handleClick = () => {
			if (isHighlight) {
				addHighlight({
					content,
					position,
					comment: {
						emoji: '',
						text: '',
						color: '#ca2a30',
					},
				});
			} else {
				setIncompleteHighlightProps({
					content,
					position,
					comment: {
						emoji: '',
						text: '',
					},
				});
				setIsCommentModalOpen(true);
			}
			hideTipAndSelection();
		};

		return (
			<button
				onClick={handleClick}
				className='px-3 py-1.5 bg-primary text-white rounded-md cursor-pointer'
			>
				<div className='flex items-center gap-2'>
					{icon}
					<p className='text-sm pr-1'>{label}</p>
				</div>
			</button>
		);
	};

	const CommentDialog = ({
		open,
		onSubmit,
		onClose,
	}: {
		open: boolean;
		onSubmit: (value: string) => void;
		onClose: () => void;
	}) => {
		const [input, updateInput] = useState('');

		useEffect(() => {
			updateInput('');
		}, [open]);
		return (
			<Dialog
				open={open}
				onOpenChange={(e) => !e && onClose()}
			>
				<DialogContent>
					<DialogHeader className='gap-1.5'>
						<DialogTitle>New comment</DialogTitle>
						<DialogDescription>
							{`Add a comment for others to see`}
						</DialogDescription>
					</DialogHeader>

					<form
						className='w-full flex flex-col gap-[1rem]'
						onSubmit={(e) => {
							e.preventDefault();
							onSubmit(input);
						}}
					>
						<div className='flex'>
							<textarea
								onChange={(e) => updateInput(e.target.value)}
								value={input}
								rows={4}
								placeholder='Type a comment..'
								className='border w-full outline-none border-primary/30 rounded-md p-3 text-sm'
							/>
						</div>

						<Button
							type='submit'
							className='w-full min-h-[2.75rem] cursor-pointer'
						>
							Add new comment
						</Button>
					</form>
				</DialogContent>
			</Dialog>
		);
	};

	useEffect(() => {
		const wrapper = document.getElementById('pdfWrapper');
		if (
			!wrapper ||
			documentUploadStatus !== DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR
		)
			return;

		let isPanning = false;
		let startX: number,
			startY: number,
			scrollLeft: number,
			scrollTop: number;

		let scale = 1;
		let initialDistance: number | null = null;
		let lastScale = 1;

		const getDistance = (touches: TouchList) => {
			const [touch1, touch2] = [touches[0], touches[1]];
			const dx = touch1.clientX - touch2.clientX;
			const dy = touch1.clientY - touch2.clientY;
			return Math.hypot(dx, dy);
		};

		const disablePointerEvents = () =>
			wrapper.classList.add('disable-pointer');
		const enablePointerEvents = () =>
			wrapper.classList.remove('disable-pointer');

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
		wrapper.addEventListener('touchstart', handleTouchStart, {
			passive: false,
		});
		wrapper.addEventListener('touchmove', handleTouchMove, {
			passive: false,
		});
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
	}, [documentUploadStatus, updateCanvasScale, cursorMode]);

	useEffect(() => {
		window.addEventListener('hashchange', scrollToHighlightFromHash, false);
		return () => {
			window.removeEventListener(
				'hashchange',
				scrollToHighlightFromHash,
				false
			);
		};
	}, [scrollToHighlightFromHash]);

	if (documentUploadStatus === DOCUMENT_UPLOAD_STATUS.LOADED_IN_EDITOR)
		return (
			<div className='w-full flex h-full bg-[transparent]'>
				<CustomCursor toolbarBtn={activeToolbarBtn} />
				<CommentDialog
					open={isCommentModalOpen}
					onClose={() => setIsCommentModalOpen(false)}
					onSubmit={(e) => {
						setIsCommentModalOpen(false);
						addHighlight({
							...incompleteHighlightProps,
							comment: {
								...incompleteHighlightProps?.comment,
								text: e,
							},
						});

						setIncompleteHighlightProps(null);
					}}
				/>

				<motion.div
					key='pdfViewer'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 20 }}
					transition={{ duration: 0.3, ease: 'easeOut' }}
					className='pdf-container flex relative flex-1 bg-[transparent]'
				>
					<motion.div className='relative my-4 w-full bg-[transparent]'>
						<PdfLoader
							url={url}
							beforeLoad={
								<div className='w-full h-full flex items-center justify-center'>
									<p className=''>Loading..</p>
								</div>
							}
						>
							{(pdfDocument) => (
								<PdfHighlighter
									pdfDocument={pdfDocument}
									enableAreaSelection={(event) =>
										event.altKey
									}
									onScrollChange={() => resetHash()}
									scrollRef={(scrollTo) => {
										scrollViewerTo.current = scrollTo;
										scrollToHighlightFromHash();
									}}
									onSelectionFinished={
										handleSelectionFinished
									}
									highlightTransform={(
										highlight,
										index,
										setTip,
										hideTip,
										viewportToScaled,
										screenshot,
										isScrolledTo
									) => {
										const isTextHighlight =
											!highlight.content?.image;

										const component = isTextHighlight ? (
											<Highlight
												isScrolledTo={isScrolledTo}
												position={highlight.position}
												comment={highlight.comment}
											/>
										) : (
											<AreaHighlight
												isScrolledTo={isScrolledTo}
												highlight={highlight}
												onChange={(boundingRect) => {
													updateHighlight(
														highlight.id,
														{
															boundingRect:
																viewportToScaled(
																	boundingRect
																),
														},
														{
															image: screenshot(
																boundingRect
															),
														}
													);
												}}
											/>
										);

										return (
											<Popup
												popupContent={
													<HighlightPopup
														{...highlight}
													/>
												}
												onMouseOver={(popupContent) =>
													setTip(
														highlight,
														() => popupContent
													)
												}
												onMouseOut={hideTip}
												key={index}
											>
												{component}
											</Popup>
										);
									}}
									highlights={documentProps.highlights}
									pdfScaleValue={canvasScale.toString()}
								/>
							)}
						</PdfLoader>
					</motion.div>
				</motion.div>
			</div>
		);
}
