@extends('layouts.admin')

@section('title', 'Interactive Dashboard Overview')

@section('content')
<!-- React Mounting container with data serialized into attributes -->
<div id="admin-dashboard-root"
     data-stats="{{ json_encode($stats) }}"
     data-recent-results="{{ json_encode($recent_results) }}"
     data-recent-chats="{{ json_encode($recent_chats) }}"
     data-top-users="{{ json_encode($topUsersCheck) }}"
     data-chart-data="{{ json_encode($chartData) }}"
     data-routes="{{ json_encode([
         'resultsIndex' => route('admin.results.index'),
         'chatsIndex' => route('admin.chats.index'),
         'chatsShow' => route('admin.chats.show', ':id'),
         'clearCache' => route('admin.system.clear-cache'),
     ]) }}"
>
    <!-- Fallback loader -->
    <div style="min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: var(--text-muted);">
        <div style="width: 38px; height: 38px; border-radius: 50%; border: 3px solid var(--border-medium); border-top-color: var(--brand-500); animation: spin 1s linear infinite;"></div>
        <p style="font-size: 0.875rem; font-weight: 500;">Memuat Dashboard...</p>
    </div>
</div>

<style>
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>

<!-- Load Vite bundle for admin app -->
@vite(['resources/js/admin.jsx'])
@endsection
