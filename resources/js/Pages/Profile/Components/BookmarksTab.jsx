import { Link, router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import BlogCard from "@/Components/BlogCard";

export default function BookmarksTab({ bookmarks }) {
    const { filters, profileUser } = usePage().props;
    const currentSort = filters?.sort || "latest";

    const handleSortChange = (sort) => {
        router.get(
            route("profile.show", profileUser.username),
            { tab: "bookmarks", sort },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    if (!bookmarks || bookmarks.data.length === 0) {
        return (
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
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No bookmarks yet
                </h3>
                <p className="text-gray-500 mb-6">
                    Start exploring and bookmark your favorite posts
                </p>
                <Link href={route("blog.index")} className="btn btn-primary">
                    Explore Blogs
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Sort Bar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm text-gray-600 font-medium">
                        {bookmarks.total} bookmarked{" "}
                        {bookmarks.total === 1 ? "post" : "posts"}
                    </p>
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
                                <option value="latest">Latest Saved</option>
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
                </div>
            </div>

            {/* Bookmark Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.data.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                ))}
            </div>

            {/* Pagination */}
            {bookmarks.last_page > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    {/* Previous Button */}
                    <Link
                        href={bookmarks.prev_page_url || "#"}
                        className={`btn btn-sm gap-2 ${
                            bookmarks.prev_page_url
                                ? "btn-ghost"
                                : "btn-disabled"
                        }`}
                        disabled={!bookmarks.prev_page_url}
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
                            { length: bookmarks.last_page },
                            (_, i) => i + 1
                        ).map((page) => {
                            const shouldShow =
                                page === 1 ||
                                page === bookmarks.last_page ||
                                (page >= bookmarks.current_page - 1 &&
                                    page <= bookmarks.current_page + 1);

                            const showEllipsisBefore =
                                page === bookmarks.current_page - 2 &&
                                bookmarks.current_page > 3;
                            const showEllipsisAfter =
                                page === bookmarks.current_page + 2 &&
                                bookmarks.current_page <
                                    bookmarks.last_page - 2;

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
                                    href={`${bookmarks.path}?page=${page}&tab=bookmarks&sort=${currentSort}`}
                                    className={`btn btn-sm ${
                                        page === bookmarks.current_page
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
                        href={bookmarks.next_page_url || "#"}
                        className={`btn btn-sm gap-2 ${
                            bookmarks.next_page_url
                                ? "btn-ghost"
                                : "btn-disabled"
                        }`}
                        disabled={!bookmarks.next_page_url}
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
            {bookmarks.total > 0 && (
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Showing{" "}
                        <span className="font-medium">{bookmarks.from}</span> to{" "}
                        <span className="font-medium">{bookmarks.to}</span> of{" "}
                        <span className="font-medium">{bookmarks.total}</span>{" "}
                        results
                    </p>
                </div>
            )}
        </div>
    );
}
