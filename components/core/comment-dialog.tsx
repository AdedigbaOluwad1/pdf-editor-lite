import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';

/**
 * Dialog for adding a new comment to a PDF highlight.
 * @param open - Whether the dialog is open
 * @param onSubmit - Callback when submitting the comment
 * @param onClose - Callback when closing the dialog
 */
export interface CommentDialogProps {
  open: boolean;
  onSubmit: (value: string) => void;
  onClose: () => void;
}

export const CommentDialog: React.FC<CommentDialogProps> = ({
  open,
  onSubmit,
  onClose,
}) => {
  const [input, updateInput] = useState('');

  useEffect(() => {
    updateInput('');
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(e) => !e && onClose()}>
      <DialogContent>
        <DialogHeader className="gap-1.5">
          <DialogTitle>New comment</DialogTitle>
          <DialogDescription>
            {`Add a comment for others to see`}
          </DialogDescription>
        </DialogHeader>
        <form
          className="w-full flex flex-col gap-[1rem]"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(input);
          }}
        >
          <div className="flex">
            <textarea
              onChange={(e) => updateInput(e.target.value)}
              value={input}
              rows={4}
              placeholder="Type a comment.."
              className="border w-full outline-none border-primary/30 rounded-md p-3 text-sm"
            />
          </div>
          <Button
            type="submit"
            className="w-full min-h-[2.75rem] cursor-pointer"
          >
            Add new comment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
