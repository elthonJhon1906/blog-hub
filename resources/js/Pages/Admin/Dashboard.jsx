import AdminLayout from "@/Layouts/AdminLayout";
import { Link } from "@inertiajs/react";

export default function Dashboard({
    stats,
    recentUsers,
    recentBlogs,
    topUsers,
}) {
    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Admin Dashboard
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    Welcome back! Here's what's happening with your blog today.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Users */}
                <div className="stats shadow bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <div className="stat">
                        <div className="stat-figure text-white opacity-70">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                            </svg>
                        </div>
                        <div className="stat-title text-blue-100">
                            Total Users
                        </div>
                        <div className="stat-value">
                            {stats.total_users.toLocaleString()}
                        </div>
                        <div className="stat-desc text-blue-100">
                            {stats.user_growth > 0 ? "+" : ""}
                            {stats.user_growth}% from last month
                        </div>
                    </div>
                </div>

                {/* Total Blogs */}
                <div className="stats shadow bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <div className="stat">
                        <div className="stat-figure text-white opacity-70">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
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
                        <div className="stat-title text-green-100">
                            Total Blogs
                        </div>
                        <div className="stat-value">
                            {stats.total_blogs.toLocaleString()}
                        </div>
                        <div className="stat-desc text-green-100">
                            {stats.blog_growth > 0 ? "+" : ""}
                            {stats.blog_growth}% from last month
                        </div>
                    </div>
                </div>

                {/* Published Blogs */}
                <div className="stats shadow bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <div className="stat">
                        <div className="stat-figure text-white opacity-70">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div className="stat-title text-purple-100">
                            Published
                        </div>
                        <div className="stat-value">
                            {stats.published_blogs.toLocaleString()}
                        </div>
                        <div className="stat-desc text-purple-100">
                            {stats.total_blogs > 0
                                ? (
                                      (stats.published_blogs /
                                          stats.total_blogs) *
                                      100
                                  ).toFixed(1)
                                : 0}
                            % of total
                        </div>
                    </div>
                </div>

                {/* Draft Blogs */}
                <div className="stats shadow bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <div className="stat">
                        <div className="stat-figure text-white opacity-70">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div className="stat-title text-orange-100">Drafts</div>
                        <div className="stat-value">
                            {stats.draft_blogs.toLocaleString()}
                        </div>
                        <div className="stat-desc text-orange-100">
                            Pending publication
                        </div>
                    </div>
                </div>
            </div>

            {/* Second Row Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Comments */}
                <div className="stats shadow border border-gray-200">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
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
                        <div className="stat-title">Comments</div>
                        <div className="stat-value text-primary">
                            {stats.total_comments.toLocaleString()}
                        </div>
                        <div className="stat-desc">Total interactions</div>
                    </div>
                </div>

                {/* Total Categories */}
                <div className="stats shadow border border-gray-200">
                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                />
                            </svg>
                        </div>
                        <div className="stat-title">Categories</div>
                        <div className="stat-value text-secondary">
                            {stats.total_categories}
                        </div>
                        <div className="stat-desc">Active categories</div>
                    </div>
                </div>

                {/* Total Tags */}
                <div className="stats shadow border border-gray-200">
                    <div className="stat">
                        <div className="stat-figure text-accent">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                            </svg>
                        </div>
                        <div className="stat-title">Tags</div>
                        <div className="stat-value text-accent">
                            {stats.total_tags}
                        </div>
                        <div className="stat-desc">Total tags created</div>
                    </div>
                </div>
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="card bg-base-100 shadow border border-gray-200">
                    <div className="card-body">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="card-title">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-primary"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                                    />
                                </svg>
                                Recent Users
                            </h2>
                            <Link
                                href={route("admin.users.index")}
                                className="btn btn-sm btn-ghost"
                            >
                                View All →
                            </Link>
                        </div>
                        {recentUsers.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentUsers.map((user) => (
                                            <tr key={user.id} className="hover">
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <div className="avatar">
                                                            <div className="w-8 h-8 rounded-full">
                                                                {user.avatar_url ? (
                                                                    <img
                                                                        src={`/storage/${user.avatar_url}`}
                                                                        alt={
                                                                            user.name
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <div className="bg-primary text-white flex items-center justify-center w-full h-full rounded-full">
                                                                        <span className="text-xs font-semibold">
                                                                            {user.name
                                                                                .charAt(
                                                                                    0
                                                                                )
                                                                                .toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="font-semibold">
                                                            {user.name}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-sm opacity-70">
                                                    {user.email}
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge badge-sm ${
                                                            user.role_name ===
                                                            "admin"
                                                                ? "badge-error"
                                                                : "badge-ghost"
                                                        }`}
                                                    >
                                                        {user.role_name}
                                                    </span>
                                                </td>
                                                <td className="text-sm">
                                                    {user.created_at}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">
                                No users yet
                            </p>
                        )}
                    </div>
                </div>

                {/* Recent Blogs */}
                <div className="card bg-base-100 shadow border border-gray-200">
                    <div className="card-body">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="card-title">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-success"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                    />
                                </svg>
                                Recent Blogs
                            </h2>
                            <Link
                                href={route("admin.blogs.index")}
                                className="btn btn-sm btn-ghost"
                            >
                                View All →
                            </Link>
                        </div>
                        {recentBlogs.length > 0 ? (
                            <div className="space-y-3">
                                {recentBlogs.map((blog) => (
                                    <div
                                        key={blog.id}
                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-base-200 transition"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-sm line-clamp-1">
                                                {blog.title}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                <span className="text-xs opacity-70">
                                                    by {blog.author}
                                                </span>
                                                <span className="text-xs opacity-50">
                                                    •
                                                </span>
                                                <span className="text-xs opacity-70">
                                                    {blog.created_at}
                                                </span>
                                                <span className="text-xs opacity-50">
                                                    •
                                                </span>
                                                <span className="text-xs opacity-70 flex items-center gap-1">
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
                                                    {blog.views}
                                                </span>
                                                <span className="text-xs opacity-50">
                                                    •
                                                </span>
                                                <span className="text-xs opacity-70 flex items-center gap-1">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-3 w-3"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                    {blog.likes}
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            className={`badge badge-sm flex-shrink-0 ${
                                                blog.status === "published"
                                                    ? "badge-success"
                                                    : "badge-warning"
                                            }`}
                                        >
                                            {blog.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">
                                No blogs yet
                            </p>
                        )}
                    </div>
                </div>

                {/* Top Active Users */}
                <div className="card bg-base-100 shadow border border-gray-200 lg:col-span-2">
                    <div className="card-body">
                        <h2 className="card-title">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-warning"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                />
                            </svg>
                            Most Active Writers
                        </h2>
                        {topUsers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                {topUsers.map((user, index) => (
                                    <Link
                                        key={user.id}
                                        href={route(
                                            "profile.show",
                                            user.username
                                        )}
                                        className="text-center p-4 rounded-lg bg-base-200 hover:bg-base-300 transition"
                                    >
                                        <div className="badge badge-warning mb-2">
                                            #{index + 1}
                                        </div>
                                        <div className="avatar mb-2">
                                            <div className="w-16 h-16 rounded-full">
                                                {user.avatar_url ? (
                                                    <img
                                                        src={`/storage/${user.avatar_url}`}
                                                        alt={user.name}
                                                    />
                                                ) : (
                                                    <div className="bg-primary text-white flex items-center justify-center w-full h-full rounded-full">
                                                        <span className="text-2xl font-semibold">
                                                            {user.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="font-bold text-sm truncate">
                                            {user.name}
                                        </div>
                                        <div className="text-xs opacity-70 mt-1">
                                            {user.blogs_count} posts
                                        </div>
                                        <div className="text-xs font-semibold text-warning mt-1 flex items-center justify-center gap-1">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-3 w-3"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                            {user.activity_score.toLocaleString()}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">
                                No active writers yet
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

Dashboard.layout = (page) => <AdminLayout children={page} />;
