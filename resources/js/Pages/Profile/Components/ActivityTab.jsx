import { Link, router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import BlogCard from "@/Components/BlogCard";

export default function ActivityTab({ activity }) {
    const { profileUser, filters } = usePage().props;
    const subTab = filters?.sub || "comments";
    const currentSort = filters?.sort || "latest";

    const handleSubTabChange = (sub) => {
        router.get(
            route("profile.show", profileUser.username),
            { tab: "activity", sub, sort: currentSort },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleSortChange = (sort) => {
        router.get(
            route("profile.show", profileUser.username),
            { tab: "activity", sub: subTab, sort },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const commentDate = new Date(date);
        const diffInSeconds = Math.floor((now - commentDate) / 1000);

        if (diffInSeconds < 60) return "just now";
        if (diffInSeconds < 3600)
            return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400)
            return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800)
            return `${Math.floor(diffInSeconds / 86400)}d ago`;
        if (diffInSeconds < 2592000)
            return `${Math.floor(diffInSeconds / 604800)}w ago`;
        return commentDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    // Empty state for no activity
    if (!activity || activity.data.length === 0) {
        return (
            <div className="space-y-6">
                {/* Sub-tabs */}
                <div className="bg-white rounded-xl border border-gray-200 p-1 inline-flex gap-1">
                    <button
                        onClick={() => handleSubTabChange("comments")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition ${
                            subTab === "comments"
                                ? "bg-blue-600 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
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
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                        My Comments
                    </button>
                    <button
                        onClick={() => handleSubTabChange("likes")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition ${
                            subTab === "likes"
                                ? "bg-blue-600 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Liked Posts
                    </button>
                </div>

                {/* Empty State */}
                <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        {subTab === "comments" ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {subTab === "comments"
                            ? "No comments yet"
                            : "No liked posts yet"}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {subTab === "comments"
                            ? "Start engaging with the community by leaving comments"
                            : "Explore posts and show some love!"}
                    </p>
                    <Link
                        href={route("blog.index")}
                        className="btn btn-primary"
                    >
                        Explore Blogs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Sub-tabs & Sort */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Sub-tabs */}
                <div className="bg-white rounded-xl border border-gray-200 p-1 inline-flex gap-1">
                    <button
                        onClick={() => handleSubTabChange("comments")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition ${
                            subTab === "comments"
                                ? "bg-blue-600 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
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
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                        My Comments
                    </button>
                    <button
                        onClick={() => handleSubTabChange("likes")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition ${
                            subTab === "likes"
                                ? "bg-blue-600 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Liked Posts
                    </button>
                </div>

                {/* Sort Dropdown */}
                {subTab === "likes" && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 font-medium">
                            Sort by:
                        </span>
                        <div className="relative">
                            <select
                                value={currentSort}
                                onChange={(e) =>
                                    handleSortChange(e.target.value)
                                }
                                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                            >
                                <option value="latest">Latest Liked</option>
                                <option value="popular">Most Popular</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                <svg
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            {subTab === "comments" ? (
                /* Comments Timeline */
                <div className="space-y-4">
                    {activity.data.map((comment) => (
                        <div
                            key={comment.id}
                            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition"
                        >
                            <div className="flex gap-4">
                                {/* Timeline indicator */}
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-blue-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                            />
                                        </svg>
                                    </div>
                                    {activity.data[
                                        activity.data.indexOf(comment) + 1
                                    ] && (
                                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                                    )}
                                </div>

                                {/* Comment Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                You commented on
                                            </p>
                                            <Link
                                                href={`/blog/${comment.blog.id}`}
                                                className="font-semibold text-gray-900 hover:text-blue-600 line-clamp-1 transition"
                                            >
                                                {comment.blog.title}
                                            </Link>
                                            <p className="text-xs text-gray-400 mt-1">
                                                by {comment.blog.user.name} •{" "}
                                                {getTimeAgo(comment.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Comment excerpt */}
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-sm text-gray-700 line-clamp-3">
                                            {comment.content}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-4 mt-3">
                                        <Link
                                            href={`/blog/${comment.blog.id}#comment-${comment.id}`}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
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
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                            View Comment
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Liked Posts Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activity.data.map((blog) => (
                        <BlogCard key={blog.id} blog={blog} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {activity.last_page > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    {/* Previous Button */}
                    <Link
                        href={activity.prev_page_url || "#"}
                        className={`btn btn-sm gap-2 ${
                            activity.prev_page_url
                                ? "btn-ghost"
                                : "btn-disabled"
                        }`}
                        disabled={!activity.prev_page_url}
                        preserveScroll
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
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Previous
                    </Link>

                    {/* Page Numbers */}
                    <div className="flex gap-1">
                        {Array.from(
                            { length: activity.last_page },
                            (_, i) => i + 1
                        ).map((page) => {
                            const shouldShow =
                                page === 1 ||
                                page === activity.last_page ||
                                (page >= activity.current_page - 1 &&
                                    page <= activity.current_page + 1);

                            const showEllipsisBefore =
                                page === activity.current_page - 2 &&
                                activity.current_page > 3;
                            const showEllipsisAfter =
                                page === activity.current_page + 2 &&
                                activity.current_page < activity.last_page - 2;

                            if (showEllipsisBefore || showEllipsisAfter) {
                                return (
                                    <span
                                        key={page}
                                        className="px-2 py-1 text-gray-400"
                                    >
                                        ...
                                    </span>
                                );
                            }

                            if (!shouldShow) return null;

                            return (
                                <Link
                                    key={page}
                                    href={`${activity.path}?page=${page}&tab=activity&sub=${subTab}&sort=${currentSort}`}
                                    className={`btn btn-sm ${
                                        page === activity.current_page
                                            ? "btn-primary"
                                            : "btn-ghost"
                                    }`}
                                    preserveScroll
                                >
                                    {page}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Next Button */}
                    <Link
                        href={activity.next_page_url || "#"}
                        className={`btn btn-sm gap-2 ${
                            activity.next_page_url
                                ? "btn-ghost"
                                : "btn-disabled"
                        }`}
                        disabled={!activity.next_page_url}
                        preserveScroll
                    >
                        Next
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
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </Link>
                </div>
            )}

            {/* Pagination Info */}
            {activity.total > 0 && (
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Showing{" "}
                        <span className="font-medium">{activity.from}</span> to{" "}
                        <span className="font-medium">{activity.to}</span> of{" "}
                        <span className="font-medium">{activity.total}</span>{" "}
                        {subTab === "comments" ? "comments" : "posts"}
                    </p>
                </div>
            )}
        </div>
    );
}
