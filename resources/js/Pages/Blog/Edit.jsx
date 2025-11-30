import { usePage } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import BlogForm from "@/Components/BlogForm";

export default function BlogEdit() {
    const { blog, categories } = usePage().props;

    // Prepare initial data from blog
    const initialData = {
        title: blog.title || "",
        content: blog.content || "",
        thumbnail: blog.thumbnail_url || null,
        category_id: blog.category_id || "",
        tags: blog.tags?.map((tag) => tag.name) || [],
        status: blog.status || "published",
        id: blog.id,
    };

    return (
        <div className="">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Edit Blog Post
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                    Update your blog post
                </p>
            </div>

            <BlogForm
                initialData={initialData}
                isEditing={true}
                categories={categories}
            />
        </div>
    );
}

BlogEdit.layout = (page) => <GuestLayout>{page}</GuestLayout>;
