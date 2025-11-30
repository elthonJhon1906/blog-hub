import GuestLayout from "@/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";

export default function StaticPage({ page }) {
    return (
        <>
            <Head title={page.title} />

            <div className="bg-base-100">
                <div className="container px-4 py-12">
                    {/* Page Header */}
                    <header className="mb-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {page.title}
                        </h1>
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
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
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <span>
                                    {new Date(
                                        page.created_at
                                    ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                            {page.updated_at !== page.created_at && (
                                <>
                                    <span>•</span>
                                    <div className="flex items-center gap-1">
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
                                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                            />
                                        </svg>
                                        <span>
                                            Updated{" "}
                                            {new Date(
                                                page.updated_at
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </header>

                    {/* Divider */}
                    <div className="divider"></div>

                    {/* Page Content */}
                    <article className="prose prose-lg max-w-none">
                        <div
                            className="page-content"
                            dangerouslySetInnerHTML={{ __html: page.content }}
                        />
                    </article>
                </div>
            </div>

            {/* Custom CSS for Page Content */}
            <style jsx>{`
                .page-content {
                    line-height: 1;
                }
                .page-content h1,
                .page-content h2,
                .page-content h3,
                .page-content h4,
                .page-content h5,
                .page-content h6 {
                    font-weight: bold;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                }
                .page-content h1 {
                    font-size: 2.5rem;
                }
                .page-content h2 {
                    font-size: 2rem;
                }
                .page-content h3 {
                    font-size: 1.75rem;
                }
                .page-content p {
                    margin-bottom: 1rem;
                }
                .page-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 0.5rem;
                    margin: 1.5rem auto;
                    display: block;
                }
                .page-content ul,
                .page-content ol {
                    margin: 1rem 0;
                    padding-left: 2rem;
                }
                .page-content li {
                    margin: 0.5rem 0;
                }
                .page-content a {
                    color: #3b82f6;
                    text-decoration: underline;
                }
                .page-content a:hover {
                    color: #2563eb;
                }
                .page-content blockquote {
                    border-left: 4px solid #e5e7eb;
                    padding-left: 1rem;
                    margin: 1.5rem 0;
                    font-style: italic;
                    color: #6b7280;
                }
                .page-content pre {
                    background-color: #f3f4f6;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    overflow-x: auto;
                }
                .page-content code {
                    background-color: #f3f4f6;
                    padding: 0.2rem 0.4rem;
                    border-radius: 0.25rem;
                    font-size: 0.875rem;
                }
                .page-content table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1.5rem 0;
                }
                .page-content table th,
                .page-content table td {
                    border: 1px solid #e5e7eb;
                    padding: 0.75rem;
                    text-align: left;
                }
                .page-content table th {
                    background-color: #f9fafb;
                    font-weight: bold;
                }
                .page-content iframe {
                    max-width: 100%;
                    margin: 1.5rem auto;
                    display: block;
                }
            `}</style>
        </>
    );
}

StaticPage.layout = (page) => <GuestLayout children={page} />;
