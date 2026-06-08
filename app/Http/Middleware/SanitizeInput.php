<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * Sanitasi input request dari karakter berbahaya (XSS, SQL injection dasar).
 */
class SanitizeInput
{
    /** Field yang tidak disanitasi (passwords, tokens, binary data) */
    private array $except = [
        'password',
        'password_confirmation',
        'current_password',
        'image',
        'avatar',
        '_token',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        $this->sanitize($request);
        return $next($request);
    }

    private function sanitize(Request $request): void
    {
        $input = $request->all();
        $sanitized = $this->sanitizeArray($input);
        $request->merge($sanitized);
    }

    private function sanitizeArray(array $data): array
    {
        foreach ($data as $key => $value) {
            if (in_array($key, $this->except, true)) {
                continue;
            }
            if (is_array($value)) {
                $data[$key] = $this->sanitizeArray($value);
            } elseif (is_string($value)) {
                $data[$key] = $this->sanitizeString($value);
            }
        }
        return $data;
    }

    private function sanitizeString(string $value): string
    {
        // Strip HTML tags dan encode karakter khusus
        return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES | ENT_HTML5, 'UTF-8');
    }
}
