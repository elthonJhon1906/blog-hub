<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index(Request $request) {
        $query = Blog::with(['tags', 'category', 'user'])
            ->where('status', 'published');

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($request->filled('category')) {
            $query->whereHas('category', function($q) use ($request) {
                $q->where('name', $request->category);
            });
        }

        // Tag filter
        if ($request->filled('tag')) {
            $query->whereHas('tags', function($q) use ($request) {
                $q->where('name', $request->tag);
            });
        }

        // Sorting
        $sortBy = $request->get('sort', 'latest');
        switch ($sortBy) {
            case 'popular':
                $query->orderByDesc('views')->orderByDesc('likes');
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

        $categories = Category::with('children')->whereNull('parent_id')->get();
        $tags = Tag::orderBy('name')->get();

        return Inertia::render('Blog/Index', [
            'blogs' => $blogs,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'tag' => $request->tag,
                'sort' => $sortBy,
            ],
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    public function create(){
        $categories = Category::with('children')->whereNull('parent_id')->get();
        
        return Inertia::render('Blog/Create', [
            'categories' => $categories,
            'preservedData' => request('preservedData'),
        ]);
    }

    public function edit($id){
        $blog = Blog::with('tags', 'category')->findOrFail($id);
        
        // Check if user is authorized to edit
        if ($blog->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $categories = Category::with('children')->whereNull('parent_id')->get();

        return Inertia::render('Blog/Edit', [
            'blog' => $blog,
            'categories' => $categories,
            'preservedData' => request('preservedData'),
        ]);
    }

    public function show($id){
        $blog = Blog::with('tags', 'category', 'user')->findOrFail($id);

        return Inertia::render('Blog/Show', [
            'blog' => $blog,
        ]);
    }

    public function store(Request $request)
    {
        $payload = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
            'status' => ['required', 'in:draft,published'],
            'thumbnail' => ['nullable'],
            'tags' => ['array'],
            'tags.*' => ['string', 'max:50'],
        ]);

        $blog = new Blog([
            'title' => $payload['title'],
            'content' => $payload['content'],
            'status' => $payload['status'],
            'category_id' => $payload['category_id'],
            'views' => 0,
            'likes' => 0,
        ]);

        $blog->user_id = Auth::id();

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('blogs', 'public');
            $blog->thumbnail_url = Storage::url($path);
        } elseif (!empty($payload['thumbnail'])) {
            $blog->thumbnail_url = $this->storeBase64Image($payload['thumbnail']);
        }

        $blog->save();

        if (!empty($payload['tags'])) {
            $tagIds = collect($payload['tags'])
                ->map(fn ($tag) => Tag::firstOrCreate(['name' => trim($tag)])->id)
                ->all();

            $blog->tags()->sync($tagIds);
        }

        return redirect()
            ->route('blog.create')
            ->with('success', $payload['status'] === 'draft'
                ? 'Blog saved as draft.'
                : 'Blog published successfully.');
    }

    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);

        // Check if user is authorized to update
        if ($blog->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $payload = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
            'status' => ['required', 'in:draft,published'],
            'thumbnail' => ['nullable'],
            'tags' => ['array'],
            'tags.*' => ['string', 'max:50'],
        ]);

        // Update blog fields
        $blog->title = $payload['title'];
        $blog->content = $payload['content'];
        $blog->status = $payload['status'];
        $blog->category_id = $payload['category_id'];

        // Handle thumbnail update
        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail if exists
            if ($blog->thumbnail_url) {
                $oldPath = str_replace('/storage/', '', $blog->thumbnail_url);
                Storage::disk('public')->delete($oldPath);
            }

            // Store new thumbnail
            $path = $request->file('thumbnail')->store('blogs', 'public');
            $blog->thumbnail_url = Storage::url($path);
        } elseif (!empty($payload['thumbnail']) && strpos($payload['thumbnail'], 'data:image') === 0) {
            // Delete old thumbnail if exists
            if ($blog->thumbnail_url) {
                $oldPath = str_replace('/storage/', '', $blog->thumbnail_url);
                Storage::disk('public')->delete($oldPath);
            }

            // Store new base64 image
            $blog->thumbnail_url = $this->storeBase64Image($payload['thumbnail']);
        }
        // If thumbnail is null or empty string, remove existing thumbnail
        elseif (array_key_exists('thumbnail', $payload) && empty($payload['thumbnail'])) {
            if ($blog->thumbnail_url) {
                $oldPath = str_replace('/storage/', '', $blog->thumbnail_url);
                Storage::disk('public')->delete($oldPath);
                $blog->thumbnail_url = null;
            }
        }

        $blog->save();

        // Update tags
        if (isset($payload['tags'])) {
            $tagIds = collect($payload['tags'])
                ->map(fn ($tag) => Tag::firstOrCreate(['name' => trim($tag)])->id)
                ->all();

            $blog->tags()->sync($tagIds);
        } else {
            $blog->tags()->sync([]);
        }

        return redirect()
            ->route('blog.show', $blog->id)
            ->with('success', $payload['status'] === 'draft'
                ? 'Blog updated and saved as draft.'
                : 'Blog updated successfully.');
    }

    private function storeBase64Image(string $dataUrl): string
    {
        if (!preg_match('/^data:image\/(\w+);base64,/', $dataUrl, $matches)) {
            throw ValidationException::withMessages([
                'thumbnail' => 'Invalid thumbnail data.',
            ]);
        }

        $extension = strtolower($matches[1]);

        if (!in_array($extension, ['jpg', 'jpeg', 'png', 'webp'])) {
            throw ValidationException::withMessages([
                'thumbnail' => 'Unsupported thumbnail format.',
            ]);
        }

        $data = substr($dataUrl, strpos($dataUrl, ',') + 1);
        $binary = base64_decode($data, true);

        if ($binary === false) {
            throw ValidationException::withMessages([
                'thumbnail' => 'Failed to decode thumbnail.',
            ]);
        }

        $filename = 'blogs/' . Str::uuid() . '.' . $extension;
        Storage::disk('public')->put($filename, $binary);

        return Storage::url($filename);
    }

    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);

        // Check if user is authorized to delete
        if ($blog->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        // Soft delete
        $blog->delete();

        return redirect()
            ->route('home')
            ->with('success', 'Blog deleted successfully.');
    }
}
