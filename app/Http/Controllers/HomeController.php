<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // top blog berdasarkan views dan likes
        $popular = Blog::with(['user', 'category', 'tags'])
            ->where('status', 'published')
            ->orderByDesc('views')
            ->orderByDesc('likes')
            ->take(5)
            ->get();
        
        $latest = Blog::with(['user', 'category', 'tags'])
            ->where('status', 'published')
            ->orderBy('created_at')
            ->take(value: 4)
            ->get();

        return Inertia::render('HomePage', [
            'popularBlogs' => $popular,
            'latestBlogs' => $latest,
        ]);
    }
}
