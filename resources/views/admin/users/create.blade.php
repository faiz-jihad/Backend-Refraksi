@extends('layouts.admin')

@section('title', 'Tambah Pengguna Baru')

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
        <span>Tambah</span>
    </nav>

    <!-- Page Header -->
    <div class="page-title-section">
        <h1 class="page-title">Tambah Pengguna Baru</h1>
        <p class="page-description">Lengkapi formulir di bawah untuk mendaftarkan akun pengguna baru ke platform.</p>
    </div>

    <form action="{{ route('admin.users.store') }}" method="POST" style="max-width: 1000px;">
        @csrf
        
        <div class="grid-2">
            <!-- Account Info Card -->
            <div class="card">
                <div class="section-divider" style="margin-top: 0;">
                    <i class="ti ti-user-circle"></i>
                    <h4>Informasi Akun</h4>
                </div>

                <div class="form-group">
                    <label class="form-label">Nama Lengkap</label>
                    <input type="text" name="name" class="form-control" placeholder="Contoh: Budi Santoso" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Alamat Email</label>
                    <input type="email" name="email" class="form-control" placeholder="email@contoh.com" required>
                </div>

                <div class="grid-2">
                    <div class="form-group">
                        <label class="form-label">Role Akses</label>
                        <select name="role" class="form-control" required>
                            <option value="user">User / Pasien</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Kata Sandi</label>
                        <input type="password" name="password" class="form-control" placeholder="Min. 8 Karakter" required>
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
                        <input type="text" name="phone" class="form-control" placeholder="0812...">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Umur</label>
                        <input type="number" name="umur" class="form-control" placeholder="Tahun">
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Jenis Kelamin</label>
                    <div style="display: flex; gap: 1rem;">
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.875rem;">
                            <input type="radio" name="kelamin" value="Laki-laki"> Laki-laki
                        </label>
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.875rem;">
                            <input type="radio" name="kelamin" value="Perempuan"> Perempuan
                        </label>
                    </div>
                </div>

                <div class="grid-2">
                    <div class="form-group">
                        <label class="form-label">Pendidikan</label>
                        <select name="jenjang_pendidikan" class="form-control">
                            <option value="">Pilih...</option>
                            <option value="SD">SD</option>
                            <option value="SMP">SMP</option>
                            <option value="SMA/K">SMA/K</option>
                            <option value="Diploma/Sarjana">Sarjana</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Pekerjaan</label>
                        <input type="text" name="status_pekerjaan" class="form-control" placeholder="Pekerjaan saat ini">
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
                        <option value="Normal">Normal</option>
                        <option value="Miopi (Rabun Jauh)">Miopi (Rabun Jauh)</option>
                        <option value="Hipermetropi (Rabun Dekat)">Hipermetropi (Rabun Dekat)</option>
                        <option value="Astigmatisme (Silinder)">Astigmatisme (Silinder)</option>
                    </select>
                </div>
                <div class="form-group" style="grid-column: span 2;">
                    <label class="form-label">Alergi (Obat/Makanan)</label>
                    <input type="text" name="allergies" class="form-control" placeholder="Contoh: Alergi debu, antibiotik tertentu...">
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Catatan Riwayat Medis</label>
                <textarea name="medical_history" class="form-control" rows="3" placeholder="Informasi kesehatan penting lainnya..."></textarea>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem;">
                <a href="{{ route('admin.users.index') }}" class="btn btn-secondary">Batal</a>
                <button type="submit" class="btn btn-primary">
                    <i class="ti ti-device-floppy"></i>
                    Daftarkan Pengguna
                </button>
            </div>
        </div>
    </form>
</div>
@endsection

