import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import TextEditor from "@/Components/TextEditor";

export default function BlogForm({
    initialData = {},
    isEditing = false,
    categories = [],
}) {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        thumbnail: null,
        category_id: "",
        tags: [],
        status: "published",
    });

    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [titleLength, setTitleLength] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize form data - hanya sekali saat mount
    useEffect(() => {
        if (isInitialized) return;

        // Priority: sessionStorage > initialData > default empty
        const preservedData = sessionStorage.getItem("preserved_draft");

        let dataToLoad = null;

        if (preservedData) {
            try {
                dataToLoad = JSON.parse(preservedData);
                // Clear immediately setelah dibaca
                sessionStorage.removeItem("preserved_draft");
            } catch (error) {
                console.error("Failed to parse preserved data:", error);
            }
        }

        // Jika tidak ada preserved data dan ada initialData (untuk Edit)
        if (!dataToLoad && Object.keys(initialData).length > 0) {
            dataToLoad = initialData;
        }

        // Set form data
        if (dataToLoad) {
            setFormData((prev) => ({
                ...prev,
                title: dataToLoad.title || "",
                content: dataToLoad.content || "",
                category_id: dataToLoad.category_id || "",
                tags: dataToLoad.tags || [],
                status: dataToLoad.status || "published",
            }));

            setTags(dataToLoad.tags || []);
            setTitleLength(dataToLoad.title?.length || 0);

            if (dataToLoad.thumbnail) {
                setImagePreview(dataToLoad.thumbnail);
            }
        }

        setIsInitialized(true);
    }, []); // Empty dependency - hanya run sekali

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert("File size must be less than 2MB");
            return;
        }

        setFormData((prev) => ({ ...prev, thumbnail: file }));

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleTitleChange = (e) => {
        const value = e.target.value;
        if (value.length <= 100) {
            setFormData((prev) => ({ ...prev, title: value }));
            setTitleLength(value.length);
        }
    };

    const addTag = () => {
        let cleaned = tagInput.trim().replace(/#/g, "");

        if (!cleaned) {
            alert("Tag cannot be empty");
            return;
        }

        if (cleaned.length > 50) {
            alert("Tag must be less than 50 characters");
            return;
        }

        if (tags.some((tag) => tag.toLowerCase() === cleaned.toLowerCase())) {
            alert("This tag already exists");
            return;
        }

        const updated = [...tags, cleaned];
        setTags(updated);
        setFormData((prev) => ({ ...prev, tags: updated }));
        setTagInput("");
    };

    const removeTag = (tagToRemove) => {
        const updated = tags.filter((tag) => tag !== tagToRemove);
        setTags(updated);
        setFormData((prev) => ({ ...prev, tags: updated }));
    };

    const handleKeyDown = (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        addTag();
    };

    const handlePreview = () => {
        if (
            !formData.title ||
            !formData.content ||
            !formData.category_id ||
            !imagePreview
        ) {
            alert(
                "Please fill in all required fields (Title, Thumbnail, Category, and Content)"
            );
            return;
        }

        let categoryName = "";
        categories?.forEach((parent) => {
            const found = parent.children?.find(
                (child) => child.id === Number(formData.category_id)
            );
            if (found) categoryName = found.name;
        });

        // Save to sessionStorage untuk back navigation
        const dataToSave = {
            title: formData.title,
            content: formData.content,
            thumbnail: imagePreview,
            category_id: formData.category_id,
            tags: tags,
            status: formData.status,
        };
        sessionStorage.setItem("preserved_draft", JSON.stringify(dataToSave));

        router.visit(route("blog.preview"), {
            method: "post",
            data: {
                title: formData.title,
                content: formData.content,
                thumbnail: imagePreview,
                category: categoryName,
                category_id: formData.category_id,
                tags: JSON.stringify(tags),
                status: formData.status,
                blog_id: initialData.blog_id || initialData.id,
                is_editing: isEditing,
            },
            preserveState: false,
            replace: false,
        });
    };

    const isFormValid = () => {
        return (
            formData.title.trim() !== "" &&
            formData.content.trim() !== "" &&
            formData.category_id !== "" &&
            imagePreview !== null
        );
    };

    return (
        <div className="space-y-6">
            {/* Title */}
            <div className="border border-gray-200 shadow-sm card bg-base-100">
                <div className="card-body">
                    <label className="form-control">
                        <div className="label">
                            <span className="text-base font-semibold label-text">
                                Title <span className="text-error">*</span>
                            </span>
                            <span
                                className={`label-text-alt ${
                                    titleLength >= 100
                                        ? "text-error font-semibold"
                                        : "text-gray-500"
                                }`}
                            >
                                {titleLength}/100
                            </span>
                        </div>
                        <input
                            type="text"
                            className="w-full text-lg input input-bordered"
                            placeholder="Enter an eye-catching title..."
                            value={formData.title}
                            onChange={handleTitleChange}
                            maxLength={100}
                            required
                        />
                    </label>
                </div>
            </div>

            {/* Thumbnail & Category & Tags */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Thumbnail */}
                <div className="border border-gray-200 shadow-sm card bg-base-100">
                    <div className="card-body">
                        <div className="label">
                            <span className="text-base font-semibold label-text">
                                Thumbnail Image{" "}
                                <span className="text-error">*</span>
                            </span>
                        </div>

                        <div className="flex flex-col gap-4">
                            {imagePreview ? (
                                <div className="relative w-full h-64 overflow-hidden bg-gray-100 rounded-lg">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="object-cover w-full h-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview(null);
                                            setFormData((prev) => ({
                                                ...prev,
                                                thumbnail: null,
                                            }));
                                        }}
                                        className="absolute top-2 right-2 btn btn-sm btn-circle btn-error"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-64 transition-colors border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
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
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Category */}
                    <div className="border border-gray-200 shadow-sm card bg-base-100">
                        <div className="card-body">
                            <label className="form-control">
                                <div className="label">
                                    <span className="text-base font-semibold label-text">
                                        Category{" "}
                                        <span className="text-error">*</span>
                                    </span>
                                </div>
                                <select
                                    className="w-full select select-bordered"
                                    value={formData.category_id}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            category_id: e.target.value,
                                        }))
                                    }
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories?.map((parent) => {
                                        const children = parent.children ?? [];

                                        if (children.length === 0) {
                                            return (
                                                <option
                                                    key={parent.id}
                                                    value={parent.id}
                                                >
                                                    {parent.name}
                                                </option>
                                            );
                                        }

                                        return (
                                            <optgroup
                                                key={parent.id}
                                                label={parent.name}
                                            >
                                                {children.map((child) => (
                                                    <option
                                                        key={child.id}
                                                        value={child.id}
                                                    >
                                                        {child.name}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        );
                                    })}
                                </select>
                            </label>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="border border-gray-200 shadow-sm card bg-base-100">
                        <div className="card-body">
                            <div className="label">
                                <span className="text-base font-semibold label-text">
                                    Tags
                                </span>
                                <span className="text-gray-500 label-text-alt">
                                    Press Enter to add
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 input input-bordered"
                                    placeholder="Add tags (e.g., technology, tutorial)"
                                    value={tagInput}
                                    onChange={(e) =>
                                        setTagInput(e.target.value)
                                    }
                                    onKeyDown={handleKeyDown}
                                    maxLength={50}
                                />
                                <button
                                    type="button"
                                    className="px-3 text-white bg-blue-900 btn hover:bg-blue-800"
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
                                            className="gap-2 p-3 badge badge-primary"
                                        >
                                            #{tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="hover:text-error"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="label">
                                <span className="text-gray-500 label-text-alt">
                                    {tags.length} tag
                                    {tags.length !== 1 ? "s" : ""} added
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="border border-gray-200 shadow-sm card bg-base-100">
                <div className="card-body">
                    <div className="label">
                        <span className="text-base font-semibold label-text">
                            Content <span className="text-error">*</span>
                        </span>
                    </div>
                    <TextEditor
                        value={formData.content}
                        onChange={(v) =>
                            setFormData((prev) => ({ ...prev, content: v }))
                        }
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    className={`btn px-6 ${
                        isFormValid()
                            ? "bg-blue-900 text-white hover:bg-blue-800"
                            : "btn-disabled bg-gray-300 text-gray-500"
                    }`}
                    onClick={handlePreview}
                    disabled={!isFormValid()}
                >
                    {isEditing ? "Preview & Update" : "Preview & Publish"}
                </button>
            </div>
        </div>
    );
}
