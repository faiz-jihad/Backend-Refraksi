@extends('layouts.admin')

@section('title', 'Hasil Pemeriksaan')

@section('content')
<div class="page-title-box">
    <div class="breadcrumb">Admin / Pemeriksaan</div>
    <h2>Hasil Pemeriksaan AI</h2>
</div>

<div class="table-card">
    <div class="table-header">
        <h3 style="font-size: 1.125rem; font-weight: 700;">Riwayat Pemeriksaan</h3>
        <button class="btn btn-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Ekspor CSV
        </button>
    </div>
    <div style="overflow-x: auto;">
        <table class="custom-table">
            <thead>
                <tr>
                    <th>Pengguna</th>
                    <th>Mata Kanan (S)</th>
                    <th>Mata Kiri (S)</th>
                    <th>Akurasi Visual</th>
                    <th>Tanggal</th>
                    <th style="text-align: right;">Hasil AI</th>
                </tr>
            </thead>
            <tbody>
                @foreach($results as $result)
                <tr>
                    <td>
                        <div style="font-weight: 700;">{{ $result->user->name ?? 'Guest' }}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">ID User: #{{ $result->user_id }}</div>
                    </td>
                    <td><span style="font-family: 'Montserrat', sans-serif; font-weight: 600;">{{ number_format($result->right_eye_sphere, 2) }}</span></td>
                    <td><span style="font-family: 'Montserrat', sans-serif; font-weight: 600;">{{ number_format($result->left_eye_sphere, 2) }}</span></td>
                    <td>
                        <div style="width: 100px; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; margin-bottom: 4px;">
                            <div style="width: {{ min(100, floatval($result->visual_acuity) * 10) }}%; height: 100%; background: var(--primary);"></div>
                        </div>
                        <div style="font-size: 0.75rem; font-weight: 600;">{{ $result->visual_acuity }}</div>
                    </td>
                    <td>{{ $result->created_at->format('d M Y, H:i') }}</td>
                    <td style="text-align: right;">
                        <a href="{{ route('admin.results.show', $result->id) }}" class="btn btn-white" style="padding: 0.4rem 0.8rem;">Lihat Detail</a>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
@endsection

