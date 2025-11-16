<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BlogController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');

Route::get('/blog/create', [BlogController::class, 'create'])
    ->middleware(['auth'])
    ->name('blog.create');

Route::match(['get', 'post'], '/blog/preview', function () {
    $request = request();
    $tags = $request->input('tags', []);

    if (is_string($tags)) {
        $decoded = json_decode($tags, true);
        $tags = is_array($decoded) ? $decoded : [];
    }

    return Inertia::render('Blog/Preview', [
        'title' => $request->input('title'),
        'content' => $request->input('content'),
        'thumbnail' => $request->input('thumbnail'),
        'category' => $request->input('category'),
        'category_id' => $request->input('category_id'),
        'tags' => $tags,
        'status' => $request->input('status', 'published'),
        'blog_id' => $request->input('blog_id'),
        'is_editing' => $request->input('is_editing', false),
    ]);
})->middleware(['auth'])->name('blog.preview');

Route::get('/blog/{id}', [BlogController::class, 'show'])
    ->name('blog.show');

Route::get('/blog/{id}/edit', [BlogController::class, 'edit'])
    ->middleware(['auth'])
    ->name('blog.edit');

Route::post('/blog', [BlogController::class, 'store'])
    ->middleware(['auth'])
    ->name('blog.store');

Route::post('/blog/{id}', [BlogController::class, 'update'])
    ->middleware(['auth'])
    ->name('blog.update');
    
Route::delete('/blog/{id}', [BlogController::class, 'destroy'])
    ->middleware(['auth'])
    ->name('blog.destroy');

Route::get('/admin', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('admin.dashboard');

Route::get('/test', function () {
    return Inertia::render('TestingPage');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
