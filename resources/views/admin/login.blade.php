<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Admin — MataCeria</title>

    <!-- Fonts: Space Mono + JetBrains Mono sesuai DESIGN.md -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">

    <style>
        /* =============================================
           DESIGN.MD — Neumorphism System
           Surface: #E7E5E4 | Primary: #006666
           Font: Space Mono + JetBrains Mono
           Radius: sm=4px, md=8px
           Shadow: light top-left (#fff), dark bottom-right (#b5b3b2)
           ============================================= */
        :root {
            --bg-canvas: #E7E5E4;
            --bg-surface: #E7E5E4;
            --bg-surface-hover: #dfdcdb;
            --bg-subtle: #d7d4d3;

            --text-primary: #1E2938;
            --text-secondary: #334155;
            --text-muted: #64748b;
            --text-placeholder: #94a3b8;

            --brand-50: #e6f2f2;
            --brand-200: #99bfbf;
            --brand-500: #006666;
            --brand-600: #004d4d;
            --brand-700: #003333;

            --danger-50: #fff2f5;
            --danger-100: #ffe6eb;
            --danger-500: #FF2157;

            --success-50: #f0fbf4;
            --success-500: #00A63D;

            /* Neumorphism shadows */
            --nm-out-sm: 3px 3px 6px #b5b3b2, -3px -3px 6px #ffffff;
            --nm-out-md: 6px 6px 12px #b5b3b2, -6px -6px 12px #ffffff;
            --nm-out-lg: 10px 10px 20px #b5b3b2, -10px -10px 20px #ffffff;
            --nm-in-sm: inset 3px 3px 6px #b5b3b2, inset -3px -3px 6px #ffffff;
            --nm-in-md: inset 5px 5px 10px #b5b3b2, inset -5px -5px 10px #ffffff;

            --radius-sm: 4px;
            --radius-md: 8px;
            --radius-lg: 12px;

            --duration-fast: 120ms;
            --duration-normal: 200ms;
            --ease-out: cubic-bezier(0.25, 0, 0, 1);
        }

        *, *::before, *::after {
            margin: 0; padding: 0; box-sizing: border-box;
        }

        html {
            font-size: 16px;
            -webkit-font-smoothing: antialiased;
        }

        body {
            font-family: 'Montserrat', sans-serif;
            background: var(--bg-canvas);
            color: var(--text-primary);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            position: relative;
            overflow: hidden;
        }

        /* ---- Neumorphic Background Texture ---- */
        body::before {
            content: '';
            position: fixed;
            inset: 0;
            background:
                radial-gradient(ellipse at 15% 20%, rgba(0,102,102,0.06) 0%, transparent 55%),
                radial-gradient(ellipse at 85% 80%, rgba(0,102,102,0.04) 0%, transparent 55%);
            pointer-events: none;
        }

        /* ---- Decorative circles ---- */
        .deco-circle {
            position: fixed;
            border-radius: 50%;
            pointer-events: none;
        }

        /* ---- Card ---- */
        .login-card {
            width: 100%;
            max-width: 440px;
            background: var(--bg-surface);
            border-radius: 20px;
            padding: 2.5rem;
            box-shadow: var(--nm-out-lg);
            position: relative;
            z-index: 10;
            animation: fadeInUp 0.5s var(--ease-out) both;
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* ---- Logo ---- */
        .logo-wrap {
            display: flex;
            align-items: center;
            gap: 0.875rem;
            margin-bottom: 2rem;
            text-decoration: none;
        }

        .logo-icon {
            width: 44px;
            height: 44px;
            background: var(--bg-surface);
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--brand-500);
            box-shadow: var(--nm-out-sm);
            transition: box-shadow var(--duration-fast) var(--ease-out);
            flex-shrink: 0;
        }

        .logo-wrap:hover .logo-icon {
            box-shadow: var(--nm-in-sm);
        }

        .logo-text-main {
            font-family: 'Montserrat', sans-serif;
            font-weight: 700;
            font-size: 1.25rem;
            color: var(--text-primary);
            letter-spacing: -0.02em;
        }

        .logo-text-main span {
            color: var(--brand-500);
        }

        .logo-label {
            font-family: 'Montserrat', sans-serif;
            font-size: 0.625rem;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: var(--text-muted);
            margin-top: 2px;
        }

        /* ---- Heading ---- */
        .card-heading {
            margin-bottom: 2rem;
        }

        .card-heading h1 {
            font-family: 'Montserrat', sans-serif;
            font-weight: 700;
            font-size: 1.5rem;
            color: var(--text-primary);
            letter-spacing: -0.03em;
            line-height: 1.3;
        }

        .card-heading p {
            font-size: 0.8125rem;
            color: var(--text-muted);
            margin-top: 0.375rem;
            line-height: 1.6;
        }

        /* ---- Separator line ---- */
        .separator {
            height: 1px;
            background: linear-gradient(to right, transparent, #b5b3b2, transparent);
            margin-bottom: 2rem;
        }

        /* ---- Alert Error ---- */
        .alert-error {
            background: var(--danger-50);
            border-radius: var(--radius-md);
            padding: 0.875rem 1rem;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: flex-start;
            gap: 0.625rem;
            box-shadow: var(--nm-in-sm);
        }

        .alert-error-icon {
            color: var(--danger-500);
            flex-shrink: 0;
            font-size: 1.125rem;
            margin-top: 1px;
        }

        .alert-error p {
            font-size: 0.8125rem;
            color: var(--danger-500);
            font-weight: 600;
        }

        /* ---- Form ---- */
        .form-group {
            margin-bottom: 1.25rem;
        }

        .form-label {
            font-family: 'Montserrat', sans-serif;
            font-size: 0.625rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: var(--text-muted);
            display: block;
            margin-bottom: 0.5rem;
        }

        .input-wrapper {
            position: relative;
        }

        .input-icon {
            position: absolute;
            left: 0.875rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
            pointer-events: none;
            display: flex;
        }

        .form-input {
            width: 100%;
            padding: 0.8125rem 1rem 0.8125rem 2.75rem;
            font-family: 'Montserrat', sans-serif;
            font-size: 0.875rem;
            color: var(--text-primary);
            background: var(--bg-canvas);
            border: 1px solid #d0cdcc;
            border-radius: var(--radius-md);
            box-shadow: var(--nm-in-sm);
            outline: none;
            transition: border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
        }

        .form-input::placeholder {
            color: var(--text-placeholder);
            font-family: 'Montserrat', sans-serif;
        }

        .form-input:focus {
            border-color: var(--brand-500);
            box-shadow: inset 2px 2px 4px #b5b3b2, inset -2px -2px 4px #ffffff, 0 0 0 2px var(--brand-200);
        }

        /* ---- Submit Button ---- */
        .btn-submit {
            width: 100%;
            padding: 0.9375rem 1.5rem;
            background: var(--brand-500);
            color: #ffffff;
            font-family: 'Montserrat', sans-serif;
            font-size: 0.875rem;
            font-weight: 700;
            letter-spacing: 0.02em;
            border: none;
            border-radius: var(--radius-md);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            box-shadow: var(--nm-out-sm);
            transition: all var(--duration-fast) var(--ease-out);
            margin-top: 1.75rem;
        }

        .btn-submit:hover {
            background: var(--brand-600);
            box-shadow: 2px 2px 4px #b5b3b2, -2px -2px 4px #ffffff;
            transform: translateY(1px);
        }

        .btn-submit:active {
            box-shadow: var(--nm-in-sm);
            transform: translateY(2px);
        }

        /* ---- Divider ---- */
        .divider-or {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin: 1.5rem 0;
        }

        .divider-or::before,
        .divider-or::after {
            content: '';
            flex: 1;
            height: 1px;
            background: #b5b3b2;
        }

        .divider-or span {
            font-family: 'Montserrat', sans-serif;
            font-size: 0.625rem;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: var(--text-muted);
        }

        /* ---- Back link ---- */
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.8125rem;
            color: var(--text-muted);
            text-decoration: none;
            font-family: 'Montserrat', sans-serif;
            font-weight: 400;
            transition: color var(--duration-fast) var(--ease-out);
        }

        .back-link:hover {
            color: var(--brand-500);
        }

        .back-link svg {
            transition: transform var(--duration-fast) var(--ease-out);
        }

        .back-link:hover svg {
            transform: translateX(-3px);
        }

        /* ---- Footer ---- */
        .card-footer-text {
            font-family: 'Montserrat', sans-serif;
            font-size: 0.625rem;
            color: var(--text-placeholder);
            text-align: center;
            margin-top: 1.5rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        /* Decorative dots */
        .dot {
            position: fixed;
            border-radius: 50%;
            background: var(--brand-500);
            pointer-events: none;
            opacity: 0.07;
        }

        /* ---- Scrollbar ---- */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg-canvas); }
        ::-webkit-scrollbar-thumb { background: #b5b3b2; border-radius: 4px; }
    </style>
</head>

<body>
    <!-- Decorative dots -->
    <div class="dot" style="width:300px; height:300px; top:-120px; right:-80px; filter:blur(60px);"></div>
    <div class="dot" style="width:200px; height:200px; bottom:-60px; left:-60px; filter:blur(50px);"></div>
    <div class="deco-circle" style="width:450px; height:450px; top:-15%; right:-10%; border:1px solid rgba(0,102,102,0.08); border-radius:50%;"></div>
    <div class="deco-circle" style="width:350px; height:350px; bottom:-15%; left:-8%; border:1px solid rgba(0,102,102,0.06); border-radius:50%;"></div>

    <!-- Login Card -->
    <div style="width:100%; max-width:440px; position:relative; z-index:10;">
        <div class="login-card">

            <!-- Logo -->
            <a href="{{ url('/') }}" class="logo-wrap">
                <div class="logo-icon">
                    <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                </div>
                <div>
                    <div class="logo-text-main">Mata<span>Ceria</span></div>
                    <div class="logo-label">Panel Administrasi</div>
                </div>
            </a>

            <div class="separator"></div>

            <!-- Heading -->
            <div class="card-heading">
                <h1>Selamat Datang</h1>
                <p>Masuk untuk mengelola platform kesehatan mata MataCeria</p>
            </div>

            <!-- Error Alert -->
            @if($errors->any())
            <div class="alert-error">
                <svg class="alert-error-icon" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                    <p>{{ $errors->first() }}</p>
                    <p style="font-size:0.6875rem; color:var(--danger-500); opacity:0.7; margin-top:2px; font-weight:400;">Silakan periksa kembali kredensial Anda</p>
                </div>
            </div>
            @endif

            <!-- Form -->
            <form action="{{ route('admin.login.submit') }}" method="POST">
                @csrf

                <!-- Email -->
                <div class="form-group">
                    <label for="email" class="form-label">Alamat Email</label>
                    <div class="input-wrapper">
                        <span class="input-icon">
                            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                        </span>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            class="form-input"
                            placeholder="admin@mataceria.com"
                            value="{{ old('email') }}"
                            required
                            autofocus
                        >
                    </div>
                </div>

                <!-- Password -->
                <div class="form-group">
                    <label for="password" class="form-label">Kata Sandi</label>
                    <div class="input-wrapper">
                        <span class="input-icon">
                            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                            </svg>
                        </span>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            class="form-input"
                            placeholder="••••••••"
                            required
                        >
                    </div>
                </div>

                <!-- Submit -->
                <button type="submit" class="btn-submit">
                    Masuk ke Panel
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                </button>
            </form>

            <!-- Or divider -->
            <div class="divider-or">
                <span>Atau</span>
            </div>

            <!-- Back to Home -->
            <div style="text-align:center;">
                <a href="{{ url('/') }}" class="back-link">
                    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                    Kembali ke Beranda
                </a>
            </div>
        </div>

        <!-- Footer under card -->
        <p class="card-footer-text">© {{ date('Y') }} MataCeria Platform — v1.0</p>
    </div>

</body>
</html>
