@extends('layouts.admin')

@section('title', 'Edit Pengguna')

@section('content')
<style>
    .form-group { margin-bottom: 1.5rem; }
    .form-label { 
        display: block; 
        font-size: 0.8125rem; 
        font-weight: 600; 
        color: var(--text-secondary); 
        margin-bottom: 0.5rem; 
    }
    .form-control {
        width: 100%;
        padding: 0.625rem 1rem;
        border-radius: var(--radius-md);
        border: 1px solid var(--border-light);
        background: var(--bg-surface);
        font-family: inherit;
        font-size: 0.875rem;
        color: var(--text-primary);
        transition: all var(--duration-fast) var(--ease-out);
        outline: none;
    }
    .form-control:focus {
        border-color: var(--brand-400);
        box-shadow: 0 0 0 3px var(--brand-50);
    }
    .section-divider {
        margin: 2rem 0 1.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--border-light);
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    .section-divider i { color: var(--brand-500); }
    .section-divider h4 { font-size: 0.875rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.05em; }
</style>

<div class="animate-in">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
        <a href="{{ route('admin.dashboard') }}">Dashboard</a>
        <span class="separator"><i class="ti ti-chevron-right"></i></span>
        <a href="{{ route('admin.users.index') }}">Pengguna</a>
        <span class="separator"><i class="ti ti-chevron-right"></i></span>
        <span>Edit Profil</span>
    </nav>

    <!-- Page Header -->
    <div class="page-title-section">
        <h1 class="page-title">Edit Profil Pengguna</h1>
        <p class="page-description">Perbarui informasi akun, profil demografi, atau data medis untuk <strong>{{ $user->name }}</strong>.</p>
    </div>

    <form action="{{ route('admin.users.update', $user->id) }}" method="POST" style="max-width: 1000px;">
        @csrf
        @method('PUT')
        
        <div class="grid-2">
            <!-- Account Info Card -->
            <div class="card">
                <div class="section-divider" style="margin-top: 0;">
                    <i class="ti ti-user-circle"></i>
                    <h4>Informasi Akun</h4>
                </div>

                <div class="form-group">
                    <label class="form-label">Nama Lengkap</label>
                    <input type="text" name="name" class="form-control" value="{{ $user->name }}" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Alamat Email</label>
                    <input type="email" name="email" class="form-control" value="{{ $user->email }}" required>
                </div>

                <div class="grid-2">
                    <div class="form-group">
                        <label class="form-label">Role Akses</label>
                        <select name="role" class="form-control" required>
                            <option value="user" {{ $user->role === 'user' ? 'selected' : '' }}>User / Pasien</option>
                            <option value="admin" {{ $user->role === 'admin' ? 'selected' : '' }}>Administrator</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Ganti Kata Sandi</label>
                        <input type="password" name="password" class="form-control" placeholder="Kosongkan jika tetap">
                    </div>
                </div>
            </div>

            <!-- Demographics Card -->
            <div class="card">
                <div class="section-divider" style="margin-top: 0;">
                    <i class="ti ti-id-badge"></i>
                    <h4>Profil & Demografi</h4>
                </div>

                <div class="grid-2">
                    <div class="form-group">
                        <label class="form-label">Nomor WhatsApp</label>
                        <input type="text" name="phone" class="form-control" value="{{ $user->phone }}" placeholder="0812...">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Umur</label>
                        <input type="number" name="umur" class="form-control" value="{{ $user->umur }}" placeholder="Tahun">
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Jenis Kelamin</label>
                    <div style="display: flex; gap: 1rem;">
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.875rem;">
                            <input type="radio" name="kelamin" value="Laki-laki" {{ $user->kelamin === 'Laki-laki' ? 'checked' : '' }}> Laki-laki
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.875rem;">
                            <input type="radio" name="kelamin" value="Perempuan" {{ $user->kelamin === 'Perempuan' ? 'checked' : '' }}> Perempuan
                        </label>
                    </div>
                </div>

                <div class="grid-2">
                    <div class="form-group">
                        <label class="form-label">Pendidikan</label>
                        <select name="jenjang_pendidikan" class="form-control">
                            <option value="">Pilih...</option>
                            <option value="SD" {{ $user->jenjang_pendidikan === 'SD' ? 'selected' : '' }}>SD</option>
                            <option value="SMP" {{ $user->jenjang_pendidikan === 'SMP' ? 'selected' : '' }}>SMP</option>
                            <option value="SMA/K" {{ $user->jenjang_pendidikan === 'SMA/K' ? 'selected' : '' }}>SMA/K</option>
                            <option value="Diploma/Sarjana" {{ $user->jenjang_pendidikan === 'Diploma/Sarjana' ? 'selected' : '' }}>Sarjana</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Pekerjaan</label>
                        <input type="text" name="status_pekerjaan" class="form-control" value="{{ $user->status_pekerjaan }}" placeholder="Pekerjaan saat ini">
                    </div>
                </div>
            </div>
        </div>

        <!-- Medical Info Card -->
        <div class="card" style="margin-top: 1.5rem;">
            <div class="section-divider" style="margin-top: 0;">
                <i class="ti ti-stethoscope"></i>
                <h4>Data Medis & Riwayat</h4>
            </div>

            <div class="grid-3">
                <div class="form-group">
                    <label class="form-label">Tipe Penglihatan</label>
                    <select name="vision_type" class="form-control">
                        <option value="Normal" {{ $user->vision_type === 'Normal' ? 'selected' : '' }}>Normal</option>
                        <option value="Miopi (Rabun Jauh)" {{ $user->vision_type === 'Miopi (Rabun Jauh)' ? 'selected' : '' }}>Miopi (Rabun Jauh)</option>
                        <option value="Hipermetropi (Rabun Dekat)" {{ $user->vision_type === 'Hipermetropi (Rabun Dekat)' ? 'selected' : '' }}>Hipermetropi (Rabun Dekat)</option>
                        <option value="Astigmatisme (Silinder)" {{ $user->vision_type === 'Astigmatisme (Silinder)' ? 'selected' : '' }}>Astigmatisme (Silinder)</option>
                    </select>
                </div>
                <div class="form-group" style="grid-column: span 2;">
                    <label class="form-label">Alergi (Obat/Makanan)</label>
                    <input type="text" name="allergies" class="form-control" value="{{ $user->allergies }}" placeholder="Contoh: Alergi debu, antibiotik tertentu...">
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Catatan Riwayat Medis</label>
                <textarea name="medical_history" class="form-control" rows="3" placeholder="Informasi kesehatan penting lainnya...">{{ $user->medical_history }}</textarea>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem;">
                <a href="{{ route('admin.users.index') }}" class="btn btn-secondary">Batal</a>
                <button type="submit" class="btn btn-primary">
                    <i class="ti ti-device-floppy"></i>
                    Simpan Perubahan
                </button>
            </div>
        </div>
    </form>

    <!-- Refraction History Chart -->
    <div class="card" style="margin-top: 2rem; max-width: 1000px;">
        <div class="section-divider" style="margin-top: 0;">
            <i class="ti ti-chart-line"></i>
            <h4>Grafik Perkembangan Penyakit Mata (Refraksi)</h4>
        </div>
        
        @if(count($refractionHistory) > 0)
            <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1.5rem;">
                Grafik ini menerjemahkan riwayat hasil deteksi mata pengguna. Semakin turun (negatif), berarti kondisi Miopi (Rabun Jauh) semakin parah. Mendekati angka 0 berarti kondisi penglihatan membaik atau normal.
            </p>
            <div style="height: 300px; position: relative;">
                <canvas id="userProgressionChart"></canvas>
            </div>
        @else
            <div style="padding: 2rem; text-align: center; color: var(--text-muted); background: var(--bg-canvas); border-radius: var(--radius-md);">
                <i class="ti ti-eye-off" style="font-size: 2rem; color: var(--brand-200); margin-bottom: 0.5rem; display: block;"></i>
                Pengguna ini belum pernah melakukan deteksi/pemeriksaan mata.
            </div>
        @endif
    </div>
</div>

@if(count($refractionHistory) > 0)
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const ctx = document.getElementById('userProgressionChart').getContext('2d');
        
        const historyData = {!! json_encode($refractionHistory) !!};
        
        const labels = historyData.map(d => {
            const date = new Date(d.created_at);
            return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        });
        
        const rightEyeData = historyData.map(d => d.right_eye_sphere);
        const leftEyeData = historyData.map(d => d.left_eye_sphere);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Mata Kanan (Spheris)',
                        data: rightEyeData,
                        borderColor: '#2d8a74', // brand-500
                        backgroundColor: 'rgba(45, 138, 116, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true,
                        pointBackgroundColor: '#2d8a74',
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Mata Kiri (Spheris)',
                        data: leftEyeData,
                        borderColor: '#d4952b', // accent-500
                        backgroundColor: 'rgba(212, 149, 43, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true,
                        pointBackgroundColor: '#d4952b',
                        pointHoverRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { font: { family: "'Montserrat', sans-serif" }, usePointStyle: true }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(61, 57, 41, 0.9)',
                        titleFont: { size: 13, family: "'Montserrat', sans-serif" },
                        bodyFont: { size: 12, family: "'Montserrat', sans-serif" },
                        padding: 10,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                let val = context.raw;
                                let prefix = val > 0 ? '+' : '';
                                return context.dataset.label + ': ' + prefix + val + ' Dioptri';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        title: { display: true, text: 'Kekuatan Lensa (Dioptri)' },
                        ticks: { font: { family: "'Montserrat', sans-serif" } },
                        grid: { color: '#f3f0ea', drawBorder: false }
                    },
                    x: {
                        ticks: { font: { family: "'Montserrat', sans-serif" } },
                        grid: { display: false, drawBorder: false }
                    }
                }
            }
        });
    });
</script>
@endif
@endsection

