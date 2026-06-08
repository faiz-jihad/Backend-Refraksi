<?php

declare(strict_types=1);

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Rate Limiter Configuration — MataCeria API
|--------------------------------------------------------------------------
*/

// Rate limit umum untuk semua endpoint API
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(90)->by($request->user()?->id ?: $request->ip());
});

// Ketat untuk endpoint auth (cegah brute-force)
RateLimiter::for('auth', function (Request $request) {
    return Limit::perMinute(10)->by($request->ip());
});

// Endpoint AI (mahal secara komputasi)
RateLimiter::for('ai', function (Request $request) {
    return Limit::perMinute(15)->by($request->user()?->id ?: $request->ip());
});

// Chat — lebih longgar tapi tetap dibatasi
RateLimiter::for('chat', function (Request $request) {
    return Limit::perMinute(30)->by($request->user()?->id ?: $request->ip());
});

/*
|--------------------------------------------------------------------------
| Konsolidasi Route Files
|--------------------------------------------------------------------------
*/

require __DIR__.'/../routes/web.php';
