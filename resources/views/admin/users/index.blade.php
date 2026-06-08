@extends('layouts.admin')

@section('title', 'Manajemen Pengguna')

@section('content')
<div class="animate-in">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
        <a href="{{ route('admin.dashboard') }}">Dashboard</a>
        <span class="separator"><i class="ti ti-chevron-right"></i></span>
        <span>Pengguna</span>
    </nav>

    <!-- Page Header -->
    <div class="page-title-section" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
        <div>
            <h1 class="page-title">Manajemen Pengguna</h1>
            <p class="page-description">Kelola data profil, riwayat medis, dan akses akun seluruh pengguna MataCeria.</p>
        </div>
        <a href="{{ route('admin.users.create') }}" class="btn btn-primary">
            <i class="ti ti-user-plus"></i>
            Tambah Pengguna Baru
        </a>
    </div>

    <!-- Main Table Card -->
    <div class="card">
        <div class="card-header">
            <h3 class="card-title">Daftar Pengguna Terdaftar</h3>
            <div class="header-right">
                <a href="{{ route('admin.users.export') }}" class="btn btn-secondary">
                    <i class="ti ti-download"></i>
                    Export Data
                </a>
            </div>
        </div>

        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Identitas</th>
                        <th>Kontak</th>
                        <th>Demografi</th>
                        <th>Pendidikan & Kerja</th>
                        <th>Status Medis</th>
                        <th>Akses</th>
                        <th style="text-align: right;">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($users as $user)
                    <tr>
                        <td>
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <div class="user-mini-avatar" style="width: 40px; height: 40px; border-radius: var(--radius-md);">
                                    {{ strtoupper(substr($user->name, 0, 1)) }}
                                </div>
                                <div>
                                    <div style="font-weight: 600; color: var(--text-primary);">{{ $user->name }}</div>
                                    <div style="font-size: 0.75rem; color: var(--text-muted);">ID: #{{ str_pad((string)$user->id, 4, '0', STR_PAD_LEFT) }}</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div style="font-weight: 500;">{{ $user->email }}</div>
                            <div style="font-size: 0.75rem; color: var(--text-secondary);">{{ $user->phone ?? '-' }}</div>
                        </td>
                        <td>
                            <div style="font-size: 0.875rem;">{{ $user->kelamin ?? '-' }}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">{{ $user->umur ?? '?' }} Tahun</div>
                        </td>
                        <td>
                            <div style="font-size: 0.875rem; font-weight: 500;">{{ $user->status_pekerjaan ?? '-' }}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">{{ $user->jenjang_pendidikan ?? '-' }}</div>
                        </td>
                        <td>
                            <div style="font-size: 0.875rem; font-weight: 600; color: var(--brand-600);">{{ $user->vision_type ?? 'Normal' }}</div>
                            <div style="font-size: 0.75rem; color: var(--danger-500); max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="Alergi: {{ $user->allergies ?? 'Tidak ada' }}">
                                Alergi: {{ $user->allergies ?? 'Tidak ada' }}
                            </div>
                        </td>
                        <td>
                            <span class="badge {{ $user->role === 'admin' ? 'badge-info' : 'badge-success' }}">
                                <i class="ti ti-shield-check" style="font-size: 10px; margin-right: 4px;"></i>
                                {{ ucfirst($user->role) }}
                            </span>
                        </td>
                        <td style="text-align: right;">
                            <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                                <form action="{{ route('admin.users.toggle-role', $user->id) }}" method="POST" style="display: inline;">
                                    @csrf
                                    <button type="submit" class="header-icon-btn" title="Ganti Role" style="width: 32px; height: 32px;">
                                        <i class="ti ti-arrows-exchange"></i>
                                    </button>
                                </form>
                                <a href="{{ route('admin.users.edit', $user->id) }}" class="header-icon-btn" title="Edit Profil" style="width: 32px; height: 32px; color: var(--brand-500);">
                                    <i class="ti ti-edit"></i>
                                </a>
                                <form action="{{ route('admin.users.destroy', $user->id) }}" method="POST" onsubmit="return confirm('Apakah Anda yakin ingin menghapus user ini?')" style="display: inline;">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="header-icon-btn" title="Hapus User" style="width: 32px; height: 32px; color: var(--danger-400);">
                                        <i class="ti ti-trash"></i>
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="7">
                            <div class="empty-state">
                                <i class="ti ti-users-off empty-state-icon"></i>
                                <h4 class="empty-state-title">Belum ada pengguna</h4>
                                <p>Daftar pengguna terdaftar akan muncul di sini.</p>
                            </div>
                        </td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection

