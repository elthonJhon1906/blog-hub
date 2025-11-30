<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BookmarkController extends Controller
{
    /**
     * Toggle bookmark for a blog post
     */
    public function toggle($blogId)
    {
        $user = Auth::user();
        $blog = Blog::findOrFail($blogId);

        // Check if already bookmarked using pivot table
        $isBookmarked = $user->bookmarkedBlogs()->where('blog_id', $blogId)->exists();

        if ($isBookmarked) {
            // Remove bookmark - detach from pivot table
            $user->bookmarkedBlogs()->detach($blogId);
            $message = 'Bookmark removed successfully';
        } else {
            // Add bookmark - attach to pivot table
            $user->bookmarkedBlogs()->attach($blogId);
            $message = 'Blog bookmarked successfully';
        }

        return back()->with([
            'success' => $message,
        ]);
    }

    /**
     * Get all bookmarks for authenticated user
     */
    public function index()
    {
        $bookmarks = Auth::user()
            ->bookmarkedBlogs()
            ->with(['category', 'user', 'tags'])
            ->withCount(['likedByUsers as likes_count', 'comments'])
            ->latest('bookmarks.created_at')
            ->paginate(12);

        return Inertia::render('Bookmark/Index', [
            'bookmarks' => $bookmarks,
        ]);
    }
}
