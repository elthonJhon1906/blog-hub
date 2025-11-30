<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class AdminCategoryController extends Controller
{
    public function index(Request $request)
    {
        // Get main categories (parent_id = null) with their children
        $categories = Category::with(['children' => function($query) {
            $query->withCount('blogs');
        }])
            ->whereNull('parent_id')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhereHas('children', function($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            })
            ->withCount('blogs')
            ->latest()
            ->get();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Validate that parent category doesn't have a parent (no sub-sub categories)
        if ($request->parent_id) {
            $parent = Category::find($request->parent_id);
            if ($parent && $parent->parent_id) {
                return back()->with('error', 'Cannot create sub-category of a sub-category.');
            }
        }

        Category::create($validator->validated());

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function update(Request $request, Category $category)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Validate that parent category doesn't have a parent (no sub-sub categories)
        if ($request->parent_id) {
            $parent = Category::find($request->parent_id);
            if ($parent && $parent->parent_id) {
                return back()->with('error', 'Cannot move to sub-category of a sub-category.');
            }
            
            // Prevent making category its own parent
            if ($request->parent_id == $category->id) {
                return back()->with('error', 'Category cannot be its own parent.');
            }
        }

        $category->update($validator->validated());

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        // Check if category has blogs
        if ($category->blogs()->count() > 0) {
            return back()->with('error', 'Cannot delete category with existing blogs.');
        }

        // Check if category has children
        if ($category->children()->count() > 0) {
            return back()->with('error', 'Cannot delete category with sub-categories.');
        }

        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}