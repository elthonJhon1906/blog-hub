import { useState, useEffect } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import TextEditor from "@/Components/TextEditor";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";

export default function BlogCreate() {
    const { categories, preservedData } = usePage().props;
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        title: "",
        content: "",
        thumbnail: null,
        category_id: "",
        tags: [],
        status: "published",
    });

    useEffect(() => {
        if (!preservedData) return;

        try {
            const parsed =
                typeof preservedData === "string"
                    ? JSON.parse(preservedData)
                    : preservedData;

            setData((prev) => ({
                ...prev,
                title: parsed.title || "",
                content: parsed.content || "",
                category_id: parsed.category_id || "",
                tags: parsed.tags || [],
                status: parsed.status || "published",
            }));

            setTags(parsed.tags || []);

            if (parsed.thumbnail) {
                setImagePreview(parsed.thumbnail);
            }
        } catch (error) {
            console.error("Failed to restore draft:", error);
        }
    }, [preservedData, setData]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setData("thumbnail", file);

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const addTag = () => {
        const cleaned = tagInput.trim();
        if (!cleaned || tags.includes(cleaned)) return;

        const updated = [...tags, cleaned];
        setTags(updated);
        setData("tags", updated);
        setTagInput("");
    };

    const removeTag = (tagToRemove) => {
        const updated = tags.filter((tag) => tag !== tagToRemove);
        setTags(updated);
        setData("tags", updated);
    };

    const handleKeyDown = (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        addTag();
    };

    const submit = (e) => {
        e.preventDefault();
        post("/blogs");
    };

    const handlePreview = () => {
        let categoryName = "";
        categories?.forEach((parent) => {
            const found = parent.children?.find(
                (child) => child.id === Number(data.category_id)
            );
            if (found) categoryName = found.name;
        });

        router.visit(route("blog.preview"), {
            method: "post",
            data: {
                title: data.title,
                content: data.content,
                thumbnail: imagePreview,
                category: categoryName,
                category_id: data.category_id,
                tags: JSON.stringify(tags),
                status: data.status,
            },
            preserveState: true,
        });
    };

    return (
        <div className="">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Create New Blog Post
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    Share your thoughts and ideas with the world
                </p>
            </div>

            <form onSubmit={submit} className="space-y-6">
                {/* Title */}
                <div className="card bg-base-100 shadow-sm border border-gray-200">
                    <div className="card-body">
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text font-semibold text-base">
                                    Title
                                </span>
                            </div>
                            <input
                                type="text"
                                className="input input-bordered w-full text-lg"
                                placeholder="Enter an eye-catching title..."
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.title}
                                className="mt-2"
                            />
                        </label>
                    </div>
                </div>

                {/* Thumbnail */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="card bg-base-100 shadow-sm border border-gray-200">
                        <div className="card-body">
                            <div className="label">
                                <span className="label-text font-semibold text-base">
                                    Thumbnail Image
                                </span>
                            </div>

                            <div className="flex flex-col gap-4">
                                {imagePreview ? (
                                    <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview(null);
                                                setData("thumbnail", null);
                                            }}
                                            className="absolute top-2 right-2 btn btn-sm btn-circle btn-error"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg
                                                className="w-10 h-10 mb-3 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                />
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">
                                                    Click to upload
                                                </span>{" "}
                                                or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG or WEBP (MAX. 2MB)
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                )}
                            </div>
                            <InputError
                                message={errors.thumbnail}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* Category */}
                        <div className="card bg-base-100 shadow-sm border border-gray-200">
                            <div className="card-body">
                                <label className="form-control">
                                    <div className="label">
                                        <span className="label-text font-semibold text-base">
                                            Category
                                        </span>
                                    </div>
                                    <select
                                        className="select select-bordered w-full"
                                        value={data.category_id}
                                        onChange={(e) =>
                                            setData(
                                                "category_id",
                                                e.target.value
                                            )
                                        }
                                        required
                                    >
                                        <option value="">
                                            Select a category
                                        </option>
                                        {categories?.map((parent) => (
                                            <optgroup
                                                key={parent.id}
                                                label={parent.name}
                                            >
                                                {parent.children?.map(
                                                    (child) => (
                                                        <option
                                                            key={child.id}
                                                            value={child.id}
                                                        >
                                                            {child.name}
                                                        </option>
                                                    )
                                                )}
                                            </optgroup>
                                        ))}
                                    </select>
                                    <InputError
                                        message={errors.category_id}
                                        className="mt-2"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="card bg-base-100 shadow-sm border border-gray-200">
                            <div className="card-body">
                                <div className="label">
                                    <span className="label-text font-semibold text-base">
                                        Tags
                                    </span>
                                    <span className="label-text-alt text-gray-500">
                                        Press Enter to add
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="input input-bordered flex-1"
                                        placeholder="Add tags (e.g., technology, tutorial)"
                                        value={tagInput}
                                        onChange={(e) =>
                                            setTagInput(e.target.value)
                                        }
                                        onKeyDown={handleKeyDown}
                                    />
                                    <button
                                        type="button"
                                        className="btn bg-blue-900 text-white hover:bg-blue-800 px-3"
                                        onClick={addTag}
                                    >
                                        Add
                                    </button>
                                </div>

                                {tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {tags.map((tag, index) => (
                                            <div
                                                key={index}
                                                className="badge badge-primary gap-2 p-3"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeTag(tag)
                                                    }
                                                    className="hover:text-error"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status */}
                        {/* <div className="card bg-base-100 shadow-sm border border-gray-200">
                            <div className="card-body">
                                <label className="form-control">
                                    <div className="label">
                                        <span className="label-text font-semibold text-base">
                                            Status
                                        </span>
                                    </div>
                                    <select
                                        className="select select-bordered w-full"
                                        value={data.status}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                    >
                                        <option value="published">
                                            📤 Published
                                        </option>
                                        <option value="draft">📝 Draft</option>
                                    </select>
                                </label>
                            </div>
                        </div> */}
                    </div>
                </div>

                {/* Content */}
                <div className="card bg-base-100 shadow-sm border border-gray-200">
                    <div className="card-body">
                        <div className="label">
                            <span className="label-text font-semibold text-base">
                                Content
                            </span>
                        </div>
                        <TextEditor
                            value={data.content}
                            onChange={(v) => setData("content", v)}
                        />
                        <InputError message={errors.content} className="mt-2" />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="btn border border-gray-500 bg-gray-200 text-gray-900 hover:bg-gray-300 hover:cursor-pointer px-3"
                        onClick={handlePreview}
                    >
                        Preview
                    </button>
                    {/* <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={processing}
                    >
                        {processing ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Publishing...
                            </>
                        ) : (
                            <>Publish</>
                        )}
                    </button> */}
                </div>
            </form>
        </div>
    );
}

BlogCreate.layout = (page) => <GuestLayout>{page}</GuestLayout>;
