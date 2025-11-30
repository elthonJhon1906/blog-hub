import { Head, router } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import ProfileHeader from "./Components/ProfileHeader";
import TabNavigation from "./Components/TabNavigation";
import OverviewTab from "./Components/OverviewTab";
import BlogsTab from "./Components/BlogsTab";
import BookmarksTab from "./Components/BookmarksTab";
import ActivityTab from "./Components/ActivityTab";
import AnalyticsTab from "./Components/AnalyticsTab";
import SettingsTab from "./Components/SettingsTab";

export default function Dashboard({
    profileUser,
    isOwner,
    activeTab,
    stats,
    blogs,
    bookmarks,
    activity,
    analytics,
}) {
    const tabs = [
        {
            id: "overview",
            label: "Overview",
            icon: (
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                </svg>
            ),
        },
        {
            id: "blogs",
            label: "Blogs",
            icon: (
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
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                </svg>
            ),
        },
        ...(isOwner
            ? [
                  {
                      id: "bookmarks",
                      label: "Bookmarks",
                      icon: (
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
                                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                              />
                          </svg>
                      ),
                  },
                  {
                      id: "activity",
                      label: "Activity",
                      icon: (
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
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                          </svg>
                      ),
                  },
                  {
                      id: "analytics",
                      label: "Analytics",
                      icon: (
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
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                          </svg>
                      ),
                      show: stats.total_posts > 0,
                  },
                  {
                      id: "settings",
                      label: "Settings",
                      icon: (
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
                                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                          </svg>
                      ),
                  },
              ]
            : []),
    ].filter((tab) => tab.show !== false);

    const handleTabChange = (tabId) => {
        router.get(
            route("profile.show", profileUser.username),
            { tab: tabId },
            {
                preserveState: true,
                preserveScroll: true, // ✅ Ini yang penting!
            }
        );
    };

    return (
        <>
            <Head title={`${profileUser.name} - Profile`} />

            <ProfileHeader
                profileUser={profileUser}
                stats={stats}
                isOwner={isOwner}
            />

            <TabNavigation
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === "overview" && (
                    <OverviewTab
                        stats={stats}
                        profileUser={profileUser}
                        isOwner={isOwner}
                    />
                )}

                {activeTab === "blogs" && (
                    <BlogsTab blogs={blogs} isOwner={isOwner} />
                )}

                {activeTab === "bookmarks" && isOwner && (
                    <BookmarksTab bookmarks={bookmarks} />
                )}

                {activeTab === "activity" && isOwner && (
                    <ActivityTab activity={activity} />
                )}

                {activeTab === "analytics" && isOwner && (
                    <AnalyticsTab analytics={analytics} />
                )}

                {activeTab === "settings" && isOwner && <SettingsTab />}
            </div>
        </>
    );
}

Dashboard.layout = (page) => <GuestLayout children={page} />;
