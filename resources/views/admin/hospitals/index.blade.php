@extends('layouts.admin')

@section('title', 'Rumah Sakit Rujukan')

@section('content')
<div class="page-title-box">
    <div class="breadcrumb">Admin / Fasilitas</div>
    <h2>Manajemen Rumah Sakit Rujukan</h2>
</div>

<div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1.5rem;">
    <!-- Form Tambah -->
    <div class="table-card">
        <div class="table-header">
            <h3 style="font-size: 1rem; font-weight: 700;">Tambah RS Rujukan</h3>
        </div>
        <form action="{{ route('admin.hospitals.store') }}" method="POST" style="padding: 1.5rem;">
            @csrf
            <div style="margin-bottom: 1rem;">
                <label style="display: block; font-size: 0.813rem; font-weight: 700; margin-bottom: 0.4rem;">Nama Rumah Sakit</label>
                <input type="text" name="name" class="btn btn-white" style="width: 100%; text-align: left;" placeholder="RS Mata A..." required>
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; font-size: 0.813rem; font-weight: 700; margin-bottom: 0.4rem;">Kota</label>
                <input type="text" name="city" class="btn btn-white" style="width: 100%; text-align: left;" placeholder="Bandung" required>
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; font-size: 0.813rem; font-weight: 700; margin-bottom: 0.4rem;">Alamat Lengkap</label>
                <textarea name="address" class="btn btn-white" style="width: 100%; text-align: left; height: 80px;" placeholder="Jl. Raya..." required></textarea>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; font-size: 0.813rem; font-weight: 700; margin-bottom: 0.4rem;">No. Telepon</label>
                <input type="text" name="phone" class="btn btn-white" style="width: 100%; text-align: left;" placeholder="022-xxxx">
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">Simpan Data</button>
        </form>
    </div>

    <!-- Daftar RS -->
    <div class="table-card">
        <div class="table-header">
            <h3 style="font-size: 1rem; font-weight: 700;">Daftar Fasilitas Kesehatan</h3>
        </div>
        <div style="overflow-x: auto;">
            <table class="custom-table">
                <thead>
                    <tr>
                        <th>Nama RS</th>
                        <th>Lokasi</th>
                        <th>Kontak</th>
                        <th style="text-align: right;">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($hospitals as $rs)
                    <tr>
                        <td>
                            <div style="font-weight: 700;">{{ $rs->name }}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted); display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">{{ $rs->address }}</div>
                        </td>
                        <td><span class="badge badge-blue">{{ $rs->city }}</span></td>
                        <td>{{ $rs->phone ?? '-' }}</td>
                        <td style="text-align: right;">
                            <button class="btn btn-white" style="padding: 0.4rem 0.6rem; color: var(--danger);">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            </button>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="4" style="text-align: center; padding: 3rem; color: var(--text-muted);">Belum ada data rumah sakit.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
