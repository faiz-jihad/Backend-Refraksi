@extends('layouts.admin')

@section('title', 'Manajemen Artikel')

@section('content')
<div class="animate-in">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
        <a href="{{ route('admin.dashboard') }}">Dashboard</a>
        <span class="separator"><i class="ti ti-chevron-right"></i></span>
        <span>Artikel</span>
    </nav>

    <!-- Page Header -->
    <div class="page-title-section" style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
            <h1 class="page-title">Manajemen Artikel</h1>
            <p class="page-description">Kelola konten edukasi, berita, dan tips kesehatan mata untuk pengguna MataCeria.</p>
        </div>
        <a href="{{ route('admin.articles.create') }}" class="btn btn-primary">
            <i class="ti ti-plus"></i>
            Buat Artikel Baru
        </a>
    </div>

    @if(session('success'))
    <div style="background: var(--success-bg); color: var(--success); border: 1px solid rgba(16,185,129,0.2); padding: 0.875rem 1.25rem; border-radius: var(--r-sm); margin-bottom: 1.5rem; font-weight: 500; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
        <i class="ti ti-circle-check" style="font-size: 1.1rem;"></i>
        {{ session('success') }}
    </div>
    @endif

    <!-- Main Card -->
    <div class="card">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem; margin-bottom: 1.25rem;">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button class="btn btn-primary category-filter" data-category="all">Semua</button>
                <button class="btn btn-secondary category-filter" data-category="Tips">Tips Kesehatan</button>
                <button class="btn btn-secondary category-filter" data-category="Edukasi">Edukasi</button>
                <button class="btn btn-secondary category-filter" data-category="Berita">Berita Utama</button>
                <button class="btn btn-secondary category-filter" data-category="Umum">Umum</button>
            </div>
            <div class="search-wrap" style="width: 240px; margin-left: auto;">
                <i class="ti ti-search search-icon" style="font-size:0.9rem;"></i>
                <input type="text" id="articleSearch" placeholder="Cari judul atau isi...">
            </div>
        </div>

        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th style="width: 50%;">Judul & Konten</th>
                        <th>Kategori</th>
                        <th>Tanggal Rilis</th>
                        <th style="text-align: right;">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($articles as $article)
                    <tr class="article-row" data-category="{{ $article->category ?? 'Umum' }}" data-title="{{ $article->title }}" data-content="{{ $article->content }}">
                        <td>
                            <div style="font-weight: 700; color: var(--text); margin-bottom: 0.25rem; font-size: 0.9rem;">{{ $article->title }}</div>
                            <div style="font-size: 0.78rem; color: var(--text-3); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.5; max-height: 3rem;">
                                {{ $article->content }}
                            </div>
                        </td>
                        <td>
                            @if(($article->category ?? 'Umum') === 'Tips')
                                <span class="badge badge-brand"><i class="ti ti-bulb" style="font-size: 10px; margin-right: 4px;"></i>Tips Kesehatan</span>
                            @elseif(($article->category ?? 'Umum') === 'Edukasi')
                                <span class="badge badge-info"><i class="ti ti-book-2" style="font-size: 10px; margin-right: 4px;"></i>Edukasi</span>
                            @elseif(($article->category ?? 'Umum') === 'Berita')
                                <span class="badge badge-warning"><i class="ti ti-news" style="font-size: 10px; margin-right: 4px;"></i>Berita Utama</span>
                            @else
                                <span class="badge badge-success"><i class="ti ti-file-text" style="font-size: 10px; margin-right: 4px;"></i>{{ $article->category ?? 'Umum' }}</span>
                            @endif
                        </td>
                        <td>
                            <div style="font-weight: 600; font-size: 0.85rem;">{{ $article->created_at->format('d M Y') }}</div>
                            <div style="font-size: 0.72rem; color: var(--text-3); margin-top: 0.1rem;">{{ $article->created_at->format('H:i') }} WIB</div>
                        </td>
                        <td style="text-align: right;">
                            <div style="display: flex; gap: 0.5rem; justify-content: flex-end; align-items: center;">
                                <a href="{{ route('admin.articles.edit', $article->id) }}" class="header-icon-btn" title="Edit Artikel" style="width: 32px; height: 32px; color: var(--brand);">
                                    <i class="ti ti-edit"></i>
                                </a>
                                <form action="{{ route('admin.articles.destroy', $article->id) }}" method="POST" onsubmit="return confirm('Hapus artikel ini secara permanen?')" style="display: inline;">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="header-icon-btn" title="Hapus Artikel" style="width: 32px; height: 32px; color: var(--danger); border: 1px solid var(--border); background: var(--surface);">
                                        <i class="ti ti-trash"></i>
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr class="initial-empty-row">
                        <td colspan="4">
                            <div class="empty-state">
                                <i class="ti ti-file-off empty-state-icon"></i>
                                <h4 class="empty-state-title">Belum ada artikel</h4>
                                <p>Daftar artikel yang Anda buat akan muncul di sini.</p>
                            </div>
                        </td>
                    </tr>
                    @endforelse
                    
                    <tr class="empty-row" style="display: none;">
                        <td colspan="4">
                            <div class="empty-state">
                                <i class="ti ti-file-off empty-state-icon"></i>
                                <h4 class="empty-state-title">Tidak ada artikel ditemukan</h4>
                                <p>Sesuaikan kata kunci pencarian atau filter kategori Anda.</p>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const searchInput = document.getElementById('articleSearch');
        const filterButtons = document.querySelectorAll('.category-filter');
        const rows = document.querySelectorAll('tbody tr.article-row');
        const emptyRow = document.querySelector('tbody tr.empty-row');
        const initialEmptyRow = document.querySelector('tbody tr.initial-empty-row');
        
        let currentSearch = '';
        let currentCategory = 'all';
        
        function updateFilters() {
            let visibleCount = 0;
            
            rows.forEach(row => {
                const title = row.getAttribute('data-title').toLowerCase();
                const content = row.getAttribute('data-content').toLowerCase();
                const category = row.getAttribute('data-category');
                
                const matchesSearch = title.includes(currentSearch) || content.includes(currentSearch);
                const matchesCategory = currentCategory === 'all' || category === currentCategory;
                
                if (matchesSearch && matchesCategory) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });
            
            if (initialEmptyRow) {
                initialEmptyRow.style.display = rows.length === 0 ? '' : 'none';
            }
            
            if (emptyRow) {
                emptyRow.style.display = (visibleCount === 0 && rows.length > 0) ? '' : 'none';
            }
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                currentSearch = e.target.value.toLowerCase();
                updateFilters();
            });
        }
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                filterButtons.forEach(b => {
                    b.classList.remove('btn-primary');
                    b.classList.add('btn-secondary');
                });
                
                this.classList.remove('btn-secondary');
                this.classList.add('btn-primary');
                
                currentCategory = this.getAttribute('data-category');
                updateFilters();
            });
        });
    });
</script>
@endsection
