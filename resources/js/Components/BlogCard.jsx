import { Link } from "@inertiajs/react";

export default function BlogCard({ blog, isAuthenticated = false }) {
    const formatDate = (dateString) => {
        if (!dateString) return "New";
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const maskedName = isAuthenticated
        ? blog.user?.name || "Anonymous"
        : "Penulis Anonim";
    const authorAvatarUrl = blog.user?.avatar_url
        ? `/storage/${blog.user.avatar_url}`
        : null;
    const showAvatarImage = isAuthenticated && authorAvatarUrl;

    return (
        <Link href={`/blog/${blog.id}`} className="block h-full">
            <div className="flex flex-col w-full h-full transition-shadow duration-300 border border-gray-200 shadow-sm card bg-base-100 hover:shadow-md">
                {/* Image - Fixed Height */}
                <figure className="relative flex-shrink-0 h-48">
                    <img
                        src={
                            blog.thumbnail_url ||
                            "https://placehold.co/640x360/e5e7eb/6b7280?text=No+Image"
                        }
                        alt={blog.title}
                        className="object-cover w-full h-full"
                    />
                    {/* overlay */}
                    <div className="absolute inset-0 bg-black/20"></div>
                    {blog.category && (
                        <div className="absolute text-white border badge top-4 right-4 bg-white/10 backdrop-blur-sm border-white/40 hover:bg-white/20">
                            {blog.category.name}
                        </div>
                    )}
                </figure>

                {/* Card Body - Flexible Height */}
                <div className="flex flex-col flex-1 p-5 card-body">
                    {/* Title - Fixed 2 lines */}
                    <h2 className="card-title text-lg font-bold line-clamp-2 hover:text-primary transition-colors min-h-[3.5rem]">
                        {blog.title || "Blog Post Title Goes Here"}
                    </h2>

                    {/* Author & Date */}
                    <div className="flex items-center gap-3 mt-2 text-sm text-base-content/70">
                        <div className="avatar">
                            <div className="w-10 h-10 rounded-full ring ring-gray-200 ring-offset-1">
                                {showAvatarImage ? (
                                    <img
                                        src={authorAvatarUrl}
                                        alt={maskedName}
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
                                        padding: showAvatarImage ? 0 : 6,
                                    }}
                                >
                                    <img
                                        src="/person-svgrepo-com.svg"
                                        alt="Anonymous"
                                        className="object-contain w-full h-full"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <p className="font-medium text-center text-base-content">
                                {maskedName}
                            </p>
                            <p className="text-xs text-center">
                                {formatDate(blog.created_at)}
                            </p>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="my-2 divider"></div>

                    {/* Stats - Push to bottom */}
                    <div className="flex items-center justify-end gap-3 mt-auto text-sm text-base-content/60">
                        {/* Likes */}
                        <div className="flex items-center gap-1">
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
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                            <span>{blog.likes_count || 0}</span>
                        </div>

                        {/* Comments */}
                        <div className="flex items-center gap-1">
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
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                            <span>{blog.comments_count || 0}</span>
                        </div>

                        {/* Views */}
                        <div className="flex items-center gap-1">
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
                            <span>{blog.views || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
