@extends('layouts.admin')

@section('title', 'Manajemen Dokter Rujukan')

@section('content')
<div class="animate-in">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
        <a href="{{ route('admin.dashboard') }}">Dashboard</a>
        <span class="separator"><i class="ti ti-chevron-right"></i></span>
        <span>Dokter Rujukan</span>
    </nav>

    <!-- Page Header -->
    <div class="page-title-section">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 1rem;">
            <div>
                <h1 class="page-title">Dokter Rujukan</h1>
                <p class="page-description">Kelola daftar dokter spesialis mata untuk referensi pasien. Dokter ini akan muncul di aplikasi pasien.</p>
            </div>
        </div>
    </div>

    @if(session('success'))
        <div class="alert alert-success" style="margin-bottom: 1.5rem;">
            <i class="ti ti-check"></i> {{ session('success') }}
        </div>
    @endif
    
    @if($errors->any())
        <div class="alert alert-danger" style="margin-bottom: 1.5rem; background: var(--danger-50); color: var(--danger-500); padding: 1rem; border-radius: var(--radius-md);">
            <ul style="margin: 0; padding-left: 1.5rem;">
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <div class="grid-2" style="grid-template-columns: 1fr 2fr;">
        <!-- Form Card -->
        <div class="card" style="height: fit-content;">
            <div class="card-header">
                <h3 class="card-title">Tambah Dokter</h3>
            </div>
            <form action="{{ route('admin.doctors.store') }}" method="POST" style="padding: 1.5rem;">
                @csrf
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; font-size: 0.8125rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-secondary);">Nama Dokter</label>
                    <input type="text" name="name" class="form-control" required placeholder="dr. Budi Santoso, Sp.M" style="width: 100%; padding: 0.625rem; border: 1px solid var(--border-light); border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; font-size: 0.8125rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-secondary);">Spesialisasi</label>
                    <input type="text" name="specialization" class="form-control" value="Spesialis Mata (Oftalmologi)" placeholder="Keahlian" style="width: 100%; padding: 0.625rem; border: 1px solid var(--border-light); border-radius: 4px;">
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="display: block; font-size: 0.8125rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-secondary);">Lokasi Praktek (RS/Klinik)</label>
                    <select name="hospital_id" class="form-control" style="width: 100%; padding: 0.625rem; border: 1px solid var(--border-light); border-radius: 4px;">
                        <option value="">-- Pilih RS Rujukan (Opsional) --</option>
                        @foreach($hospitals as $rs)
                            <option value="{{ $rs->id }}">{{ $rs->name }}</option>
                        @endforeach
                    </select>
                    <small style="color: var(--text-muted); font-size: 0.75rem; margin-top: 0.25rem; display: block;">Pastikan RS sudah ditambahkan di menu RS Rujukan</small>
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="display: block; font-size: 0.8125rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-secondary);">Nomor Telepon/WA</label>
                    <input type="text" name="phone" class="form-control" placeholder="0812..." style="width: 100%; padding: 0.625rem; border: 1px solid var(--border-light); border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; font-size: 0.8125rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-secondary);">Jadwal Praktek</label>
                    <input type="text" name="schedule" class="form-control" placeholder="Senin - Jumat, 08:00 - 14:00" style="width: 100%; padding: 0.625rem; border: 1px solid var(--border-light); border-radius: 4px;">
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">
                    <i class="ti ti-plus"></i> Simpan Dokter
                </button>
            </form>
        </div>

        <!-- Table Card -->
        <div class="card">
            <div class="card-header" style="border-bottom: 1px solid var(--border-light); margin-bottom: 0;">
                <h3 class="card-title">Daftar Dokter</h3>
            </div>
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Nama Dokter & Spesialisasi</th>
                            <th>Kontak & Jadwal</th>
                            <th>Lokasi (RS)</th>
                            <th style="text-align: right;">Opsi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($doctors as $doc)
                        <tr>
                            <td>
                                <div style="font-weight: 600; color: var(--text-primary);">{{ $doc->name }}</div>
                                <div style="font-size: 0.8125rem; color: var(--text-muted);">{{ $doc->specialization }}</div>
                            </td>
                            <td>
                                <div style="font-size: 0.8125rem; margin-bottom: 0.25rem;">
                                    <i class="ti ti-phone" style="color: var(--brand-500);"></i> {{ $doc->phone ?: '-' }}
                                </div>
                                <div style="font-size: 0.8125rem; color: var(--text-muted);">
                                    <i class="ti ti-clock" style="color: var(--accent-500);"></i> {{ $doc->schedule ?: 'Sesuai perjanjian' }}
                                </div>
                            </td>
                            <td>
                                @if($doc->hospital)
                                    <span class="badge badge-success">{{ $doc->hospital->name }}</span>
                                @else
                                    <span style="font-size: 0.8125rem; color: var(--text-muted);">Independen</span>
                                @endif
                            </td>
                            <td style="text-align: right;">
                                <form action="{{ route('admin.doctors.destroy', $doc->id) }}" method="POST" onsubmit="return confirm('Apakah Anda yakin ingin menghapus dokter ini?');" style="display: inline-block;">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-danger" style="padding: 0.35rem 0.6rem; font-size: 0.75rem;">
                                        <i class="ti ti-trash"></i> Hapus
                                    </button>
                                </form>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="4" style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
                                <i class="ti ti-stethoscope off" style="font-size: 2rem; margin-bottom: 1rem; color: var(--border-dark);"></i>
                                <div>Belum ada data dokter rujukan yang ditambahkan.</div>
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
