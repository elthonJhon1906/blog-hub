import { useState } from "react";
import { router, Link } from "@inertiajs/react";

export default function PageCard({ page, onEdit }) {
    const [deletePage, setDeletePage] = useState(null);

    const handleDelete = (p) => {
        setDeletePage(p);
    };

    const handleDeleteConfirm = () => {
        if (deletePage) {
            router.delete(route("admin.pages.destroy", deletePage.id), {
                preserveScroll: true,
                onFinish: () => setDeletePage(null),
            });
        }
    };

    const handleDeleteCancel = () => {
        setDeletePage(null);
    };

    return (
        <>
            <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all hover:border-primary">
                <div className="card-body p-5">
                    <div className="flex items-start justify-between gap-3">
                        {/* Page Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
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
                                <span className="truncate">{page.title}</span>
                            </h3>

                            {/* Slug/URL */}
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
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
                                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                    />
                                </svg>
                                <code className="text-xs bg-base-200 px-2 py-1 rounded">
                                    /page/{page.slug}
                                </code>
                            </div>

                            {/* Content Preview */}
                            {page.content && (
                                <div
                                    className="text-sm text-gray-600 line-clamp-2 mb-3"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            page.content.substring(0, 150) +
                                            "...",
                                    }}
                                />
                            )}

                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span>
                                        Created{" "}
                                        {new Date(
                                            page.created_at
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                {page.updated_at !== page.created_at && (
                                    <div className="flex items-center gap-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3 w-3"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            />
                                        </svg>
                                        <span>
                                            Updated{" "}
                                            {new Date(
                                                page.updated_at
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-1">
                            <Link
                                href={route("page.show", page.slug)}
                                target="_blank"
                                className="btn btn-sm btn-ghost btn-square"
                                aria-label="View Page"
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
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                            </Link>
                            <button
                                onClick={() => onEdit(page)}
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
                                onClick={() => handleDelete(page)}
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
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deletePage && (
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
                            Are you sure you want to delete page{" "}
                            <span className="font-bold">
                                {deletePage.title}
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
                                Delete Page
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
