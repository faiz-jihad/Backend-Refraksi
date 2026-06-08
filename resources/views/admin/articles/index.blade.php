@extends('layouts.admin')

@section('title', 'Manajemen Artikel')

@section('content')
<div class="page-title-box" style="display: flex; justify-content: space-between; align-items: flex-end;">
    <div>
        <div class="breadcrumb">Admin / Konten</div>
        <h2>Manajemen Artikel</h2>
    </div>
    <a href="{{ route('admin.articles.create') }}" class="btn btn-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:18px;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        Buat Artikel Baru
    </a>
</div>

<div class="table-card">
    <div class="table-header">
        <div style="display: flex; gap: 1rem;">
            <button class="btn btn-white active">Semua</button>
            <button class="btn btn-white">Tips</button>
            <button class="btn btn-white">Edukasi</button>
        </div>
        <div class="search-bar" style="border: 1px solid var(--border);">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="Filter judul...">
        </div>
    </div>
    <div style="overflow-x: auto;">
        <table class="custom-table">
            <thead>
                <tr>
                    <th style="width: 50%;">Judul & Konten</th>
                    <th>Kategori</th>
                    <th>Tanggal Rilis</th>
                    <th style="text-align: right;">Opsi</th>
                </tr>
            </thead>
            <tbody>
                @forelse($articles as $article)
                <tr>
                    <td>
                        <div style="font-weight: 700; color: var(--text-main); margin-bottom: 0.25rem;">{{ $article->title }}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted); display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">
                            {{ $article->content }}
                        </div>
                    </td>
                    <td><span class="badge badge-blue">{{ $article->category ?? 'Umum' }}</span></td>
                    <td>
                        <div style="font-weight: 500;">{{ $article->created_at->format('d M Y') }}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">{{ $article->created_at->format('H:i') }} WIB</div>
                    </td>
                    <td style="text-align: right;">
                        <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                            <a href="{{ route('admin.articles.edit', $article->id) }}" class="btn btn-white" style="padding: 0.4rem 0.6rem;" title="Edit">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </a>
                            <form action="{{ route('admin.articles.destroy', $article->id) }}" method="POST" onsubmit="return confirm('Hapus artikel ini permanen?')">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-white" style="padding: 0.4rem 0.6rem; color: var(--danger);">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                            </form>
                        </div>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="4" style="text-align: center; padding: 4rem;">
                        <div style="margin-bottom: 1rem; color: var(--text-muted);">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width: 48px; opacity: 0.3;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line></svg>
                        </div>
                        <div style="font-weight: 600; color: var(--text-muted);">Belum ada artikel ditemukan</div>
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
