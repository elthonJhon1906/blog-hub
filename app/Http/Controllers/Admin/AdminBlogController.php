<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminBlogController extends Controller
{
    public function index(Request $request)
    {
        $query = Blog::with(['category', 'user', 'tags'])
            ->withCount(['likedByUsers as likes_count', 'comments']);

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->has('category') && $request->category) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('name', $request->category);
            });
        }

        // Filter by tag
        if ($request->has('tag') && $request->tag) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('name', $request->tag);
            });
        }

        // Sorting
        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'popular':
                $query->orderByDesc('views')
                      ->orderByDesc('likes_count');
                break;
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'most_comments':
                $query->orderByDesc('comments_count');
                break;
            case 'latest':
            default:
                $query->orderByDesc('created_at');
                break;
        }

        $blogs = $query->paginate(12)->withQueryString();

        // Get all categories for filter
        $categories = Category::with('children')
            ->whereNull('parent_id')
            ->get();

        // Get all tags for filter
        $tags = Tag::select('tags.id', 'tags.name')
            ->join('blog_tags', 'tags.id', '=', 'blog_tags.tag_id')
            ->distinct()
            ->orderBy('tags.name')
            ->get();

        return Inertia::render('Admin/Blogs/Index', [
            'blogs' => $blogs,
            'categories' => $categories,
            'tags' => $tags,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'category' => $request->category,
                'tag' => $request->tag,
                'sort' => $sort,
            ],
        ]);
    }

    public function destroy(Blog $blog)
    {
        // Delete thumbnail
        if ($blog->thumbnail_url) {
            $path = str_replace('/storage/', '', $blog->thumbnail_url);
            Storage::disk('public')->delete($path);
        }

        // Delete pivot relationships
        $blog->tags()->detach();
        $blog->likedByUsers()->detach();
        $blog->bookmarkedByUsers()->detach();

        // Delete comments (cascade will handle this if set in migration)
        $blog->comments()->delete();

        // Delete blog
        $blog->delete();

        return redirect()->route('admin.blogs.index')
            ->with('success', 'Blog deleted successfully!');
    }

    public function updateStatus(Request $request, Blog $blog)
    {
        $validated = $request->validate([
            'status' => 'required|in:draft,published',
        ]);

        $blog->update(['status' => $validated['status']]);

        return back()->with('success', 'Blog status updated successfully!');
    }
}