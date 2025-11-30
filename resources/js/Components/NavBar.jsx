import React, { useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";

export default function NavBar() {
    const { categories } = usePage().props;
    const { auth } = usePage().props;
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get(route("blog.index"), { search: searchQuery.trim() });
        }
    };

    return (
        <div className="sticky top-0 z-50 w-full bg-white">
            <div className="navbar bg-base-500 shadow-sm px-40 max-lg:px-6 max-md:px-4">
                <div className="dropdown">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost lg:hidden"
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
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                    >
                        {categories?.map((category) => (
                            <li key={category.id}>
                                {category.children?.length > 0 ? (
                                    <>
                                        <a>{category.name}</a>
                                        <ul className="p-2">
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
                                    >
                                        {category.name}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex-1">
                    <Link
                        href="/"
                        className="btn btn-ghost text-xl max-md:hidden"
                    >
                        BlogHub
                    </Link>
                </div>
                <div className="flex gap-2">
                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="flex">
                        <div className="join">
                            <input
                                type="text"
                                placeholder="Search blogs..."
                                className="input input-bordered join-item w-24 md:w-auto"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </form>

                    {/* User Auth */}
                    {auth.user ? (
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar"
                            >
                                <div className="w-10 rounded-full">
                                    {auth.user.avatar_url ? (
                                        <img
                                            src={`/storage/${auth.user.avatar_url}`}
                                            alt={auth.user.name}
                                            className="rounded-full object-cover"
                                            onError={(e) => {
                                                // Fallback ke initial jika gambar gagal load
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
                                        <div className="bg-blue-900 text-white rounded-full w-10">
                                            <span className="text-lg">
                                                {auth.user.name
                                                    ?.charAt(0)
                                                    .toUpperCase() || "U"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ul
                                tabIndex="-1"
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow border border-gray-200"
                            >
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
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link href={route("blog.create")}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                        Create Blog
                                    </Link>
                                </li>
                                <div className="divider my-1"></div>
                                <li>
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="text-error"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                            />
                                        </svg>
                                        Logout
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link
                                href="/login"
                                className="btn btn-soft border-[1px] border-gray-400 hover:bg-gray-300 shadow-none"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="btn shadow-none bg-blue-900 text-white border-[1px] border-blue-400 hover:bg-blue-700 "
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full bg-base-100 shadow-sm max-lg:hidden bg-blue-900 text-white px-40 max-lg:px-0">
                <ul className="flex h-14">
                    {categories?.map((category) => (
                        <li key={category.id} className="relative group">
                            {category.children?.length > 0 ? (
                                <>
                                    <button className="px-3 h-14 flex items-center hover:bg-blue-800">
                                        {category.name}
                                    </button>
                                    <ul className="absolute hidden group-hover:block w-48 bg-blue-900 shadow-lg rounded-b-md left-0 top-full">
                                        {category.children.map((child) => (
                                            <li key={child.id}>
                                                <Link
                                                    href={route("blog.index", {
                                                        category: child.name,
                                                    })}
                                                    className="block px-4 py-2 hover:bg-blue-800"
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
                                    className="px-3 h-14 flex items-center hover:bg-blue-800"
                                >
                                    {category.name}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
