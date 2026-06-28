<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CekSekretaris
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()->role !== 'sekretaris') {
            return response()->json([
                'message' => 'Akses ditolak. Hanya sekretaris yang bisa mengakses ini.',
            ], 403);
        }
    {
        return $next($request);
    }
    }
}