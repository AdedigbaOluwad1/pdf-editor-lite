import React from 'react';

/**
 * Popup for displaying a comment on a PDF highlight.
 * @param comment - The comment object containing text and emoji
 */
export interface HighlightPopupProps {
  comment: { text: string; emoji: string };
}

export const HighlightPopup: React.FC<HighlightPopupProps> = ({ comment }) =>
  comment.text ? (
    <div className="bg-primary text-white py-2 px-3 rounded-md">
      {comment.emoji} {comment.text}
    </div>
  ) : null;

export default HighlightPopup; 