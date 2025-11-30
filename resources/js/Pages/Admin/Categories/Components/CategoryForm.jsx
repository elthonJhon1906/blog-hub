import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function CategoryForm({
    category = null,
    parentCategory = null,
    isOpen,
    onClose,
}) {
    const isEditing = !!category;
    const isSubCategory = !!parentCategory;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: category?.name || "",
        description: category?.description || "",
        parent_id: category?.parent_id || parentCategory?.id || "",
    });

    useEffect(() => {
        if (category) {
            setData({
                name: category.name,
                description: category.description || "",
                parent_id: category.parent_id || "",
            });
        } else if (parentCategory) {
            setData({
                name: "",
                description: "",
                parent_id: parentCategory.id,
            });
        } else {
            reset();
        }
    }, [category, parentCategory, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            put(route("admin.categories.update", category.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
                preserveScroll: true,
            });
        } else {
            post(route("admin.categories.store"), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
                preserveScroll: true,
            });
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-2xl flex items-center gap-2">
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
                        {isEditing
                            ? "Edit Category"
                            : isSubCategory
                            ? `Add Sub-Category to "${parentCategory.name}"`
                            : "Create New Category"}
                    </h3>
                    <button
                        onClick={handleClose}
                        className="btn btn-sm btn-circle btn-ghost"
                        type="button"
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
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Category Type Info */}
                        {isSubCategory && !isEditing && (
                            <div className="alert alert-info">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="stroke-current shrink-0 w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                                <span>
                                    Creating sub-category under{" "}
                                    <strong>{parentCategory.name}</strong>
                                </span>
                            </div>
                        )}

                        {/* Name */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Category Name
                                    <span className="text-error ml-1">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Technology, Web Development"
                                className={`input input-bordered w-full ${
                                    errors.name ? "input-error" : ""
                                }`}
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                autoFocus
                            />
                            {errors.name && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        {errors.name}
                                    </span>
                                </label>
                            )}
                        </div>

                        {/* Description */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Description
                                    <span className="text-gray-500 text-xs ml-2">
                                        (Optional)
                                    </span>
                                </span>
                            </label>
                            <textarea
                                placeholder="Brief description of this category..."
                                className={`textarea textarea-bordered w-full h-24 ${
                                    errors.description ? "textarea-error" : ""
                                }`}
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                            />
                            {errors.description && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        {errors.description}
                                    </span>
                                </label>
                            )}
                        </div>

                        {/* Hidden parent_id field */}
                        {errors.parent_id && (
                            <div className="alert alert-error">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="stroke-current shrink-0 h-6 w-6"
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
                                <span>{errors.parent_id}</span>
                            </div>
                        )}
                    </div>

                    <div className="modal-action">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="btn btn-ghost"
                            disabled={processing}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    {isEditing ? "Updating..." : "Creating..."}
                                </>
                            ) : isEditing ? (
                                "Update Category"
                            ) : (
                                "Create Category"
                            )}
                        </button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop" onClick={handleClose}></div>
        </div>
    );
}
