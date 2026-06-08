<?php

declare(strict_types=1);

use App\Helpers\ApiResponse;
use App\Exceptions\GeminiException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->validateCsrfTokens(except: [
            'api/*',
            'api/v1/refraction/predict',
            'refraction/predict',
        ]);

        // Global middleware — diterapkan ke semua request
        $middleware->append(\App\Http\Middleware\SecurityHeaders::class);
        $middleware->append(\App\Http\Middleware\SanitizeInput::class);

        $middleware->alias([
            'role'     => \App\Http\Middleware\RoleMiddleware::class,
            'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        ]);

        // Rate limiter per kelompok route
        $middleware->throttleApi('api');
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Illuminate\Validation\ValidationException $e) {
            return ApiResponse::error(
                message: 'Data yang dikirim tidak valid',
                errors: $e->errors(),
                code: 422
            );
        });

        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e) {
            return ApiResponse::unauthorized();
        });

        $exceptions->render(function (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ApiResponse::notFound();
        });

        $exceptions->render(function (GeminiException $e) {
            return ApiResponse::error(message: $e->getMessage(), code: 503);
        });

        $exceptions->shouldRenderJsonWhen(function (Request $request, \Throwable $e) {
            if ($request->is('api/*')) {
                return true;
            }
            return $request->expectsJson();
        });

        $exceptions->render(function (\Exception $e, Request $request) {
            Log::error('Unhandled exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            if ($request->is('api/*') || $request->expectsJson()) {
                return ApiResponse::serverError();
            }
            
            return false; // Let Laravel handle the web view rendering for web routes
        });
    })->create();
