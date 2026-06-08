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

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">

    <style>
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; background: #E7E5E4; }

        /* DESIGN.MD: Montserrat primary font */
        body { font-family: 'Montserrat', sans-serif; color: #1E2938; }

        /* Neumorphic scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #E7E5E4; box-shadow: inset 2px 2px 4px #b5b3b2, inset -2px -2px 4px #ffffff; }
        ::-webkit-scrollbar-thumb { background: #b5b3b2; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #006666; }

        /* Scan animation for mobile canvas */
        @keyframes scan {
            0% { top: 0; opacity: 0.8; }
            50% { opacity: 0.4; }
            100% { top: 100%; opacity: 0.8; }
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
        }
    </style>

    <!-- Styles and Scripts via Vite -->
    @vite(['resources/css/app.css', 'resources/js/welcome.jsx'])
</head>

<body class="antialiased" style="background:#E7E5E4; font-family: 'Montserrat', sans-serif; color: #1E2938;">

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
                    ['name' => 'dr. Andi Wijaya, Sp.M', 'time' => 'Respon < 10 mnt']
                ];
            }
        } catch (\Exception $e) {
            $patientsCount = '50,000+';
            $doctorsCount = '120+';
            $dbDoctors = [
                ['name' => 'dr. Sari Andini, Sp.M', 'time' => 'Respon < 5 mnt'],
                ['name' => 'dr. Andi Wijaya, Sp.M', 'time' => 'Respon < 10 mnt']
            ];
        }
    @endphp

    <!-- React Root Container -->
    <div id="welcome-root"
         data-login-route="{{ route('login') }}"
         data-admin-route="{{ url('/admin') }}"
         data-authenticated="{{ Auth::check() ? 'true' : 'false' }}"
         data-user-name="{{ Auth::check() ? Auth::user()->name : '' }}"
         data-stats-patients="{{ $patientsCount }}"
         data-stats-doctors="{{ $doctorsCount }}"
         data-doctors="{{ json_encode($dbDoctors) }}"
    >
        <!-- Fallback loader (neumorphic) -->
        <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background:#E7E5E4;">
            <div style="text-align:center; font-family:'Montserrat', sans-serif;">
                <div style="width:48px; height:48px; border-radius:50%; background:#E7E5E4; box-shadow:5px 5px 10px #b5b3b2,-5px -5px 10px #ffffff; display:flex; align-items:center; justify-content:center; margin:0 auto 16px;">
                    <div style="width:32px; height:32px; border:2px solid transparent; border-top:2px solid #006666; border-radius:50%; animation:spin 1s linear infinite;"></div>
                </div>
                <p style="font-size:10px; letter-spacing:0.15em; color:#64748b; text-transform:uppercase;">Loading MataCeria...</p>
            </div>
        </div>
    </div>

    <style>
        @keyframes spin { to { transform: rotate(360deg); } }
    </style>

</body>
</html>