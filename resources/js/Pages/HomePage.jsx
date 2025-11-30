import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import Hero from "@/Components/Hero";
import SideBar from "@/Components/SideBar";
import LatestBlogs from "@/Components/LatestBlogs";

export default function HomePage({
    popularBlogs,
    latestBlogs,
    popularTags,
    topUsers,
    trendingPosts,
}) {
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

    return (
        <div className="flex gap-5">
            <Head title="Home" />

            {/* Content */}
            <div className="flex-[3]">
                <div className="flex flex-col gap-5">
                    {/* Hero Section with Slider */}
                    <Hero popularBlogs={popularBlogs} />

                    {/* Latest Blogs Section */}
                    <LatestBlogs latestBlogs={latestBlogs} />
                </div>
            </div>

            {/* Sidebar */}
            <SideBar
                popularTags={popularTags || []}
                topUsers={topUsers || []}
                topPosts={trendingPosts || []}
                router={router}
            />
        </div>
    );
}

HomePage.layout = (page) => <GuestLayout children={page} />;
