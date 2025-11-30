import { Link, router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import BlogCard from "@/Components/BlogCard";

export default function BlogsTab({ blogs, isOwner }) {
    const { filters, stats, profileUser } = usePage().props;
    const currentFilter = filters?.filter || "all";
    const currentSort = filters?.sort || "latest";

    const handleFilterChange = (filter) => {
        router.get(
            route("profile.show", profileUser.username),
            { tab: "blogs", filter, sort: currentSort },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleSortChange = (sort) => {
        router.get(
            route("profile.show", profileUser.username),
            { tab: "blogs", filter: currentFilter, sort },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    // Check if there's no data
    const hasNoData = !blogs || blogs.data.length === 0;

    return (
        <div className="space-y-6">
            {/* Filter & Sort Bar - Always show for owner */}
            {isOwner && (
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Status Filter (Owner Only) */}
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => handleFilterChange("all")}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                                    currentFilter === "all"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                All
                                <span
                                    className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                        currentFilter === "all"
                                            ? "bg-white/20"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    {(stats?.total_posts || 0) +
                                        (stats?.total_drafts || 0)}
                                </span>
                            </button>
                            <button
                                onClick={() => handleFilterChange("published")}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                                    currentFilter === "published"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Published
                                <span
                                    className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                        currentFilter === "published"
                                            ? "bg-white/20"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    {stats?.total_posts || 0}
                                </span>
                            </button>
                            <button
                                onClick={() => handleFilterChange("draft")}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                                    currentFilter === "draft"
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Drafts
                                <span
                                    className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                        currentFilter === "draft"
                                            ? "bg-white/20"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    {stats?.total_drafts || 0}
                                </span>
                            </button>
                        </div>

                        {/* Sort Dropdown */}
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
                                    <option value="latest">Latest</option>
                                    <option value="popular">
                                        Most Popular
                                    </option>
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
                    </div>
                </div>
            )}

            {/* Empty State or Blog Grid */}
            {hasNoData ? (
                <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
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
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {currentFilter === "draft"
                            ? "No drafts yet"
                            : currentFilter === "published"
                            ? "No published posts yet"
                            : "No blogs yet"}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {currentFilter === "draft"
                            ? "You don't have any drafts saved"
                            : currentFilter === "published"
                            ? "You haven't published any posts yet"
                            : "Start writing your first blog post"}
                    </p>
                    {isOwner && (
                        <Link
                            href={route("blog.create")}
                            className="btn bg-blue-600 text-white gap-2"
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
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Create Your First Blog
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    {/* Blog Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs.data.map((blog) => (
                            <div key={blog.id} className="relative">
                                <BlogCard blog={blog} />

                                {/* Status Badge */}
                                {isOwner && (
                                    <div className="absolute top-4 left-4 z-10">
                                        <span
                                            className={`badge badge-sm ${
                                                blog.status === "published"
                                                    ? "badge-success"
                                                    : "badge-warning"
                                            }`}
                                        >
                                            {blog.status === "published"
                                                ? "Published"
                                                : "Draft"}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {blogs.last_page > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            {/* Previous Button */}
                            <Link
                                href={blogs.prev_page_url || "#"}
                                className={`btn btn-sm gap-2 ${
                                    blogs.prev_page_url
                                        ? "btn-ghost"
                                        : "btn-disabled"
                                }`}
                                disabled={!blogs.prev_page_url}
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
                                    { length: blogs.last_page },
                                    (_, i) => i + 1
                                ).map((page) => {
                                    const shouldShow =
                                        page === 1 ||
                                        page === blogs.last_page ||
                                        (page >= blogs.current_page - 1 &&
                                            page <= blogs.current_page + 1);

                                    const showEllipsisBefore =
                                        page === blogs.current_page - 2 &&
                                        blogs.current_page > 3;
                                    const showEllipsisAfter =
                                        page === blogs.current_page + 2 &&
                                        blogs.current_page <
                                            blogs.last_page - 2;

                                    if (
                                        showEllipsisBefore ||
                                        showEllipsisAfter
                                    ) {
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
                                            href={`${blogs.path}?page=${page}&tab=blogs&filter=${currentFilter}&sort=${currentSort}`}
                                            className={`btn btn-sm ${
                                                page === blogs.current_page
                                                    ? "btn bg-blue-600 text-white"
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
                                href={blogs.next_page_url || "#"}
                                className={`btn btn-sm gap-2 ${
                                    blogs.next_page_url
                                        ? "btn-ghost"
                                        : "btn-disabled"
                                }`}
                                disabled={!blogs.next_page_url}
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
                    {blogs.total > 0 && (
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Showing{" "}
                                <span className="font-medium">
                                    {blogs.from}
                                </span>{" "}
                                to{" "}
                                <span className="font-medium">{blogs.to}</span>{" "}
                                of{" "}
                                <span className="font-medium">
                                    {blogs.total}
                                </span>{" "}
                                results
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
