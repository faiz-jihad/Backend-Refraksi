<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title') | MataCeria</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    
    <!-- Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
    
    <!-- Charts -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    
    <!-- Load Tailwind CSS via Vite -->
    @vite(['resources/css/app.css'])
    
    <script>
        // Apply dark mode immediately to prevent flash
        if (localStorage.getItem('admin-dark-mode') === 'true') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    </script>

    <style>
        /* =============================================
           ROOT VARIABLES - NEUMORPHISM STYLE
           Soft, extruded and pressed elements
           ============================================= */
        :root {
            /* Neumorphic surface base color (#E7E5E4) */
            --bg-canvas: #E7E5E4;
            --bg-surface: #E7E5E4;
            --bg-surface-hover: #dfdcdb;
            --bg-subtle: #d7d4d3;
            
            /* Text - Slate color (#1E2938) */
            --text-primary: #1E2938;
            --text-secondary: #334155;
            --text-muted: #64748b;
            --text-placeholder: #94a3b8;
            --text-inverse: #fefdfb;
            
            /* Borders are invisible in neumorphism - depth is represented by shadows */
            --border-light: transparent;
            --border-medium: transparent;
            
            /* Brand & Accents */
            --brand-50: #e6f2f2;
            --brand-100: #ccdfdf;
            --brand-200: #99bfbf;
            --brand-400: #338080;
            --brand-500: #006666;
            --brand-600: #004d4d;
            --brand-700: #003333;
            
            /* Accent */
            --accent-50: #fffbf5;
            --accent-100: #fff2e0;
            --accent-400: #ffc266;
            --accent-500: #fe9900;
            --accent-600: #cc7a00;
            
            /* Semantic */
            --danger-50: #fff2f5;
            --danger-100: #ffe6eb;
            --danger-400: #ff5c82;
            --danger-500: #ff2157;
            
            --success-50: #f0fbf4;
            --success-400: #00cc4b;
            --success-500: #00A63D;
            
            --info-50: #f0f7ff;
            --info-400: #3b82f6;
            
            /* Neumorphism shadows - light source at top-left (#ffffff), shadow at bottom-right (#b5b3b2) */
            --nm-shadow-out-sm: 2px 2px 5px #b5b3b2, -2px -2px 5px #ffffff;
            --nm-shadow-out-md: 5px 5px 10px #b5b3b2, -5px -5px 10px #ffffff;
            --nm-shadow-out-lg: 10px 10px 20px #b5b3b2, -10px -10px 20px #ffffff;
            --nm-shadow-out-xl: 16px 16px 32px #b5b3b2, -16px -16px 32px #ffffff;
            
            --nm-shadow-in-sm: inset 2px 2px 5px #b5b3b2, inset -2px -2px 5px #ffffff;
            --nm-shadow-in-md: inset 5px 5px 10px #b5b3b2, inset -5px -5px 10px #ffffff;
            --nm-shadow-in-lg: inset 10px 10px 20px #b5b3b2, inset -10px -10px 20px #ffffff;
            
            /* Map shadows to existing shadow variables */
            --shadow-sm: var(--nm-shadow-out-sm);
            --shadow-md: var(--nm-shadow-out-md);
            --shadow-lg: var(--nm-shadow-out-lg);
            --shadow-xl: var(--nm-shadow-out-xl);
            
            /* Radius - rounded sm: 4px, rounded md: 8px, rounded lg: 12px */
            --radius-sm: 4px;
            --radius-md: 8px;
            --radius-lg: 12px;
            --radius-xl: 16px;

            /* Timing / Easing (DESIGN.md: compact density mode) */
            --duration-fast: 120ms;
            --duration-normal: 200ms;
            --duration-slow: 300ms;
            --ease-out: cubic-bezier(0.25, 0, 0, 1);
            --ease-in-out: cubic-bezier(0.45, 0, 0.55, 1);
            
            /* Layout */
            --sidebar-width: 260px;
            --header-height: 64px;
        }

        /* =============================================
           DARK THEME OVERRIDES
           ============================================= */
        [data-theme="dark"] {
            --bg-canvas: #181E29;
            --bg-surface: #181E29;
            --bg-surface-hover: #131821;
            --bg-subtle: #0f131a;
            
            --text-primary: #f1f5f9;
            --text-secondary: #94a3b8;
            --text-muted: #64748b;
            --text-placeholder: #475569;
            --text-inverse: #0f172a;
            
            --border-light: rgba(255, 255, 255, 0.05);
            --border-medium: rgba(255, 255, 255, 0.1);
            
            --brand-50: rgba(32, 178, 170, 0.1);
            --brand-100: rgba(32, 178, 170, 0.2);
            --brand-200: rgba(32, 178, 170, 0.3);
            --brand-400: #1e9992;
            --brand-500: #20b2aa;
            --brand-600: #1a918a;
            --brand-700: #15736d;
            
            --nm-shadow-out-sm: 2px 2px 5px #0a0d13, -2px -2px 5px #262f41;
            --nm-shadow-out-md: 5px 5px 10px #0a0d13, -5px -5px 10px #262f41;
            --nm-shadow-out-lg: 10px 10px 20px #0a0d13, -10px -10px 20px #262f41;
            --nm-shadow-out-xl: 16px 16px 32px #0a0d13, -16px -16px 32px #262f41;
            
            --nm-shadow-in-sm: inset 2px 2px 5px #0a0d13, inset -2px -2px 5px #262f41;
            --nm-shadow-in-md: inset 5px 5px 10px #0a0d13, inset -5px -5px 10px #262f41;
            --nm-shadow-in-lg: inset 10px 10px 20px #0a0d13, inset -10px -10px 20px #262f41;
        }

        /* =============================================
           RESET & BASE
           ============================================= */
        *, *::before, *::after {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html {
            font-size: 16px;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        body {
            font-family: 'Montserrat', sans-serif;
            background: var(--bg-canvas);
            color: var(--text-primary);
            line-height: 1.6;
            display: flex;
            min-height: 100vh;
            letter-spacing: -0.01em;
        }

        h1, h2, h3, h4, h5, h6, .logo-text, .page-title, .card-title {
            font-family: 'Montserrat', sans-serif;
        }

        .font-mono-label {
            font-family: 'Montserrat', sans-serif;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        /* =============================================
           SIDEBAR
           Neumorphic Sidebar
           ============================================= */
        .sidebar {
            width: var(--sidebar-width);
            background: var(--bg-surface);
            border-right: none;
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 100;
            box-shadow: 4px 0 10px #b5b3b2, -4px 0 10px #ffffff;
            overflow-y: auto;
            overflow-x: hidden;
        }

        /* Sidebar Header */
        .sidebar-header {
            padding: 1.75rem 1.5rem 1.25rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            border-bottom: 2px solid #dbd8d7;
        }

        .logo-mark {
            width: 38px;
            height: 38px;
            background: var(--brand-500);
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 1.125rem;
            flex-shrink: 0;
            box-shadow: var(--nm-shadow-out-sm);
        }

        .logo-text {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--text-primary);
            letter-spacing: -0.02em;
        }

        .logo-subtle {
            font-size: 0.6875rem;
            color: var(--text-muted);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-top: -2px;
        }

        /* Navigation */
        .sidebar-nav {
            flex: 1;
            padding: 1.25rem 0.75rem;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .nav-section {
            margin-bottom: 0.5rem;
        }

        .nav-section-label {
            font-size: 0.6875rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--text-muted);
            padding: 0.75rem 0.75rem 0.5rem;
            user-select: none;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.625rem 0.75rem;
            border-radius: var(--radius-md);
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all var(--duration-fast) var(--ease-out);
            cursor: pointer;
            position: relative;
            border: none;
            background: transparent;
            width: 100%;
            text-align: left;
            box-shadow: none;
        }

        .nav-item:hover {
            color: var(--text-primary);
            box-shadow: var(--nm-shadow-out-sm);
            background: var(--bg-surface);
        }

        .nav-item.active {
            background: var(--bg-surface);
            color: var(--brand-600);
            font-weight: 600;
            box-shadow: var(--nm-shadow-in-sm);
        }

        .nav-item.active::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 24px;
            background: var(--brand-500);
            border-radius: 0 4px 4px 0;
            display: block;
        }

        .nav-item .nav-icon {
            width: 20px;
            height: 20px;
            flex-shrink: 0;
            opacity: 0.7;
            transition: opacity var(--duration-fast) var(--ease-out);
        }

        .nav-item:hover .nav-icon,
        .nav-item.active .nav-icon {
            opacity: 1;
        }

        .nav-badge {
            margin-left: auto;
            font-size: 0.6875rem;
            font-weight: 600;
            padding: 0.125rem 0.5rem;
            border-radius: 100px;
            background: var(--brand-500);
            color: white;
            box-shadow: var(--nm-shadow-out-sm);
        }

        /* Sidebar Footer */
        .sidebar-footer {
            padding: 1rem 1.25rem;
            border-top: 2px solid #dbd8d7;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .user-mini {
            display: flex;
            align-items: center;
            gap: 0.625rem;
            padding: 0.5rem;
            border-radius: var(--radius-md);
            text-decoration: none;
            transition: all var(--duration-fast) var(--ease-out);
        }

        .user-mini:hover {
            box-shadow: var(--nm-shadow-in-sm);
        }

        .user-mini-avatar {
            width: 32px;
            height: 32px;
            border-radius: var(--radius-sm);
            background: var(--brand-500);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 0.8125rem;
            flex-shrink: 0;
            box-shadow: var(--nm-shadow-out-sm);
        }

        .user-mini-info {
            flex: 1;
            min-width: 0;
        }

        .user-mini-name {
            font-size: 0.8125rem;
            font-weight: 600;
            color: var(--text-primary);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .user-mini-role {
            font-size: 0.6875rem;
            color: var(--text-muted);
        }

        .logout-btn {
            display: flex;
            align-items: center;
            gap: 0.625rem;
            width: 100%;
            padding: 0.625rem 0.75rem;
            border-radius: var(--radius-md);
            border: none;
            background: var(--bg-surface);
            color: var(--danger-500);
            font-family: inherit;
            font-size: 0.8125rem;
            font-weight: 600;
            cursor: pointer;
            box-shadow: var(--nm-shadow-out-sm);
            transition: all var(--duration-fast) var(--ease-out);
        }

        .logout-btn:hover {
            background: var(--danger-50);
            box-shadow: 1px 1px 3px #b5b3b2, -1px -1px 3px #ffffff;
            color: var(--danger-500);
        }

        .logout-btn:active {
            box-shadow: var(--nm-shadow-in-sm);
        }

        /* =============================================
           MAIN AREA
           ============================================= */
        .main-wrapper {
            margin-left: var(--sidebar-width);
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            min-width: 0;
        }

        /* Top Header */
        .top-header {
            height: var(--header-height);
            background: var(--bg-surface);
            border-bottom: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 1.75rem;
            position: sticky;
            top: 0;
            z-index: 50;
            gap: 1rem;
            box-shadow: 0 4px 8px #b5b3b2;
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
            padding: 0.5rem 0.875rem 0.5rem 2.5rem;
            border: none;
            border-radius: 100px;
            font-family: inherit;
            font-size: 0.875rem;
            color: var(--text-primary);
            background: var(--bg-canvas);
            box-shadow: var(--nm-shadow-in-sm);
            transition: all var(--duration-fast) var(--ease-out);
            outline: none;
        }

        .search-wrap input::placeholder {
            color: var(--text-placeholder);
        }

        .search-wrap input:focus {
            box-shadow: inset 3px 3px 6px #b5b3b2, inset -3px -3px 6px #ffffff, 0 0 0 2px var(--brand-200);
            background: var(--bg-surface);
        }

        .search-wrap .search-icon {
            position: absolute;
            left: 0.875rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
            pointer-events: none;
        }

        .header-right {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .header-icon-btn {
            width: 38px;
            height: 38px;
            border-radius: var(--radius-md);
            border: none;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--text-secondary);
            transition: all var(--duration-fast) var(--ease-out);
            position: relative;
            box-shadow: var(--nm-shadow-out-sm);
        }

        .header-icon-btn:hover {
            background: var(--bg-surface-hover);
            color: var(--text-primary);
        }

        .header-icon-btn:active {
            box-shadow: var(--nm-shadow-in-sm);
        }

        .notif-dot {
            position: absolute;
            top: 6px;
            right: 6px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--accent-500);
            border: 2px solid var(--bg-surface);
        }

        .divider-v {
            width: 1px;
            height: 24px;
            background: #dbd8d7;
            margin: 0 0.25rem;
        }

        /* Page Content */
        .page-content {
            flex: 1;
            padding: 1.75rem;
            min-width: 0;
        }

        /* =============================================
           COMMON COMPONENTS
           ============================================= */
        
        /* Cards */
        .card {
            background: var(--bg-surface);
            border: 1px solid rgba(0, 0, 0, 0.05);
            border-radius: var(--radius-lg);
            padding: 1.5rem;
            box-shadow: var(--shadow-md);
            transition: all var(--duration-normal) var(--ease-out);
        }

        .card:hover {
            border-color: rgba(0, 0, 0, 0.08);
            box-shadow: var(--shadow-lg);
        }

        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 1.25rem;
        }

        .card-title {
            font-size: 1rem;
            font-weight: 700;
            color: var(--text-primary);
            letter-spacing: -0.01em;
        }

        .card-subtitle {
            font-size: 0.8125rem;
            color: var(--text-muted);
            margin-top: 0.125rem;
        }

        /* Stats Card */
        .stat-card {
            background: var(--bg-surface);
            border: none;
            border-radius: var(--radius-lg);
            padding: 1.25rem 1.5rem;
            box-shadow: var(--shadow-sm);
            transition: all var(--duration-normal) var(--ease-out);
            cursor: default;
        }

        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }

        .stat-card-icon {
            width: 44px;
            height: 44px;
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 0.875rem;
            font-size: 1.25rem;
            box-shadow: var(--nm-shadow-in-sm);
        }

        .stat-card-value {
            font-size: 1.75rem;
            font-weight: 700;
            color: var(--text-primary);
            letter-spacing: -0.02em;
            line-height: 1.2;
        }

        .stat-card-label {
            font-size: 0.8125rem;
            color: var(--text-muted);
            margin-top: 0.25rem;
        }

        .stat-card-trend {
            font-size: 0.75rem;
            font-weight: 600;
            margin-top: 0.5rem;
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
        }

        /* Buttons */
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.625rem 1.25rem;
            border-radius: var(--radius-md);
            font-family: inherit;
            font-size: 0.875rem;
            font-weight: 600;
            cursor: pointer;
            transition: all var(--duration-fast) var(--ease-out);
            text-decoration: none;
            border: none;
            white-space: nowrap;
        }

        .btn-primary {
            background: var(--brand-500);
            color: white;
            box-shadow: var(--nm-shadow-out-sm);
        }

        .btn-primary:hover {
            background: var(--brand-600);
            box-shadow: 1px 1px 3px #b5b3b2, -1px -1px 3px #ffffff;
            transform: translateY(1px);
        }

        .btn-primary:active {
            box-shadow: var(--nm-shadow-in-sm);
            transform: translateY(2px);
        }

        .btn-secondary {
            background: var(--bg-surface);
            color: var(--text-primary);
            border: 1px solid #d0cdcc;
            box-shadow: var(--nm-shadow-out-sm);
        }

        .btn-secondary:hover {
            background: var(--bg-surface-hover);
            border-color: #b5b3b2;
            box-shadow: 1px 1px 3px #b5b3b2, -1px -1px 3px #ffffff;
        }

        .btn-secondary:active {
            box-shadow: var(--nm-shadow-in-sm);
        }

        .btn-ghost {
            background: transparent;
            color: var(--text-secondary);
        }

        .btn-ghost:hover {
            box-shadow: var(--nm-shadow-out-sm);
            color: var(--text-primary);
        }

        .btn-ghost:active {
            box-shadow: var(--nm-shadow-in-sm);
        }

        .btn-danger {
            background: var(--danger-50);
            color: var(--danger-500);
            box-shadow: var(--nm-shadow-out-sm);
        }

        .btn-danger:hover {
            background: var(--danger-100);
            box-shadow: 1px 1px 3px #b5b3b2, -1px -1px 3px #ffffff;
        }

        .btn-danger:active {
            box-shadow: var(--nm-shadow-in-sm);
        }

        /* Tables */
        .table-wrap {
            overflow-x: auto;
            border: none;
            border-radius: var(--radius-lg);
            background: var(--bg-surface);
            box-shadow: var(--nm-shadow-in-sm);
            padding: 0.5rem;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: transparent;
        }

        thead th {
            padding: 1rem 1.25rem;
            text-align: left;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--text-muted);
            background: transparent;
            border-bottom: 2px solid #dbd8d7;
            white-space: nowrap;
        }

        tbody td {
            padding: 1rem 1.25rem;
            font-size: 0.875rem;
            color: var(--text-primary);
            border-bottom: 1px solid #dbd8d7;
        }

        tbody tr:last-child td {
            border-bottom: none;
        }

        tbody tr:hover {
            background: var(--bg-surface-hover);
        }

        /* Badge / Tag */
        .badge {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            border-radius: 100px;
            font-size: 0.75rem;
            font-weight: 600;
            letter-spacing: 0.01em;
            box-shadow: var(--nm-shadow-out-sm);
        }

        .badge-success {
            background: var(--success-50);
            color: var(--success-500);
        }

        .badge-info {
            background: var(--info-50);
            color: var(--info-400);
        }

        .badge-warning {
            background: var(--accent-50);
            color: var(--accent-600);
        }

        /* Page Title */
        .page-title-section {
            margin-bottom: 1.75rem;
        }

        .page-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary);
            letter-spacing: -0.02em;
        }

        .page-description {
            font-size: 0.875rem;
            color: var(--text-muted);
            margin-top: 0.25rem;
        }

        /* Global Inputs - Neumorphic */
        .form-control,
        input[type="text"],
        input[type="email"],
        input[type="password"],
        input[type="number"],
        input[type="tel"],
        input[type="url"],
        textarea,
        select {
            width: 100% !important;
            padding: 0.625rem 1rem !important;
            font-family: 'Montserrat', sans-serif !important;
            font-size: 0.875rem !important;
            color: var(--text-primary) !important;
            background-color: var(--bg-canvas) !important;
            border: 1px solid #d0cdcc !important;
            border-radius: var(--radius-md) !important;
            box-shadow: var(--nm-shadow-in-sm) !important;
            outline: none !important;
            transition: border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out) !important;
        }

        .form-control:focus,
        input[type="text"]:focus,
        input[type="email"]:focus,
        input[type="password"]:focus,
        input[type="number"]:focus,
        input[type="tel"]:focus,
        input[type="url"]:focus,
        textarea:focus,
        select:focus {
            border-color: var(--brand-500) !important;
            box-shadow: inset 2px 2px 4px #b5b3b2, inset -2px -2px 4px #ffffff, 0 0 0 2px var(--brand-200) !important;
        }

        .breadcrumb {
            display: flex;
            align-items: center;
            gap: 0.375rem;
            font-size: 0.8125rem;
            color: var(--text-muted);
            margin-bottom: 0.5rem;
        }

        .breadcrumb a {
            color: var(--text-secondary);
            text-decoration: none;
        }

        .breadcrumb a:hover {
            color: var(--brand-500);
        }

        .breadcrumb .separator {
            color: var(--text-placeholder);
        }

        /* Grid */
        .grid-2 {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.25rem;
        }

        .grid-3 {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.25rem;
        }

        .grid-4 {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1.25rem;
        }

        /* Empty State */
        .empty-state {
            text-align: center;
            padding: 3rem 2rem;
            color: var(--text-muted);
        }

        .empty-state-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.4;
        }

        .empty-state-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--text-secondary);
            margin-bottom: 0.5rem;
        }

        /* Animation */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(12px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .animate-in {
            animation: fadeInUp var(--duration-slow) var(--ease-out) forwards;
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .grid-4 { grid-template-columns: repeat(2, 1fr); }
            .grid-3 { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
                transition: transform var(--duration-normal) var(--ease-in-out);
            }
            
            .sidebar.open {
                transform: translateX(0);
            }
            
            .main-wrapper {
                margin-left: 0;
            }
            
            .grid-2, .grid-3, .grid-4 {
                grid-template-columns: 1fr;
            }
            
            .page-content {
                padding: 1rem;
            }
            
            .top-header {
                padding: 0 1rem;
            }
            
            .header-left {
                max-width: none;
            }
        }

        /* Scrollbar */
        .sidebar::-webkit-scrollbar {
            width: 4px;
        }

        .sidebar::-webkit-scrollbar-track {
            background: transparent;
        }

        .sidebar::-webkit-scrollbar-thumb {
            background: #b5b3b2;
            border-radius: 4px;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
            background: #006666;
        }

        /* Print */
        @media print {
            .sidebar, .top-header {
                display: none;
            }
            .main-wrapper {
                margin-left: 0;
            }
        }

        /* Mobile Overlay */
        .sidebar-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(30, 41, 56, 0.4);
            backdrop-filter: blur(4px);
            z-index: 95;
            opacity: 0;
            transition: opacity var(--duration-normal) var(--ease-out);
        }
        .sidebar-overlay.active {
            display: block;
            opacity: 1;
        }
    </style>
</head>
<body>
    <!-- ============ SIDEBAR OVERLAY ============ -->
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="document.getElementById('sidebar').classList.remove('open'); this.classList.remove('active');"></div>

    <!-- ============ SIDEBAR ============ -->
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
            <div class="logo-mark">MC</div>
            <div>
                <div class="logo-text">MataCeria</div>
                <div class="logo-subtle">Panel Admin</div>
            </div>
        </div>

        <nav class="sidebar-nav">
            <!-- Section: Main -->
            <div class="nav-section">
                <div class="nav-section-label">Utama</div>
                <a href="{{ route('admin.dashboard') }}" class="nav-item {{ request()->routeIs('admin.dashboard') ? 'active' : '' }}">
                    <i class="ti ti-layout-dashboard nav-icon"></i>
                    <span>Dashboard</span>
                </a>
            </div>

            <!-- Section: Content -->
            <div class="nav-section">
                <div class="nav-section-label">Konten & Data</div>
                
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
            </div>

            <!-- Section: Settings -->
            <div class="nav-section">
                <div class="nav-section-label">Pengaturan</div>
                
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
            </div>
        </nav>

        <!-- Sidebar Footer -->
        <div class="sidebar-footer">
            <div class="user-mini">
                <div class="user-mini-avatar">{{ strtoupper(substr(Auth::user()->name ?? 'A', 0, 1)) }}</div>
                <div class="user-mini-info">
                    <div class="user-mini-name">{{ Auth::user()->name ?? 'Admin' }}</div>
                    <div class="user-mini-role">Administrator</div>
                </div>
            </div>
            
            <form action="{{ route('admin.logout') }}" method="POST">
                @csrf
                <button type="submit" class="logout-btn">
                    <i class="ti ti-logout" style="font-size: 1.125rem;"></i>
                    <span>Keluar</span>
                </button>
            </form>
        </div>
    </aside>

    <!-- ============ MAIN AREA ============ -->
    <div class="main-wrapper">
        <!-- Top Header -->
        <header class="top-header">
            <div class="header-left">
                <!-- Mobile menu toggle -->
                <button class="header-icon-btn" id="menuToggle" style="display: none;" onclick="document.getElementById('sidebar').classList.toggle('open'); document.getElementById('sidebarOverlay').classList.toggle('active')">
                    <i class="ti ti-menu-2"></i>
                </button>
                
                <div class="search-wrap">
                    <i class="ti ti-search search-icon"></i>
                    <input type="text" placeholder="Cari apa saja..." id="globalSearch">
                </div>
            </div>

            <div class="header-right">
                <button class="header-icon-btn" title="Notifikasi">
                    <i class="ti ti-bell"></i>
                    <span class="notif-dot"></span>
                </button>
                
                <button class="header-icon-btn" title="Bantuan">
                    <i class="ti ti-help-circle"></i>
                </button>
                
                <div class="divider-v"></div>
                
                <div style="text-align: right; padding: 0 0.25rem;">
                    <div style="font-size: 0.8125rem; font-weight: 600; color: var(--text-primary);">{{ Auth::user()->name ?? 'Admin' }}</div>
                    <div style="font-size: 0.6875rem; color: var(--text-muted);">Administrator</div>
                </div>
            </div>
        </header>

        <!-- Page Content -->
        <main class="page-content">
            @yield('content')
        </main>
    </div>

    <!-- Mobile Menu Toggle Display -->
    <script>
        // Show mobile menu button on small screens
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle && window.innerWidth <= 768) {
            menuToggle.style.display = 'flex';
        }
        
        window.addEventListener('resize', () => {
            if (menuToggle) {
                const isMobile = window.innerWidth <= 768;
                menuToggle.style.display = isMobile ? 'flex' : 'none';
                if (!isMobile) {
                    document.getElementById('sidebar').classList.remove('open');
                    document.getElementById('sidebarOverlay').classList.remove('active');
                }
            }
        });
    </script>
</body>
</html>