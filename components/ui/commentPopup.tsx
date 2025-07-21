"use client";

import { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Reply, Send } from "lucide-react";
import { useSession } from "next-auth/react";

interface Comment {
  commentid: string;
  itemid: string;
  userid: string;
  parentid: string | null;
  content: string;
  createdat: string;
  updatedat: string;
  author: string;
  avatar: string | null;
  replies?: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  itemId: string;
  onReplyAdded?: () => void;
}

function CommentItem({ comment, itemId, onReplyAdded }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim() || !itemId || !session?.user) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemid: itemId,
          userid: session.user.id,
          parentid: comment.commentid,
          content: replyText,
        }),
      });
      if (response.ok) {
        setReplyText("");
        setIsReplying(false);
        onReplyAdded?.();
      }
    } catch (error) {
      console.error("Failed to add reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start space-x-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          {comment.avatar ? (
            <AvatarImage src={comment.avatar} alt={comment.author} />
          ) : (
            <AvatarImage src="/placeholder.svg" alt="User avatar" />
          )}
          <AvatarFallback className="text-xs">
            {comment.author.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="text-sm font-medium leading-none">
            {comment.author}
          </div>
          <p className="text-sm text-gray-600">{comment.content}</p>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(!isReplying)}
              className="h-6 px-2 text-xs hover:text-blue-500"
            >
              <Reply className="w-3 h-3 mr-1" />
              <span className="sr-only sm:not-sr-only">Reply</span>
            </Button>
          </div>
        </div>
      </div>

      {isReplying && (
        <div className="ml-11 space-y-2">
          <Textarea
            placeholder={`Reply to ${comment.author}...`}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="min-h-[60px] resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setIsReplying(false);
                setReplyText("");
              }}
              className=" text-sm text-blue-500 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleReply}
              disabled={!replyText.trim() || isSubmitting}
              className="flex items-center px-3 py-1 rounded-sm text-white bg-blue-600 hover:bg-blue-700 text-sm"
            >
              <Send className="w-3 h-3 mr-1" />
              Reply
            </button>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 sm:ml-11 space-y-3 border-l-2 border-gray-100 pl-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.commentid}
              comment={reply}
              itemId={itemId}
              onReplyAdded={onReplyAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentsPopup({
  open,
  onOpenChange,
  itemId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
}) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/comments?itemid=${itemId}`);
      const json = await response.json();
      setComments(Array.isArray(json) ? json : json.data || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  useEffect(() => {
    if (open && itemId) {
      fetchComments();
    }
  }, [open, itemId, fetchComments]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !itemId || !session?.user) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemid: itemId,
          userid: session.user.id,
          content: newComment,
        }),
      });
      if (response.ok) {
        setNewComment("");
        fetchComments();
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90dvh] sm:max-h-[80vh] flex flex-col p-4 sm:p-6">
        <DialogHeader className="px-0 sm:px-0">
          <DialogTitle className="text-lg sm:text-xl">
            Comments ({comments.length})
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.commentid}
                comment={comment}
                itemId={itemId}
                onReplyAdded={fetchComments}
              />
            ))
          )}
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex gap-3">
            <Avatar className="w-8 h-8 flex-shrink-0">
              {session?.user?.image ? (
                <AvatarImage
                  src={session.user.image}
                  alt={session.user.name || "You"}
                />
              ) : (
                <AvatarFallback className="text-xs">
                  {session?.user?.name?.charAt(0).toUpperCase() || "Y"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[60px] resize-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || isSubmitting}
                  className="flex items-center px-3 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-3 h-3 mr-1" />
                  Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
