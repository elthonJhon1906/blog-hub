import { Head, router } from "@inertiajs/react";
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
    return (
        <div className="flex gap-5">
            <Head title="Home" />

            {/* Content */}
            <div className="flex-[3]">
                <div className="flex flex-col gap-5">
                    {/* Hero Section with Slider */}
                    {popularBlogs && popularBlogs.length > 0 ? (
                        <Hero popularBlogs={popularBlogs} />
                    ) : (
                        <div className="card bg-base-100 shadow-sm border-[0.5px] border-gray-200">
                            <div className="card-body">
                                <p className="text-center text-gray-500">
                                    Belum ada berita populer. Unggah artikel
                                    pertamamu untuk mengisi halaman ini.
                                </p>
                            </div>
                        </div>
                    )}

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
