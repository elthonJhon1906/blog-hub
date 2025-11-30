import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import BlogCard from "@/Components/BlogCard";

export default function BlogIndex({
    blogs,
    filters,
    categories,
    tags: allTags,
}) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || "");
    const [selectedCategory, setSelectedCategory] = useState(
        filters?.category || ""
    );
    const [selectedTag, setSelectedTag] = useState(filters?.tag || "");
    const [sortBy, setSortBy] = useState(filters?.sort || "latest");

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters({ search: searchQuery });
    };

    const applyFilters = (newFilters = {}) => {
        const params = {
            search: searchQuery,
            category: selectedCategory,
            tag: selectedTag,
            sort: sortBy,
            ...newFilters,
        };

        // Remove empty values
        Object.keys(params).forEach((key) => {
            if (!params[key]) delete params[key];
        });

        router.get(route("blog.index"), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("");
        setSelectedTag("");
        setSortBy("latest");
        router.get(route("blog.index"));
    };

    const getContentPreview = (content) => {
        try {
            const delta = JSON.parse(content);
            const text = delta
                .map((op) => op.insert)
                .join("")
                .trim();
            return text.length > 150 ? text.substring(0, 150) + "..." : text;
        } catch {
            return "No preview available.";
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Recently";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const activeFiltersCount = [
        filters?.search,
        filters?.category,
        filters?.tag,
    ].filter(Boolean).length;

    return (
        <div className="space-y-6">
            <Head title="Browse Blogs" />

            {/* Header */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {filters?.search
                                ? `Search: "${filters.search}"`
                                : filters?.category
                                ? `Category: ${filters.category}`
                                : filters?.tag
                                ? `Tag: #${filters.tag}`
                                : "All Blogs"}
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {blogs.total} {blogs.total === 1 ? "post" : "posts"}{" "}
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
                            className="flex flex-col md:flex-row gap-3"
                        >
                            {/* Search Input */}
                            {/* <div className="flex-1">
                                    <div className="join w-full">
                                        <input
                                            type="text"
                                            className="input input-bordered join-item w-full"
                                            placeholder="Search blogs..."
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
                                </div> */}

                            {/* Category Filter */}
                            <select
                                className="select select-bordered w-full md:w-48"
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    applyFilters({
                                        category: e.target.value,
                                    });
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
                                className="select select-bordered w-full md:w-48"
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
                                className="select select-bordered w-full md:w-40"
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    applyFilters({ sort: e.target.value });
                                }}
                            >
                                <option value="latest">Latest</option>
                                <option value="popular">Most Popular</option>
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
                            // <article
                            //     key={blog.id}
                            //     className="card bg-base-100 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                            // >
                            //     {/* Thumbnail */}
                            //     <figure className="h-48 bg-gray-100">
                            //         <img
                            //             src={
                            //                 blog.thumbnail_url ||
                            //                 "https://via.placeholder.com/400x300?text=No+Image"
                            //             }
                            //             alt={blog.title}
                            //             className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            //         />
                            //     </figure>

                            //     <div className="card-body p-4">
                            //         {/* Meta Info */}
                            //         <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            //             {blog.category && (
                            //                 <span className="badge badge-sm badge-outline">
                            //                     {blog.category.name}
                            //                 </span>
                            //             )}
                            //             <span>
                            //                 {formatDate(blog.created_at)}
                            //             </span>
                            //         </div>

                            //         {/* Title */}
                            //         <h2 className="card-title text-lg line-clamp-2 mb-2">
                            //             <Link
                            //                 href={route("blog.show", blog.id)}
                            //                 className="hover:text-primary transition"
                            //             >
                            //                 {blog.title}
                            //             </Link>
                            //         </h2>

                            //         {/* Preview */}
                            //         <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                            //             {getContentPreview(blog.content)}
                            //         </p>

                            //         {/* Tags */}
                            //         {blog.tags && blog.tags.length > 0 && (
                            //             <div className="flex flex-wrap gap-1 mb-3">
                            //                 {blog.tags
                            //                     .slice(0, 3)
                            //                     .map((tag) => (
                            //                         <button
                            //                             key={tag.id}
                            //                             onClick={() => {
                            //                                 setSelectedTag(
                            //                                     tag.name
                            //                                 );
                            //                                 applyFilters({
                            //                                     tag: tag.name,
                            //                                 });
                            //                             }}
                            //                             className="badge badge-xs badge-ghost hover:badge-primary transition"
                            //                         >
                            //                             #{tag.name}
                            //                         </button>
                            //                     ))}
                            //             </div>
                            //         )}

                            //         {/* Footer */}
                            //         <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                            //             <div className="flex items-center gap-3 text-xs text-gray-500">
                            //                 <span className="flex items-center gap-1">
                            //                     <svg
                            //                         xmlns="http://www.w3.org/2000/svg"
                            //                         className="h-4 w-4"
                            //                         fill="none"
                            //                         viewBox="0 0 24 24"
                            //                         stroke="currentColor"
                            //                     >
                            //                         <path
                            //                             strokeLinecap="round"
                            //                             strokeLinejoin="round"
                            //                             strokeWidth="2"
                            //                             d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            //                         />
                            //                         <path
                            //                             strokeLinecap="round"
                            //                             strokeLinejoin="round"
                            //                             strokeWidth="2"
                            //                             d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            //                         />
                            //                     </svg>
                            //                     {blog.views}
                            //                 </span>
                            //                 <span className="flex items-center gap-1">
                            //                     <svg
                            //                         xmlns="http://www.w3.org/2000/svg"
                            //                         className="h-4 w-4"
                            //                         fill="none"
                            //                         viewBox="0 0 24 24"
                            //                         stroke="currentColor"
                            //                     >
                            //                         <path
                            //                             strokeLinecap="round"
                            //                             strokeLinejoin="round"
                            //                             strokeWidth="2"
                            //                             d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            //                         />
                            //                     </svg>
                            //                     {blog.likes}
                            //                 </span>
                            //             </div>
                            //             <Link
                            //                 href={route("blog.show", blog.id)}
                            //                 className="text-sm font-medium text-primary hover:underline"
                            //             >
                            //                 Read More →
                            //             </Link>
                            //         </div>
                            //     </div>
                            // </article>
                            <BlogCard key={blog.id} blog={blog} />
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
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
        </div>
    );
}

BlogIndex.layout = (page) => <GuestLayout children={page} />;
