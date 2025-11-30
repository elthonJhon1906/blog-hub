import AdminLayout from "@/Layouts/AdminLayout";
import { router, usePage } from "@inertiajs/react";
import { useState } from "react";
import CategoryForm from "./Components/CategoryForm";
import CategoryItem from "./Components/CategoryItem";

export default function Index({ categories, filters }) {
    const { flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [parentCategory, setParentCategory] = useState(null);
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("admin.categories.index"),
            { search },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleReset = () => {
        setSearch("");
        router.get(route("admin.categories.index"));
    };

    const handleCreate = () => {
        setSelectedCategory(null);
        setParentCategory(null);
        setIsModalOpen(true);
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setParentCategory(null);
        setIsModalOpen(true);
    };

    const handleAddSubCategory = (category) => {
        setSelectedCategory(null);
        setParentCategory(category);
        setIsModalOpen(true);
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Categories Management
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Organize your blog content with categories and
                            sub-categories
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
                        Add Category
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
                                placeholder="Search categories..."
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

            {/* Categories List */}
            <div className="card bg-base-100 shadow">
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
                                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                                />
                            </svg>
                            Category Structure
                        </h2>
                        <div className="text-sm text-gray-500">
                            {categories.length}{" "}
                            {categories.length === 1
                                ? "category"
                                : "categories"}
                        </div>
                    </div>

                    {categories.length > 0 ? (
                        <div className="space-y-3">
                            {categories.map((category) => (
                                <CategoryItem
                                    key={category.id}
                                    category={category}
                                    onEdit={handleEdit}
                                    onAddSubCategory={handleAddSubCategory}
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
                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                />
                            </svg>
                            <p className="text-gray-500 mb-4">
                                No categories found
                            </p>
                            <button
                                onClick={handleCreate}
                                className="btn btn-primary"
                            >
                                Create First Category
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Category Form Modal */}
            <CategoryForm
                category={selectedCategory}
                parentCategory={parentCategory}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

Index.layout = (page) => <AdminLayout children={page} />;
