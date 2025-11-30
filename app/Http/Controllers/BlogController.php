<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $query = Blog::with(['category', 'user', 'tags'])
            ->withCount(['likedByUsers as likes_count', 'comments'])
            ->where('status', 'published');

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

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                    ->orWhere('content', 'ilike', "%{$search}%");
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

        return Inertia::render('Blog/Index', [
            'blogs' => $blogs,
            'categories' => $categories,
            'tags' => $tags,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'tag' => $request->tag,
                'sort' => $sort,
            ],
        ]);
    }

    public function create()
    {
        $categories = Category::with('children')
            ->whereNull('parent_id')
            ->get();

        return Inertia::render('Blog/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'content' => 'required|string',
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'category_id' => 'required|exists:categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'status' => 'required|in:draft,published',
        ]);

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        $blog = Blog::create([
            'user_id' => Auth::id(),
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'content' => $validated['content'],
            'thumbnail_url' => $thumbnailPath ? Storage::url($thumbnailPath) : null,
            'status' => $validated['status'],
        ]);

        if (!empty($validated['tags'])) {
            foreach ($validated['tags'] as $tagName) {
                $tag = Tag::firstOrCreate(['name' => $tagName]);
                $blog->tags()->attach($tag->id);
            }
        }

        return redirect()->route('blog.show', $blog->id)
            ->with('success', 'Blog post created successfully!');
    }

    public function show($id)
    {
        $blog = Blog::with([
            'category', 
            'user', 
            'tags', 
            'comments' => function ($query) {
                $query->whereNull('parent_id')
                    ->with([
                        'user:id,name',
                        'replies' => function ($q) {
                            $q->with('user:id,name')
                                ->orderBy('created_at', 'asc');
                        }
                    ])
                    ->orderBy('created_at', 'desc');
            }
        ])
        ->withCount(['likedByUsers as likes_count', 'comments'])
        ->findOrFail($id);

        // Increment views
        $blog->increment('views');

        // Check if current user is the owner
        $isOwner = Auth::check() && Auth::id() === $blog->user_id;

        // Check if current user has liked this blog
        $isLiked = Auth::check() 
            ? Auth::user()->likedBlogs()->where('blog_id', $id)->exists()
            : false;

        // Check if current user has bookmarked this blog
        $isBookmarked = Auth::check() 
            ? Auth::user()->bookmarkedBlogs()->where('blog_id', $id)->exists()
            : false;

        return Inertia::render('Blog/Show', [
            'blog' => $blog,
            'isOwner' => $isOwner,
            'isLiked' => $isLiked,
            'isBookmarked' => $isBookmarked,
        ]);
    }

    public function edit($id)
    {
        $blog = Blog::with(['tags'])->findOrFail($id);

        if ($blog->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $categories = Category::with('children')
            ->whereNull('parent_id')
            ->get();

        return Inertia::render('Blog/Edit', [
            'blog' => $blog,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);

        if ($blog->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'content' => 'required|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'category_id' => 'required|exists:categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'status' => 'required|in:draft,published',
        ]);

        if ($request->hasFile('thumbnail')) {
            if ($blog->thumbnail_url) {
                $oldPath = str_replace('/storage/', '', $blog->thumbnail_url);
                Storage::disk('public')->delete($oldPath);
            }
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
            $blog->thumbnail_url = Storage::url($thumbnailPath);
        }

        $blog->update([
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'content' => $validated['content'],
            'status' => $validated['status'],
        ]);

        // Update tags
        $blog->tags()->detach();
        if (!empty($validated['tags'])) {
            foreach ($validated['tags'] as $tagName) {
                $tag = Tag::firstOrCreate(['name' => $tagName]);
                $blog->tags()->attach($tag->id);
            }
        }

        return redirect()->route('blog.show', $blog->id)
            ->with('success', 'Blog post updated successfully!');
    }

    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);

        if ($blog->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

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

        return redirect()->route('home')
            ->with('success', 'Blog post deleted successfully!');
    }
}
