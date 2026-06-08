<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title') | MataCeria Admin</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <!-- Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">

    <!-- Charts -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

    <!-- Vite -->
    @vite(['resources/css/app.css'])
    
    <script>
        if (localStorage.getItem('admin-dark-mode') === 'true') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    </script>

    <style>
        /* ============================================= 
           DESIGN TOKENS — Modern Flat UI
           ============================================= */
        :root {
            --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

            /* Layout */
            --sidebar-w: 256px;
            --header-h: 60px;

            /* Brand */
            --brand: #0d9488;
            --brand-light: rgba(13, 148, 136, 0.1);
            --brand-border: rgba(13, 148, 136, 0.3);

            /* Surface */
            --canvas: #f1f5f9;
            --surface: #ffffff;
            --surface-2: #f8fafc;
            --surface-hover: #f1f5f9;
            --sidebar-bg: #0f172a;
            --sidebar-text: #94a3b8;
            --sidebar-text-active: #ffffff;
            --sidebar-item-hover: rgba(255,255,255,0.06);
            --sidebar-item-active: rgba(13,148,136,0.15);
            --sidebar-border: rgba(255,255,255,0.06);

            /* Text */
            --text: #0f172a;
            --text-2: #334155;
            --text-3: #64748b;
            --text-4: #94a3b8;

            /* Border */
            --border: #e2e8f0;
            --border-2: #f1f5f9;

            /* Shadow */
            --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
            --shadow-md: 0 4px 16px rgba(0,0,0,0.07), 0 2px 6px rgba(0,0,0,0.04);
            --shadow-lg: 0 10px 40px rgba(0,0,0,0.1);

            /* Semantic */
            --success: #10b981;
            --success-bg: rgba(16,185,129,0.1);
            --warning: #f59e0b;
            --warning-bg: rgba(245,158,11,0.1);
            --danger: #ef4444;
            --danger-bg: rgba(239,68,68,0.1);
            --info: #3b82f6;
            --info-bg: rgba(59,130,246,0.1);

            /* Radius */
            --r-sm: 8px;
            --r-md: 12px;
            --r-lg: 16px;
            --r-xl: 20px;
            --r-2xl: 24px;
        }

        [data-theme="dark"] {
            --canvas: #0b1120;
            --surface: #131c2e;
            --surface-2: #0f172a;
            --surface-hover: #1e293b;

            --sidebar-bg: #080e1a;
            --sidebar-border: rgba(255,255,255,0.05);

            --text: #f1f5f9;
            --text-2: #cbd5e1;
            --text-3: #94a3b8;
            --text-4: #64748b;

            --border: #1e293b;
            --border-2: #0f172a;

            --shadow-sm: 0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2);
            --shadow-md: 0 4px 16px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.2);
            --shadow-lg: 0 10px 40px rgba(0,0,0,0.5);
        }

        /* ============================================= 
           RESET & BASE
           ============================================= */
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        html { font-size: 16px; -webkit-font-smoothing: antialiased; }

        body {
            font-family: var(--font-sans);
            background: var(--canvas);
            color: var(--text);
            line-height: 1.6;
            display: flex;
            min-height: 100vh;
        }

        a { text-decoration: none; color: inherit; }

        /* ============================================= 
           SIDEBAR
           ============================================= */
        .sidebar {
            width: var(--sidebar-w);
            background: var(--sidebar-bg);
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0; left: 0; bottom: 0;
            z-index: 100;
            overflow-y: auto;
            overflow-x: hidden;
            border-right: 1px solid var(--sidebar-border);
        }

        .sidebar::-webkit-scrollbar { width: 3px; }
        .sidebar::-webkit-scrollbar-track { background: transparent; }
        .sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

        /* Logo */
        .sidebar-logo {
            padding: 1.5rem 1.25rem 1.25rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            border-bottom: 1px solid var(--sidebar-border);
        }

        .logo-icon {
            width: 36px;
            height: 36px;
            background: var(--brand);
            border-radius: var(--r-sm);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 800;
            font-size: 0.9rem;
            flex-shrink: 0;
        }

        .logo-name {
            font-size: 1.05rem;
            font-weight: 700;
            color: #fff;
            letter-spacing: -0.02em;
        }

        .logo-tag {
            font-size: 0.65rem;
            color: var(--sidebar-text);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-top: -2px;
        }

        /* Nav */
        .sidebar-nav {
            flex: 1;
            padding: 1rem 0.75rem;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .nav-group-label {
            font-size: 0.6rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: var(--sidebar-text);
            padding: 0.875rem 0.75rem 0.375rem;
            opacity: 0.6;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.6rem 0.75rem;
            border-radius: var(--r-sm);
            color: var(--sidebar-text);
            font-size: 0.845rem;
            font-weight: 500;
            transition: all 0.2s ease;
            cursor: pointer;
            position: relative;
            border: none;
            background: transparent;
            width: 100%;
            text-align: left;
        }

        .nav-item:hover {
            background: var(--sidebar-item-hover);
            color: #fff;
        }

        .nav-item.active {
            background: var(--sidebar-item-active);
            color: var(--brand);
            font-weight: 600;
        }

        .nav-item.active .nav-icon { opacity: 1; }

        .nav-icon {
            font-size: 1.15rem;
            width: 20px;
            opacity: 0.6;
            flex-shrink: 0;
            transition: opacity 0.2s;
        }

        .nav-item:hover .nav-icon { opacity: 1; }

        .nav-badge {
            margin-left: auto;
            font-size: 0.6rem;
            font-weight: 700;
            padding: 0.15rem 0.45rem;
            border-radius: 99px;
            background: var(--brand);
            color: white;
        }

        /* Sidebar Footer */
        .sidebar-footer {
            padding: 1rem 0.75rem;
            border-top: 1px solid var(--sidebar-border);
        }

        .user-card {
            display: flex;
            align-items: center;
            gap: 0.625rem;
            padding: 0.625rem 0.75rem;
            border-radius: var(--r-sm);
            transition: background 0.2s;
        }

        .user-card:hover { background: var(--sidebar-item-hover); }

        .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: var(--r-sm);
            background: var(--brand);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 0.8rem;
            flex-shrink: 0;
        }

        .user-name {
            font-size: 0.8rem;
            font-weight: 600;
            color: #fff;
        }

        .user-role {
            font-size: 0.65rem;
            color: var(--sidebar-text);
        }

        .logout-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            width: 100%;
            padding: 0.6rem 0.75rem;
            border-radius: var(--r-sm);
            border: none;
            background: transparent;
            color: #ef4444;
            font-family: inherit;
            font-size: 0.845rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            margin-top: 0.25rem;
        }

        .logout-btn:hover {
            background: rgba(239,68,68,0.1);
        }

        /* ============================================= 
           MAIN AREA
           ============================================= */
        .main-wrapper {
            margin-left: var(--sidebar-w);
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            min-width: 0;
        }

        /* Header */
        .top-header {
            height: var(--header-h);
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 1.75rem;
            position: sticky;
            top: 0;
            z-index: 50;
            gap: 1rem;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            flex: 1;
            max-width: 480px;
        }

        .search-wrap {
            position: relative;
            flex: 1;
        }

        .search-wrap input {
            width: 100%;
            padding: 0.5rem 1rem 0.5rem 2.5rem;
            border: 1px solid var(--border);
            border-radius: 99px;
            font-family: inherit;
            font-size: 0.845rem;
            color: var(--text);
            background: var(--canvas);
            outline: none;
            transition: all 0.2s;
        }

        .search-wrap input::placeholder { color: var(--text-4); }

        .search-wrap input:focus {
            border-color: var(--brand);
            background: var(--surface);
            box-shadow: 0 0 0 3px var(--brand-light);
        }

        .search-wrap .search-icon {
            position: absolute;
            left: 0.875rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-4);
            pointer-events: none;
        }

        .header-right {
            display: flex;
            align-items: center;
            gap: 0.625rem;
        }

        .header-icon-btn {
            width: 36px;
            height: 36px;
            border-radius: var(--r-sm);
            border: 1px solid var(--border);
            background: var(--surface);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--text-3);
            transition: all 0.2s;
            position: relative;
        }

        .header-icon-btn:hover {
            background: var(--surface-hover);
            color: var(--text);
            border-color: var(--border);
        }

        .notif-dot {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: var(--warning);
            border: 2px solid var(--surface);
        }

        .divider-v {
            width: 1px;
            height: 22px;
            background: var(--border);
            margin: 0 0.25rem;
        }

        /* Page Content */
        .page-content {
            flex: 1;
            padding: 2rem 1.75rem;
            min-width: 0;
        }

        /* ============================================= 
           SHARED COMPONENTS
           ============================================= */

        /* Cards */
        .card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--r-xl);
            padding: 1.5rem;
            box-shadow: var(--shadow-sm);
            transition: box-shadow 0.2s;
        }

        .card:hover { box-shadow: var(--shadow-md); }

        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.25rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border);
        }

        .card-title {
            font-size: 0.95rem;
            font-weight: 700;
            color: var(--text);
        }

        .card-subtitle {
            font-size: 0.78rem;
            color: var(--text-3);
            margin-top: 0.2rem;
        }

        /* Buttons */
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.55rem 1.1rem;
            border-radius: var(--r-sm);
            font-family: inherit;
            font-size: 0.845rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.15s;
            border: 1px solid transparent;
            white-space: nowrap;
            text-decoration: none;
        }

        .btn-primary { background: var(--brand); color: white; }
        .btn-primary:hover { background: #0f766e; }
        .btn-primary:active { transform: scale(0.98); }

        .btn-secondary {
            background: var(--surface);
            color: var(--text-2);
            border-color: var(--border);
        }
        .btn-secondary:hover { background: var(--surface-hover); }

        .btn-danger { background: var(--danger-bg); color: var(--danger); border-color: rgba(239,68,68,0.2); }
        .btn-danger:hover { background: rgba(239,68,68,0.15); }

        /* Tables */
        .table-wrap {
            overflow-x: auto;
            border: 1px solid var(--border);
            border-radius: var(--r-lg);
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead th {
            padding: 0.875rem 1.25rem;
            text-align: left;
            font-size: 0.72rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.07em;
            color: var(--text-3);
            background: var(--surface-2);
            border-bottom: 1px solid var(--border);
            white-space: nowrap;
        }

        tbody td {
            padding: 0.875rem 1.25rem;
            font-size: 0.875rem;
            color: var(--text);
            border-bottom: 1px solid var(--border-2);
        }

        tbody tr:last-child td { border-bottom: none; }

        tbody tr {
            transition: background 0.15s;
        }
        
        tbody tr:hover { background: var(--surface-hover); }

        /* Badges */
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 0.3rem;
            padding: 0.2rem 0.625rem;
            border-radius: 99px;
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.02em;
        }

        .badge-success { background: var(--success-bg); color: var(--success); }
        .badge-warning { background: var(--warning-bg); color: var(--warning); }
        .badge-danger { background: var(--danger-bg); color: var(--danger); }
        .badge-info { background: var(--info-bg); color: var(--info); }
        .badge-brand { background: var(--brand-light); color: var(--brand); }

        /* Page Title */
        .page-title-section { margin-bottom: 2rem; }
        .page-title {
            font-size: 1.5rem;
            font-weight: 800;
            color: var(--text);
            letter-spacing: -0.03em;
        }
        .page-description {
            font-size: 0.875rem;
            color: var(--text-3);
            margin-top: 0.25rem;
        }

        /* Inputs */
        .form-control,
        input[type="text"],
        input[type="email"],
        input[type="password"],
        input[type="number"],
        input[type="tel"],
        textarea,
        select {
            width: 100% !important;
            padding: 0.6rem 0.875rem !important;
            font-family: inherit !important;
            font-size: 0.875rem !important;
            color: var(--text) !important;
            background: var(--surface) !important;
            border: 1px solid var(--border) !important;
            border-radius: var(--r-sm) !important;
            outline: none !important;
            transition: border-color 0.15s, box-shadow 0.15s !important;
        }

        .form-control:focus,
        input[type="text"]:focus,
        input[type="email"]:focus,
        input[type="password"]:focus,
        input[type="number"]:focus,
        input[type="tel"]:focus,
        textarea:focus,
        select:focus {
            border-color: var(--brand) !important;
            box-shadow: 0 0 0 3px var(--brand-light) !important;
        }

        /* Breadcrumb */
        .breadcrumb {
            display: flex;
            align-items: center;
            gap: 0.375rem;
            font-size: 0.78rem;
            color: var(--text-3);
            margin-bottom: 0.5rem;
        }

        .breadcrumb a { color: var(--text-3); transition: color 0.15s; }
        .breadcrumb a:hover { color: var(--brand); }

        /* Grids */
        .grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 1.25rem; }
        .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.25rem; }
        .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.25rem; }

        /* Empty State */
        .empty-state {
            text-align: center;
            padding: 3rem 2rem;
            color: var(--text-4);
        }
        .empty-state-icon { font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.5; }
        .empty-state-title { font-size: 1rem; font-weight: 600; color: var(--text-3); margin-bottom: 0.375rem; }

        /* Animations */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: fadeInUp 0.3s ease-out forwards; }

        /* Mobile Overlay */
        .sidebar-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 95;
            opacity: 0;
            transition: opacity 0.2s;
        }
        .sidebar-overlay.active { display: block; opacity: 1; }

        /* Responsive */
        @media (max-width: 1024px) {
            .grid-4 { grid-template-columns: repeat(2,1fr); }
            .grid-3 { grid-template-columns: repeat(2,1fr); }
        }

        @media (max-width: 768px) {
            .sidebar { transform: translateX(-100%); transition: transform 0.25s ease-in-out; }
            .sidebar.open { transform: translateX(0); }
            .main-wrapper { margin-left: 0; }
            .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
            .page-content { padding: 1.25rem 1rem; }
            .top-header { padding: 0 1rem; }
            .header-left { max-width: none; }
        }

        /* Print */
        @media print {
            .sidebar, .top-header { display: none; }
            .main-wrapper { margin-left: 0; }
        }
    </style>
</head>
<body>
    <!-- Sidebar Overlay (Mobile) -->
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>

    <!-- Sidebar -->
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-logo">
            <div class="logo-icon">MC</div>
            <div>
                <div class="logo-name">MataCeria</div>
                <div class="logo-tag">Panel Admin</div>
            </div>
        </div>

        <nav class="sidebar-nav">
            <div class="nav-group-label">Utama</div>
            <a href="{{ route('admin.dashboard') }}" class="nav-item {{ request()->routeIs('admin.dashboard') ? 'active' : '' }}">
                <i class="ti ti-layout-dashboard nav-icon"></i>
                <span>Dashboard</span>
            </a>

            <div class="nav-group-label" style="margin-top:0.5rem;">Konten & Data</div>
            <a href="{{ route('admin.articles.index') }}" class="nav-item {{ request()->routeIs('admin.articles.*') ? 'active' : '' }}">
                <i class="ti ti-file-text nav-icon"></i>
                <span>Artikel</span>
                <span class="nav-badge">Baru</span>
            </a>
            <a href="{{ route('admin.users.index') }}" class="nav-item {{ request()->routeIs('admin.users.*') ? 'active' : '' }}">
                <i class="ti ti-users nav-icon"></i>
                <span>Pengguna</span>
            </a>
            <a href="{{ route('admin.results.index') }}" class="nav-item {{ request()->routeIs('admin.results.*') ? 'active' : '' }}">
                <i class="ti ti-clipboard-check nav-icon"></i>
                <span>Hasil Periksa</span>
            </a>
            <a href="{{ route('admin.hospitals.index') }}" class="nav-item {{ request()->routeIs('admin.hospitals.*') ? 'active' : '' }}">
                <i class="ti ti-building-hospital nav-icon"></i>
                <span>RS Rujukan</span>
            </a>
            <a href="{{ route('admin.doctors.index') }}" class="nav-item {{ request()->routeIs('admin.doctors.*') ? 'active' : '' }}">
                <i class="ti ti-stethoscope nav-icon"></i>
                <span>List Dokter</span>
            </a>
            <a href="{{ route('admin.chats.index') }}" class="nav-item {{ request()->routeIs('admin.chats.*') ? 'active' : '' }}">
                <i class="ti ti-messages nav-icon"></i>
                <span>Chat AI</span>
            </a>

            <div class="nav-group-label" style="margin-top:0.5rem;">Pengaturan</div>
            <a href="{{ route('admin.guide') }}" class="nav-item {{ request()->routeIs('admin.guide') ? 'active' : '' }}">
                <i class="ti ti-book-2 nav-icon"></i>
                <span>Panduan</span>
            </a>
            <a href="{{ route('admin.api-docs') }}" class="nav-item {{ request()->routeIs('admin.api-docs') ? 'active' : '' }}">
                <i class="ti ti-api nav-icon"></i>
                <span>API Docs</span>
            </a>
            <a href="{{ route('admin.system') }}" class="nav-item {{ request()->routeIs('admin.system') ? 'active' : '' }}">
                <i class="ti ti-settings nav-icon"></i>
                <span>Sistem</span>
            </a>
            <a href="{{ route('admin.backup') }}" class="nav-item {{ request()->routeIs('admin.backup') ? 'active' : '' }}">
                <i class="ti ti-database nav-icon"></i>
                <span>Backup</span>
            </a>
        </nav>

        <div class="sidebar-footer">
            <div class="user-card">
                <div class="user-avatar">{{ strtoupper(substr(Auth::user()->name ?? 'A', 0, 1)) }}</div>
                <div>
                    <div class="user-name">{{ Auth::user()->name ?? 'Admin' }}</div>
                    <div class="user-role">Administrator</div>
                </div>
            </div>
            <form action="{{ route('admin.logout') }}" method="POST">
                @csrf
                <button type="submit" class="logout-btn">
                    <i class="ti ti-logout" style="font-size:1rem;"></i>
                    <span>Keluar</span>
                </button>
            </form>
        </div>
    </aside>

    <!-- Main Area -->
    <div class="main-wrapper">
        <!-- Header -->
        <header class="top-header">
            <div class="header-left">
                <!-- Mobile menu btn -->
                <button class="header-icon-btn" id="menuToggle" style="display:none;" onclick="toggleSidebar()">
                    <i class="ti ti-menu-2" style="font-size:1.1rem;"></i>
                </button>
                <div class="search-wrap">
                    <i class="ti ti-search search-icon" style="font-size:0.9rem;"></i>
                    <input type="text" placeholder="Cari apa saja..." id="globalSearch">
                </div>
            </div>

            <div class="header-right">
                <button class="header-icon-btn" title="Notifikasi">
                    <i class="ti ti-bell" style="font-size:1.05rem;"></i>
                    <span class="notif-dot"></span>
                </button>
                <button class="header-icon-btn" title="Bantuan">
                    <i class="ti ti-help-circle" style="font-size:1.05rem;"></i>
                </button>
                <div class="divider-v"></div>
                <div style="text-align:right; padding: 0 0.25rem;">
                    <div style="font-size:0.845rem; font-weight:600; color:var(--text);">{{ Auth::user()->name ?? 'Admin' }}</div>
                    <div style="font-size:0.68rem; color:var(--text-3);">Administrator</div>
                </div>
            </div>
        </header>

        <!-- Page Content -->
        <main class="page-content">
            @yield('content')
        </main>
    </div>

    <script>
        function toggleSidebar() {
            document.getElementById('sidebar').classList.toggle('open');
            document.getElementById('sidebarOverlay').classList.toggle('active');
        }
        function closeSidebar() {
            document.getElementById('sidebar').classList.remove('open');
            document.getElementById('sidebarOverlay').classList.remove('active');
        }

        const menuToggle = document.getElementById('menuToggle');
        function checkMobile() {
            if (menuToggle) {
                menuToggle.style.display = window.innerWidth <= 768 ? 'flex' : 'none';
                if (window.innerWidth > 768) closeSidebar();
            }
        }
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Global Search Engine (Real-time Table Filtering)
        const globalSearch = document.getElementById('globalSearch');
        if (globalSearch) {
            globalSearch.addEventListener('input', function(e) {
                const term = e.target.value.toLowerCase();
                // Find all table rows in the current page
                const rows = document.querySelectorAll('tbody tr');
                
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(term) ? '' : 'none';
                });
            });
        }
    </script>
</body>
</html>