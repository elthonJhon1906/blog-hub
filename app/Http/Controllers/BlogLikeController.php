<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BlogLikeController extends Controller
{
    /**
     * Toggle like for a blog post
     */
    public function toggle($blogId)
    {
        $user = Auth::user();
        $blog = Blog::findOrFail($blogId);

        // Check if already liked using pivot table
        $isLiked = $user->likedBlogs()->where('blog_id', $blogId)->exists();

        if ($isLiked) {
            // Unlike - detach from pivot table
            $user->likedBlogs()->detach($blogId);
            $message = 'Blog unliked successfully';
        } else {
            // Like - attach to pivot table
            $user->likedBlogs()->attach($blogId);
            $message = 'Blog liked successfully';
        }

        // Get updated like count
        $likeCount = $blog->likedByUsers()->count();

        return back()->with([
            'success' => $message,
            'likeCount' => $likeCount,
        ]);
    }
}
