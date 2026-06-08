@extends('layouts.admin')

@section('title', 'System Settings')

@section('content')
<div class="animate-in">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
        <span>Admin</span>
        <span class="separator"><i class="ti ti-chevron-right"></i></span>
        <span>Pengaturan</span>
        <span class="separator"><i class="ti ti-chevron-right"></i></span>
        <span>Sistem</span>
    </nav>

    <!-- Page Header -->
    <div class="page-title-section">
        <h1 class="page-title">Informasi Sistem</h1>
        <p class="page-description">Detail konfigurasi server dan aplikasi MataCeria yang sedang berjalan saat ini.</p>
    </div>

    @if(session('success'))
    <div style="background: var(--success-50); color: var(--success-400); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--success-400); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
        <i class="ti ti-circle-check" style="font-size: 1.25rem;"></i>
        {{ session('success') }}
    </div>
    @endif

    @if(session('error'))
    <div style="background: var(--danger-50); color: var(--danger-500); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--danger-100); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
        <i class="ti ti-alert-triangle" style="font-size: 1.25rem;"></i>
        {{ session('error') }}
    </div>
    @endif

    <div class="grid-2">
        <!-- System Info Card -->
        <div class="card">
            <div class="card-header">
                <div>
                    <h2 class="card-title">Spesifikasi Server & Lingkungan</h2>
                    <p class="card-subtitle">Membaca data konfigurasi dari file <code>.env</code></p>
                </div>
                <div style="padding: 0.5rem; background: var(--brand-50); border-radius: 50%; color: var(--brand-500);">
                    <i class="ti ti-server-cog" style="font-size: 1.5rem;"></i>
                </div>
            </div>
            
            <div style="margin-top: 1rem;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tbody>
                        @foreach($serverInfo as $key => $value)
                        <tr style="border-bottom: 1px solid var(--border-light);">
                            <td style="padding: 0.875rem 0; font-weight: 600; color: var(--text-secondary); font-size: 0.875rem;">
                                {{ $key }}
                            </td>
                            <td style="padding: 0.875rem 0; text-align: right; color: var(--text-primary); font-family: 'Montserrat', sans-serif; font-size: 0.875rem;">
                                {{ $value }}
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>

        <!-- API Traffic Card -->
        <div class="card" style="grid-column: 1 / -1;">
            <div class="card-header">
                <div>
                    <h2 class="card-title">Token API & Server Traffic</h2>
                    <p class="card-subtitle">Penggunaan API (Sanctum) dan integrasi pihak ketiga (Gemini, AI Inference)</p>
                </div>
                <div style="padding: 0.5rem; background: var(--info-50); border-radius: 50%; color: var(--info-400);">
                    <i class="ti ti-activity" style="font-size: 1.5rem;"></i>
                </div>
            </div>

            <div class="grid-4" style="margin-top: 1rem;">
                <div class="stat-card" style="box-shadow: none; border-color: var(--border-light);">
                    <div class="stat-card-label" style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Total Token Sanctum</div>
                    <div class="stat-card-value" style="font-size: 1.5rem;">{{ number_format($apiTraffic['sanctum_total_tokens']) }}</div>
                    <div class="stat-card-trend" style="color: var(--text-muted); font-weight: 400;"><i class="ti ti-key"></i> Token Terbit</div>
                </div>
                
                <div class="stat-card" style="box-shadow: none; border-color: var(--border-light);">
                    <div class="stat-card-label" style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Token Aktif (24 Jam)</div>
                    <div class="stat-card-value" style="font-size: 1.5rem; color: var(--success-400);">{{ number_format($apiTraffic['sanctum_active_last_24h']) }}</div>
                    <div class="stat-card-trend" style="color: var(--success-400); font-weight: 400;"><i class="ti ti-clock"></i> Digunakan Terakhir</div>
                </div>

                <div class="stat-card" style="box-shadow: none; border-color: var(--border-light);">
                    <div class="stat-card-label" style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Traffic API Gemini</div>
                    <div class="stat-card-value" style="font-size: 1.5rem; color: var(--accent-500);">{{ number_format($apiTraffic['gemini_api_calls']) }}</div>
                    <div class="stat-card-trend" style="color: var(--accent-500); font-weight: 400;"><i class="ti ti-message-chatbot"></i> Total Pesan Dibalas</div>
                    <div style="font-size: 0.6875rem; color: var(--text-muted); margin-top: 0.5rem; border-top: 1px dashed var(--border-light); padding-top: 0.5rem;">
                        <i class="ti ti-coin"></i> ~{{ number_format($apiTraffic['gemini_estimated_tokens']) }} Tokens Terpakai
                    </div>
                </div>

                <div class="stat-card" style="box-shadow: none; border-color: var(--border-light);">
                    <div class="stat-card-label" style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">Traffic AI Inference</div>
                    <div class="stat-card-value" style="font-size: 1.5rem; color: var(--brand-500);">{{ number_format($apiTraffic['refraction_api_calls']) }}</div>
                    <div class="stat-card-trend" style="color: var(--brand-500); font-weight: 400;"><i class="ti ti-eye"></i> Total Deteksi Gambar</div>
                </div>
            </div>
            
            <!-- Traffic Chart -->
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-light);">
                <h3 style="font-size: 0.95rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-primary);">Grafik Penggunaan AI (7 Hari Terakhir)</h3>
                <div style="height: 300px; position: relative;">
                    <canvas id="apiTrafficChart"></canvas>
                </div>
            </div>
        </div>

        <!-- System Actions Card -->
        <div class="card">
            <div class="card-header">
                <div>
                    <h2 class="card-title">Tindakan Pemeliharaan</h2>
                    <p class="card-subtitle">Operasi tingkat lanjut untuk mereset *state* aplikasi.</p>
                </div>
                <div style="padding: 0.5rem; background: var(--accent-50); border-radius: 50%; color: var(--accent-500);">
                    <i class="ti ti-tool" style="font-size: 1.5rem;"></i>
                </div>
            </div>

            <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 1rem;">
                <div style="padding: 1.25rem; border: 1px solid var(--border-light); border-radius: var(--radius-md); background: var(--bg-canvas);">
                    <h3 style="font-size: 0.95rem; font-weight: 600; margin-bottom: 0.25rem; color: var(--text-primary);">Clear All Cache</h3>
                    <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 1rem;">
                        Akan menjalankan perintah <code>artisan cache:clear</code>, <code>view:clear</code>, <code>route:clear</code>, dan <code>config:clear</code>. Sangat direkomendasikan jika perubahan .env tidak terbaca.
                    </p>
                    <form action="{{ route('admin.system.clear-cache') }}" method="POST">
                        @csrf
                        <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;">
                            <i class="ti ti-trash"></i> Bersihkan Cache Sistem
                        </button>
                    </form>
                </div>
                
                <div style="padding: 1.25rem; border: 1px solid var(--danger-100); border-radius: var(--radius-md); background: var(--danger-50);">
                    <h3 style="font-size: 0.95rem; font-weight: 600; margin-bottom: 0.25rem; color: var(--danger-500);">Aksi Berbahaya Lainnya</h3>
                    <p style="font-size: 0.8125rem; color: var(--danger-400); margin-bottom: 1rem;">
                        Akses ke database migrasi / seeder ulang saat ini dikunci secara default demi keamanan server *Production*.
                    </p>
                    <button class="btn btn-danger" style="width: 100%; justify-content: center; opacity: 0.5; cursor: not-allowed;" disabled>
                        <i class="ti ti-alert-triangle"></i> Reset Database (Dikunci)
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('apiTrafficChart').getContext('2d');
    
    // Convert PHP data to Javascript
    const chartLabels = {!! json_encode($chartData['labels']) !!};
    const geminiData = {!! json_encode($chartData['gemini']) !!};
    const refractionData = {!! json_encode($chartData['refraction']) !!};

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartLabels,
            datasets: [
                {
                    label: 'Gemini AI Calls',
                    data: geminiData,
                    borderColor: '#FE9900',
                    backgroundColor: 'rgba(254,153,0,0.08)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#FE9900',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
                {
                    label: 'Flask Inference Calls',
                    data: refractionData,
                    borderColor: '#006666',
                    backgroundColor: 'rgba(0,102,102,0.07)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#006666',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { family: "'Montserrat', sans-serif", size: 11 },
                        usePointStyle: true,
                        boxWidth: 8,
                        color: '#334155',
                    }
                },
                tooltip: {
                    backgroundColor: '#E7E5E4',
                    titleColor: '#1E2938',
                    bodyColor: '#334155',
                    borderColor: '#b5b3b2',
                    borderWidth: 1,
                    titleFont: { family: "'Montserrat', sans-serif", size: 12, weight: '700' },
                    bodyFont: { family: "'Montserrat', sans-serif", size: 11 },
                    padding: 12,
                    cornerRadius: 8,
                    boxShadow: '5px 5px 10px #b5b3b2, -5px -5px 10px #ffffff',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0,
                        font: { family: "'Montserrat', sans-serif", size: 10 },
                        color: '#64748b',
                    },
                    grid: { color: '#dbd8d7', drawBorder: false }
                },
                x: {
                    ticks: {
                        font: { family: "'Montserrat', sans-serif", size: 10 },
                        color: '#64748b',
                    },
                    grid: { display: false, drawBorder: false }
                }
            }
        }
    });
});
</script>
@endsection
