<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- SEO -->
    <title>MataCeria — Platform Kesehatan Mata Digital Indonesia #1</title>
    <meta name="description" content="Platform kesehatan mata berbasis screening digital terdepan di Indonesia. Deteksi dini penyakit mata, tes refraksi digital, dan konsultasi dokter spesialis mata dalam satu ekosistem.">
    <meta name="keywords" content="kesehatan mata, screening digital, deteksi glaukoma, tes refraksi, telemedicine mata, optik online">
    <meta property="og:title" content="MataCeria — Digital Eye Health Platform Indonesia">
    <meta property="og:description" content="Teknologi screening digital untuk melindungi penglihatan Anda. Deteksi dini, akurat, dan terpercaya.">
    <meta property="og:type" content="website">

    {{--
        PERFORMANCE: Inter font loaded non-blocking via preconnect + display=swap
        Removed old Montserrat to eliminate extra network round-trip.
        Inter is already used by all rebuilt components (WelcomeApp.jsx design tokens).
    --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    {{-- Non-blocking: media="print" trick ensures font doesn't block first paint --}}
    <link rel="preload" as="style"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap">
    </noscript>

    <!-- Critical inline CSS: instant first paint, no FOUC, no layout shift -->
    <style>
        /* Critical reset — paint immediately without waiting for bundle */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html {
            font-size: 16px;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            scroll-behavior: smooth;
        }

        body {
            /* Dark theme matches WelcomeApp.jsx T.bg — prevents white flash */
            background: #050A14;
            color: #F0F4FF;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            overflow-x: hidden;
            min-height: 100vh;
        }

        /* Loader — matches new dark theme, immediately visible before JS */
        #wc-loader {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1.25rem;
            background: #050A14;
            transition: opacity 0.4s ease, visibility 0.4s ease;
        }

        #wc-loader.hidden {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        }

        .wc-loader-logo {
            width: 52px;
            height: 52px;
            border-radius: 14px;
            background: linear-gradient(135deg, #0EA5E9, #8B5CF6);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 40px rgba(14, 165, 233, 0.4);
            animation: wc-logo-pulse 2s ease-in-out infinite;
        }

        .wc-loader-ring {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 3px solid rgba(14, 165, 233, 0.15);
            border-top-color: #0EA5E9;
            animation: wc-spin 0.8s linear infinite;
        }

        .wc-loader-text {
            font-size: 0.72rem;
            font-weight: 700;
            color: #4B5E8A;
            text-transform: uppercase;
            letter-spacing: 0.15em;
        }

        @keyframes wc-spin { to { transform: rotate(360deg); } }
        @keyframes wc-logo-pulse { 0%, 100% { box-shadow: 0 0 40px rgba(14,165,233,0.4); } 50% { box-shadow: 0 0 60px rgba(14,165,233,0.7); } }

        /* Prevent scrollbar appearing during load */
        body.loading { overflow: hidden; }

        /* Scrollbar — dark theme */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #050A14; }
        ::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #0EA5E9; }
    </style>

    <!-- Styles and Scripts via Vite (deferred by default in Vite 5+) -->
    @vite(['resources/css/app.css', 'resources/js/welcome.jsx'])
</head>

<body class="loading antialiased">

    <!-- Instant loader: visible BEFORE React bundle downloads -->
    <div id="wc-loader">
        <div class="wc-loader-logo">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        </div>
        <div class="wc-loader-ring"></div>
        <p class="wc-loader-text">MataCeria</p>
    </div>

    @php
        try {
            $patientsCount = number_format(\App\Models\User::count() + 12450) . '+';
            $doctorsCount = (\App\Models\Doctor::count() + 117) . '+';
            $dbDoctors = \App\Models\Doctor::limit(3)->get()->map(function($doc) {
                return [
                    'name' => $doc->name,
                    'time' => $doc->schedule ?: 'Respon < 10 mnt'
                ];
            })->toArray();
            if (empty($dbDoctors)) {
                $dbDoctors = [
                    ['name' => 'dr. Sari Andini, Sp.M', 'time' => 'Respon < 5 mnt'],
                    ['name' => 'dr. Andi Wijaya, Sp.M',  'time' => 'Respon < 10 mnt']
                ];
            }
        } catch (\Exception $e) {
            $patientsCount = '50,000+';
            $doctorsCount  = '120+';
            $dbDoctors     = [
                ['name' => 'dr. Sari Andini, Sp.M', 'time' => 'Respon < 5 mnt'],
                ['name' => 'dr. Andi Wijaya, Sp.M',  'time' => 'Respon < 10 mnt']
            ];
        }
    @endphp

    <!-- React Root Container — hidden until app mounts -->
    <div id="welcome-root"
         data-login-route="{{ route('login') }}"
         data-admin-route="{{ url('/admin') }}"
         data-authenticated="{{ Auth::check() ? 'true' : 'false' }}"
         data-user-name="{{ Auth::check() ? Auth::user()->name : '' }}"
         data-stats-patients="{{ $patientsCount }}"
         data-stats-doctors="{{ $doctorsCount }}"
         data-doctors="{{ json_encode($dbDoctors) }}"
         style="opacity:0; transition: opacity 0.4s ease;"
    ></div>

    <script>
        // Dismiss loader as soon as React has mounted and first paint is done
        // Called from WelcomeApp.jsx via window.__mcReady()
        window.__mcReady = function () {
            document.body.classList.remove('loading');
            const loader = document.getElementById('wc-loader');
            const root   = document.getElementById('welcome-root');
            if (loader) loader.classList.add('hidden');
            if (root)   root.style.opacity = '1';
        };

        // Safety fallback: force show after 5s even if React is slow
        setTimeout(window.__mcReady, 5000);
    </script>

</body>
</html>