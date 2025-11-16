import { useState, useEffect, useRef } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function BlogShow({ blog }) {
    const { auth } = usePage().props;
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState(blog.likes || 0);
    const [comment, setComment] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const contentRef = useRef(null);
    const quillRef = useRef(null);

    // Check if current user is the blog owner
    const isOwner = auth?.user?.id === blog.user_id;

    // Render Quill content
    useEffect(() => {
        if (contentRef.current && blog.content) {
            if (!quillRef.current) {
                quillRef.current = new Quill(contentRef.current, {
                    theme: "snow",
                    readOnly: true,
                    modules: {
                        toolbar: false,
                    },
                });
            }

            try {
                quillRef.current.setText("");

                let delta;
                if (typeof blog.content === "string") {
                    delta = JSON.parse(blog.content);
                } else {
                    delta = blog.content;
                }

                if (Array.isArray(delta)) {
                    quillRef.current.setContents({ ops: delta });
                } else {
                    quillRef.current.setContents(delta);
                }
            } catch (error) {
                console.error("Error setting content:", error);
            }
        }

        return () => {
            if (quillRef.current) {
                quillRef.current = null;
            }
        };
    }, [blog.content]);

    const formatDate = (dateString) => {
        if (!dateString) return "Recently";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    };

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        console.log("Comment:", comment);
        setComment("");
    };

    const handleEdit = () => {
        router.visit(route("blog.edit", blog.id));
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(route("blog.destroy", blog.id), {
            onSuccess: () => {
                router.visit("/");
            },
        });
    };

    return (
        <GuestLayout>
            <Head title={blog.title} />

            <div className="">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-6">
                    <Link
                        href="/"
                        className="btn btn-ghost btn-sm gap-2 text-gray-600 hover:text-blue-900"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Back to Home
                    </Link>

                    {isOwner && (
                        <div className="flex gap-2">
                            <button
                                onClick={handleEdit}
                                className="btn btn-sm btn-outline gap-2 px-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="btn btn-sm btn-outline gap-2 px-2 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Article */}
                <article className="card bg-base-100 shadow-lg border border-gray-200">
                    {/* Thumbnail */}
                    {blog.thumbnail_url && (
                        <figure className="w-full h-96 bg-gray-100">
                            <img
                                src={blog.thumbnail_url}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                            />
                        </figure>
                    )}

                    <div className="card-body p-8">
                        {/* Category & Views */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                {blog.category && (
                                    <span className="badge bg-blue-900 text-white border-none">
                                        {blog.category.name}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                                <span>{blog.views.toLocaleString()} views</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            {blog.title}
                        </h1>

                        {/* Author & Date */}
                        <div className="flex items-center gap-4 pb-6 mb-6 border-b border-gray-200">
                            <div className="avatar placeholder">
                                <div className="bg-blue-900 text-white rounded-full w-12">
                                    <span className="text-xl">
                                        {blog.user?.name?.charAt(0) || "A"}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">
                                    {blog.user?.name || "Anonymous"}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {formatDate(blog.created_at)}
                                </div>
                            </div>
                        </div>

                        {/* Content - Quill Display */}
                        <div
                            className="ql-container ql-snow mb-8"
                            style={{ border: "none" }}
                        >
                            <div
                                ref={contentRef}
                                className="blog-content-display ql-editor font-sans !border-none text-base "
                                style={{ padding: 0 }}
                            />
                        </div>

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                            <div className="pt-6 border-t border-gray-200 mb-6">
                                <div className="flex flex-wrap gap-2">
                                    {blog.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="badge badge-outline hover:bg-blue-900 hover:text-white hover:border-blue-900 transition cursor-pointer"
                                        >
                                            #{tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Interactions */}
                        <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                            <button
                                onClick={handleLike}
                                className={`btn btn-sm gap-2 ${
                                    isLiked
                                        ? "bg-blue-900 text-white hover:bg-blue-800"
                                        : "btn-outline hover:bg-blue-900 hover:text-white hover:border-blue-900"
                                }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill={isLiked ? "currentColor" : "none"}
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                                <span>{likeCount}</span>
                            </button>

                            <button
                                onClick={handleBookmark}
                                className={`btn btn-sm gap-2 ${
                                    isBookmarked
                                        ? "bg-blue-900 text-white hover:bg-blue-800"
                                        : "btn-outline hover:bg-blue-900 hover:text-white hover:border-blue-900"
                                }`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill={
                                        isBookmarked ? "currentColor" : "none"
                                    }
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                    />
                                </svg>
                                {isBookmarked ? "Saved" : "Save"}
                            </button>

                            <div className="flex-1"></div>

                            <button className="btn btn-sm btn-outline gap-2 hover:bg-blue-900 hover:text-white hover:border-blue-900">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                    />
                                </svg>
                                Share
                            </button>
                        </div>
                    </div>
                </article>

                {/* Comments Section */}
                <div className="card bg-base-100 shadow-lg border border-gray-200 mt-6">
                    <div className="card-body p-8">
                        <h2 className="text-2xl font-bold mb-6">Comments</h2>

                        {/* Comment Form */}
                        <form onSubmit={handleCommentSubmit} className="mb-8">
                            <textarea
                                className="textarea textarea-bordered w-full h-24 resize-none focus:border-blue-900"
                                placeholder="Write a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            ></textarea>
                            <div className="flex justify-end mt-3">
                                <button
                                    type="submit"
                                    className="btn bg-blue-900 text-white hover:bg-blue-800"
                                    disabled={!comment.trim()}
                                >
                                    Post Comment
                                </button>
                            </div>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-6">
                            {/* Empty State */}
                            <div className="text-center py-8 text-gray-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 mx-auto mb-3 opacity-50"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                                    />
                                </svg>
                                <p>No comments yet. Be the first to comment!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="modal modal-open">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg mb-4">
                                Delete Blog Post
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete "
                                <span className="font-semibold">
                                    {blog.title}
                                </span>
                                "? This action cannot be undone and all
                                associated data will be permanently removed.
                            </p>
                            <div className="modal-action">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="btn btn-ghost px-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="btn bg-red-600 text-white px-2 hover:bg-red-700 border-none"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div
                            className="modal-backdrop"
                            onClick={() => setShowDeleteModal(false)}
                        ></div>
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}
