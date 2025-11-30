<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class UserController extends Controller
{
    public function show($username, Request $request)
    {
        $user = User::where('username', $username)->firstOrFail();
        
        // Check if viewing own profile
        $isOwner = Auth::check() && Auth::id() === $user->id;
        
        // Get active tab
        $activeTab = $request->get('tab', 'overview');

        // Stats
        $stats = [
            'total_posts' => $user->blogs()->where('status', 'published')->count(),
            'total_drafts' => $isOwner ? $user->blogs()->where('status', 'draft')->count() : 0,
            'total_views' => $user->blogs()->sum('views'),
            'total_likes' => $user->blogs()->withCount('likedByUsers')->get()->sum('liked_by_users_count'),
            'total_comments' => $user->blogs()->withCount('comments')->get()->sum('comments_count'),
        ];

        // My Blogs (if owner or if tab is blogs)
        $blogs = null;
        if ($activeTab === 'blogs' || $isOwner) {
            $blogsQuery = $user->blogs()
                ->with(['user','category', 'tags'])
                ->withCount(['likedByUsers as likes_count', 'comments']);
            
            // Filter by status (only for owner)
            $filter = $request->get('filter', 'all');
            if ($isOwner) {
                if ($filter === 'published') {
                    $blogsQuery->where('status', 'published');
                } elseif ($filter === 'draft') {
                    $blogsQuery->where('status', 'draft');
                }
                // 'all' shows both published and draft
            } else {
                // Non-owner can only see published
                $blogsQuery->where('status', 'published');
            }
            
            // Sort by
            $sort = $request->get('sort', 'latest');
            if ($sort === 'popular') {
                $blogsQuery->orderByDesc('views');
            } else { // latest
                $blogsQuery->orderByDesc('created_at');
            }
            
            $blogs = $blogsQuery->paginate(9)->withQueryString();
        }

        // Bookmarks (only for owner)
        $bookmarks = null;
        if ($activeTab === 'bookmarks' && $isOwner) {
            $sort = $request->get('sort', 'latest');
            
            $bookmarksQuery = $user->bookmarkedBlogs()
                ->with(['user', 'category', 'tags'])
                ->withCount(['likedByUsers as likes_count', 'comments']);
            
            if ($sort === 'popular') {
                $bookmarksQuery->orderByDesc('views');
            } else { // latest
                $bookmarksQuery->orderByDesc('bookmarks.created_at');
            }
            
            $bookmarks = $bookmarksQuery->paginate(9)->withQueryString();
        }

        // Activity (only for owner)
        $activity = null;
        if ($activeTab === 'activity' && $isOwner) {
            $subTab = $request->get('sub', 'comments');
            
            if ($subTab === 'comments') {
                $activity = $user->comments()
                    ->with(['blog:id,title,user_id', 'blog.user:id,name'])
                    ->orderByDesc('created_at')
                    ->paginate(20)
                    ->withQueryString();
            } else { // likes
                $activity = $user->likedBlogs()
                    ->with(['user', 'category', 'tags'])
                    ->withCount(['likedByUsers as likes_count', 'comments'])
                    ->orderByDesc('blog_likes.created_at')
                    ->paginate(9)
                    ->withQueryString();
            }
        }

        // Analytics (only for owner with blogs)
        $analytics = null;
        if ($activeTab === 'analytics' && $isOwner && $stats['total_posts'] > 0) {
            $dateRange = $request->get('range', '30');
            $days = (int) $dateRange;
            
            // Views trend based on date range
            $viewsTrend = $user->blogs()
                ->where('created_at', '>=', Carbon::now()->subDays($days))
                ->selectRaw('DATE(created_at) as date, SUM(views) as views, COUNT(*) as posts')
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->map(function($item) {
                    return [
                        'date' => $item->date,
                        'views' => (int) $item->views,
                        'posts' => (int) $item->posts,
                    ];
                });

            // Fill missing dates with 0
            $filledData = [];
            for ($i = $days - 1; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i)->format('Y-m-d');
                $existing = $viewsTrend->firstWhere('date', $date);
                $filledData[] = [
                    'date' => $date,
                    'views' => $existing ? $existing['views'] : 0,
                    'posts' => $existing ? $existing['posts'] : 0,
                ];
            }

            // Engagement metrics
            $totalViews = $user->blogs()->sum('views');
            $totalLikes = $user->blogs()->withCount('likedByUsers')->get()->sum('liked_by_users_count');
            $totalComments = $user->blogs()->withCount('comments')->get()->sum('comments_count');
            $totalPosts = $stats['total_posts'];

            $engagement = [
                'avg_views' => $totalPosts > 0 ? round($totalViews / $totalPosts, 1) : 0,
                'like_rate' => $totalViews > 0 ? round(($totalLikes / $totalViews) * 100, 1) : 0,
                'comment_rate' => $totalViews > 0 ? round(($totalComments / $totalViews) * 100, 1) : 0,
            ];

            // Category performance
            $categoryStats = $user->blogs()
                ->where('status', 'published')
                ->join('categories', 'blogs.category_id', '=', 'categories.id')
                ->select(
                    'categories.name',
                    DB::raw('COUNT(blogs.id) as posts'),
                    DB::raw('SUM(blogs.views) as total_views')
                )
                ->groupBy('categories.id', 'categories.name')
                ->orderByDesc('total_views')
                ->take(5)
                ->get()
                ->map(function($item) {
                    return [
                        'name' => $item->name,
                        'posts' => (int) $item->posts,
                        'views' => (int) $item->total_views,
                        'avg_views' => $item->posts > 0 ? round($item->total_views / $item->posts, 1) : 0,
                    ];
                });

            $analytics = [
                'views_trend' => $filledData,
                'engagement' => $engagement,
                'category_stats' => $categoryStats,
            ];
        }

        return Inertia::render('Profile/Dashboard', [
            'profileUser' => $user,
            'isOwner' => $isOwner,
            'activeTab' => $activeTab,
            'stats' => $stats,
            'blogs' => $blogs,
            'bookmarks' => $bookmarks,
            'activity' => $activity,
            'analytics' => $analytics,
            'filters' => [
                'filter' => $request->get('filter', 'all'),
                'sort' => $request->get('sort', 'latest'),
                'sub' => $request->get('sub', 'comments'),
                'range' => $request->get('range', '30'),
            ],
        ]);
    }
}
