import { useEffect, useMemo, useState } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import "quill/dist/quill.snow.css";

const dataURLToFile = (dataUrl, filename = "thumbnail.png") => {
    if (!dataUrl?.startsWith("data:")) return null;

    const arr = dataUrl.split(",");
    if (arr.length < 2) return null;

    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
};

export default function BlogPreview() {
    const {
        title,
        content,
        thumbnail,
        category,
        category_id,
        tags,
        status,
        blog_id,
        is_editing,
    } = usePage().props;

    const parsedTags = useMemo(() => {
        if (!tags) return [];
        if (Array.isArray(tags)) return tags;
        try {
            return JSON.parse(tags) ?? [];
        } catch {
            return [];
        }
    }, [tags]);

    const form = useForm({
        title: title ?? "",
        content: content ?? "",
        thumbnail: thumbnail ?? null,
        category_id: category_id ?? "",
        tags: parsedTags,
        status: status ?? "published",
    });
    const { data, setData, processing } = form;

    const [renderedContent, setRenderedContent] = useState("");
    const [submittingAs, setSubmittingAs] = useState(null);

    useEffect(() => {
        setData((prev) => ({
            ...prev,
            title: title ?? "",
            content: content ?? "",
            thumbnail: thumbnail ?? null,
            category_id: category_id ?? "",
            tags: parsedTags,
            status: status ?? "published",
        }));
    }, [title, content, thumbnail, category_id, parsedTags, status, setData]);

    useEffect(() => {
        if (!content) {
            setRenderedContent("<p><br/></p>");
            return;
        }

        try {
            const ops =
                typeof content === "string" ? JSON.parse(content) : content;
            const converter = new QuillDeltaToHtmlConverter(ops, {
                paragraphTag: "p",
                encodeHtml: false,
            });
            setRenderedContent(converter.convert());
        } catch (error) {
            console.error("Failed to render preview:", error);
            setRenderedContent("<p><br/></p>");
        }
    }, [content]);

    const handleBackToEdit = () => {
        const routeName = is_editing ? "blog.edit" : "blog.create";
        const routeParams = is_editing ? blog_id : undefined;

        // Simpan ke sessionStorage
        const dataToSave = {
            title,
            content,
            thumbnail,
            category_id,
            tags: parsedTags,
            status,
        };
        sessionStorage.setItem("preserved_draft", JSON.stringify(dataToSave));

        // Redirect langsung
        router.get(route(routeName, routeParams));
    };

    const preparePayload = (currentData, targetStatus) => {
        const payload = {
            ...currentData,
            status: targetStatus,
        };

        if (Array.isArray(payload.tags)) {
            payload.tags = payload.tags.map((tag) =>
                typeof tag === "string" ? tag : `${tag}`
            );
        } else if (typeof payload.tags === "string") {
            try {
                const parsed = JSON.parse(payload.tags);
                payload.tags = Array.isArray(parsed) ? parsed : [];
            } catch {
                payload.tags = [];
            }
        }

        if (payload.thumbnail && typeof payload.thumbnail === "string") {
            if (payload.thumbnail.startsWith("data:")) {
                const file = dataURLToFile(
                    payload.thumbnail,
                    `thumbnail-${Date.now()}.png`
                );
                payload.thumbnail = file;
            } else if (is_editing) {
                delete payload.thumbnail;
            }
        }

        return payload;
    };

    const handleSubmit = (targetStatus) => {
        setSubmittingAs(targetStatus);

        const formData = preparePayload(data, targetStatus);

        if (
            !is_editing &&
            (!formData.thumbnail || !(formData.thumbnail instanceof File))
        ) {
            alert(
                "Thumbnail tidak valid. Silakan kembali ke form dan unggah ulang gambar."
            );
            setSubmittingAs(null);
            return;
        }

        const submitRoute = is_editing
            ? route("blog.update", blog_id)
            : route("blog.store");

        form.transform(() => formData);
        form.post(submitRoute, {
            preserveScroll: true,
            onSuccess: () => {
                sessionStorage.removeItem("preserved_draft");
                if (is_editing) {
                    router.visit(route("blog.show", blog_id));
                }
            },
            onFinish: () => {
                setSubmittingAs(null);
            },
        });
    };

    return (
        <div className="">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleBackToEdit}
                        className="btn btn-ghost btn-sm"
                        disabled={processing}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Back to {is_editing ? "Edit" : "Create"}
                    </button>
                    <div className="text-white badge badge-success">
                        Preview Mode
                    </div>
                </div>
            </div>

            {/* Blog Content */}
            <article className="border border-gray-200 shadow-lg card bg-base-100">
                {/* Thumbnail */}
                {thumbnail && (
                    <figure className="w-full h-96">
                        <img
                            src={thumbnail}
                            alt={title}
                            className="object-cover w-full h-full"
                        />
                    </figure>
                )}

                <div className="p-8 card-body">
                    {/* Category */}
                    {category && (
                        <div className="mb-4">
                            <span className="badge badge-primary">
                                {category}
                            </span>
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="mb-4 text-4xl font-bold text-gray-900 break-words">
                        {title || "Untitled Blog Post"}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 pb-6 mb-6 text-sm text-gray-600 border-b">
                        <div className="flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            {new Date().toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="ql-snow ql-container !border-none !p-0">
                        <div
                            className="ql-editor !p-0 blog-content-display"
                            dangerouslySetInnerHTML={{
                                __html: renderedContent,
                            }}
                        />
                    </div>

                    {/* Tags */}
                    {parsedTags.length > 0 && (
                        <div className="pt-6 mt-6 border-t">
                            <div className="flex flex-wrap gap-2">
                                {parsedTags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="badge badge-outline"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </article>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
                <button
                    className="px-6 bg-gray-200 border border-gray-500 btn hover:bg-gray-300"
                    onClick={() => handleSubmit("draft")}
                    disabled={processing}
                >
                    {submittingAs === "draft" ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        "Save as Draft"
                    )}
                </button>
                <button
                    className="px-6 text-white bg-blue-900 btn hover:bg-blue-800"
                    onClick={() => handleSubmit("published")}
                    disabled={processing}
                >
                    {submittingAs === "published" ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : is_editing ? (
                        "Update & Publish"
                    ) : (
                        "Publish Now"
                    )}
                </button>
            </div>
        </div>
    );
}

BlogPreview.layout = (page) => <GuestLayout>{page}</GuestLayout>;
