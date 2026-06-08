<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Helpers\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user() || $request->user()->role !== $role) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return ApiResponse::error(
                    message: 'Unauthorized: Access denied for your role',
                    code: 403
                );
            }

            if (!$request->user()) {
                return redirect()->guest(route('login'))->withErrors([
                    'email' => 'Silakan masuk terlebih dahulu untuk mengakses panel admin.'
                ]);
            }

            abort(403, 'Unauthorized: Access denied for your role');
        }

        return $next($request);
    }
}
