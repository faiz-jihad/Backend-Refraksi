<?php

declare(strict_types=1);

return [
    'api_key'  => env('GEMINI_API_KEY'),
    'model'    => env('GEMINI_MODEL', 'gemini-2.0-flash'),
    'base_url' => env('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta'),
];
