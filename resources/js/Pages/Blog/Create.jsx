import { usePage } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import BlogForm from "@/Components/BlogForm";

export default function BlogCreate() {
    const { categories } = usePage().props;

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

            <BlogForm isEditing={false} categories={categories} />
        </div>
    );
}

BlogCreate.layout = (page) => <GuestLayout>{page}</GuestLayout>;
