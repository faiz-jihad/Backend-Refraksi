@extends('layouts.admin')

@section('title', 'Database Backup')

@section('content')
<div class="animate-in">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
        <span>Admin</span>
        <span class="separator"><i class="ti ti-chevron-right"></i></span>
        <span>Pengaturan</span>
        <span class="separator"><i class="ti ti-chevron-right"></i></span>
        <span>Backup Database</span>
    </nav>

    <!-- Page Header -->
    <div class="page-title-section" style="margin-bottom: 2rem;">
        <h1 class="page-title">Backup & Recovery</h1>
        <p class="page-description">Kelola pencadangan data sistem Anda secara berkala. Simpan file cadangan (JSON) di tempat yang aman.</p>
    </div>

    <div class="grid-2">
        <!-- Backup Action Card -->
        <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <div class="card-header" style="margin-bottom: 0.5rem;">
                    <div>
                        <h2 class="card-title">Ekspor Database Keseluruhan</h2>
                        <p class="card-subtitle">Buat cadangan dari seluruh tabel aktif di database.</p>
                    </div>
                </div>
                <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.6;">
                    Fitur ini akan menyusun ulang seluruh baris data (termasuk Artikel, Pengguna, Riwayat Refraksi, dan Chat Sesi AI) ke dalam sebuah format file <strong>.json</strong>. Gunakan format ini untuk keperluan migrasi manual atau pencadangan darurat.
                </p>
                
                <div style="background: var(--info-50); border: 1px solid var(--info-400); border-radius: var(--radius-sm); padding: 1rem; display: flex; align-items: flex-start; gap: 0.75rem;">
                    <i class="ti ti-info-circle" style="color: var(--info-400); font-size: 1.25rem; margin-top: 2px;"></i>
                    <div style="font-size: 0.8125rem; color: var(--text-primary);">
                        <strong>Saran Keamanan:</strong> Lakukan pencadangan minimal satu kali dalam seminggu untuk menghindari kehilangan data jika terjadi kegagalan server.
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 2rem; border-top: 1px solid var(--border-light); padding-top: 1.5rem;">
                <a href="{{ route('admin.backup.download') }}" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 0.875rem;">
                    <i class="ti ti-download" style="font-size: 1.25rem;"></i> Download Backup (JSON)
                </a>
            </div>
        </div>

        <!-- Database Stats Card -->
        <div class="card">
            <div class="card-header">
                <div>
                    <h2 class="card-title">Statistik Tabel Terkini</h2>
                    <p class="card-subtitle">Jumlah baris data aktif di setiap tabel.</p>
                </div>
                <div style="padding: 0.5rem; background: var(--success-50); border-radius: 50%; color: var(--success-400);">
                    <i class="ti ti-table" style="font-size: 1.5rem;"></i>
                </div>
            </div>
            
            <div class="table-wrap" style="max-height: 350px; overflow-y: auto;">
                <table>
                    <thead>
                        <tr>
                            <th>Nama Tabel</th>
                            <th style="text-align: right;">Total Baris (Rows)</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($tableStats as $stat)
                        <tr>
                            <td style="font-family: 'Montserrat', sans-serif; color: var(--brand-600); font-weight: 500;">
                                <i class="ti ti-database" style="color: var(--text-placeholder); margin-right: 0.5rem; font-size: 1rem; vertical-align: -2px;"></i>
                                {{ $stat['name'] }}
                            </td>
                            <td style="text-align: right;">
                                <span class="badge {{ $stat['rows'] > 0 ? 'badge-success' : 'badge-info' }}">{{ number_format($stat['rows']) }}</span>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="2" class="empty-state">
                                <i class="ti ti-table-off empty-state-icon"></i>
                                <div class="empty-state-title">Tidak Ada Tabel</div>
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection
