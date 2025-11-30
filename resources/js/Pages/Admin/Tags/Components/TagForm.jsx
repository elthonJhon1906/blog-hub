import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function TagForm({ tag = null, isOpen, onClose }) {
    const isEditing = !!tag;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: tag?.name || "",
    });

    useEffect(() => {
        if (tag) {
            setData({
                name: tag.name,
            });
        } else {
            reset();
        }
    }, [tag, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            put(route("admin.tags.update", tag.id), {
                onSuccess: () => {
                    reset();
                    onClose();
                },
                preserveScroll: true,
            });
        } else {
            post(route("admin.tags.store"), {
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
            <div className="modal-box">
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
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                        </svg>
                        {isEditing ? "Edit Tag" : "Create New Tag"}
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
                        {/* Info Alert */}
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
                                />
                            </svg>
                            <span className="text-sm">
                                You can type with or without <strong>#</strong>{" "}
                                symbol. It will be added automatically in the
                                display.
                            </span>
                        </div>

                        {/* Tag Name */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Tag Name
                                    <span className="text-error ml-1">*</span>
                                </span>
                            </label>
                            <div className="join w-full">
                                <span className="btn btn-neutral join-item pointer-events-none">
                                    #
                                </span>
                                <input
                                    type="text"
                                    placeholder="javascript, react, tutorial"
                                    className={`input input-bordered join-item flex-1 ${
                                        errors.name ? "input-error" : ""
                                    }`}
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    autoFocus
                                />
                            </div>
                            {errors.name && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        {errors.name}
                                    </span>
                                </label>
                            )}
                            <label className="label">
                                <span className="label-text-alt text-gray-500">
                                    Max 50 characters. Letters, numbers, and
                                    hyphens only.
                                </span>
                            </label>
                        </div>

                        {/* Preview */}
                        {data.name && (
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">
                                        Preview
                                    </span>
                                </label>
                                <div className="p-3 bg-base-200 rounded-lg">
                                    <span className="text-lg font-medium text-primary">
                                        #{data.name.replace(/#/g, "")}
                                    </span>
                                </div>
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
                                "Update Tag"
                            ) : (
                                "Create Tag"
                            )}
                        </button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop" onClick={handleClose}></div>
        </div>
    );
}
