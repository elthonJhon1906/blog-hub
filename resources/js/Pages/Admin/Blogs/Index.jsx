import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import BlogCard from "@/Components/BlogCard";

export default function AdminBlogIndex({
    blogs,
    filters,
    categories,
    tags: allTags,
}) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || "");
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || "");
    const [selectedCategory, setSelectedCategory] = useState(
        filters?.category || ""
    );
    const [selectedTag, setSelectedTag] = useState(filters?.tag || "");
    const [sortBy, setSortBy] = useState(filters?.sort || "latest");
    const [deleteBlog, setDeleteBlog] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters({ search: searchQuery });
    };

    const applyFilters = (newFilters = {}) => {
        const params = {
            search: searchQuery,
            status: selectedStatus,
            category: selectedCategory,
            tag: selectedTag,
            sort: sortBy,
            ...newFilters,
        };

        Object.keys(params).forEach((key) => {
            if (!params[key]) delete params[key];
        });

        router.get(route("admin.blogs.index"), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedStatus("");
        setSelectedCategory("");
        setSelectedTag("");
        setSortBy("latest");
        router.get(route("admin.blogs.index"));
    };

    const handleDelete = (blog) => {
        setDeleteBlog(blog);
    };

    const handleDeleteConfirm = () => {
        if (deleteBlog) {
            router.delete(route("admin.blogs.destroy", deleteBlog.id), {
                preserveScroll: true,
                onSuccess: () => setDeleteBlog(null),
            });
        }
    };

    const handleStatusChange = (blogId, newStatus) => {
        router.post(
            route("admin.blogs.update-status", blogId),
            { status: newStatus },
            { preserveScroll: true }
        );
    };

    const activeFiltersCount = [
        filters?.search,
        filters?.status,
        filters?.category,
        filters?.tag,
    ].filter(Boolean).length;

    return (
        <div className="space-y-6">
            <Head title="Manage Blogs - Admin" />

            {/* Header */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Blog Management
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {blogs.total} {blogs.total === 1 ? "blog" : "blogs"}{" "}
                            found
                        </p>
                    </div>

                    {activeFiltersCount > 0 && (
                        <button
                            onClick={clearFilters}
                            className="btn btn-sm btn-ghost gap-2"
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
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Search & Filters */}
                <div className="card bg-base-100 shadow-sm border border-gray-200">
                    <div className="card-body p-4">
                        <form
                            onSubmit={handleSearch}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3"
                        >
                            {/* Search Input */}
                            <div className="lg:col-span-2">
                                <div className="join w-full">
                                    <input
                                        type="text"
                                        className="input input-bordered join-item w-full"
                                        placeholder="Search blogs, authors..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-primary join-item"
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
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Status Filter */}
                            <select
                                className="select select-bordered w-full"
                                value={selectedStatus}
                                onChange={(e) => {
                                    setSelectedStatus(e.target.value);
                                    applyFilters({ status: e.target.value });
                                }}
                            >
                                <option value="">All Status</option>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>

                            {/* Category Filter */}
                            <select
                                className="select select-bordered w-full"
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    applyFilters({ category: e.target.value });
                                }}
                            >
                                <option value="">All Categories</option>
                                {categories?.map((parent) => (
                                    <optgroup
                                        key={parent.id}
                                        label={parent.name}
                                    >
                                        {parent.children?.map((child) => (
                                            <option
                                                key={child.id}
                                                value={child.name}
                                            >
                                                {child.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>

                            {/* Tag Filter */}
                            <select
                                className="select select-bordered w-full"
                                value={selectedTag}
                                onChange={(e) => {
                                    setSelectedTag(e.target.value);
                                    applyFilters({ tag: e.target.value });
                                }}
                            >
                                <option value="">All Tags</option>
                                {allTags?.map((tag) => (
                                    <option key={tag.id} value={tag.name}>
                                        #{tag.name}
                                    </option>
                                ))}
                            </select>

                            {/* Sort */}
                            <select
                                className="select select-bordered w-full"
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    applyFilters({ sort: e.target.value });
                                }}
                            >
                                <option value="latest">Latest</option>
                                <option value="popular">Most Popular</option>
                                <option value="most_comments">
                                    Most Comments
                                </option>
                                <option value="oldest">Oldest</option>
                            </select>
                        </form>
                    </div>
                </div>
            </div>

            {/* Active Filters Badges */}
            {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2">
                    {filters?.search && (
                        <div className="badge badge-lg gap-2">
                            Search: "{filters.search}"
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    applyFilters({ search: "" });
                                }}
                                className="hover:text-error"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                    {filters?.status && (
                        <div className="badge badge-lg gap-2">
                            Status: {filters.status}
                            <button
                                onClick={() => {
                                    setSelectedStatus("");
                                    applyFilters({ status: "" });
                                }}
                                className="hover:text-error"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                    {filters?.category && (
                        <div className="badge badge-lg gap-2">
                            Category: {filters.category}
                            <button
                                onClick={() => {
                                    setSelectedCategory("");
                                    applyFilters({ category: "" });
                                }}
                                className="hover:text-error"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                    {filters?.tag && (
                        <div className="badge badge-lg gap-2">
                            Tag: #{filters.tag}
                            <button
                                onClick={() => {
                                    setSelectedTag("");
                                    applyFilters({ tag: "" });
                                }}
                                className="hover:text-error"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Blog Grid */}
            {blogs.data.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs.data.map((blog) => (
                            <div key={blog.id} className="relative">
                                {/* Status Badge Overlay */}
                                <div className="absolute top-2 left-2 z-10">
                                    <div
                                        className={`badge badge-sm ${
                                            blog.status === "published"
                                                ? "badge-success"
                                                : "badge-warning"
                                        }`}
                                    >
                                        {blog.status}
                                    </div>
                                </div>

                                {/* Admin Actions Overlay */}
                                {/* <div className="absolute top-2 right-2 z-10 flex gap-1">
                                    <Link
                                        href={route("blog.show", blog.id)}
                                        target="_blank"
                                        className="btn btn-xs btn-circle bg-blue-900 text-white hover:bg-blue-800 border-none"
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
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    </Link>
                                    <Link
                                        href={route("blog.edit", blog.id)}
                                        className="btn btn-xs btn-circle bg-white/90 hover:bg-white border-none"
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
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(blog)}
                                        className="btn btn-xs btn-circle bg-error text-white hover:bg-red-700 border-none"
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
                                    </button>
                                </div> */}

                                <BlogCard blog={blog} />
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {blogs.last_page > 1 && (
                        <div className="flex justify-center mt-8">
                            <div className="join">
                                {blogs.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (link.url) {
                                                const url = new URL(link.url);
                                                const page =
                                                    url.searchParams.get(
                                                        "page"
                                                    );
                                                applyFilters({ page });
                                            }
                                        }}
                                        className={`join-item btn btn-sm ${
                                            link.active
                                                ? "btn-primary"
                                                : "btn-ghost"
                                        }`}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="card bg-base-100 shadow-sm border border-gray-200">
                    <div className="card-body py-16 text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 mx-auto text-gray-400 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No blogs found
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Try adjusting your search or filters
                        </p>
                        <button
                            onClick={clearFilters}
                            className="btn btn-primary btn-sm"
                        >
                            Clear All Filters
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteBlog && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-error">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            Confirm Delete Blog
                        </h3>
                        <p className="py-4">
                            Are you sure you want to delete blog{" "}
                            <span className="font-bold">
                                "{deleteBlog.title}"
                            </span>
                            ?
                            <br />
                            <span className="text-sm text-gray-500 block mt-2">
                                This will permanently delete:
                            </span>
                            <ul className="list-disc list-inside text-sm text-gray-500 mt-1 ml-4">
                                <li>The blog post</li>
                                <li>
                                    All comments (
                                    {deleteBlog.comments_count || 0})
                                </li>
                                <li>
                                    All likes ({deleteBlog.likes_count || 0})
                                </li>
                                <li>The thumbnail image</li>
                            </ul>
                            <span className="text-sm text-error block mt-2">
                                This action cannot be undone!
                            </span>
                        </p>
                        <div className="modal-action">
                            <button
                                onClick={() => setDeleteBlog(null)}
                                className="btn btn-ghost"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="btn btn-error"
                            >
                                Delete Blog
                            </button>
                        </div>
                    </div>
                    <div
                        className="modal-backdrop"
                        onClick={() => setDeleteBlog(null)}
                    ></div>
                </div>
            )}
        </div>
    );
}

AdminBlogIndex.layout = (page) => <AdminLayout children={page} />;
