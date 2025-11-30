import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import PageForm from "./Components/PageForm";
import PageCard from "./Components/PageCard";

export default function Index({ pages, filters }) {
    const { flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPage, setSelectedPage] = useState(null);
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("admin.pages.index"),
            { search },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleReset = () => {
        setSearch("");
        router.get(route("admin.pages.index"));
    };

    const handleCreate = () => {
        setSelectedPage(null);
        setIsModalOpen(true);
    };

    const handleEdit = (page) => {
        setSelectedPage(page);
        setIsModalOpen(true);
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Pages Management</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage static pages like About, Contact, Privacy
                            Policy
                        </p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="btn btn-primary gap-2"
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
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Add Page
                    </button>
                </div>
            </div>

            {/* Flash Messages */}
            {flash?.success && (
                <div className="alert alert-success mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>{flash.success}</span>
                </div>
            )}

            {flash?.error && (
                <div className="alert alert-error mb-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>{flash.error}</span>
                </div>
            )}

            {/* Search */}
            <div className="card bg-base-100 shadow mb-6">
                <div className="card-body">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="form-control flex-1">
                            <input
                                type="text"
                                placeholder="Search pages by title or slug..."
                                className="input input-bordered w-full"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
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
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                        {search && (
                            <button
                                type="button"
                                onClick={handleReset}
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
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )}
                    </form>
                </div>
            </div>

            {/* Pages Grid */}
            <div className="card bg-base-100 shadow mb-6">
                <div className="card-body">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="card-title text-lg">
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
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            All Pages
                        </h2>
                        <div className="text-sm text-gray-500">
                            {pages.total} {pages.total === 1 ? "page" : "pages"}
                        </div>
                    </div>

                    {pages.data.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {pages.data.map((page) => (
                                <PageCard
                                    key={page.id}
                                    page={page}
                                    onEdit={handleEdit}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-16 w-16 mx-auto mb-4 opacity-30"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <p className="text-gray-500 mb-4">No pages found</p>
                            <button
                                onClick={handleCreate}
                                className="btn btn-primary"
                            >
                                Create First Page
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {pages.data.length > 0 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing {pages.from} to {pages.to} of {pages.total}{" "}
                        pages
                    </div>
                    <div className="join">
                        {pages.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                className={`join-item btn btn-sm ${
                                    link.active ? "btn-active" : ""
                                } ${!link.url ? "btn-disabled" : ""}`}
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                                preserveState
                                preserveScroll
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Page Form Modal */}
            <PageForm
                page={selectedPage}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

Index.layout = (page) => <AdminLayout children={page} />;
