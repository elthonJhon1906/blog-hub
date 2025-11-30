import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";

export default function Hero({ popularBlogs }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

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

    const currentBlog = popularBlogs[currentSlide];

    return (
        <div className="relative shadow-sm">
            <div
                className="hero shadow-sm rounded-md h-[400px] md:h-[400px] lg:h-[450px] transition-all duration-700 ease-in-out"
                style={{
                    backgroundImage: `url(${currentBlog.thumbnail_url})`,
                }}
            >
                <div className="hero-overlay rounded-md bg-opacity-60"></div>
                <div className="hero-content text-neutral-content w-full px-4 md:px-20 flex justify-start">
                    {/* Fixed height container with flex layout */}
                    <div className="max-w-2xl flex flex-col h-[200px] md:h-[220px] justify-between">
                        {/* Title - Fixed 2-3 lines */}
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight line-clamp-2 md:line-clamp-3 min-h-[3rem] md:min-h-[4rem]">
                            {currentBlog.title}
                        </h1>

                        {/* Content - Fixed 2 lines */}
                        <p className="text-sm md:text-base opacity-90 line-clamp-2 min-h-[2.5rem] md:min-h-[3rem]">
                            {getContentPreview(currentBlog.content)}
                        </p>

                        {/* Button - Always at bottom */}
                        <div>
                            <Link
                                href={`/blog/${currentBlog.id}`}
                                className="btn btn-sm shadow-none md:btn-md bg-white/10 backdrop-blur-sm border border-white/40 text-white hover:bg-white/20"
                            >
                                Read More
                            </Link>
                        </div>
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
    );
}
