import { useState, useEffect, useRef } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import Comment from "@/Components/Comment";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import {
    FacebookShareButton,
    FacebookIcon,
    WhatsappShareButton,
    WhatsappIcon,
    LinkedinShareButton,
    LinkedinIcon,
    TwitterShareButton,
    TwitterIcon,
} from "react-share";

export default function BlogShow({
    blog,
    isLiked: initialIsLiked,
    isBookmarked: initialIsBookmarked,
}) {
    const { auth } = usePage().props;
    const isAuthenticated = !!auth?.user;
    const [isLiked, setIsLiked] = useState(initialIsLiked || false);
    const [isBookmarked, setIsBookmarked] = useState(
        initialIsBookmarked || false
    );
    const [likeCount, setLikeCount] = useState(blog.likes_count || 0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareUrl, setShareUrl] = useState("");
    const [isCopied, setIsCopied] = useState(false);
    const contentRef = useRef(null);
    const quillRef = useRef(null);

    const isOwner = auth?.user?.id === blog.user_id;
    const authorName = isAuthenticated
        ? blog.user?.name || "Anonymous"
        : "Penulis Anonim";
    const authorAvatarUrl = blog.user?.avatar_url
        ? `/storage/${blog.user.avatar_url}`
        : null;
    const showAvatarImage = isAuthenticated && authorAvatarUrl;

    // Update state when props change (after navigation back)
    useEffect(() => {
        setIsLiked(initialIsLiked || false);
        setIsBookmarked(initialIsBookmarked || false);
        setLikeCount(blog.likes_count || 0);
    }, [initialIsLiked, initialIsBookmarked, blog.likes_count]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            const generatedRoute = route("blog.show", blog.id);
            setShareUrl(generatedRoute);
        } catch (error) {
            setShareUrl(window.location.href);
        }
    }, [blog.id]);

    // Render Quill content
    useEffect(() => {
        if (!contentRef.current) return;

        if (!quillRef.current) {
            quillRef.current = new Quill(contentRef.current, {
                theme: "snow",
                readOnly: true,
                modules: { toolbar: false },
            });
        }

        if (!blog?.content) return;

        try {
            let delta = blog.content;

            if (typeof delta === "string") {
                delta = JSON.parse(delta);
            }

            if (Array.isArray(delta)) {
                delta = { ops: delta };
            }

            if (!delta.ops) {
                console.warn("Invalid Delta format:", delta);
                return;
            }

            quillRef.current.setContents(delta);
        } catch (err) {
            console.error("Failed to load Quill content:", err);
        }
    }, [blog]);

    const formatDate = (dateString) => {
        if (!dateString) return "Recently";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleLike = () => {
        if (!auth?.user) {
            alert("Please login to like this post");
            return;
        }

        // Optimistic UI update
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikeCount(newIsLiked ? likeCount + 1 : likeCount - 1);

        router.post(
            route("blog.like.toggle", blog.id),
            {},
            {
                preserveScroll: true,
                onError: () => {
                    // Revert on error
                    setIsLiked(!newIsLiked);
                    setLikeCount(newIsLiked ? likeCount - 1 : likeCount + 1);
                },
            }
        );
    };

    const handleBookmark = () => {
        if (!auth?.user) {
            alert("Please login to bookmark this post");
            return;
        }

        // Optimistic UI update
        const newIsBookmarked = !isBookmarked;
        setIsBookmarked(newIsBookmarked);

        router.post(
            route("blog.bookmark.toggle", blog.id),
            {},
            {
                preserveScroll: true,
                onError: () => {
                    // Revert on error
                    setIsBookmarked(!newIsBookmarked);
                },
            }
        );
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

    const handleShareModalToggle = () => {
        setShowShareModal((prev) => !prev);
        setIsCopied(false);
    };

    const handleCopyShareUrl = async () => {
        if (!shareUrl) return;

        try {
            await navigator.clipboard.writeText(shareUrl);
            setIsCopied(true);
        } catch (error) {
            console.error("Failed to copy URL", error);
        }
    };

    return (
        <div className="">
            <Head title={blog.title} />

            {/* Header Actions */}
            <div className="flex items-center justify-between mb-6">
                <Link
                    href="/"
                    className="gap-2 text-gray-600 btn btn-ghost btn-sm hover:text-blue-900"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
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
                            className="gap-2 px-2 text-gray-600 btn btn-sm btn-outline hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
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
                            className="gap-2 px-2 text-red-600 btn btn-sm btn-outline hover:bg-red-50 hover:text-red-700 hover:border-red-400"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
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
            <article className="border border-gray-200 shadow-sm card bg-base-100">
                {/* Thumbnail */}
                {blog.thumbnail_url && (
                    <figure className="w-full bg-gray-100 h-96">
                        <img
                            src={blog.thumbnail_url}
                            alt={blog.title}
                            className="object-cover w-full h-full"
                        />
                    </figure>
                )}

                <div className="p-8 card-body">
                    {/* Category & Views */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            {blog.category && (
                                <span className="text-white bg-blue-900 border-none badge">
                                    {blog.category.name}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
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
                    <h1 className="mb-4 text-4xl font-bold text-gray-900 break-words">
                        {blog.title}
                    </h1>

                    {/* Author & Date */}
                    <div className="flex items-center gap-4 pb-6 mb-6 border-b border-gray-200">
                        <div className="avatar">
                            <div className="w-12 h-12 rounded-full ring ring-gray-200 ring-offset-2">
                                {showAvatarImage ? (
                                    <img
                                        src={authorAvatarUrl}
                                        alt={authorName}
                                        className="object-cover w-full h-full rounded-full"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                            const fallback =
                                                e.target.nextElementSibling;
                                            if (fallback) {
                                                fallback.style.display = "flex";
                                            }
                                        }}
                                    />
                                ) : null}
                                <div
                                    className="flex items-center justify-center w-full h-full"
                                    style={{
                                        display: showAvatarImage
                                            ? "none"
                                            : "flex",
                                        padding: showAvatarImage ? 0 : 10,
                                    }}
                                >
                                    <img
                                        src="/person-svgrepo-com.svg"
                                        alt="Penulis Anonim"
                                        className="object-contain w-full h-full"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900">
                                {authorName}
                            </div>
                            <div className="text-sm text-gray-500">
                                {formatDate(blog.created_at)}
                            </div>
                            {!isAuthenticated && (
                                <div className="mt-1 text-xs text-gray-400">
                                    Login untuk melihat identitas penulis.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content - Quill Display */}
                    <div
                        className="mb-8 ql-container ql-snow"
                        style={{ border: "none" }}
                    >
                        <div
                            ref={contentRef}
                            className="blog-content-display ql-editor font-sans !border-none text-base"
                            style={{ padding: 0 }}
                        />
                    </div>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="pt-6 mb-6 border-t border-gray-200">
                            <div className="flex flex-wrap gap-2">
                                {blog.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="transition cursor-pointer badge badge-outline hover:bg-blue-900 hover:text-white hover:border-blue-900"
                                    >
                                        #{tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Interactions */}
                    <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                        {/* Like Button */}
                        <button
                            onClick={handleLike}
                            disabled={!auth?.user}
                            className={`btn btn-ghost btn-sm gap-2 ${
                                isLiked
                                    ? "text-red-500 hover:text-red-600 hover:bg-red-50"
                                    : "text-gray-600 hover:text-red-500 hover:bg-red-50"
                            } ${!auth?.user ? "btn-disabled opacity-50" : ""}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                fill={isLiked ? "currentColor" : "none"}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                            <span className="font-medium">{likeCount}</span>
                        </button>

                        {/* Bookmark Button */}
                        <button
                            onClick={handleBookmark}
                            disabled={!auth?.user}
                            className={`btn btn-ghost btn-sm gap-2 ${
                                isBookmarked
                                    ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                            } ${!auth?.user ? "btn-disabled opacity-50" : ""}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                fill={isBookmarked ? "currentColor" : "none"}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                />
                            </svg>
                            <span className="font-medium">
                                {isBookmarked ? "Saved" : "Save"}
                            </span>
                        </button>

                        <div className="flex-1"></div>

                        {/* Share Button */}
                        <button
                            type="button"
                            onClick={handleShareModalToggle}
                            className="gap-2 text-gray-600 btn btn-ghost btn-sm hover:text-blue-900 hover:bg-blue-50"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                />
                            </svg>
                            <span className="font-medium">Share</span>
                        </button>
                    </div>
                </div>
            </article>

            {/* Comments Section */}
            <div className="mt-8">
                <h2 className="mb-4 text-xl font-bold">Comments</h2>
                {blog.comments && blog.comments.length > 0 ? (
                    blog.comments.map((comment) => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            blogId={blog.id}
                        />
                    ))
                ) : (
                    <div className="text-gray-500">No comments yet.</div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="mb-4 text-lg font-bold">
                            Delete Blog Post
                        </h3>
                        <p className="mb-6 text-gray-600">
                            Are you sure you want to delete "
                            <span className="font-semibold">{blog.title}</span>
                            "? This action cannot be undone and all associated
                            data will be permanently removed.
                        </p>
                        <div className="modal-action">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-2 btn btn-ghost"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-2 text-white bg-red-600 border-none btn hover:bg-red-700"
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

            {/* Share Modal */}
            {showShareModal && (
                <div className="modal modal-open">
                    <div className="max-w-lg modal-box">
                        <h3 className="text-lg font-semibold">Bagikan Artikel</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            Salin tautan atau bagikan langsung ke platform favoritmu.
                        </p>

                        <div className="flex items-center gap-2 mt-4">
                            <input
                                type="text"
                                className="w-full input input-bordered"
                                value={shareUrl}
                                readOnly
                            />
                            <button
                                type="button"
                                onClick={handleCopyShareUrl}
                                className="p-2 btn btn-primary"
                            >
                                {isCopied ? "Tersalin" : "Salin"}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <FacebookShareButton url={shareUrl} quote={blog.title}>
                                <div className="flex items-center w-full gap-2 btn btn-outline">
                                    <FacebookIcon size={32} round />
                                    Facebook
                                </div>
                            </FacebookShareButton>
                            <TwitterShareButton url={shareUrl} title={blog.title}>
                                <div className="flex items-center w-full gap-2 btn btn-outline">
                                    <TwitterIcon size={32} round />
                                    Twitter
                                </div>
                            </TwitterShareButton>
                            <WhatsappShareButton url={shareUrl} title={blog.title} separator=" - ">
                                <div className="flex items-center w-full gap-2 btn btn-outline">
                                    <WhatsappIcon size={32} round />
                                    WhatsApp
                                </div>
                            </WhatsappShareButton>
                            <LinkedinShareButton url={shareUrl} title={blog.title}>
                                <div className="flex items-center w-full gap-2 btn btn-outline">
                                    <LinkedinIcon size={32} round />
                                    LinkedIn
                                </div>
                            </LinkedinShareButton>
                        </div>

                        <div className="modal-action">
                            <button
                                type="button"
                                onClick={handleShareModalToggle}
                                className="btn btn-ghost"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={handleShareModalToggle}></div>
                </div>
            )}
        </div>
    );
}

BlogShow.layout = (page) => <GuestLayout children={page} />;
