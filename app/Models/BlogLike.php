<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BlogLike extends Model
{
    protected $fillable = [
        'blog_id',
        'user_id',
    ];

    public $incrementing = false;

    /**
     * Get the blog that owns the blog like.
     */
    public function blog(): BelongsTo
    {
        return $this->belongsTo(Blog::class);
    }

    /**
     * Get the user that owns the blog like.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
