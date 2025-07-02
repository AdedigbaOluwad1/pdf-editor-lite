import { useEffect } from 'react';

const useKeyboardShortcuts = ({
	undo,
	redo,
	isEditorModeActive,
}: {
	undo?: () => void;
	redo?: () => void;
	isEditorModeActive: boolean;
}) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const isCtrlOrCmd = e.ctrlKey || e.metaKey;

			// Ctrl+Z or Cmd+Z
			if (
				isEditorModeActive &&
				isCtrlOrCmd &&
				e.key === 'z' &&
				!e.shiftKey
			) {
				e.preventDefault();
				undo?.();
			}

			// Ctrl+Y or Ctrl+Shift+Z
			if (
				isEditorModeActive &&
				((isCtrlOrCmd && e.key === 'y') ||
					(isCtrlOrCmd && e.key === 'z' && e.shiftKey))
			) {
				e.preventDefault();
				redo?.();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [undo, redo, isEditorModeActive]);
};

export default useKeyboardShortcuts;
