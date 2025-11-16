import { useState, useEffect } from "react";
import { Head, Link, router } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import BlogCard from "@/Components/BlogCard";

export default function HomePage({ popularBlogs, latestBlogs }) {
    console.log("Latest Blogs:", latestBlogs);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    // Dummy data for sidebar
    const popularTags = [
        { name: "JavaScript", count: 234 },
        { name: "React", count: 189 },
        { name: "Web Development", count: 167 },
        { name: "Tutorial", count: 145 },
        { name: "Node.js", count: 132 },
        { name: "CSS", count: 121 },
        { name: "Database", count: 98 },
        { name: "API", count: 87 },
    ];

    const topUsers = [
        { id: 1, name: "John Doe", avatar: "JD", posts: 42, followers: 1234 },
        { id: 2, name: "Jane Smith", avatar: "JS", posts: 38, followers: 987 },
        {
            id: 3,
            name: "Mike Johnson",
            avatar: "MJ",
            posts: 35,
            followers: 856,
        },
        {
            id: 4,
            name: "Sarah Williams",
            avatar: "SW",
            posts: 31,
            followers: 743,
        },
        { id: 5, name: "David Brown", avatar: "DB", posts: 28, followers: 621 },
    ];

    const topPosts = [
        {
            id: 1,
            title: "Getting Started with React Hooks",
            author: "John Doe",
            likes: 456,
            thumbnail: "https://via.placeholder.com/100x100?text=React",
        },
        {
            id: 2,
            title: "Advanced CSS Grid Techniques",
            author: "Jane Smith",
            likes: 389,
            thumbnail: "https://via.placeholder.com/100x100?text=CSS",
        },
        {
            id: 3,
            title: "Building REST APIs with Node.js",
            author: "Mike Johnson",
            likes: 367,
            thumbnail: "https://via.placeholder.com/100x100?text=Node",
        },
        {
            id: 4,
            title: "Mastering JavaScript ES6+",
            author: "Sarah Williams",
            likes: 345,
            thumbnail: "https://via.placeholder.com/100x100?text=JS",
        },
        {
            id: 5,
            title: "Database Design Best Practices",
            author: "David Brown",
            likes: 312,
            thumbnail: "https://via.placeholder.com/100x100?text=DB",
        },
    ];

    // Auto slide setiap 5 detik
    useEffect(() => {
        if (!isAutoPlay || !popularBlogs?.length) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % popularBlogs.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlay, popularBlogs]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlay(false);
        setTimeout(() => setIsAutoPlay(true), 10000);
    };

    const nextSlide = () => {
        goToSlide((currentSlide + 1) % popularBlogs.length);
    };

    const prevSlide = () => {
        goToSlide(
            (currentSlide - 1 + popularBlogs.length) % popularBlogs.length
        );
    };

    // Extract content preview from Quill Delta format
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

    const formatDate = (dateString) => {
        if (!dateString) return "New";
        return new Date(dateString).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (!popularBlogs || popularBlogs.length === 0) {
        return (
            <div className="flex gap-5">
                <div className="flex-[3]">
                    <div className="card bg-base-100 shadow-sm border-[0.5px] border-gray-200">
                        <div className="card-body">
                            <p className="text-center text-gray-500">
                                No blogs available yet.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 card border-[1px] border-gray-200 max-lg:hidden">
                    Sidebar
                </div>
            </div>
        );
    }

    const currentBlog = popularBlogs[currentSlide];

    return (
        <div className="flex gap-5">
            <Head title="Home" />

            {/* Content */}
            <div className="flex-[3]">
                <div className="flex flex-col gap-5">
                    {/* Hero Section with Slider */}
                    <div className="relative shadow-sm">
                        <div
                            className="hero shadow-sm rounded-md h-[400px] md:h-[400px] lg:h-[450px] transition-all duration-700 ease-in-out"
                            style={{
                                backgroundImage: `url(${currentBlog.thumbnail_url})`,
                            }}
                        >
                            <div className="hero-overlay rounded-md bg-opacity-60"></div>
                            <div className="hero-content text-neutral-content w-full px-4 md:px-20 flex justify-start">
                                <div className="max-w-2xl ">
                                    <h1 className="mb-3 text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                                        {currentBlog.title}
                                    </h1>
                                    <p className="mb-4 text-sm md:text-base opacity-90 line-clamp-2">
                                        {getContentPreview(currentBlog.content)}
                                    </p>
                                    <Link
                                        href={`/blog/${currentBlog.id}`}
                                        className="btn btn-sm shadow-none md:btn-md bg-white/10 backdrop-blur-sm border border-white/40 text-white hover:bg-white/20"
                                    >
                                        Read More
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Arrow Buttons */}
                        <button
                            onClick={prevSlide}
                            className="btn btn-circle btn-sm md:btn-md btn-ghost absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 border-none text-white max-md:hidden"
                            aria-label="Previous slide"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 md:h-6 md:w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>

                        <button
                            onClick={nextSlide}
                            className="btn btn-circle btn-sm md:btn-md btn-ghost absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 border-none text-white max-md:hidden"
                            aria-label="Next slide"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 md:h-6 md:w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>

                        {/* Slide Indicators */}
                        <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {popularBlogs.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`h-2 md:h-3 rounded-full transition-all duration-300 ${
                                        currentSlide === index
                                            ? "bg-white w-6 md:w-8"
                                            : "bg-white/50 w-2 md:w-3 hover:bg-white/75"
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Latest Blogs Section */}
                    <div className="card h-fit bg-base-100 shadow-sm border-[0.5px] border-gray-200">
                        <div className="card-body">
                            <div className="card-title flex items-center justify-between">
                                <span>Latest</span>
                                <span className="text-xs text-gray-500">
                                    {latestBlogs?.length ?? 0} posts
                                </span>
                            </div>

                            {latestBlogs?.length ? (
                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {latestBlogs.map((blog) => (
                                        <article
                                            key={blog.id}
                                            className="card border border-gray-200 hover:shadow transition"
                                        >
                                            <figure className="h-40 w-full overflow-hidden rounded-t-md bg-gray-100">
                                                <img
                                                    src={
                                                        blog.thumbnail_url ??
                                                        "https://via.placeholder.com/640x360?text=No+Image"
                                                    }
                                                    alt={blog.title}
                                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                                />
                                            </figure>
                                            <div className="card-body p-4">
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                                    {blog.category?.name && (
                                                        <button
                                                            onClick={() =>
                                                                router.get(
                                                                    route(
                                                                        "blog.index"
                                                                    ),
                                                                    {
                                                                        category:
                                                                            blog
                                                                                .category
                                                                                .name,
                                                                    }
                                                                )
                                                            }
                                                            className="badge badge-outline hover:badge-primary transition cursor-pointer"
                                                        >
                                                            {blog.category.name}
                                                        </button>
                                                    )}
                                                    <span>
                                                        {formatDate(
                                                            blog.created_at
                                                        )}
                                                    </span>
                                                </div>
                                                <h3 className="text-base font-semibold line-clamp-2">
                                                    {blog.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 line-clamp-3 mt-2">
                                                    {getContentPreview(
                                                        blog.content
                                                    )}
                                                </p>
                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="text-xs text-gray-500">
                                                        {blog.user?.name ??
                                                            "Anonymous"}
                                                    </div>
                                                    <Link
                                                        href={`/blog/${blog.id}`}
                                                        className="text-sm text-primary font-medium hover:underline"
                                                    >
                                                        Read
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-32 flex items-center justify-center text-sm text-gray-500">
                                    No recent posts yet.
                                </div>
                            )}

                            <div className="justify-end card-actions">
                                <Link
                                    href={route("blog.index")}
                                    className="btn btn-sm"
                                >
                                    Browse All Blogs
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="flex-1 flex flex-col gap-5 max-lg:hidden">
                {/* Popular Tags */}
                <div className="card bg-base-100 shadow-sm border border-gray-200">
                    <div className="card-body p-4">
                        <h3 className="card-title text-base mb-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-primary"
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
                        <div className="flex flex-wrap gap-2">
                            {popularTags.slice(0, 8).map((tag, index) => (
                                <button
                                    key={index}
                                    onClick={() =>
                                        router.get(route("blog.index"), {
                                            tag: tag.name,
                                        })
                                    }
                                    className="badge badge-lg bg-gray-200 border border-gray-400 px-1 hover:bg-gray-300 transition cursor-pointer"
                                >
                                    #{tag.name}
                                    <span className="ml-1 text-xs opacity-70">
                                        {tag.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <button className="btn btn-sm btn-ghost w-full mt-2">
                            View All Tags →
                        </button>
                    </div>
                </div>

                {/* Top Users */}
                <div className="card bg-base-100 shadow-sm border border-gray-200">
                    <div className="card-body p-4">
                        <h3 className="card-title text-base mb-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-primary"
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
                            {topUsers.map((user, index) => (
                                <div
                                    key={user.id}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 transition cursor-pointer"
                                >
                                    <div className="badge bg-blue-800 badge-sm text-white">
                                        {index + 1}
                                    </div>
                                    <div className="avatar placeholder">
                                        <div className="bg-blue-900 text-white rounded-full w-10 h-10">
                                            <span className="text-sm">
                                                {user.avatar}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {user.posts} posts
                                            {/* {user.followers} followers */}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-sm btn-ghost w-full mt-2">
                            View All Writers →
                        </button>
                    </div>
                </div>

                {/* Top Posts */}
                <div className="card bg-base-100 shadow-sm border border-gray-200">
                    <div className="card-body p-4">
                        <h3 className="card-title text-base mb-3">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-primary"
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
                                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-base-200 transition"
                                >
                                    <div className="badge badge-error badge-sm mt-1">
                                        {index + 1}
                                    </div>
                                    <figure className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                                        <img
                                            src={post.thumbnail}
                                            alt={post.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </figure>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm line-clamp-2 mb-1">
                                            {post.title}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span>{post.author}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-3 w-3"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                                {post.likes}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <button className="btn btn-sm btn-ghost w-full mt-2">
                            View All Trending →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

HomePage.layout = (page) => <GuestLayout children={page} />;
