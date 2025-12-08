<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\BlogLikeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminBlogController;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminTagController;
use App\Http\Controllers\Admin\AdminRoleController;
use App\Http\Controllers\Admin\AdminPageController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ===================================
// PUBLIC ROUTES
// ===================================

Route::get('/', [HomeController::class, 'index'])->name('home');

// Blog Routes
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');

// ===================================
// AUTHENTICATED BLOG ROUTES
// ===================================
Route::middleware('auth')->group(function () {
    // Create & Preview - HARUS DI ATAS {id}
    Route::get('/blog/create', [BlogController::class, 'create'])->name('blog.create');

    Route::match(['get', 'post'], '/blog/preview', function () {
        $request = request();

        if ($request->isMethod('post')) {
            $tags = $request->input('tags', []);
            if (is_string($tags)) {
                $decoded = json_decode($tags, true);
                $tags = is_array($decoded) ? $decoded : [];
            }

            $previewData = [
                'title' => $request->input('title'),
                'content' => $request->input('content'),
                'thumbnail' => $request->input('thumbnail'),
                'category' => $request->input('category'),
                'category_id' => $request->input('category_id'),
                'tags' => $tags,
                'status' => $request->input('status', 'published'),
                'blog_id' => $request->input('blog_id'),
                'is_editing' => $request->input('is_editing', false),
            ];

            session(['blog_preview' => $previewData]);
        } else {
            $previewData = session('blog_preview');

            if (!$previewData) {
                return redirect()->route('home')->with('error', 'Preview session expired. Please try again.');
            }
        }

        return Inertia::render('Blog/Preview', $previewData);
    })->name('blog.preview');

    // Store Blog
    Route::post('/blog', [BlogController::class, 'store'])->name('blog.store');

    // Edit Blog
    Route::get('/blog/{id}/edit', [BlogController::class, 'edit'])->name('blog.edit');
    Route::post('/blog/{id}', [BlogController::class, 'update'])->name('blog.update');
    Route::delete('/blog/{id}', [BlogController::class, 'destroy'])->name('blog.destroy');

    // Comments
    Route::post('/blog/{blog}/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::put('/blog/{blog}/comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('/blog/{blog}/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');

    // Like & Bookmark
    Route::post('/blog/{blog}/like', [BlogLikeController::class, 'toggle'])->name('blog.like.toggle');
    Route::post('/blog/{blog}/bookmark', [BookmarkController::class, 'toggle'])->name('blog.bookmark.toggle');

    // Bookmarks List
    Route::get('/bookmarks', [BookmarkController::class, 'index'])->name('bookmarks.index');
});

// Comments List (Public - bisa guest juga lihat)
Route::get('/blog/{blog}/comments', [CommentController::class, 'index'])->name('comments.index');

// Show Blog - PALING BAWAH
Route::get('/blog/{id}', [BlogController::class, 'show'])->name('blog.show');

// ===================================
// USER PROFILE
// ===================================

Route::middleware('auth')->group(function () {
    Route::get('/profile/{username}', [UserController::class, 'show'])->name('profile.show');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ===================================
// ADMIN ROUTES
// ===================================
Route::prefix('admin')
    ->middleware(['auth', 'role:admin'])
    ->name('admin.')
    ->group(function () {
        // Dashboard
        Route::get('/', [AdminController::class, 'index'])->name('dashboard');

        // Users Management
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');

        // Blogs Management
        Route::get('/blogs', [AdminBlogController::class, 'index'])->name('blogs.index');
        Route::delete('/blogs/{blog}', [AdminBlogController::class, 'destroy'])->name('blogs.destroy');
        Route::post('/blogs/{blog}/status', [AdminBlogController::class, 'updateStatus'])->name('blogs.update-status');

        // Categories Management
        Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');
        Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');
        Route::put('/categories/{category}', [AdminCategoryController::class, 'update'])->name('categories.update');
        Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy'])->name('categories.destroy');

        // Tags Management
        Route::get('/tags', [AdminTagController::class, 'index'])->name('tags.index');
        Route::post('/tags', [AdminTagController::class, 'store'])->name('tags.store');
        Route::put('/tags/{tag}', [AdminTagController::class, 'update'])->name('tags.update');
        Route::delete('/tags/{tag}', [AdminTagController::class, 'destroy'])->name('tags.destroy');

        // Pages Management
        Route::get('/pages', [AdminPageController::class, 'index'])->name('pages.index');
        Route::post('/pages', [AdminPageController::class, 'store'])->name('pages.store');
        Route::put('/pages/{page}', [AdminPageController::class, 'update'])->name('pages.update');
        Route::delete('/pages/{page}', [AdminPageController::class, 'destroy'])->name('pages.destroy');
        Route::post('/pages/upload-image', [AdminPageController::class, 'uploadImage'])->name('pages.upload-image');

        // Roles Management
        Route::get('/roles', [AdminRoleController::class, 'index'])->name('roles.index');
    });

// ===================================
// STATIC PAGES (Frontend)
// ===================================
Route::get('/page/{slug}', [PageController::class, 'show'])->name('page.show');

// ===================================
// TESTING (Remove in production!)
// ===================================
Route::get('/test', function () {
    return Inertia::render('TestingPage');
});

require __DIR__.'/auth.php';
