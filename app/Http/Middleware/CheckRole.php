<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return redirect()->route('login')
                ->with('error', 'Please login to continue.');
        }

        // Check if user has required role
        $user = Auth::user();
        
        // If role_id is 1 (admin), allow access
        if (in_array('admin', $roles) && $user->role_id === 1) {
            return $next($request);
        }

        // If unauthorized, redirect to home
        return redirect()->route('home')
            ->with('error', 'Unauthorized access. Admin only.');
    }
}
