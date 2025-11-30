<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class CommentController extends Controller
{
    /**
     * Store a newly created comment.
     */
    public function store(Request $request, $blogId)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:comments,id',
        ]);

        // Check if blog exists
        $blog = Blog::findOrFail($blogId);

        // If it's a reply, verify parent comment belongs to same blog
        if ($validated['parent_id']) {
            $parentComment = Comment::findOrFail($validated['parent_id']);
            if ($parentComment->blog_id != $blogId) {
                throw ValidationException::withMessages([
                    'parent_id' => 'Invalid parent comment.'
                ]);
            }
        }

        $comment = Comment::create([
            'blog_id' => $blogId,
            'user_id' => Auth::id(),
            'content' => $validated['content'],
            'parent_id' => $validated['parent_id'] ?? null,
        ]);

        // Load relationships for response
        $comment->load('user:id,name', 'replies.user:id,name');

        return back()->with([
            'success' => 'Comment posted successfully!',
            'comment' => $comment,
        ]);
    }

    /**
     * Update the specified comment.
     */
    public function update(Request $request, $blogId, $commentId)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comment = Comment::where('blog_id', $blogId)
            ->where('id', $commentId)
            ->firstOrFail();

        // Check if user owns the comment
        if ($comment->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $comment->update([
            'content' => $validated['content'],
        ]);

        $comment->load('user:id,name', 'replies.user:id,name');

        return back()->with([
            'success' => 'Comment updated successfully!',
            'comment' => $comment,
        ]);
    }

    /**
     * Remove the specified comment.
     */
    public function destroy($blogId, $commentId)
    {
        $comment = Comment::where('blog_id', $blogId)
            ->where('id', $commentId)
            ->firstOrFail();

        // Check if user owns the comment
        if ($comment->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        // Soft delete the comment and its replies
        $comment->replies()->delete();
        $comment->delete();

        return back()->with('success', 'Comment deleted successfully!');
    }

    /**
     * Get comments for a specific blog (for AJAX requests)
     */
    public function index($blogId)
    {
        $comments = Comment::where('blog_id', $blogId)
            ->whereNull('parent_id') // Only get parent comments
            ->with([
                'user:id,name',
                'replies' => function ($query) {
                    $query->with('user:id,name')
                        ->orderBy('created_at', 'asc');
                }
            ])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($comments);
    }
}
