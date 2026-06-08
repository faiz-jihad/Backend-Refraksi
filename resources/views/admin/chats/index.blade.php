@extends('layouts.admin')

@section('title', 'Riwayat Chat AI')

@section('content')
<div class="page-title-box">
    <div class="breadcrumb">Admin / Percakapan</div>
    <h2>Riwayat Konsultasi AI</h2>
</div>

<div class="table-card">
    <div class="table-header">
        <h3 style="font-size: 1.125rem; font-weight: 700;">Daftar Sesi Chat</h3>
    </div>
    <div style="overflow-x: auto;">
        <table class="custom-table">
            <thead>
                <tr>
                    <th>Pasien</th>
                    <th>ID Sesi</th>
                    <th>Terakhir Aktif</th>
                    <th style="text-align: right;">Aksi</th>
                </tr>
            </thead>
            <tbody>
                @forelse($sessions as $session)
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div class="avatar" style="width: 32px; height: 32px; font-size: 12px;">{{ substr($session->user->name ?? 'G', 0, 1) }}</div>
                            <div style="font-weight: 700;">{{ $session->user->name ?? 'Guest' }}</div>
                        </div>
                    </td>
                    <td><code style="background: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.75rem;">{{ $session->session_id }}</code></td>
                    <td>{{ $session->updated_at->diffForHumans() }}</td>
                    <td style="text-align: right;">
                        <a href="{{ route('admin.chats.show', $session->id) }}" class="btn btn-white" style="padding: 0.4rem 0.8rem;">Buka Percakapan</a>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="4" style="text-align: center; padding: 3rem; color: var(--text-muted);">Belum ada riwayat chat.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
