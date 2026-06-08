@extends('layouts.admin')

@section('title', 'Edit Artikel')

@section('content')
<div class="page-title-box">
    <div class="breadcrumb">Admin / Konten / Edit</div>
    <h2>Edit Artikel</h2>
</div>

<div style="max-width: 800px;">
    <div class="table-card">
        <div class="table-header">
            <h3 style="font-size: 1.125rem; font-weight: 700;">Edit: {{ $article->title }}</h3>
        </div>
        <form action="{{ route('admin.articles.update', $article->id) }}" method="POST" style="padding: 2rem;">
            @csrf
            @method('PUT')
            
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; font-size: 0.875rem; font-weight: 700; margin-bottom: 0.5rem;">Judul Artikel</label>
                <input type="text" name="title" class="btn btn-white" style="width: 100%; text-align: left; padding: 0.75rem 1rem;" value="{{ $article->title }}" required>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                <div>
                    <label style="display: block; font-size: 0.875rem; font-weight: 700; margin-bottom: 0.5rem;">Kategori</label>
                    <select name="category" class="btn btn-white" style="width: 100%; text-align: left; padding: 0.75rem 1rem;" required>
                        <option value="Tips" {{ $article->category == 'Tips' ? 'selected' : '' }}>Tips Kesehatan</option>
                        <option value="Edukasi" {{ $article->category == 'Edukasi' ? 'selected' : '' }}>Edukasi</option>
                        <option value="Berita" {{ $article->category == 'Berita' ? 'selected' : '' }}>Berita Utama</option>
                        <option value="Umum" {{ $article->category == 'Umum' ? 'selected' : '' }}>Umum</option>
                    </select>
                </div>
                <div>
                    <label style="display: block; font-size: 0.875rem; font-weight: 700; margin-bottom: 0.5rem;">URL Gambar</label>
                    <input type="url" name="image_url" class="btn btn-white" style="width: 100%; text-align: left; padding: 0.75rem 1rem;" value="{{ $article->image_url }}">
                </div>
            </div>

            <div style="margin-bottom: 2rem;">
                <label style="display: block; font-size: 0.875rem; font-weight: 700; margin-bottom: 0.5rem;">Konten Artikel</label>
                <textarea name="content" rows="12" class="btn btn-white" style="width: 100%; text-align: left; padding: 1rem; line-height: 1.6; resize: vertical;" required>{{ $article->content }}</textarea>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: flex-end; border-top: 1px solid var(--border); padding-top: 2rem;">
                <a href="{{ route('admin.articles.index') }}" class="btn btn-white">Batal</a>
                <button type="submit" class="btn btn-primary">Simpan Perubahan</button>
            </div>
        </form>
    </div>
</div>
@endsection
