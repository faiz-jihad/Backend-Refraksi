@extends('layouts.admin')

@section('title', 'Detail Hasil Pemeriksaan')

@section('content')
<div class="page-title-box">
    <div class="breadcrumb">Admin / Pemeriksaan / Detail</div>
    <h2>Detail Hasil Pemeriksaan AI</h2>
</div>

<div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1.5rem;">
    <!-- Info Pasien -->
    <div>
        <div class="table-card" style="margin-bottom: 1.5rem;">
            <div class="table-header"><h3 style="font-size: 1rem; font-weight: 700;">Data Pasien</h3></div>
            <div style="padding: 1.5rem;">
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                    <div class="avatar" style="width: 48px; height: 48px;">{{ substr($result->user->name ?? 'G', 0, 1) }}</div>
                    <div>
                        <div style="font-weight: 800; font-size: 1.125rem;">{{ $result->user->name ?? 'Guest' }}</div>
                        <div style="font-size: 0.813rem; color: var(--text-muted);">{{ $result->user->email ?? 'N/A' }}</div>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                        <span style="color: var(--text-muted);">ID Pasien</span>
                        <span style="font-weight: 600;">#{{ $result->user_id }}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                        <span style="color: var(--text-muted);">Tanggal Periksa</span>
                        <span style="font-weight: 600;">{{ $result->created_at->format('d M Y, H:i') }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="table-card">
            <div class="table-header"><h3 style="font-size: 1rem; font-weight: 700;">Parameter Klinis</h3></div>
            <div style="padding: 1.5rem;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div style="padding: 1rem; background: var(--bg-main); border-radius: 12px; text-align: center;">
                        <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">Mata Kanan</div>
                        <div style="font-size: 1.25rem; font-weight: 800;">{{ number_format($result->right_eye_sphere, 2) }}</div>
                    </div>
                    <div style="padding: 1rem; background: var(--bg-main); border-radius: 12px; text-align: center;">
                        <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">Mata Kiri</div>
                        <div style="font-size: 1.25rem; font-weight: 800;">{{ number_format($result->left_eye_sphere, 2) }}</div>
                    </div>
                </div>
                <div style="margin-top: 1rem; padding: 1rem; background: var(--primary-light); border-radius: 12px; text-align: center;">
                    <div style="font-size: 0.75rem; color: var(--primary); font-weight: 700; margin-bottom: 0.25rem;">Visual Acuity</div>
                    <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary-dark);">{{ $result->visual_acuity }}</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Analisis AI -->
    <div class="table-card">
        <div class="table-header">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="width: 32px; height: 32px; background: #e0f2fe; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--primary);">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px;"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                </div>
                <h3 style="font-size: 1.125rem; font-weight: 700;">Analisis & Rekomendasi AI</h3>
            </div>
        </div>
        <div style="padding: 2rem;">
            @php
                $recommendations = $result->ai_recommendations;
                if (is_string($recommendations)) {
                    $recommendations = json_decode($recommendations, true);
                }

                // Normalisasi data dari berbagai format AI (Snellen / Manual / Legacy)
                $diagnosa = null;
                $kategori = null;
                $keparahan = null;
                $summary = null;
                $actions = [];
                $saranKacamata = null;
                $tipsKesehatan = null;
                $confidence = null;

                if ($recommendations) {
                    // 1. Format Snellen AI
                    if (isset($recommendations['predicted_class'])) {
                        $kategori = $recommendations['predicted_class'];
                        $summary = $recommendations['recommendation'] ?? $recommendations['friendly_summary'] ?? null;
                        
                        // Parse confidence
                        if (isset($recommendations['confidence'])) {
                            $confVal = $recommendations['confidence'];
                            if (is_numeric($confVal)) {
                                $confidence = ($confVal <= 1.0 ? ($confVal * 100) : $confVal) . '%';
                            } else {
                                $confidence = $confVal;
                            }
                        }
                        
                        $actions = isset($recommendations['friendly_summary']) ? [$recommendations['friendly_summary']] : [];
                    } 
                    // 2. Format Manual Input
                    elseif (isset($recommendations['kondisi'])) {
                        $diagnosa = $recommendations['kondisi'];
                        $kategori = $recommendations['kategori'] ?? null;
                        $keparahan = $recommendations['tingkat_keparahan'] ?? null;
                        $summary = $recommendations['kondisi'];
                        $actions = $recommendations['rekomendasi'] ?? [];
                        $saranKacamata = $recommendations['saran_kacamata'] ?? null;
                        $tipsKesehatan = $recommendations['tips_kesehatan'] ?? null;
                    }
                    // 3. Format Legacy / Default
                    else {
                        $summary = $recommendations['summary'] ?? null;
                        $actions = $recommendations['actions'] ?? [];
                    }
                }
            @endphp

            @if($recommendations)
                <!-- Detail Kategori & Akurasi -->
                <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                    @if($kategori)
                    <div style="padding: 0.5rem 1rem; background: var(--primary-light); color: var(--primary-dark); border-radius: 20px; font-weight: 700; font-size: 0.813rem;">
                        Kategori: {{ $kategori }}
                    </div>
                    @endif
                    
                    @if($keparahan)
                    <div style="padding: 0.5rem 1rem; background: #fff7ed; color: #c2410c; border-radius: 20px; font-weight: 700; font-size: 0.813rem;">
                        Tingkat: {{ $keparahan }}
                    </div>
                    @endif

                    @if($confidence)
                    <div style="padding: 0.5rem 1rem; background: #f0fdf4; color: #15803d; border-radius: 20px; font-weight: 700; font-size: 0.813rem;">
                        Akurasi AI: {{ $confidence }}
                    </div>
                    @endif
                </div>

                @if($summary)
                <div style="margin-bottom: 2rem;">
                    <h4 style="font-size: 0.875rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Kesimpulan Diagnosa</h4>
                    <div style="padding: 1.5rem; background: #f8fafc; border-left: 4px solid var(--primary); border-radius: 0 12px 12px 0; font-size: 0.95rem; line-height: 1.6; color: var(--text-main);">
                        {{ $summary }}
                    </div>
                </div>
                @endif

                @if($saranKacamata)
                <div style="margin-bottom: 2rem;">
                    <h4 style="font-size: 0.875rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Rekomendasi Lensa / Kacamata</h4>
                    <div style="padding: 1.25rem; background: #f0f9ff; border-radius: 12px; font-size: 0.938rem; line-height: 1.5; color: #0369a1; font-weight: 500; border: 1px solid #bae6fd;">
                        👁️ {{ $saranKacamata }}
                    </div>
                </div>
                @endif

                @if(!empty($actions))
                <div style="margin-bottom: 2rem;">
                    <h4 style="font-size: 0.875rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Tindakan Lanjutan</h4>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        @foreach($actions as $action)
                        <li style="display: flex; gap: 1rem; margin-bottom: 0.75rem; padding: 1rem; border: 1px solid var(--border); border-radius: 12px; background: white;">
                            <div style="color: var(--success);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 20px;"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
                            <div style="font-size: 0.938rem; font-weight: 500; color: var(--text-main); line-height: 1.4;">{{ $action }}</div>
                        </li>
                        @endforeach
                    </ul>
                </div>
                @endif

                @if($tipsKesehatan)
                <div style="margin-bottom: 2rem;">
                    <h4 style="font-size: 0.875rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem;">Tips Kesehatan Mata</h4>
                    <div style="padding: 1.25rem; background: #fdf2f8; border-radius: 12px; font-size: 0.938rem; line-height: 1.5; color: #b91c1c; border: 1px solid #fbcfe8;">
                        ✨ {{ $tipsKesehatan }}
                    </div>
                </div>
                @endif
            @else
                <div style="padding: 3rem; text-align: center; color: var(--text-muted);">
                    Tidak ada data rekomendasi AI untuk pemeriksaan ini.
                </div>
            @endif

            <div style="margin-top: 2rem; display: flex; justify-content: flex-end;">
                <a href="{{ route('admin.results.index') }}" class="btn btn-white">Kembali ke Daftar</a>
            </div>
        </div>
    </div>
</div>
@endsection
