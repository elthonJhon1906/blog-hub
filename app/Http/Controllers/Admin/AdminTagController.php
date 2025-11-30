<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class AdminTagController extends Controller
{
    public function index(Request $request)
    {
        $tags = Tag::when($request->search, function ($query, $search) {
                // Remove # from search query
                $cleanSearch = trim(str_replace('#', '', $search));
                $query->where('name', 'like', "%{$cleanSearch}%");
            })
            ->withCount('blogs')
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Tags/Index', [
            'tags' => $tags,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        // Clean tag name - remove all # symbols and trim
        $cleanName = trim(str_replace('#', '', $request->name));

        $validator = Validator::make(['name' => $cleanName], [
            'name' => 'required|string|max:50|unique:tags,name',
        ], [
            'name.required' => 'Tag name is required.',
            'name.unique' => 'This tag already exists.',
            'name.max' => 'Tag name cannot exceed 50 characters.',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Check if tag name is empty after cleaning
        if (empty($cleanName)) {
            return back()->with('error', 'Tag name cannot be empty or contain only # symbols.');
        }

        Tag::create(['name' => $cleanName]);

        return redirect()->route('admin.tags.index')
            ->with('success', 'Tag created successfully.');
    }

    public function update(Request $request, Tag $tag)
    {
        // Clean tag name - remove all # symbols and trim
        $cleanName = trim(str_replace('#', '', $request->name));

        $validator = Validator::make(['name' => $cleanName], [
            'name' => 'required|string|max:50|unique:tags,name,' . $tag->id,
        ], [
            'name.required' => 'Tag name is required.',
            'name.unique' => 'This tag already exists.',
            'name.max' => 'Tag name cannot exceed 50 characters.',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Check if tag name is empty after cleaning
        if (empty($cleanName)) {
            return back()->with('error', 'Tag name cannot be empty or contain only # symbols.');
        }

        $tag->update(['name' => $cleanName]);

        return redirect()->route('admin.tags.index')
            ->with('success', 'Tag updated successfully.');
    }

    public function destroy(Tag $tag)
    {
        // Check if tag has blogs
        if ($tag->blogs()->count() > 0) {
            return back()->with('error', 'Cannot delete tag with existing blogs.');
        }

        $tag->delete();

        return redirect()->route('admin.tags.index')
            ->with('success', 'Tag deleted successfully.');
    }
}