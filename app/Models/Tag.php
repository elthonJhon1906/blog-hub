<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
    ];

    /**
     * Get the blogs for the tag.
     */
    public function blogs(): BelongsToMany
    {
        return $this->belongsToMany(Blog::class, 'blog_tags')
            ->withTimestamps();
    }

    /**
     * Get or create a tag by name (case-insensitive).
     */
    public static function findOrCreateByName(string $name): self
    {
        // Clean tag name - remove all # symbols and trim
        $cleanName = trim(str_replace('#', '', $name));
        
        // Return null if empty after cleaning
        if (empty($cleanName)) {
            throw new \InvalidArgumentException('Tag name cannot be empty or contain only # symbols');
        }
        
        // Find existing tag (case-insensitive)
        $existing = static::whereRaw('LOWER(name) = ?', [strtolower($cleanName)])->first();
        
        if ($existing) {
            return $existing;
        }

        // Create new tag with original case (but without # symbols)
        return static::create(['name' => $cleanName]);
    }
}
