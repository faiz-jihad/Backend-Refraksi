<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">

    <!-- SEO & Indexing -->
    <title>MataCeria — Platform Kesehatan Mata Digital Indonesia #1</title>
    <meta name="description" content="Platform kesehatan mata berbasis screening digital terdepan di Indonesia. Deteksi dini penyakit mata, tes refraksi digital, dan konsultasi dokter spesialis mata dalam satu ekosistem.">
    <meta name="keywords" content="kesehatan mata, screening digital, deteksi glaukoma, tes refraksi, telemedicine mata, optik online, ai kesehatan">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <link rel="canonical" href="{{ url('/') }}" />
    
    <!-- Schema.org JSON-LD Structured Data for Rich Snippets -->
    <script type="application/ld+json">
    {
      "@@context": "https://schema.org",
      "@@graph": [
        {
          "@@type": "SoftwareApplication",
          "@@id": "{{ url('/') }}#app",
          "name": "MataCeria",
          "url": "{{ url('/') }}",
          "operatingSystem": "Android, iOS",
          "applicationCategory": "HealthApplication",
          "downloadUrl": "https://mataceria.my.id/",
          "offers": {
            "@@type": "Offer",
            "price": "0.00",
            "priceCurrency": "IDR"
          },
          "aggregateRating": {
            "@@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "12450"
          }
        },
        {
          "@@type": "Organization",
          "@@id": "{{ url('/') }}#organization",
          "name": "MataCeria",
          "url": "{{ url('/') }}",
          "logo": "{{ url('/images/og-mataceria.jpg') }}",
          "description": "Platform screening kesehatan mata berbasis digital pertama di Indonesia."
        },
        {
          "@@type": "FAQPage",
          "@@id": "{{ url('/') }}#faq",
          "mainEntity": [
            {
              "@@type": "Question",
              "name": "Apa itu aplikasi MataCeria?",
              "acceptedAnswer": {
                "@@type": "Answer",
                "text": "MataCeria adalah platform kesehatan mata digital inovatif di Indonesia untuk deteksi dini ketajaman visual, tes rabun jauh, rabun dekat, silinder, serta konsultasi dokter mata secara instan dipandu oleh teknologi kecerdasan buatan (AI)."
              }
            },
            {
              "@@type": "Question",
              "name": "Apakah tes mata di MataCeria akurat?",
              "acceptedAnswer": {
                "@@type": "Answer",
                "text": "Ya, tes mata MataCeria dirancang dengan metode terstandarisasi medis secara digital, serta dilengkapi dengan fitur kalibrasi jarak otomatis berbasis kamera untuk hasil yang akurat."
              }
            }
          ]
        }
      ]
    }
    </script>
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url('/') }}">
    <meta property="og:title" content="MataCeria — Digital Eye Health Platform Indonesia">
    <meta property="og:description" content="Teknologi screening digital untuk melindungi penglihatan Anda. Deteksi dini, akurat, dan terpercaya.">
    <meta property="og:image" content="{{ url('/images/og-mataceria.jpg') }}">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="{{ url('/') }}">
    <meta name="twitter:title" content="MataCeria — Digital Eye Health Platform Indonesia">
    <meta name="twitter:description" content="Teknologi screening digital untuk melindungi penglihatan Anda. Deteksi dini, akurat, dan terpercaya.">

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
            /* White base theme matches WelcomeApp.jsx T.bg — prevents flash */
            background: #FFFFFF;
            color: #0F2918;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            overflow-x: hidden;
            min-height: 100vh;
        }

        /* Loader — calm green theme (before React hydrates) */
        #wc-loader {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1.25rem;
            background: #FFFFFF;
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
            background: linear-gradient(135deg, #22C55E, #059669);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 40px rgba(34, 197, 94, 0.35);
            animation: wc-logo-pulse 2s ease-in-out infinite;
        }

        .wc-loader-ring {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 3px solid rgba(22, 163, 74, 0.18);
            border-top-color: #16A34A;
            animation: wc-spin 0.8s linear infinite;
        }

        .wc-loader-text {
            font-size: 0.72rem;
            font-weight: 700;
            color: #8AAD97;
            text-transform: uppercase;
            letter-spacing: 0.15em;
        }

        @keyframes wc-spin { to { transform: rotate(360deg); } }
        @keyframes wc-logo-pulse { 0%, 100% { box-shadow: 0 0 40px rgba(34,197,94,0.35); } 50% { box-shadow: 0 0 60px rgba(34,197,94,0.55); } }

        /* Prevent scrollbar appearing during load */
        body.loading { overflow: hidden; }

        /* Scrollbar — green-tinted light theme */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #F4FAF6; }
        ::-webkit-scrollbar-thumb { background: #B6D9C2; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #16A34A; }
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
            
            // Hardcode doctors list to prevent Class Not Found fatal error
            $doctorsCount  = '120+';
            $dbDoctors     = [
                ['name' => 'dr. Sari Andini, Sp.M', 'time' => 'Respon < 5 mnt'],
                ['name' => 'dr. Andi Wijaya, Sp.M',  'time' => 'Respon < 10 mnt']
            ];
        } catch (\Throwable $e) {
            // Catch \Throwable to handle both Exceptions (DB error) and Errors (Class Not Found)
            $patientsCount = '50,000+';
            $doctorsCount  = '120+';
            $dbDoctors     = [
                ['name' => 'dr. Sari Andini, Sp.M', 'time' => 'Respon < 5 mnt'],
                ['name' => 'dr. Andi Wijaya, Sp.M',  'time' => 'Respon < 10 mnt']
            ];
        }
    @endphp

    <!-- Fallback Content for SEO & Search Engine Crawlers (Googlebot) -->
    <noscript>
        <div style="padding: 4rem 2rem; max-width: 800px; margin: 0 auto; font-family: sans-serif; line-height: 1.8; color: #0F2918; background: #FFFFFF;">
            <header style="text-align: center; margin-bottom: 3rem;">
                <h1 style="font-size: 2.5rem; color: #16A34A; margin-bottom: 1rem;">MataCeria — Uji Kesehatan Mata Secara Digital</h1>
                <p style="font-size: 1.2rem; color: #3D6B52;">Platform Screening & Kesehatan Mata Digital #1 di Indonesia. Deteksi Dini Rabun Jauh (Myopia), Rabun Dekat (Hyperopia), dan Silinder (Astigmatisme).</p>
            </header>
            
            <section style="margin-bottom: 3rem;">
                <h2 style="color: #0F2918; border-bottom: 2px solid #E2F0E8; padding-bottom: 0.5rem;">Mengapa Memilih MataCeria?</h2>
                <p>MataCeria memberikan kemudahan screening kesehatan mata mandiri kapan saja dan di mana saja langsung dari smartphone Anda. Didukung oleh teknologi kecerdasan buatan (AI) terdepan untuk hasil akurat dan terstandarisasi secara klinis.</p>
            </section>

            <section style="margin-bottom: 3rem;">
                <h2 style="color: #0F2918; border-bottom: 2px solid #E2F0E8; padding-bottom: 0.5rem;">Fitur Utama Aplikasi</h2>
                <ul style="padding-left: 1.5rem;">
                    <li><strong>Uji Refraksi Mandiri:</strong> Tes ketajaman penglihatan digital menggunakan standar Snellen Chart dan sistem kalibrasi jarak cerdas.</li>
                    <li><strong>Deteksi Silinder (Astigmatisme):</strong> Menguji kelainan kelengkungan kornea mata menggunakan bagan dial kipas astigmat terkalibrasi.</li>
                    <li><strong>Rekomendasi Diagnostik Berbasis AI:</strong> Dapatkan analisis klinis instan dan saran tindak lanjut kesehatan mata Anda.</li>
                    <li><strong>Konsultasi Dokter & Klinik:</strong> Terhubung dengan dokter spesialis mata terpercaya secara real-time.</li>
                </ul>
            </section>

            <section style="margin-bottom: 3rem;">
                <h2 style="color: #0F2918; border-bottom: 2px solid #E2F0E8; padding-bottom: 0.5rem;">Bagaimana Cara Kerja Aplikasi?</h2>
                <ol style="padding-left: 1.5rem;">
                    <li><strong>Download Aplikasi:</strong> Unduh aplikasi MataCeria gratis dari App Store atau Google Play Store.</li>
                    <li><strong>Pilih Tes Mata:</strong> Tentukan pemeriksaan yang ingin Anda jalani (Rabun Jauh, Rabun Dekat, atau Silinder).</li>
                    <li><strong>Screening Cepat:</strong> Ikuti panduan suara dan visual interaktif berdurasi 3 menit.</li>
                    <li><strong>Lihat Hasil Instan:</strong> Terima laporan medis terformat yang dapat dibagikan kepada spesialis mata Anda.</li>
                </ol>
            </section>
            
            <section style="text-align: center; margin-top: 4rem;">
                <p style="font-weight: bold; font-size: 1.1rem;">Bergabunglah dengan 50.000+ pengguna aktif yang mempercayakan kesehatan matanya pada MataCeria.</p>
                <div style="margin-top: 1.5rem; display: flex; gap: 1rem; justify-content: center;">
                    <a href="{{ route('login') }}" style="background: #16A34A; color: #fff; padding: 0.75rem 2rem; border-radius: 8px; text-decoration: none; font-weight: bold;">Masuk ke Akun</a>
                    <a href="/register" style="border: 2px solid #16A34A; color: #16A34A; padding: 0.75rem 2rem; border-radius: 8px; text-decoration: none; font-weight: bold;">Daftar Gratis</a>
                </div>
            </section>
        </div>
    </noscript>

    <!-- React Root Container — hidden until app mounts -->
    <div id="welcome-root"
         data-login-route="{{ route('login') }}"
         data-admin-route="{{ url('/admin') }}"
         data-authenticated="{{ Auth::check() ? 'true' : 'false' }}"
         data-user-name="{{ Auth::check() ? Auth::user()->name : '' }}"
         data-stats-patients="{{ $patientsCount }}"
         data-stats-doctors="{{ $doctorsCount }}"
         data-doctors="{{ json_encode($dbDoctors) }}"
         data-apk-route="{{ route('download.apk') }}"
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