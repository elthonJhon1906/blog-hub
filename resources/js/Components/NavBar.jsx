import React, { useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";

export default function NavBar() {
    const { categories = [], auth } = usePage().props;
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
    const [isDesktopCategoriesOpen, setIsDesktopCategoriesOpen] = useState(false);
    const hasCategories = categories.length > 0;

    const blueFill = "from-blue-900 to-blue-700";
    const blueOutline = "border-blue-800 text-blue-900";
    const blueSolid = "bg-blue-900 hover:bg-blue-800 text-white";
    const blueBorder = "bg-white border border-blue-800 text-blue-900 hover:bg-blue-50";
    const blueBorderActive = "bg-blue-900 border-blue-900 shadow";
    const disabledCategoryBtn = "btn-disabled text-gray-500 bg-white border border-gray-200";
    const baseCategoryBtn = "btn btn-md font-medium";

    const getCategoryButtonClass = (isOpen, extra = "") => {
        if (!hasCategories) {
            return [baseCategoryBtn, extra, disabledCategoryBtn].filter(Boolean).join(" ");
        }

        return [baseCategoryBtn, extra, blueBorder, isOpen ? blueBorderActive : ""]
            .filter(Boolean)
            .join(" ");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get(route("blog.index"), { search: searchQuery.trim() });
        }
    };

    const renderCategoryTree = (items) =>
        items.map((category) => (
            <li key={category.id}>
                {category.children?.length ? (
                    <details>
                        <summary>{category.name}</summary>
                        <ul>{renderCategoryTree(category.children)}</ul>
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
        ));

    return (
        <div className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
            <div className="flex flex-row justify-between gap-4 px-4 mx-auto navbar max-w-7xl sm:px-6 lg:px-10">
                {/* Left: brand + mobile menu */}
                <div className="flex items-center gap-2">
                    <div
                        className={`dropdown lg:hidden ${
                            isMobileCategoriesOpen ? "dropdown-open" : ""
                        }`}
                        onBlur={(event) => {
                            if (!event.currentTarget.contains(event.relatedTarget)) {
                                setIsMobileCategoriesOpen(false);
                            }
                        }}
                    >
                        <button
                            className={getCategoryButtonClass(isMobileCategoriesOpen)}
                            tabIndex={0}
                            type="button"
                            disabled={!hasCategories}
                            aria-pressed={isMobileCategoriesOpen}
                            onClick={() => {
                                if (!hasCategories) return;
                                setIsMobileCategoriesOpen((prev) => !prev);
                            }}
                        >
                            Kategori
                        </button>
                        {hasCategories ? (
                            isMobileCategoriesOpen && (
                                <ul
                                    tabIndex={-1}
                                    className="p-2 mt-3 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-60"
                                >
                                    {renderCategoryTree(categories)}
                                </ul>
                            )
                        ) : (
                            isMobileCategoriesOpen && (
                                <div className="p-3 mt-3 text-sm text-gray-500 shadow bg-base-100 rounded-box">
                                    Belum ada kategori.
                                </div>
                            )
                        )}
                    </div>
                    <Link href="/" className="text-2xl font-semibold tracking-tight text-blue-900">
                        BlogHub
                    </Link>
                </div>

                {/* Middle: nav */}
                <div className="items-center justify-center flex-1 hidden gap-3 lg:flex">
                    <Link
                        href="/"
                        className={`btn btn-md ${blueSolid}`}
                    >
                        Beranda
                    </Link>
                    <div
                        className={`dropdown ${isDesktopCategoriesOpen ? "dropdown-open" : ""}`}
                        onBlur={(event) => {
                            if (!event.currentTarget.contains(event.relatedTarget)) {
                                setIsDesktopCategoriesOpen(false);
                            }
                        }}
                    >
                        <button
                            type="button"
                            className={getCategoryButtonClass(
                                isDesktopCategoriesOpen,
                                "gap-2 px-2"
                            )}
                            disabled={!hasCategories}
                            aria-expanded={isDesktopCategoriesOpen}
                            aria-pressed={isDesktopCategoriesOpen}
                            onClick={() => {
                                if (!hasCategories) return;
                                setIsDesktopCategoriesOpen((prev) => !prev);
                            }}
                        >
                            Categories
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>
                        {hasCategories ? (
                            isDesktopCategoriesOpen && (
                                <ul
                                    tabIndex={-1}
                                    className="menu dropdown-content bg-base-100 rounded-lg shadow z-[1] w-fit px-4 py-1 mt-1 border border-gray-100"
                                >
                                    {renderCategoryTree(categories)}
                                </ul>
                            )
                        ) : (
                            isDesktopCategoriesOpen && (
                                <div
                                    tabIndex={-1}
                                    className="dropdown-content bg-base-100 rounded-box shadow z-[1] w-64 p-3 text-sm text-gray-500 border border-gray-100"
                                >
                                    Belum ada kategori untuk ditampilkan.
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Right: search + auth */}
                <div className="flex items-center justify-center w-full gap-3 lg:w-auto">
                    <form
                        onSubmit={handleSearch}
                        className={`hidden md:flex items-center gap-2 transition-all duration-200 px-10 ${
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
                                placeholder="Cari Artikel . . . . . . "
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                            />
                        </label>
                        <button type="submit" className={`btn btn-md px-4 ${blueSolid}`}>
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
                                                e.target.nextElementSibling.style.display = "flex";
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className="avatar placeholder"
                                        style={{
                                            display: auth.user.avatar_url ? "none" : "flex",
                                        }}
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 text-white bg-blue-900 rounded-full">
                                            <span className="text-lg font-semibold">
                                                {auth.user.name?.charAt(0).toUpperCase() || "U"}
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
                                    <Link href={route("profile.show", auth.user.username)}>
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route("blog.create")}>Create Blog</Link>
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
        </div>
    );
}
