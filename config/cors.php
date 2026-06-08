<?php

return [

    /*
    |--------------------------------------------------------------------------
    | CORS Configuration — MataCeria API
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

    // Ganti '*' dengan domain spesifik di production
    // Contoh: 'allowed_origins' => ['https://mataceria.com', 'https://app.mataceria.com']
    'allowed_origins' => [env('FRONTEND_URL', '*')],

    'allowed_origins_patterns' => [],

    'allowed_headers' => [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'X-CSRF-TOKEN',
    ],

    'exposed_headers' => ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],

    'max_age' => 86400, // 24 jam cache preflight

    'supports_credentials' => true,

];

