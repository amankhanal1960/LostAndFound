// components/CommentsPopup.tsx
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Reply, Send } from "lucide-react";

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  replies: Comment[];
}
const mockComments: Comment[] = [
  {
    id: "1",
    author: "Ankita Poudel",
    avatar: "SC",
    content:
      "This design looks absolutely stunning! The color palette and typography work so well together. Really impressed with the attention to detail.",
    timestamp: "2 hours ago",
    replies: [
      {
        id: "1-1",
        author: "Aarkiti Poudel",
        avatar: "MJ",
        content: "Totally agree! The gradient effects are particularly nice.",
        timestamp: "1 hour ago",
        replies: [],
      },
      {
        id: "1-2",
        author: "Alex Rivera",
        avatar: "AR",
        content:
          "Thanks Sarah! Spent a lot of time getting the colors just right 🎨",
        timestamp: "45 minutes ago",
        replies: [],
      },
    ],
  },
  {
    id: "2",
    author: "David Park",
    avatar: "DP",
    content:
      "The mobile responsiveness is on point. How did you handle the navigation collapse?",
    timestamp: "3 hours ago",
    replies: [
      {
        id: "2-1",
        author: "Alex Rivera",
        avatar: "AR",
        content:
          "Used a combination of CSS Grid and Flexbox with some custom breakpoints. Happy to share the code!",
        timestamp: "2 hours ago",
        replies: [],
      },
    ],
  },
  {
    id: "3",
    author: "Emma Wilson",
    avatar: "EW",
    content:
      "Love the micro-interactions! The button hover states feel so smooth and polished.",
    timestamp: "4 hours ago",
    replies: [],
  },
];

function CommentItem({
  comment,
  depth = 0,
}: {
  comment: Comment;
  depth?: number;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = () => {
    if (!replyText.trim()) return;
    console.log("Reply:", replyText);
    setReplyText("");
    setIsReplying(false);
  };

  return (
    <div
      className={`${
        depth > 0 ? "ml-8 border-l-2 border-gray-100 pl-4 z-100" : ""
      }`}
    >
      <div className="flex gap-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage
            src={`/placeholder.svg?height=32&width=32&text=${comment.avatar}`}
          />
          <AvatarFallback className="text-xs">{comment.avatar}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{comment.author}</span>
            <span className="text-xs text-muted-foreground">
              {comment.timestamp}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-2 leading-relaxed">
            {comment.content}
          </p>
          <div className="flex items-center gap-1 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(!isReplying)}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-blue-500"
            >
              <Reply className="w-3 h-3 mr-1" />
              Reply
            </Button>
          </div>
          {isReplying && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
              <Textarea
                placeholder={`Reply to ${comment.author}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="mb-2 min-h-[60px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyText("");
                  }}
                  className="h-7 px-3 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleReply}
                  disabled={!replyText.trim()}
                  className="h-7 px-3 text-xs"
                >
                  <Send className="w-3 h-3 mr-1" />
                  Reply
                </Button>
              </div>
            </div>
          )}
          {comment.replies.length > 0 && (
            <div className="space-y-4">
              {comment.replies.map((r) => (
                <CommentItem key={r.id} comment={r} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CommentsPopup({
  open,
  onOpenChange,
  comments = mockComments,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comments?: Comment[];
}) {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    console.log("New comment:", newComment);
    setNewComment("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="z-500 bg-black/50 backdrop-blur-xl" />
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col z-500">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            Comments ({comments.length})
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-6">
            {comments.map((c) => (
              <CommentItem key={c.id} comment={c} />
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 border-t pt-4 mt-4">
          <div className="flex gap-3">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src="/placeholder.svg?height=32&width=32&text=You" />
              <AvatarFallback className="text-xs">You</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-2 min-h-[60px] resize-none"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  size="sm"
                >
                  <Send className="w-3 h-3 mr-1" />
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
