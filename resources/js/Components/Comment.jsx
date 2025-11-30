import { useState } from "react";
import { router, usePage } from "@inertiajs/react";

export default function Comment({ comment, blogId, depth = 0 }) {
    const { auth } = usePage().props;

    // Safety check - return null jika comment undefined
    if (!comment || !comment.id) {
        console.error("Invalid comment data:", comment);
        return null;
    }

    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [editContent, setEditContent] = useState(comment.content || "");
    const [showReplies, setShowReplies] = useState(true);

    const isOwner = auth.user?.id === comment.user_id;
    const isAdmin = auth.user?.role_id === 1; // Admin role
    const canEdit = isOwner || isAdmin;
    const canDelete = isOwner || isAdmin;

    const handleReply = (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        router.post(
            route("comments.store", blogId),
            {
                content: replyContent,
                parent_id: comment.id,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setReplyContent("");
                    setIsReplying(false);
                },
            }
        );
    };

    const handleEdit = (e) => {
        e.preventDefault();
        if (!editContent.trim()) return;

        router.put(
            route("comments.update", [blogId, comment.id]),
            {
                content: editContent,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsEditing(false);
                },
            }
        );
    };

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        router.delete(route("comments.destroy", [blogId, comment.id]), {
            preserveScroll: true,
        });
    };

    const timeAgo = (date) => {
        if (!date) return "just now";

        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
            }
        }
        return "just now";
    };

    return (
        <div className={`${depth > 0 ? "ml-8 md:ml-12" : ""}`}>
            <div className="flex gap-3 mb-4">
                {/* Avatar */}
                <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-10 h-10">
                        <span className="text-sm">
                            {comment.user?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                    </div>
                </div>

                {/* Comment Content */}
                <div className="flex-1">
                    <div className="bg-base-200 rounded-lg p-4">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">
                                    {comment.user?.name || "Unknown User"}
                                </span>
                                {isAdmin &&
                                    comment.user_id === auth.user?.id && (
                                        <span className="badge badge-xs badge-primary">
                                            Admin
                                        </span>
                                    )}
                                {isAdmin &&
                                    comment.user_id !== auth.user?.id && (
                                        <span className="badge badge-xs badge-ghost">
                                            User
                                        </span>
                                    )}
                            </div>
                            <span className="text-xs text-gray-500">
                                {timeAgo(comment.created_at)}
                                {comment.updated_at &&
                                    comment.created_at !==
                                        comment.updated_at && (
                                        <span className="ml-1">(edited)</span>
                                    )}
                            </span>
                        </div>

                        {/* Content */}
                        {isEditing ? (
                            <form onSubmit={handleEdit} className="space-y-2">
                                <textarea
                                    className="textarea textarea-bordered w-full"
                                    rows="3"
                                    value={editContent}
                                    onChange={(e) =>
                                        setEditContent(e.target.value)
                                    }
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-sm"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditContent(
                                                comment.content || ""
                                            );
                                        }}
                                        className="btn btn-ghost btn-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <p className="text-sm whitespace-pre-wrap">
                                {comment.content || ""}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    {!isEditing && (
                        <div className="flex items-center gap-3 mt-2 text-xs">
                            {auth.user && (
                                <button
                                    onClick={() => setIsReplying(!isReplying)}
                                    className="text-primary hover:underline flex items-center gap-1"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                        />
                                    </svg>
                                    Reply
                                </button>
                            )}

                            {canEdit && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                    </svg>
                                    Edit
                                </button>
                            )}

                            {canDelete && (
                                <button
                                    onClick={handleDelete}
                                    className="text-error hover:underline flex items-center gap-1"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                    Delete
                                </button>
                            )}

                            {/* Admin Badge for visibility */}
                            {isAdmin && !isOwner && (
                                <span className="text-gray-400 italic text-xs">
                                    (Admin controls visible)
                                </span>
                            )}

                            {comment.replies &&
                                Array.isArray(comment.replies) &&
                                comment.replies.length > 0 && (
                                    <button
                                        onClick={() =>
                                            setShowReplies(!showReplies)
                                        }
                                        className="text-gray-600 hover:underline flex items-center gap-1"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-3 w-3 transition-transform ${
                                                showReplies ? "rotate-90" : ""
                                            }`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                        {showReplies ? "Hide" : "Show"}{" "}
                                        {comment.replies.length}{" "}
                                        {comment.replies.length === 1
                                            ? "reply"
                                            : "replies"}
                                    </button>
                                )}
                        </div>
                    )}

                    {/* Reply Form */}
                    {isReplying && (
                        <form onSubmit={handleReply} className="mt-3">
                            <textarea
                                className="textarea textarea-bordered w-full"
                                rows="3"
                                placeholder="Write a reply..."
                                value={replyContent}
                                onChange={(e) =>
                                    setReplyContent(e.target.value)
                                }
                                autoFocus
                            />
                            <div className="flex gap-2 mt-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-sm"
                                >
                                    Reply
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsReplying(false);
                                        setReplyContent("");
                                    }}
                                    className="btn btn-ghost btn-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Nested Replies */}
                    {showReplies &&
                        comment.replies &&
                        Array.isArray(comment.replies) &&
                        comment.replies.length > 0 && (
                            <div className="mt-3 space-y-3">
                                {comment.replies.map((reply) => (
                                    <Comment
                                        key={reply.id}
                                        comment={reply}
                                        blogId={blogId}
                                        depth={depth + 1}
                                    />
                                ))}
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}
