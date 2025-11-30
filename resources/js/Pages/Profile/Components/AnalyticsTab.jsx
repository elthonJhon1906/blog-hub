import { router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function AnalyticsTab({ analytics }) {
    const { profileUser, filters } = usePage().props;
    const currentRange = filters?.range || "30";

    const handleRangeChange = (range) => {
        router.get(
            route("profile.show", profileUser.username),
            { tab: "analytics", range },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    if (!analytics) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No analytics available
                </h3>
                <p className="text-gray-500">
                    Publish some posts to see your analytics
                </p>
            </div>
        );
    }

    // Format date for chart
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    // Custom tooltip for chart
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-md p-3">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                        {formatDate(payload[0].payload.date)}
                    </p>
                    <p className="text-sm text-blue-600">
                        Views:{" "}
                        <span className="font-bold">{payload[0].value}</span>
                    </p>
                    {payload[0].payload.posts > 0 && (
                        <p className="text-sm text-gray-500">
                            {payload[0].payload.posts} post(s) published
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Performance Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Performance Overview
                            </h2>
                            <p className="text-sm text-gray-500">
                                Views trend over time
                            </p>
                        </div>
                    </div>

                    {/* Date Range Filter */}
                    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => handleRangeChange("7")}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                                currentRange === "7"
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            7 Days
                        </button>
                        <button
                            onClick={() => handleRangeChange("30")}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                                currentRange === "30"
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            30 Days
                        </button>
                        <button
                            onClick={() => handleRangeChange("90")}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                                currentRange === "90"
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            90 Days
                        </button>
                    </div>
                </div>

                {/* Line Chart */}
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.views_trend}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#f0f0f0"
                            />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatDate}
                                stroke="#9ca3af"
                                style={{ fontSize: "12px" }}
                            />
                            <YAxis
                                stroke="#9ca3af"
                                style={{ fontSize: "12px" }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="views"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ fill: "#3b82f6", r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Engagement Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Average Views */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-600">
                            Avg Views/Post
                        </p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {analytics.engagement.avg_views.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        per published post
                    </p>
                </div>

                {/* Like Rate */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-red-600"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-600">
                            Like Rate
                        </p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {analytics.engagement.like_rate}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">likes per view</p>
                </div>

                {/* Comment Rate */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-green-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-600">
                            Comment Rate
                        </p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {analytics.engagement.comment_rate}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        comments per view
                    </p>
                </div>
            </div>

            {/* Category Performance */}
            {analytics.category_stats.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-purple-600"
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
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Performance by Category
                            </h2>
                            <p className="text-sm text-gray-500">
                                Top {analytics.category_stats.length} performing
                                categories
                            </p>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.category_stats}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#f0f0f0"
                                />
                                <XAxis
                                    dataKey="name"
                                    stroke="#9ca3af"
                                    style={{ fontSize: "12px" }}
                                />
                                <YAxis
                                    stroke="#9ca3af"
                                    style={{ fontSize: "12px" }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "white",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                    }}
                                />
                                <Bar
                                    dataKey="views"
                                    fill="#8b5cf6"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Category Stats Table */}
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                                        Category
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                        Posts
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                        Total Views
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                                        Avg Views
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.category_stats.map(
                                    (category, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition"
                                        >
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                                {category.name}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600 text-right">
                                                {category.posts}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-900 font-medium text-right">
                                                {category.views.toLocaleString()}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600 text-right">
                                                {category.avg_views.toLocaleString()}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
