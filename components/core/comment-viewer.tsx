import React, { useEffect, useState } from 'react';
import Avatar from '../common/avatar';
import { useViewerContext } from '@/contexts';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { IHighlight } from 'react-pdf-highlighter';
import { toast } from 'sonner';

export interface CommentItemProps {
  id: string;
  avatar?: string;
  username: string;
  fullName: string;
  content: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
  comment: string;
}

export const CommentItem = ({
  id,
  avatar,
  username,
  fullName,
  content,
  onEdit,
  onDelete,
  className,
  comment,
}: CommentItemProps) => {
  const updateHash = () => {
    document.location.hash = `highlight-${id}`;
  };

  return (
    <div
      className={cn(
        'flex gap-3 rounded-lg py-1 transition-colors cursor-pointer',
        className
      )}
      onClick={updateHash}
    >
      <Avatar
        src={avatar}
        className="w-[2.25rem] h-[2.25rem]"
        alt={fullName || username}
      />

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-semibold text-base">{fullName}</span>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 cursor-pointer w-8 text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(id)}
                aria-label="Edit comment"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 cursor-pointer w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(id)}
                aria-label="Delete comment"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="w-full mt-[-0.5rem]">
          <p className="text-base font-bold text-muted-foreground leading-relaxed">
            {comment?.length > 25 ? `${comment?.substring(0, 25)}..` : comment}
          </p>
          <p className="text-base italic text-muted-foreground leading-relaxed">
            {`"${
              content.length > 60 ? `${content.substring(0, 60)}...` : content
            }"`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function CommentViewer() {
  const { documentProps, updateDocumentProps } = useViewerContext();
  const [selectedComment, setSelectedComment] = useState<IHighlight | null>(
    null
  );

  const UpdateCommentDialog = ({
    open,
    onSubmit,
    onClose,
    comment,
  }: {
    open: boolean;
    onSubmit: (value: string) => void;
    onClose: () => void;
    comment: string;
  }) => {
    const [input, updateInput] = useState(comment);

    useEffect(() => {
      updateInput(comment);
    }, [comment]);
    return (
      <Dialog open={open} onOpenChange={(e) => !e && onClose()}>
        <DialogContent>
          <DialogHeader className="gap-1.5">
            <DialogTitle>Update comment</DialogTitle>
            <DialogDescription>
              {`Update a previously added comment`}
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
              Update comment
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="w-[340px] px-0.5 flex flex-col gap-1">
      <UpdateCommentDialog
        open={Boolean(selectedComment)}
        comment={selectedComment?.comment.text || ''}
        onClose={() => setSelectedComment(null)}
        onSubmit={(value) => {
          updateDocumentProps((prev) => ({
            ...prev,
            highlights: prev.highlights.map((e) => {
              if (e.id !== selectedComment?.id) return e;
              return {
                ...selectedComment,
                comment: {
                  ...selectedComment.comment,
                  text: value,
                },
              };
            }),
          }));

          setSelectedComment(null);
          toast.info('Comment updated successfully!');
        }}
      />
      <p className="font-medium text-lg mt-[-0.125rem]">Comments</p>
      <div className="w-full flex flex-col">
        {documentProps.highlights.map(
          (highlight, index) =>
            highlight.comment.text && (
              <>
                <CommentItem
                  content={highlight?.content?.text || ''}
                  fullName="Adedigba Oluwadarasimi"
                  id={highlight.id}
                  username="AdedigbaOluwad1"
                  avatar="https://github.com/shadcn.png"
                  key={`comment_${index}`}
                  onDelete={() => {
                    updateDocumentProps((prev) => ({
                      ...prev,
                      highlights: prev.highlights.filter(
                        (e) => e.id !== highlight.id
                      ),
                    }));
                    toast.info('Comment deleted successfully!');
                  }}
                  onEdit={() => setSelectedComment(highlight)}
                  comment={highlight.comment.text}
                />
                {index !==
                  documentProps.highlights.filter((e) => !!e.comment.text)
                    .length -
                    1 && (
                  <Separator orientation="horizontal" className="mb-2 mt-1" />
                )}
              </>
            )
        )}

        {!documentProps.highlights.filter((e) => !!e.comment.text).length && (
          <div className="h-[3.5rem] pb-4 flex items-center justify-center text-sm text-muted-foreground">
            No comments added yet
          </div>
        )}
      </div>
    </div>
  );
}
