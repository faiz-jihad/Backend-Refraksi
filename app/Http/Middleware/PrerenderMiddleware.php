<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PrerenderMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        if ($this->shouldPrerender($request)) {
            // Kita arahkan bot ke service Prerender.io gratisan / berbayar
            $prerenderUrl = 'https://service.prerender.io/' . $request->fullUrl();
            $token = config('services.prerender.token');

            try {
                $response = Http::withHeaders([
                    'X-Prerender-Token' => $token,
                ])->timeout(10)->get($prerenderUrl);

                if ($response->successful()) {
                    return response($response->body(), $response->status())
                        ->header('Content-Type', 'text/html; charset=UTF-8');
                }
            } catch (\Exception $e) {
                // Jika prerender error, fallback balik ke render normal biar web gak crash
                return $next($request);
            }
        }

        return $next($request);
    }

    /**
     * Cek apakah request datang dari bot/crawler.
     */
    private function shouldPrerender(Request $request): bool
    {
        $userAgent = strtolower($request->header('User-Agent', ''));

        // Jangan prerender jika tidak ada user agent atau request internal dari prerender itu sendiri
        if (empty($userAgent) || $request->header('X-Prerender')) {
            return false;
        }

        // Daftar bot/crawler yang perlu disajikan versi pre-rendered HTML
        $bots = [
            'googlebot',
            'bingbot',
            'yandexbot',
            'baiduspider',
            'facebookexternalhit',
            'twitterbot',
            'rogerbot',
            'linkedinbot',
            'embedly',
            'quora link preview',
            'showyoubot',
            'outbrain',
            'pinterest/0.',
            'developers.google.com'
        ];

        foreach ($bots as $bot) {
            if (Str::contains($userAgent, $bot)) {
                return true;
            }
        }

        return false;
    }
}
