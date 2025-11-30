import { useForm } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function PageForm({ page = null, isOpen, onClose }) {
    const isEditing = !!page;
    const editorRef = useRef(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: page?.title || "",
        slug: page?.slug || "",
        content: page?.content || "",
    });

    useEffect(() => {
        if (page) {
            setData({
                title: page.title,
                slug: page.slug,
                content: page.content || "",
            });
        } else {
            reset();
        }
    }, [page, isOpen]);

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setData("title", title);

        if (!isEditing) {
            const slug = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            setData((prev) => ({ ...prev, slug }));
        }
    };

    // ✅ Handle TinyMCE content change
    const handleEditorChange = (content, editor) => {
        setData("content", content);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // ✅ Get content from TinyMCE editor sebagai fallback
        const editorContent = editorRef.current?.getContent() || "";

        const submitData = {
            ...data,
            content: editorContent || data.content, // Pakai editor content atau fallback ke data.content
        };

        console.log("Submitting data:", submitData); // Debug

        if (isEditing) {
            put(route("admin.pages.update", page.id), {
                data: submitData,
                onSuccess: () => {
                    reset();
                    onClose();
                },
                onError: (errors) => {
                    console.error("Update errors:", errors);
                },
                preserveScroll: true,
            });
        } else {
            post(route("admin.pages.store"), {
                data: submitData,
                onSuccess: () => {
                    reset();
                    onClose();
                },
                onError: (errors) => {
                    console.error("Create errors:", errors);
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
            <div className="modal-box max-w-6xl h-[90vh] flex flex-col p-0">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-base-300">
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
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        {isEditing ? "Edit Page" : "Create New Page"}
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

                {/* Form Content */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col flex-1 overflow-hidden"
                >
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {/* Title */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Page Title
                                    <span className="text-error ml-1">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. About Us, Privacy Policy"
                                className={`input input-bordered w-full ${
                                    errors.title ? "input-error" : ""
                                }`}
                                value={data.title}
                                onChange={handleTitleChange}
                                autoFocus
                            />
                            {errors.title && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        {errors.title}
                                    </span>
                                </label>
                            )}
                        </div>

                        {/* Slug */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Slug (URL)
                                    <span className="text-error ml-1">*</span>
                                </span>
                            </label>
                            <div className="join w-full">
                                <span className="btn btn-neutral join-item pointer-events-none text-sm">
                                    /page/
                                </span>
                                <input
                                    type="text"
                                    placeholder="about-us"
                                    className={`input input-bordered join-item flex-1 ${
                                        errors.slug ? "input-error" : ""
                                    }`}
                                    value={data.slug}
                                    onChange={(e) =>
                                        setData("slug", e.target.value)
                                    }
                                />
                            </div>
                            {errors.slug && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        {errors.slug}
                                    </span>
                                </label>
                            )}
                            <label className="label">
                                <span className="label-text-alt text-gray-500">
                                    URL-friendly format (lowercase, hyphens
                                    only)
                                </span>
                            </label>
                        </div>

                        {/* Content Editor */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold">
                                    Page Content
                                </span>
                            </label>
                            <div className="border border-base-300 rounded-lg overflow-hidden">
                                <Editor
                                    tinymceScriptSrc="/tinymce/tinymce.min.js"
                                    licenseKey="gpl"
                                    onInit={(evt, editor) => {
                                        editorRef.current = editor;
                                    }}
                                    value={data.content}
                                    onEditorChange={handleEditorChange}
                                    init={{
                                        height: 500,
                                        menubar: true,
                                        plugins: [
                                            "advlist",
                                            "autolink",
                                            "lists",
                                            "link",
                                            "image",
                                            "charmap",
                                            "preview",
                                            "anchor",
                                            "searchreplace",
                                            "visualblocks",
                                            "code",
                                            "fullscreen",
                                            "insertdatetime",
                                            "media",
                                            "table",
                                            "help",
                                            "wordcount",
                                        ],
                                        toolbar:
                                            "undo redo | blocks | " +
                                            "bold italic forecolor | alignleft aligncenter " +
                                            "alignright alignjustify | bullist numlist outdent indent | " +
                                            "removeformat | image media link | code | help",
                                        content_style:
                                            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",

                                        // Image upload handler
                                        images_upload_handler: async (
                                            blobInfo,
                                            progress
                                        ) => {
                                            const formData = new FormData();
                                            formData.append(
                                                "file",
                                                blobInfo.blob(),
                                                blobInfo.filename()
                                            );

                                            try {
                                                const response = await fetch(
                                                    route(
                                                        "admin.pages.upload-image"
                                                    ),
                                                    {
                                                        method: "POST",
                                                        body: formData,
                                                        headers: {
                                                            "X-CSRF-TOKEN":
                                                                document.querySelector(
                                                                    'meta[name="csrf-token"]'
                                                                ).content,
                                                        },
                                                    }
                                                );

                                                const data =
                                                    await response.json();
                                                return data.location;
                                            } catch (error) {
                                                console.error(
                                                    "Image upload failed:",
                                                    error
                                                );
                                                throw error;
                                            }
                                        },

                                        paste_data_images: true,
                                        media_live_embeds: true,
                                        branding: false,
                                        promotion: false,
                                    }}
                                />
                            </div>
                            {errors.content && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        {errors.content}
                                    </span>
                                </label>
                            )}
                        </div>

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
                            <div className="text-sm">
                                <strong>Tips:</strong>
                                <ul className="list-disc list-inside mt-1">
                                    <li>Use the toolbar for text formatting</li>
                                    <li>
                                        Click "Code" button to edit HTML
                                        directly
                                    </li>
                                    <li>
                                        Drag & drop or paste images directly
                                    </li>
                                    <li>
                                        Use "Media" button to embed YouTube
                                        videos
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-base-300 p-6 flex justify-end gap-2">
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
                                "Update Page"
                            ) : (
                                "Create Page"
                            )}
                        </button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop" onClick={handleClose}></div>
        </div>
    );
}
