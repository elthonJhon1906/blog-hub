import { Link, router } from "@inertiajs/react";
import BlogCard from "./BlogCard";

export default function LatestBlogs({ latestBlogs }) {
    const formatDate = (dateString) => {
        if (!dateString) return "New";
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getContentPreview = (content) => {
        try {
            const delta = JSON.parse(content);
            const text = delta
                .map((op) => op.insert)
                .join("")
                .trim();
            return text.length > 120 ? text.substring(0, 120) + "..." : text;
        } catch {
            return "Discover amazing stories, insights, and knowledge from writers around the world.";
        }
    };

    return (
        <div className="card h-fit bg-base-100 shadow-sm border-[0.5px] border-gray-200">
            <div className="card-body">
                <div className="card-title flex items-center justify-between">
                    <span>Latest</span>
                    {/* <span className="text-xs text-gray-500">
                        {latestBlogs?.length ?? 0} posts
                    </span> */}
                </div>

                {latestBlogs?.length ? (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                        {latestBlogs.map((blog) => (
                            // <article
                            //     key={blog.id}
                            //     className="card border border-gray-200 hover:shadow transition"
                            // >
                            //     <figure className="h-40 w-full overflow-hidden rounded-t-md bg-gray-100">
                            //         <img
                            //             src={
                            //                 blog.thumbnail_url ??
                            //                 "https://via.placeholder.com/640x360?text=No+Image"
                            //             }
                            //             alt={blog.title}
                            //             className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                            //         />
                            //     </figure>
                            //     <div className="card-body p-4">
                            //         <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            //             {blog.category?.name && (
                            //                 <button
                            //                     onClick={() =>
                            //                         router.get(
                            //                             route("blog.index"),
                            //                             {
                            //                                 category:
                            //                                     blog.category
                            //                                         .name,
                            //                             }
                            //                         )
                            //                     }
                            //                     className="badge badge-outline hover:badge-primary transition cursor-pointer"
                            //                 >
                            //                     {blog.category.name}
                            //                 </button>
                            //             )}
                            //             <span>
                            //                 {formatDate(blog.created_at)}
                            //             </span>
                            //         </div>
                            //         <h3 className="text-base font-semibold line-clamp-2">
                            //             {blog.title}
                            //         </h3>
                            //         <p className="text-sm text-gray-600 line-clamp-3 mt-2">
                            //             {getContentPreview(blog.content)}
                            //         </p>
                            //         <div className="flex items-center justify-between mt-4">
                            //             <div className="text-xs text-gray-500">
                            //                 {blog.user?.name ?? "Anonymous"}
                            //             </div>
                            //             <Link
                            //                 href={`/blog/${blog.id}`}
                            //                 className="text-sm text-primary font-medium hover:underline"
                            //             >
                            //                 Read
                            //             </Link>
                            //         </div>
                            //     </div>
                            // </article>
                            <BlogCard key={blog.id} blog={blog} />
                        ))}
                    </div>
                ) : (
                    <div className="h-32 flex items-center justify-center text-sm text-gray-500">
                        No recent posts yet.
                    </div>
                )}

                <div className="justify-end card-actions">
                    <Link href={route("blog.index")} className="btn btn-sm">
                        Browse All Blogs
                    </Link>
                </div>
            </div>
        </div>
    );
}
