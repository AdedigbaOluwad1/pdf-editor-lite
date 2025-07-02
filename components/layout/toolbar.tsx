'use client';
import React, { ReactNode } from 'react';
import Tooltip from '../common/tooltip';
import IconButton from '../common/icon-button';
import {
	Eraser,
	Hand,
	Highlighter,
	MessageSquareText,
	MousePointer2,
	PenTool,
	Redo2,
	RedoDot,
	Signature,
	StickyNote,
	Type,
	Underline,
	Undo2,
	UndoDot,
	ZoomIn,
	ZoomOut,
} from 'lucide-react';
import { useViewerContext } from './context';
import { Separator } from '../ui/separator';
import MultiSelector from '../common/multi-selector';
import { LEFT_SIDEBAR_ENUMS, TOOLBAR_BTNS } from '@/lib/enums';
import DropdownSelector from '../common/dropdown-selector';
import CommentViewer from '../core/comment-viewer';
import HighlightStylePane from '../core/highlight-style-pane';

export default function ToolBar() {
	const {
		onFutureFeatClick,
		activeToolbarBtn,
		updateActiveToolbarBtn,
		activeSidebarBtn,
		updateCanvasScale,
		canvasScale,
		cursorMode,
		updateCursorMode,
		undo,
		redo,
		canRedo,
		canUndo,
	} = useViewerContext();

	const toolbarGroups: Partial<Record<LEFT_SIDEBAR_ENUMS, ReactNode>> = {
		[LEFT_SIDEBAR_ENUMS.ANOTATE]: (
			<>
				<MultiSelector
					tooltip={{
						buttonTooltipContent: 'Erase',
						side: 'bottom',
					}}
					dropdown={{ align: 'end', side: 'bottom' }}
					dropdowncontent={
						<div>
							<p>Coming soon!</p>
						</div>
					}
					onClick={onFutureFeatClick}
					isActive={activeToolbarBtn?.id === TOOLBAR_BTNS.ERASE}
				>
					<div className='flex items-center gap-2'>
						<Eraser
							strokeWidth={1.5}
							style={{ width: '1.5rem', height: '1.5rem' }}
							color='#325167'
						/>

						<p className='text-sm hidden xxl:block pr-1'>Eraser</p>
					</div>
				</MultiSelector>

				<MultiSelector
					tooltip={{
						buttonTooltipContent: 'Type',
						side: 'bottom',
					}}
					dropdown={{ align: 'end', side: 'bottom' }}
					dropdowncontent={
						<div>
							<p>Coming soon!</p>
						</div>
					}
					onClick={() => onFutureFeatClick()}
					isActive={activeToolbarBtn?.id === TOOLBAR_BTNS.TYPE}
				>
					<div className='flex items-center gap-2'>
						<Type
							strokeWidth={1.5}
							style={{ width: '1.5rem', height: '1.5rem' }}
							color='#325167'
						/>

						<p className='text-sm hidden xxl:block pr-1'>Type</p>
					</div>
				</MultiSelector>

				<MultiSelector
					tooltip={{
						buttonTooltipContent: 'Draw',
						side: 'bottom',
					}}
					dropdown={{ align: 'end', side: 'bottom' }}
					dropdowncontent={
						<div>
							<p>Coming soon!</p>
						</div>
					}
					onClick={onFutureFeatClick}
					isActive={activeToolbarBtn?.id === TOOLBAR_BTNS.DRAW}
				>
					<div className='flex items-center gap-2'>
						<PenTool
							strokeWidth={1.5}
							style={{ width: '1.5rem', height: '1.5rem' }}
							color='#325167'
						/>

						<p className='text-sm hidden xxl:block pr-1'>Draw</p>
					</div>
				</MultiSelector>
			</>
		),

		[LEFT_SIDEBAR_ENUMS.HIGHLIGHT]: (
			<>
				<MultiSelector
					tooltip={{
						buttonTooltipContent: 'Highlight',
						side: 'bottom',
					}}
					dropdown={{ align: 'end', side: 'bottom' }}
					dropdowncontent={<HighlightStylePane />}
					onClick={() =>
						updateActiveToolbarBtn({
							id: TOOLBAR_BTNS.HIGHLIGHT,
							label: 'Highlight',
							onClick: () => null,
							hideCustomCursor: true,
						})
					}
					isActive={activeToolbarBtn?.id === TOOLBAR_BTNS.HIGHLIGHT}
				>
					<div className='flex items-center gap-2'>
						<Highlighter
							strokeWidth={1.5}
							style={{ width: '1.5rem', height: '1.5rem' }}
							color='#325167'
						/>

						<p className='text-sm hidden xxl:block pr-1'>
							Highlight
						</p>
					</div>
				</MultiSelector>
			</>
		),

		[LEFT_SIDEBAR_ENUMS.UNDERLINE]: (
			<>
				<MultiSelector
					tooltip={{
						buttonTooltipContent: 'Erase',
						side: 'bottom',
					}}
					dropdown={{ align: 'end', side: 'bottom' }}
					dropdowncontent={
						<div>
							<p>Coming soon!</p>
						</div>
					}
					onClick={onFutureFeatClick}
					isActive={activeToolbarBtn?.id === TOOLBAR_BTNS.UNDERLINE}
				>
					<div className='flex items-center gap-2'>
						<Underline
							strokeWidth={1.5}
							style={{ width: '1.5rem', height: '1.5rem' }}
							color='#325167'
						/>

						<p className='text-sm hidden xxl:block pr-1'>
							Underline
						</p>
					</div>
				</MultiSelector>
			</>
		),
	};

	return (
		<div className='h-[48px] p-[8px] flex items-center justify-between'>
			<div className='hidden xl:flex items-center gap-0.5'>
				<MultiSelector
					tooltip={{
						buttonTooltipContent: 'Thumbnails',
						side: 'bottom',
					}}
					dropdown={{ align: 'start', side: 'bottom' }}
					dropdowncontent={
						<div>
							<p>Coming soon!</p>
						</div>
					}
					onClick={onFutureFeatClick}
					isActive={activeToolbarBtn?.id === TOOLBAR_BTNS.THUMBNAILS}
				>
					<StickyNote
						strokeWidth={1.5}
						style={{ width: '1.5rem', height: '1.5rem' }}
						color='#325167'
					/>
				</MultiSelector>

				<Separator
					className='bg-[#a5b5c1] min-h-[15px] mx-2'
					orientation='vertical'
				/>

				<Tooltip
					content='Zoom out'
					side='bottom'
					sideOffset={10}
				>
					<IconButton
						disabled={canvasScale <= 0.3}
						onClick={() => updateCanvasScale(canvasScale / 1.2)}
						className='p-2 hover:bg-[#dae1e8]'
					>
						<ZoomOut
							strokeWidth={1.5}
							style={{ width: '1.5rem', height: '1.5rem' }}
							color='#325167'
						/>
					</IconButton>
				</Tooltip>

				<Tooltip
					content='Zoom in'
					side='bottom'
					sideOffset={10}
				>
					<IconButton
						disabled={canvasScale >= 3}
						onClick={() => updateCanvasScale(canvasScale * 1.2)}
						className='p-2 hover:bg-[#dae1e8]'
					>
						<ZoomIn
							strokeWidth={1.5}
							style={{ width: '1.5rem', height: '1.5rem' }}
							color='#325167'
						/>
					</IconButton>
				</Tooltip>

				<Tooltip
					content='Rotate left'
					side='bottom'
					sideOffset={10}
				>
					<IconButton
						onClick={onFutureFeatClick}
						className='p-2 hover:bg-[#dae1e8]'
					>
						<UndoDot
							strokeWidth={1.5}
							style={{ width: '1.5rem', height: '1.5rem' }}
							color='#325167'
						/>
					</IconButton>
				</Tooltip>

				<Tooltip
					content='Rotate right'
					side='bottom'
					sideOffset={10}
				>
					<IconButton
						onClick={onFutureFeatClick}
						className='p-2 hover:bg-[#dae1e8]'
					>
						<RedoDot
							strokeWidth={1.5}
							style={{ width: '1.5rem', height: '1.5rem' }}
							color='#325167'
						/>
					</IconButton>
				</Tooltip>

				<Separator
					className='bg-[#a5b5c1] min-h-[15px] mx-2'
					orientation='vertical'
				/>

				<Tooltip
					content='Pan'
					side='bottom'
					sideOffset={10}
				>
					<IconButton
						onClick={() => updateCursorMode('cursor')}
						className={`p-2 hover:bg-[#dae1e8] ${
							cursorMode === 'cursor' &&
							'hover:bg-[#d0e6f2!important] bg-[#d0e6f2]'
						}`}
					>
						<MousePointer2
							strokeWidth={1.5}
							style={{ width: '1.5rem', height: '1.5rem' }}
							color='#325167'
						/>
					</IconButton>
				</Tooltip>

				<Tooltip
					content='Pan'
					side='bottom'
					sideOffset={10}
				>
					<IconButton
						onClick={() => updateCursorMode('pan')}
						className={`p-2 hover:bg-[#dae1e8] ${
							cursorMode === 'pan' &&
							'hover:bg-[#d0e6f2!important] bg-[#d0e6f2]'
						}`}
					>
						<Hand
							strokeWidth={1.5}
							style={{ width: '1.5rem', height: '1.5rem' }}
							color='#325167'
						/>
					</IconButton>
				</Tooltip>

				<Separator
					className='bg-[#a5b5c1] min-h-[15px] mx-2'
					orientation='vertical'
				/>

				<Tooltip
					content='Undo'
					side='bottom'
					sideOffset={10}
				>
					<IconButton
						onClick={undo}
						disabled={!canUndo}
						className='p-1 hover:bg-[#dae1e8]'
					>
						<Undo2
							strokeWidth={1.5}
							style={{ width: '1.5rem', height: '1.5rem' }}
							color='#325167'
						/>
					</IconButton>
				</Tooltip>

				<Tooltip
					content='Redo'
					side='bottom'
					sideOffset={10}
				>
					<IconButton
						onClick={redo}
						disabled={!canRedo}
						className='p-1 hover:bg-[#dae1e8]'
					>
						<Redo2
							strokeWidth={1.55}
							style={{ width: '1.5rem', height: '1.5rem' }}
							color='#325167'
						/>
					</IconButton>
				</Tooltip>
			</div>

			<div className='flex ml-auto items-center gap-0.5'>
				{activeSidebarBtn === LEFT_SIDEBAR_ENUMS.POPULAR ? (
					<>{...Object.values(toolbarGroups)}</>
				) : (
					toolbarGroups[activeSidebarBtn]
				)}

				<Separator
					className='bg-[#a5b5c1] min-h-[15px] mx-2'
					orientation='vertical'
				/>

				<MultiSelector
					tooltip={{
						buttonTooltipContent: 'Add comments',
						side: 'bottom',
					}}
					dropdown={{ align: 'end', side: 'bottom' }}
					dropdowncontent={<CommentViewer />}
					onClick={() =>
						updateActiveToolbarBtn({
							id: TOOLBAR_BTNS.COMMENT,
							onClick: () => null,
							label: 'Add comment',
							hideCustomCursor: true,
						})
					}
					isActive={activeToolbarBtn?.id === TOOLBAR_BTNS.COMMENT}
				>
					<div className='flex items-center gap-2'>
						<MessageSquareText
							strokeWidth={1.5}
							style={{ width: '1.5rem', height: '1.5rem' }}
							color='#325167'
						/>

						<p className='text-sm hidden xxl:block pr-1'>
							Add Comment
						</p>
					</div>
				</MultiSelector>

				<Separator
					className='bg-[#a5b5c1] min-h-[15px] mx-2'
					orientation='vertical'
				/>

				<DropdownSelector
					tooltip={{
						buttonTooltipContent: 'Signature',
						side: 'bottom',
					}}
					dropdown={{ align: 'end', side: 'bottom' }}
					dropdowncontent={
						<div>
							<p>Coming soon!</p>
						</div>
					}
					onClick={onFutureFeatClick}
					isActive={activeToolbarBtn?.id === TOOLBAR_BTNS.SIGN}
				>
					<div className='flex items-center gap-2'>
						<Signature
							strokeWidth={1.5}
							style={{ width: '1.5rem', height: '1.5rem' }}
							color='#325167'
						/>

						<p className='text-sm pr-1'>Signature</p>
					</div>
				</DropdownSelector>
			</div>
		</div>
	);
}
