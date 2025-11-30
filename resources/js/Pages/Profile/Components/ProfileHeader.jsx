import { Link, router } from "@inertiajs/react";

export default function ProfileHeader({ profileUser, stats, isOwner }) {
    const handleEditProfile = (e) => {
        e.preventDefault();
        router.get(
            route("profile.show", profileUser.username),
            { tab: "settings" },
            {
                preserveState: false,
                preserveScroll: true,
            }
        );
    };

    return (
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="avatar">
                            <div className="w-32 h-32 rounded-2xl ring ring-white ring-offset-4 ring-offset-blue-700">
                                {profileUser.avatar_url ? (
                                    <img
                                        src={`/storage/${profileUser.avatar_url}`}
                                        alt={profileUser.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                profileUser.name
                                            )}&size=200&background=random`;
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-white text-blue-900 flex items-center justify-center">
                                        <span className="text-5xl font-bold">
                                            {profileUser.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl font-bold mb-2 text-white">
                            {profileUser.name}
                        </h1>
                        <p className="text-blue-100 text-lg mb-4">
                            @{profileUser.username}
                        </p>
                        {profileUser.bio && (
                            <p className="text-blue-50 max-w-2xl mb-6">
                                {profileUser.bio}
                            </p>
                        )}

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                            <div className="bg-blue-800/50 backdrop-blur-sm rounded-xl p-4 border border-blue-600/30">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/30 rounded-lg">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-white"
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
                                    <div>
                                        <div className="text-3xl font-bold text-white">
                                            {stats.total_posts}
                                        </div>
                                        <div className="text-sm text-blue-100">
                                            Posts
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-800/50 backdrop-blur-sm rounded-xl p-4 border border-blue-600/30">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/30 rounded-lg">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-white"
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
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-white">
                                            {stats.total_views}
                                        </div>
                                        <div className="text-sm text-blue-100">
                                            Views
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-800/50 backdrop-blur-sm rounded-xl p-4 border border-blue-600/30">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/30 rounded-lg">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-white">
                                            {stats.total_likes}
                                        </div>
                                        <div className="text-sm text-blue-100">
                                            Likes
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-800/50 backdrop-blur-sm rounded-xl p-4 border border-blue-600/30">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/30 rounded-lg">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-white"
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
                                    <div>
                                        <div className="text-3xl font-bold text-white">
                                            {stats.total_comments}
                                        </div>
                                        <div className="text-sm text-blue-100">
                                            Comments
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Edit Profile Button (Owner Only) */}
                    {isOwner && (
                        <button
                            onClick={handleEditProfile}
                            className="btn bg-white text-blue-900 border-0 hover:bg-blue-50 gap-2"
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
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
