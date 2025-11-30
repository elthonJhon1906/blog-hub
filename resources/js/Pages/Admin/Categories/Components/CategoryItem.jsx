import { useState } from "react";
import { router } from "@inertiajs/react";

export default function CategoryItem({
    category,
    onEdit,
    onAddSubCategory,
    level = 0,
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [deleteCategory, setDeleteCategory] = useState(null);
    const hasChildren = category.children && category.children.length > 0;
    const isMainCategory = level === 0;

    const handleDelete = (cat) => {
        setDeleteCategory(cat);
    };

    const handleDeleteConfirm = () => {
        if (deleteCategory) {
            router.delete(
                route("admin.categories.destroy", deleteCategory.id),
                {
                    preserveScroll: true,
                    onFinish: () => setDeleteCategory(null),
                }
            );
        }
    };

    const handleDeleteCancel = () => {
        setDeleteCategory(null);
    };

    return (
        <>
            <div
                className={`flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-all border ${
                    isMainCategory
                        ? "bg-base-100 border-base-300"
                        : "bg-base-50 border-base-200"
                }`}
            >
                {/* Expand/Collapse Button */}
                <div className="flex-shrink-0">
                    {isMainCategory ? (
                        hasChildren ? (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="btn btn-sm btn-ghost btn-square"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-4 w-4 transition-transform ${
                                        isExpanded ? "rotate-90" : ""
                                    }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        ) : (
                            <div className="w-10"></div>
                        )
                    ) : (
                        <div className="w-6 h-6 flex items-center justify-center">
                            <div className="w-3 h-3 border-l-2 border-b-2 border-base-300"></div>
                        </div>
                    )}
                </div>

                {/* Category Icon */}
                <div className="flex-shrink-0">
                    {isMainCategory ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-primary"
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
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-secondary"
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
                    )}
                </div>

                {/* Category Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-base">
                            {category.name}
                        </h4>
                        {hasChildren && (
                            <span className="badge badge-sm badge-primary badge-outline">
                                {category.children.length} sub-
                                {category.children.length === 1
                                    ? "category"
                                    : "categories"}
                            </span>
                        )}
                        {category.blogs_count > 0 && (
                            <span className="badge badge-sm badge-ghost">
                                {category.blogs_count} blog
                                {category.blogs_count !== 1 ? "s" : ""}
                            </span>
                        )}
                    </div>
                    {category.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {category.description}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-1">
                    {isMainCategory && (
                        <button
                            onClick={() => onAddSubCategory(category)}
                            className="btn btn-sm btn-ghost btn-square text-success"
                            aria-label="Add Sub-Category"
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
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </button>
                    )}
                    <button
                        onClick={() => onEdit(category)}
                        className="btn btn-sm btn-ghost btn-square"
                        aria-label="Edit"
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
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={() => handleDelete(category)}
                        className="btn btn-sm btn-ghost btn-square text-error"
                        aria-label="Delete"
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
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Sub-categories */}
            {isMainCategory && hasChildren && isExpanded && (
                <div className="ml-10 mt-2 space-y-2 border-l-2 border-base-300 pl-4">
                    {category.children.map((child) => (
                        <CategoryItem
                            key={child.id}
                            category={child}
                            onEdit={onEdit}
                            onAddSubCategory={onAddSubCategory}
                            level={1}
                        />
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteCategory && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg flex items-center gap-2 text-error">
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
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            Confirm Delete
                        </h3>
                        <p className="py-4">
                            Are you sure you want to delete category{" "}
                            <span className="font-bold">
                                {deleteCategory.name}
                            </span>
                            ?
                            <br />
                            <span className="text-sm text-gray-500">
                                This action cannot be undone.
                            </span>
                        </p>
                        <div className="modal-action">
                            <button
                                onClick={handleDeleteCancel}
                                className="btn btn-ghost"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="btn btn-error"
                            >
                                Delete Category
                            </button>
                        </div>
                    </div>
                    <div
                        className="modal-backdrop"
                        onClick={handleDeleteCancel}
                    ></div>
                </div>
            )}
        </>
    );
}
