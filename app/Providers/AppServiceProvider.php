<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Category;
use App\Models\Blog;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        $extractPlainText = function (?string $content): string {
            if (!$content) {
                return '';
            }

            $text = '';

            try {
                $decoded = json_decode($content, true, 512, JSON_THROW_ON_ERROR);
                $ops = $decoded['ops'] ?? (is_array($decoded) ? $decoded : []);
                foreach ($ops as $op) {
                    $insert = $op['insert'] ?? '';
                    if (is_string($insert)) {
                        $text .= $insert;
                    }
                }
            } catch (\Throwable) {
                $text = strip_tags($content);
            }

            return Str::of($text)->squish()->value();
        };

        Inertia::share([
            'auth' => function () {
                /** @var \App\Models\User|null $user */
                $user = Auth::user();
                return [
                    'user' => $user ? [
                        'id' => $user->id,
                        'name' => $user->name,
                        'username' => $user->username,
                        'email' => $user->email,
                        'avatar_url' => $user->avatar_url,
                        'role' => session('role'),
                    ] : null,
                ];
            },
            'categories' => function () {
                return Category::with('children')->whereNull('parent_id')->get();
            },
            'marqueeItems' => function () use ($extractPlainText) {
                return Blog::query()
                    ->select(['id', 'title', 'content'])
                    ->where('status', 'published')
                    ->inRandomOrder()
                    ->take(12)
                    ->get()
                    ->map(function (Blog $blog) use ($extractPlainText) {
                        $text = $extractPlainText($blog->content) ?: $blog->title;

                        return [
                            'id' => $blog->id,
                            'title' => $blog->title,
                            'text' => Str::limit($text, 160),
                            'url' => route('blog.show', $blog->id),
                        ];
                    })
                    ->filter(fn ($item) => !empty($item['text']))
                    ->values();
            },
        ]);
    }
}
