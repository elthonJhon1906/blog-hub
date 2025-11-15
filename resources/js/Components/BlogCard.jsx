export default function BlogCard({
    title,
    imageUrl,
    author,
    date,
    likes,
    comments,
    views,
    category,
}) {
    return (
        <div className="card bg-base-100 w-65 shadow-sm hover:shadow-md transition-shadow duration-300">
            {/* Image */}
            <figure className="relative">
                <img
                    src={
                        imageUrl ||
                        "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                    }
                    alt={title}
                    className="h-48 w-full object-cover"
                />
                {category && (
                    <div className="badge badge-primary absolute top-4 right-4">
                        {category}
                    </div>
                )}
            </figure>

            {/* Card Body */}
            <div className="card-body p-5">
                {/* Title */}
                <h2 className="card-title text-lg font-bold line-clamp-2 hover:text-primary cursor-pointer transition-colors">
                    {title || "Blog Post Title Goes Here"}
                </h2>

                {/* Author & Date */}
                <div className="flex items-center gap-2 text-sm text-base-content/70 mt-2">
                    <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content w-8 rounded-full">
                            <span className="text-xs">
                                {author?.charAt(0) || "A"}
                            </span>
                        </div>
                    </div>
                    <div>
                        <p className="font-medium text-base-content">
                            {author || "Anonymous"}
                        </p>
                        <p className="text-xs">{date || "Jan 1, 2024"}</p>
                    </div>
                </div>

                {/* Divider */}
                <div className="divider my-2"></div>

                {/* Stats (Likes, Comments, Views) */}
                <div className="flex items-center justify-between text-sm text-base-content/60">
                    {/* Likes */}
                    <div className="flex items-center gap-1 hover:text-error cursor-pointer transition-colors">
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
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                        <span>{likes || 0}</span>
                    </div>

                    {/* Comments */}
                    <div className="flex items-center gap-1 hover:text-info cursor-pointer transition-colors">
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
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                        <span>{comments || 0}</span>
                    </div>

                    {/* Views */}
                    <div className="flex items-center gap-1 hover:text-success cursor-pointer transition-colors">
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
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                        </svg>
                        <span>{views || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
