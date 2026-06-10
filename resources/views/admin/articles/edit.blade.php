@extends('layouts.admin')

@section('title', 'Edit Artikel')

@section('content')
<div class="animate-in">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
        <a href="{{ route('admin.dashboard') }}">Dashboard</a>
        <span class="separator"><i class="ti ti-chevron-right"></i></span>
        <a href="{{ route('admin.articles.index') }}">Artikel</a>
        <span class="separator"><i class="ti ti-chevron-right"></i></span>
        <span>Edit Artikel</span>
    </nav>

    <!-- Page Header -->
    <div class="page-title-section" style="margin-bottom: 2rem;">
        <h1 class="page-title">Edit Artikel</h1>
        <p class="page-description">Perbarui informasi, kategori, atau isi konten artikel MataCeria yang diterbitkan.</p>
    </div>

    @if($errors->any())
    <div style="background: var(--danger-bg); color: var(--danger); border: 1px solid rgba(239,68,68,0.2); padding: 0.875rem 1.25rem; border-radius: var(--r-sm); margin-bottom: 1.5rem; font-weight: 500; font-size: 0.875rem;">
        <ul style="margin: 0; padding-left: 1rem;">
            @foreach($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
    @endif

    <div class="card" style="max-width: 800px;">
        <div class="card-header">
            <h3 class="card-title">Edit: {{ $article->title }}</h3>
        </div>
        
        <form action="{{ route('admin.articles.update', $article->id) }}" method="POST" style="padding: 1.5rem 0 0 0;">
            @csrf
            @method('PUT')
            
            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; font-size: 0.875rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-2);">Judul Artikel</label>
                <input type="text" name="title" class="form-control" value="{{ old('title', $article->title) }}" required>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                <div>
                    <label style="display: block; font-size: 0.875rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-2);">Kategori</label>
                    <select name="category" class="form-control" required>
                        <option value="Tips" {{ old('category', $article->category) == 'Tips' ? 'selected' : '' }}>Tips Kesehatan</option>
                        <option value="Edukasi" {{ old('category', $article->category) == 'Edukasi' ? 'selected' : '' }}>Edukasi</option>
                        <option value="Berita" {{ old('category', $article->category) == 'Berita' ? 'selected' : '' }}>Berita Utama</option>
                        <option value="Umum" {{ old('category', $article->category) == 'Umum' ? 'selected' : '' }}>Umum</option>
                    </select>
                </div>
                <div>
                    <label style="display: block; font-size: 0.875rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-2);">URL Gambar</label>
                    <input type="url" name="image_url" class="form-control" value="{{ old('image_url', $article->image_url) }}">
                </div>
            </div>

            <div style="margin-bottom: 2rem;">
                <label style="display: block; font-size: 0.875rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-2);">Konten Artikel</label>
                <textarea name="content" rows="12" class="form-control" style="line-height: 1.6; resize: vertical;" required>{{ old('content', $article->content) }}</textarea>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: flex-end; border-top: 1px solid var(--border); padding-top: 1.5rem; padding-bottom: 0.5rem;">
                <a href="{{ route('admin.articles.index') }}" class="btn btn-secondary">Batal</a>
                <button type="submit" class="btn btn-primary">
                    <i class="ti ti-device-floppy" style="font-size: 1.1rem;"></i>
                    Simpan Perubahan
                </button>
            </div>
        </form>
    </div>
</div>
@endsection
