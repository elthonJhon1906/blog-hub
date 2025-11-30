<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // Top blog berdasarkan views dengan likes dan comments count
        $popular = Blog::with(['user', 'category', 'tags'])
            ->withCount(['likedByUsers as likes_count', 'comments'])
            ->where('status', 'published')
            ->orderByDesc('views')
            ->take(5)
            ->get();
        
        $latest = Blog::with(['user', 'category', 'tags'])
            ->withCount(['likedByUsers as likes_count', 'comments'])
            ->where('status', 'published')
            ->orderByDesc('created_at')
            ->take(4)
            ->get();

        // Popular tags - get tags with blog count
        $popularTags = Tag::select('tags.id', 'tags.name', DB::raw('COUNT(DISTINCT blog_tags.blog_id) as count'))
            ->join('blog_tags', 'tags.id', '=', 'blog_tags.tag_id')
            ->join('blogs', 'blog_tags.blog_id', '=', 'blogs.id')
            ->where('blogs.status', 'published')
            ->groupBy('tags.id', 'tags.name')
            ->orderByDesc('count')
            ->take(8)
            ->get();

        // Top Writers dengan Weighted Score
        $topUsers = User::select(
                'users.id',
                'users.name',
                'users.username',
                'users.email',
                'users.avatar_url',
                'users.bio',
                'users.created_at'
            )
            ->selectRaw('
                (COUNT(DISTINCT blogs.id) * 10) + 
                (COUNT(DISTINCT CONCAT(blog_likes.blog_id, blog_likes.user_id)) * 2) + 
                (COUNT(DISTINCT comments.id) * 3) as score
            ')
            ->selectRaw('COUNT(DISTINCT blogs.id) as blogs_count')
            ->leftJoin('blogs', function($join) {
                $join->on('users.id', '=', 'blogs.user_id')
                     ->where('blogs.status', '=', 'published')
                     ->whereNull('blogs.deleted_at');
            })
            ->leftJoin('blog_likes', 'blogs.id', '=', 'blog_likes.blog_id')
            ->leftJoin('comments', 'blogs.id', '=', 'comments.blog_id')
            ->groupBy(
                'users.id',
                'users.name',
                'users.username',
                'users.email',
                'users.avatar_url',
                'users.bio',
                'users.created_at'
            )
            ->havingRaw('(COUNT(DISTINCT blogs.id) * 10) + 
                         (COUNT(DISTINCT CONCAT(blog_likes.blog_id, blog_likes.user_id)) * 2) + 
                         (COUNT(DISTINCT comments.id) * 3) > 0')
            ->orderByRaw('(COUNT(DISTINCT blogs.id) * 10) + 
                          (COUNT(DISTINCT CONCAT(blog_likes.blog_id, blog_likes.user_id)) * 2) + 
                          (COUNT(DISTINCT comments.id) * 3) DESC')
            ->take(5)
            ->get();

        // Trending Posts (7 hari terakhir)
        $trendingPosts = Blog::with(['user', 'category'])
            ->withCount(['likedByUsers as likes_count', 'comments as comments_count'])
            ->where('status', 'published')
            ->where('created_at', '>=', now()->subDays(7))
            ->get()
            ->map(function ($blog) {
                $blog->engagement_score = 
                    ($blog->views * 1) + 
                    ($blog->likes_count * 5) + 
                    ($blog->comments_count * 10);
                return $blog;
            })
            ->sortByDesc('engagement_score')
            ->take(5)
            ->values();

        return Inertia::render('HomePage', [
            'popularBlogs' => $popular,
            'latestBlogs' => $latest,
            'popularTags' => $popularTags,
            'topUsers' => $topUsers,
            'trendingPosts' => $trendingPosts,
        ]);
    }
}
