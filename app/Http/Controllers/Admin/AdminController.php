<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Blog;
use App\Models\Comment;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function index()
    {
        // Stats
        $totalUsers = User::count();
        $totalBlogs = Blog::count();
        $publishedBlogs = Blog::where('status', 'published')->count();
        $draftBlogs = Blog::where('status', 'draft')->count();

        // Calculate percentage changes (compare with last month)
        $lastMonthUsers = User::where('created_at', '<', Carbon::now()->subMonth())->count();
        $userGrowth = $lastMonthUsers > 0 
            ? round((($totalUsers - $lastMonthUsers) / $lastMonthUsers) * 100, 1)
            : 0;

        $lastMonthBlogs = Blog::where('created_at', '<', Carbon::now()->subMonth())->count();
        $blogGrowth = $lastMonthBlogs > 0
            ? round((($totalBlogs - $lastMonthBlogs) / $lastMonthBlogs) * 100, 1)
            : 0;

        $stats = [
            'total_users' => $totalUsers,
            'total_blogs' => $totalBlogs,
            'total_comments' => Comment::count(),
            'total_categories' => Category::count(),
            'total_tags' => Tag::count(),
            'published_blogs' => $publishedBlogs,
            'draft_blogs' => $draftBlogs,
            'user_growth' => $userGrowth,
            'blog_growth' => $blogGrowth,
        ];

        // Recent Users (last 5)
        $recentUsers = User::with('role')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'username' => $user->username,
                    'avatar_url' => $user->avatar_url,
                    'role_name' => $user->role->name ?? 'user',
                    'created_at' => $user->created_at->format('Y-m-d'),
                ];
            });

        // Recent Blogs (last 5)
        $recentBlogs = Blog::with('user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($blog) {
                return [
                    'id' => $blog->id,
                    'title' => $blog->title,
                    'author' => $blog->user->name,
                    'author_username' => $blog->user->username,
                    'status' => $blog->status,
                    'views' => $blog->views,
                    'likes' => $blog->likes,
                    'created_at' => $blog->created_at->format('Y-m-d'),
                ];
            });

        // Top Active Users (by blog count) - Fixed for PostgreSQL
        $topUsers = User::withCount('blogs')
            ->orderBy('blogs_count', 'desc')
            ->take(5)
            ->get()
            ->filter(function ($user) {
                return $user->blogs_count > 0;
            })
            ->map(function ($user, $index) {
                // Calculate activity score based on blogs, views, and likes
                $totalViews = $user->blogs()->sum('views');
                $totalLikes = $user->blogs()->sum('likes');
                $activityScore = ($user->blogs_count * 10) + ($totalViews * 2) + ($totalLikes * 5);

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'avatar_url' => $user->avatar_url,
                    'blogs_count' => $user->blogs_count,
                    'activity_score' => $activityScore,
                ];
            })
            ->values(); // Re-index array after filter

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentUsers' => $recentUsers,
            'recentBlogs' => $recentBlogs,
            'topUsers' => $topUsers,
        ]);
    }
}