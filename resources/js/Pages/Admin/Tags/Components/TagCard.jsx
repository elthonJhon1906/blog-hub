import { useState } from "react";
import { router } from "@inertiajs/react";

export default function TagCard({ tag, onEdit }) {
    const [deleteTag, setDeleteTag] = useState(null);

    const handleDelete = (t) => {
        setDeleteTag(t);
    };

    const handleDeleteConfirm = () => {
        if (deleteTag) {
            router.delete(route("admin.tags.destroy", deleteTag.id), {
                preserveScroll: true,
                onFinish: () => setDeleteTag(null),
            });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteTag(null);
    };

    return (
        <>
            <div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-all hover:border-primary">
                <div className="card-body p-4">
                    <div className="flex items-start justify-between gap-3">
                        {/* Tag Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-2">
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
                                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                    />
                                </svg>
                                <span className="truncate">#{tag.name}</span>
                            </h3>

                            {/* Stats */}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
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
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <span>
                                    {tag.blogs_count}{" "}
                                    {tag.blogs_count === 1 ? "blog" : "blogs"}
                                </span>
                            </div>

                            {/* Created Date */}
                            <div className="text-xs text-gray-500 mt-1">
                                Created{" "}
                                {new Date(tag.created_at).toLocaleDateString()}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1">
                            <button
                                onClick={() => onEdit(tag)}
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
                                onClick={() => handleDelete(tag)}
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
            {deleteTag && (
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
                            Are you sure you want to delete tag{" "}
                            <span className="font-bold text-primary">
                                #{deleteTag.name}
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
                                Delete Tag
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
