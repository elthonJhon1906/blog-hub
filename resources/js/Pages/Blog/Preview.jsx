import { useEffect, useMemo, useState } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import "quill/dist/quill.snow.css";

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

    const { data, setData, post, processing, errors } = useForm({
        title: title ?? "",
        content: content ?? "",
        thumbnail: thumbnail ?? null,
        category_id: category_id ?? "",
        tags: parsedTags,
        status: status ?? "published",
    });

    const [renderedContent, setRenderedContent] = useState("");

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
        const routeParams = is_editing ? [blog_id] : [];

        router.visit(route(routeName, ...routeParams), {
            method: "get",
            data: {
                preservedData: JSON.stringify({
                    title,
                    content,
                    thumbnail,
                    category_id,
                    tags: parsedTags,
                    status,
                }),
            },
        });
    };

    const handleSubmit = (targetStatus) => {
        setData("status", targetStatus);

        if (is_editing) {
            // Update existing blog
            post(route("blog.update", blog_id), {
                preserveScroll: true,
                onSuccess: () => {
                    router.visit(route("blog.show", blog_id));
                },
            });
        } else {
            // Create new blog
            post(route("blog.store"), {
                preserveScroll: true,
                onSuccess: () => {
                    router.visit(route("blog.create"));
                },
            });
        }
    };

    return (
        <div className="">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleBackToEdit}
                        className="btn btn-ghost btn-sm"
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
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Back to {is_editing ? "Edit" : "Create"}
                    </button>
                    <div className="badge badge-success text-white">
                        Preview Mode
                    </div>
                </div>
            </div>

            {/* Blog Content */}
            <article className="card bg-base-100 shadow-lg border border-gray-200">
                {/* Thumbnail */}
                {thumbnail && (
                    <figure className="w-full h-96">
                        <img
                            src={thumbnail}
                            alt={title}
                            className="w-full h-full object-cover "
                        />
                    </figure>
                )}

                <div className="card-body p-8">
                    {/* Category */}
                    {category && (
                        <div className="mb-4">
                            <span className="badge badge-primary">
                                {category}
                            </span>
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {title || "Untitled Blog Post"}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
                        <div className="flex items-center gap-2">
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
                        <div className="pt-6 border-t mt-6">
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
            <div className="flex gap-3 justify-end mt-6">
                <button
                    className="btn bg-gray-200 border border-gray-500 hover:bg-gray-300 hover:cursor-pointer px-3"
                    onClick={() => handleSubmit("draft")}
                    disabled={processing}
                >
                    {processing ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        "Draft"
                    )}
                </button>
                <button
                    className="btn bg-blue-900 text-white hover:bg-blue-800 hover:cursor-pointer px-3"
                    onClick={() => handleSubmit("published")}
                    disabled={processing}
                >
                    {processing ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : is_editing ? (
                        "Update"
                    ) : (
                        "Publish Now"
                    )}
                </button>
            </div>
        </div>
    );
}

BlogPreview.layout = (page) => <GuestLayout>{page}</GuestLayout>;
