import { Link } from "@inertiajs/react";

export default function SideBar({
    popularTags,
    topUsers,
    topPosts,
    router,
    isAuthenticated = false,
}) {
    // Remove # prefix if exists
    const cleanTagName = (tagName) => {
        return tagName.startsWith("#") ? tagName.substring(1) : tagName;
    };

    return (
        <div className="flex flex-col flex-1 gap-5 max-lg:hidden">
            {/* Popular Tags */}
            <div className="border border-gray-200 shadow-sm card bg-base-100">
                <div className="p-4 card-body">
                    <h3 className="mb-3 text-base card-title">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                        </svg>
                        Popular Tags
                    </h3>
                    {popularTags.length > 0 ? (
                        <>
                            <div className="flex flex-wrap gap-2">
                                {popularTags.slice(0, 8).map((tag) => (
                                    <button
                                        key={tag.id}
                                        onClick={() =>
                                            router.get(route("blog.index"), {
                                                tag: cleanTagName(tag.name),
                                            })
                                        }
                                        className="px-1 transition bg-gray-200 border border-gray-400 cursor-pointer badge badge-lg hover:bg-gray-300"
                                    >
                                        #{cleanTagName(tag.name)}
                                        <span className="ml-1 text-xs opacity-70">
                                            {tag.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            {popularTags.length > 8 && (
                                <button className="w-full mt-2 btn btn-sm btn-ghost">
                                    View All Tags →
                                </button>
                            )}
                        </>
                    ) : (
                        <p className="py-4 text-sm text-center text-gray-500">
                            No tags available yet
                        </p>
                    )}
                </div>
            </div>

            {/* Top Users */}
            <div className="border border-gray-200 shadow-sm card bg-base-100">
                <div className="p-4 card-body">
                    <h3 className="mb-3 text-base card-title">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        Top Writers
                    </h3>
                    <div className="space-y-3">
                        {topUsers.map((user, index) => {
                            const showAvatarImage =
                                isAuthenticated && user.avatar_url;
                            const maskedName = isAuthenticated
                                ? user.name
                                : "Penulis Anonim";
                            const initial = user.name
                                ? user.name.charAt(0).toUpperCase()
                                : "?";

                            return (
                            <Link
                                key={user.id}
                                href={route("profile.show", user.username)}
                                className="flex items-center gap-3 p-2 transition rounded-lg cursor-pointer hover:bg-base-200"
                            >
                                <div className="flex-shrink-0 text-white bg-blue-800 badge badge-sm">
                                    {index + 1}
                                </div>
                                <div className="flex-shrink-0 avatar">
                                    <div className="w-10 h-10 rounded-full ring ring-gray-200 ring-offset-2">
                                        {showAvatarImage ? (
                                            <img
                                                src={`/storage/${user.avatar_url}`}
                                                alt={maskedName}
                                                className="object-cover w-full h-full rounded-full"
                                                onError={(e) => {
                                                    e.target.style.display =
                                                        "none";
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
                                                padding: showAvatarImage
                                                    ? 0
                                                    : 6,
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
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">
                                        {maskedName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {user.blogs_count || 0} posts
                                    </p>
                                </div>
                            </Link>
                        );
                        })}
                    </div>
                    {topUsers.length > 0 && (
                        <Link
                            href={route("blog.index")}
                            className="w-full mt-2 btn btn-sm btn-ghost"
                        >
                            View All Writers →
                        </Link>
                    )}
                </div>
            </div>

            {/* Top Posts */}
            <div className="border border-gray-200 shadow-sm card bg-base-100">
                <div className="p-4 card-body">
                    <h3 className="mb-3 text-base card-title">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                        </svg>
                        Trending Posts
                    </h3>
                    <div className="space-y-3">
                        {topPosts.map((post, index) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.id}`}
                                className="flex items-start w-full gap-3 p-2 transition rounded-lg hover:bg-base-200"
                            >
                                <div className="flex-shrink-0 mt-1 badge badge-error badge-sm">
                                    {index + 1}
                                </div>
                                <figure className="flex-shrink-0 w-16 h-16 overflow-hidden bg-gray-100 rounded-md">
                                    <img
                                        src={
                                            post.thumbnail_url ||
                                            "https://via.placeholder.com/100x100?text=No+Image"
                                        }
                                        alt={post.title}
                                        className="object-cover w-full h-full"
                                    />
                                </figure>
                                <div className="flex-1 min-w-0">
                                    <p className="mb-1 text-sm font-semibold break-all line-clamp-2">
                                        {post.title}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="flex-1 min-w-0 truncate">
                                            {post.user?.name}
                                        </span>
                                        <span className="flex-shrink-0">•</span>
                                        <span className="flex items-center flex-shrink-0 gap-1">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-3 h-3"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            {post.likes_count || 0}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {topPosts.length > 0 && (
                        <Link
                            href={route("blog.index")}
                            className="w-full mt-2 btn btn-sm btn-ghost"
                        >
                            View All Trending →
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
