import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import BlogCard from "@/Components/BlogCard";

export default function HomePage() {
    // Dummy data untuk hero slider
    const heroSlides = [
        {
            id: 1,
            image: "https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp",
            title: "Welcome to BlogHub",
            description:
                "Discover amazing stories, insights, and knowledge from writers around the world. Start your journey today!",
        },
        {
            id: 2,
            image: "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp",
            title: "Share Your Story",
            description:
                "Express yourself and share your thoughts with our vibrant community. Your voice matters here.",
        },
        {
            id: 3,
            image: "https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp",
            title: "Join Our Community",
            description:
                "Connect with passionate writers and readers. Build your network and grow together.",
        },
        {
            id: 4,
            image: "https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp",
            title: "Explore Topics",
            description:
                "From technology to lifestyle, discover content that matches your interests and passion.",
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    // Auto slide setiap 5 detik
    useEffect(() => {
        if (!isAutoPlay) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlay, heroSlides.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlay(false); // Stop auto play saat manual navigate
        setTimeout(() => setIsAutoPlay(true), 10000); // Resume setelah 10 detik
    };

    const nextSlide = () => {
        goToSlide((currentSlide + 1) % heroSlides.length);
    };

    const prevSlide = () => {
        goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length);
    };

    return (
        <div className="flex gap-5">
            {/* Content */}
            <div className="flex-[3]">
                {/* Hero Section with Slider */}
                <div className="flex flex-col gap-5">
                    <div className="relative">
                        <div
                            className="hero rounded-md min-h-[30rem] max-lg:min-h-[400px] transition-all duration-700 ease-in-out"
                            style={{
                                backgroundImage: `url(${heroSlides[currentSlide].image})`,
                            }}
                        >
                            <div className="hero-overlay rounded-md bg-opacity-60"></div>
                            <div className="hero-content text-neutral-content text-center">
                                <div className="max-w-md">
                                    <h1 className="mb-5 text-5xl font-bold animate-fade-in">
                                        {heroSlides[currentSlide].title}
                                    </h1>
                                    <p className="mb-5 animate-fade-in">
                                        {heroSlides[currentSlide].description}
                                    </p>
                                    <button className="btn btn-dash sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl px-3 border-1 border-gray-500/50">
                                        Read More
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Arrow Buttons */}
                        <button
                            onClick={prevSlide}
                            className="btn btn-circle btn-ghost absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 border-none text-white"
                            aria-label="Previous slide"
                        >
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
                                    strokeWidth="2"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>

                        <button
                            onClick={nextSlide}
                            className="btn btn-circle btn-ghost absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 border-none text-white"
                            aria-label="Next slide"
                        >
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
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>

                        {/* Slide Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {heroSlides.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        currentSlide === index
                                            ? "bg-white w-8"
                                            : "bg-white bg-opacity-50 hover:bg-opacity-75"
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="card h-fit bg-base-100 shadow-sm border-[0.5px] border-gray-200">
                        <div className="card-body">
                            <div className="card-title">Latest</div>
                            <div className="w-full grid grid-cols-3 gap-2">
                                <BlogCard />
                                <BlogCard />
                                <BlogCard />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Sidebar */}
            <div className="flex-1 card border-[1px] border-gray-500/50">
                Sidebar
            </div>
        </div>
    );
}

HomePage.layout = (page) => <GuestLayout children={page} />;
