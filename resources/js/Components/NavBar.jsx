import React, { useState, useEffect } from "react";
import { usePage, Link, router } from "@inertiajs/react";

export default function NavBar() {
    const { categories = [], auth, marqueeItems = [] } = usePage().props;
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);

    const blueSolid = "bg-blue-900 hover:bg-blue-800 text-white";
    const blueOutline = "border-blue-800 text-blue-900";

    useEffect(() => {
        if (!marqueeItems.length) return;
        setCurrentHeadlineIndex(
            Math.floor(Math.random() * marqueeItems.length)
        );
    }, [marqueeItems.length]);

    useEffect(() => {
        if (!marqueeItems.length) return;

        const interval = setInterval(() => {
            setCurrentHeadlineIndex((prev) =>
                marqueeItems.length ? (prev + 1) % marqueeItems.length : 0
            );
        }, 60_000);

        return () => clearInterval(interval);
    }, [marqueeItems.length]);

    const currentHeadline = marqueeItems.length
        ? marqueeItems[currentHeadlineIndex % marqueeItems.length]
        : null;

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get(route("blog.index"), { search: searchQuery.trim() });
        }
    };

    return (
        <div className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
            {/* Marquee Headline */}
            {currentHeadline && (
                <div className="bg-blue-50 border-b border-blue-100">
                    <div className="flex items-center gap-3 px-4 py-1 mx-auto text-sm text-blue-900 max-w-7xl sm:px-6 lg:px-10">
                        <span className="text-xs font-semibold tracking-wider uppercase text-blue-800">
                            Update
                        </span>
                        <div
                            className="flex-1 overflow-hidden"
                            aria-live="polite"
                        >
                            <div
                                key={`${currentHeadline.id}-${currentHeadlineIndex}`}
                                className="navbar-marquee whitespace-nowrap"
                            >
                                <Link
                                    href={currentHeadline.url || "/"}
                                    className="flex items-center gap-2 text-blue-900 hover:text-blue-700"
                                >
                                    <strong className="text-xs uppercase tracking-wide">
                                        {currentHeadline.title}
                                    </strong>
                                    <span className="opacity-80">
                                        {currentHeadline.text}
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Navbar - Brand, Search, Auth */}
            <div className="flex flex-row justify-between gap-4 px-4 mx-auto navbar max-w-7xl sm:px-6 lg:px-10">
                {/* Left: Brand + Mobile Menu */}
                <div className="flex items-center gap-2">
                    <div className="dropdown lg:hidden">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost"
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
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16"
                                />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                        >
                            {categories?.map((category) => (
                                <li key={category.id}>
                                    {category.children?.length > 0 ? (
                                        <details>
                                            <summary>{category.name}</summary>
                                            <ul>
                                                {category.children.map(
                                                    (child) => (
                                                        <li key={child.id}>
                                                            <Link
                                                                href={route(
                                                                    "blog.index",
                                                                    {
                                                                        category:
                                                                            child.name,
                                                                    }
                                                                )}
                                                            >
                                                                {child.name}
                                                            </Link>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </details>
                                    ) : (
                                        <Link
                                            href={route("blog.index", {
                                                category: category.name,
                                            })}
                                        >
                                            {category.name}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Link
                        href="/"
                        className="text-2xl font-semibold tracking-tight text-blue-900"
                    >
                        BlogHub
                    </Link>
                </div>

                {/* Right: Search + Auth */}
                <div className="flex items-center justify-end gap-3">
                    <form
                        onSubmit={handleSearch}
                        className={`hidden md:flex items-center gap-2 transition-all duration-200 ${
                            isSearchFocused ? "scale-[1.01]" : ""
                        }`}
                    >
                        <label
                            className={`flex items-center gap-2 bg-white w-72 transition-all duration-200 rounded-lg border px-2 ${
                                isSearchFocused
                                    ? "border-blue-500 ring-2 ring-blue-200 shadow-lg"
                                    : "input-bordered shadow-sm hover:ring-1 hover:ring-blue-100"
                            }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4 opacity-60"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                                />
                            </svg>
                            <input
                                type="search"
                                className="bg-transparent border-none outline-none search-input grow focus:outline-none focus:ring-0 focus:border-0"
                                placeholder="Cari Artikel..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                            />
                        </label>
                        <button
                            type="submit"
                            className={`btn btn-md px-4 ${blueSolid}`}
                        >
                            Cari
                        </button>
                    </form>

                    {auth?.user ? (
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar"
                            >
                                <div className="w-10 h-10 rounded-full">
                                    {auth.user.avatar_url ? (
                                        <img
                                            src={`/storage/${auth.user.avatar_url}`}
                                            alt={auth.user.name}
                                            className="object-cover w-10 h-10 rounded-full"
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                                e.target.nextElementSibling.style.display =
                                                    "flex";
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className="avatar placeholder"
                                        style={{
                                            display: auth.user.avatar_url
                                                ? "none"
                                                : "flex",
                                        }}
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 text-white bg-blue-900 rounded-full">
                                            <span className="text-lg font-semibold">
                                                {auth.user.name
                                                    ?.charAt(0)
                                                    .toUpperCase() || "U"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-56 p-2 shadow border border-gray-200">
                                <li className="menu-title">
                                    <span>{auth.user.name}</span>
                                </li>
                                <li>
                                    <Link
                                        href={route(
                                            "profile.show",
                                            auth.user.username
                                        )}
                                    >
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route("blog.create")}>
                                        Create Blog
                                    </Link>
                                </li>
                                <div className="my-1 divider"></div>
                                <li>
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="text-error"
                                    >
                                        Logout
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link
                                href="/login"
                                className={`btn btn-outline btn-md ${blueOutline}`}
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className={`btn btn-md ${blueSolid}`}
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Navbar - Categories (Desktop Only) */}
            <div className="hidden lg:block w-full bg-blue-900 text-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
                    <ul className="flex h-12 items-center">
                        {categories?.map((category) => (
                            <li key={category.id} className="relative group">
                                {category.children?.length > 0 ? (
                                    <>
                                        <button className="px-4 h-12 flex items-center hover:bg-blue-800 transition-colors font-medium">
                                            {category.name}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 ml-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </button>
                                        <ul className="absolute hidden group-hover:block w-56 bg-blue-900 text-white shadow-lg rounded-b-md left-0 top-full z-50 ">
                                            {category.children.map((child) => (
                                                <li key={child.id}>
                                                    <Link
                                                        href={route(
                                                            "blog.index",
                                                            {
                                                                category:
                                                                    child.name,
                                                            }
                                                        )}
                                                        className="block px-4 py-2.5 hover:bg-blue-800 transition-colors text-sm rounded-b-md"
                                                    >
                                                        {child.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <Link
                                        href={route("blog.index", {
                                            category: category.name,
                                        })}
                                        className="px-4 h-12 flex items-center hover:bg-blue-800 transition-colors font-medium"
                                    >
                                        {category.name}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
