@extends('layouts.admin')

@section('title', 'Buat Artikel Baru')

@section('content')
<div class="page-title-box">
    <div class="breadcrumb">Admin / Konten / Tambah</div>
    <h2>Buat Artikel Baru</h2>
</div>

<div style="max-width: 800px;">
    <div class="table-card">
        <div class="table-header">
            <h3 style="font-size: 1.125rem; font-weight: 700;">Formulir Artikel</h3>
        </div>
        <form action="{{ route('admin.articles.store') }}" method="POST" style="padding: 2rem;">
            @csrf
            
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; font-size: 0.875rem; font-weight: 700; margin-bottom: 0.5rem;">Judul Artikel</label>
                <input type="text" name="title" class="btn btn-white" style="width: 100%; text-align: left; padding: 0.75rem 1rem;" placeholder="Contoh: 5 Tips Menjaga Kesehatan Mata di Depan Layar" required>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                <div>
                    <label style="display: block; font-size: 0.875rem; font-weight: 700; margin-bottom: 0.5rem;">Kategori</label>
                    <select name="category" class="btn btn-white" style="width: 100%; text-align: left; padding: 0.75rem 1rem;" required>
                        <option value="Tips">Tips Kesehatan</option>
                        <option value="Edukasi">Edukasi</option>
                        <option value="Berita">Berita Utama</option>
                        <option value="Umum">Umum</option>
                    </select>
                </div>
                <div>
                    <label style="display: block; font-size: 0.875rem; font-weight: 700; margin-bottom: 0.5rem;">URL Gambar (Opsional)</label>
                    <input type="url" name="image_url" class="btn btn-white" style="width: 100%; text-align: left; padding: 0.75rem 1rem;" placeholder="https://images.unsplash.com/...">
                </div>
            </div>

            <div style="margin-bottom: 2rem;">
                <label style="display: block; font-size: 0.875rem; font-weight: 700; margin-bottom: 0.5rem;">Konten Artikel</label>
                <textarea name="content" rows="12" class="btn btn-white" style="width: 100%; text-align: left; padding: 1rem; line-height: 1.6; resize: vertical;" placeholder="Tulis konten edukasi di sini..." required></textarea>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: flex-end; border-top: 1px solid var(--border); padding-top: 2rem;">
                <a href="{{ route('admin.articles.index') }}" class="btn btn-white">Batal</a>
                <button type="submit" class="btn btn-primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px;"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                    Terbitkan Artikel
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
