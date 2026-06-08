@extends('layouts.admin')

@section('title', 'Buku Panduan Lengkap (User Guide)')

@section('content')
<style>
    .guide-card {
        background: var(--bg-surface);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-md);
        padding: 2rem;
        margin-bottom: 2rem;
    }
    .guide-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 2px dashed var(--border-light);
    }
    .guide-header i {
        font-size: 2rem;
        color: var(--brand-500);
        background: var(--brand-50);
        padding: 0.75rem;
        border-radius: var(--radius-sm);
    }
    .guide-header h3 {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
    }
    .guide-content p {
        font-size: 0.95rem;
        color: var(--text-secondary);
        line-height: 1.7;
        margin-bottom: 1rem;
    }
    .guide-content h4 {
        font-size: 1rem;
        color: var(--text-primary);
        margin: 1.5rem 0 0.75rem 0;
        font-weight: 600;
    }
    .guide-content ul, .guide-content ol {
        margin-left: 1.5rem;
        margin-bottom: 1.5rem;
        color: var(--text-secondary);
        font-size: 0.95rem;
        line-height: 1.7;
    }
    .guide-content li {
        margin-bottom: 0.5rem;
    }
    .guide-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.2rem 0.6rem;
        background: var(--accent-50);
        color: var(--accent-600);
        border-radius: 4px;
        font-weight: 600;
        font-size: 0.75rem;
        border: 1px solid rgba(212, 149, 43, 0.2);
    }
    .guide-alert {
        padding: 1rem 1.5rem;
        background: var(--info-50);
        border-left: 4px solid var(--info-500);
        border-radius: 4px;
        margin-bottom: 1.5rem;
    }
    .guide-alert.warning {
        background: var(--warning-50);
        border-left-color: var(--warning-500);
    }
    .guide-alert strong {
        color: var(--text-primary);
        display: block;
        margin-bottom: 0.25rem;
    }
    .guide-alert p {
        margin: 0;
        font-size: 0.875rem;
    }
    .code-snippet {
        background: var(--bg-canvas);
        border: 1px solid var(--border-light);
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.85rem;
        color: var(--danger-500);
    }
</style>

<div class="animate-in">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
        <a href="{{ route('admin.dashboard') }}">Dashboard</a>
        <span class="separator"><i class="ti ti-chevron-right"></i></span>
        <span>Panduan Lengkap Sistem</span>
    </nav>

    <!-- Page Header -->
    <div class="page-title-section">
        <h1 class="page-title">Buku Panduan Sistem MataCeria</h1>
        <p class="page-description">Pelajari fungsionalitas mendalam setiap fitur di dalam panel admin untuk memaksimalkan kontrol operasional klinik/aplikasi Anda.</p>
    </div>

    <!-- 1. DASHBOARD OVERVIEW -->
    <div class="guide-card">
        <div class="guide-header">
            <i class="ti ti-layout-dashboard"></i>
            <h3>1. Navigasi & Analisa Dashboard</h3>
        </div>
        <div class="guide-content">
            <p>Menu <b>Dashboard</b> adalah titik pemantauan tertinggi (Bird's-eye view) terhadap performa keseluruhan ekosistem MataCeria.</p>
            
            <h4>Membaca Grafik Top Pengguna Teraktif</h4>
            <p>Di tengah dashboard, terdapat grafik batang (Bar Chart) bernama <b>"Top 5 Pengguna Teraktif"</b>. Grafik ini dihitung secara otomatis dengan memindai tabel riwayat deteksi.</p>
            <ul>
                <li>Sumbu bawah (X) merepresentasikan <b>Nama Pengguna</b>.</li>
                <li>Sumbu samping (Y) menunjukkan <b>Total Frekuensi</b> seberapa sering orang tersebut menggunakan kamera untuk memindai mata.</li>
                <li>Gunakan grafik ini untuk memberikan <i>reward</i>, menindaklanjuti secara medis, atau memantau pasien yang paling bergantung pada layanan Anda.</li>
            </ul>

            <div class="guide-alert">
                <strong>💡 Tip Interaksi</strong>
                <p>Arahkan kursor mouse (hover) ke setiap balok kuning pada grafik atau angka stat card di bagian atas layar untuk melihat detail presisinya.</p>
            </div>
        </div>
    </div>

    <!-- 2. MANAJEMEN PENGGUNA & GRAFIK PERSONAL -->
    <div class="guide-card">
        <div class="guide-header">
            <i class="ti ti-user-scan"></i>
            <h3>2. Mengelola Pengguna & Grafik Rekam Medis Personal</h3>
        </div>
        <div class="guide-content">
            <p>Panel <b>Pengguna</b> menyimpan seluruh informasi dasar, akses otorisasi, serta riwayat perkembangan fisik mata pengguna.</p>
            
            <h4>Membaca Grafik Perkembangan Penyakit Mata (Refraksi)</h4>
            <p>Untuk melihat rekam medis personal:</p>
            <ol>
                <li>Buka menu <span class="guide-badge"><i class="ti ti-users"></i> Pengguna</span>.</li>
                <li>Klik tombol <span class="guide-badge"><i class="ti ti-pencil"></i> Edit</span> (Ikon kuning) pada nama pengguna yang dituju.</li>
                <li>Geser (Scroll) ke bagian paling bawah halaman edit. Anda akan menemukan grafik garis spesifik milik individu tersebut.</li>
            </ol>
            
            <h4>Cara Menginterpretasikan Kurva Garis:</h4>
            <ul>
                <li><b>Garis Hijau:</b> Menandakan Spheris Mata Kanan (Right Eye).</li>
                <li><b>Garis Kuning:</b> Menandakan Spheris Mata Kiri (Left Eye).</li>
                <li><b>Kurva Menurun (Negatif):</b> Jika garis bergerak dari -1.0 lalu bulan depannya menjadi -2.5, ini berarti penyakit <b>Rabun Jauh (Miopi) semakin memburuk/parah</b>.</li>
                <li><b>Kurva Mendekati 0:</b> Jika dari -3.0 naik menjadi -1.5, berarti kondisi mata pasien <b>membaik</b>.</li>
            </ul>

            <h4>Limitasi & Rate Limit AI</h4>
            <p>Sistem ini terhubung langsung ke mesin pembelajaran cerdas (AI) yang memiliki biaya per-<i>request</i>. Oleh karena itu, diterapkan sistem Limitasi Otomatis (Rate Limiter):</p>
            <ul>
                <li><b>Role User:</b> Dibatasi hanya boleh menggunakan <span class="code-snippet">Chatbot 10x per hari</span> dan <span class="code-snippet">Deteksi Gambar 10x per hari</span>. Angka ini akan di-<i>reset</i> otomatis saat lewat tengah malam.</li>
                <li><b>Role Admin:</b> Bebas limit (Unlimited). Anda bisa mengetes fungsionalitas sistem kapan saja.</li>
            </ul>
        </div>
    </div>

    <!-- 3. DETEKSI & KONSULTASI AI -->
    <div class="guide-card">
        <div class="guide-header">
            <i class="ti ti-brain"></i>
            <h3>3. Evaluasi Hasil Deteksi & Riwayat Chatbot</h3>
        </div>
        <div class="guide-content">
            <p>Aplikasi MataCeria ditenagai oleh 2 mesin terpisah: AI Python (Flask) untuk mata, dan Google Gemini AI untuk teks (Chatbot).</p>

            <h4>Menu "Hasil Periksa" (Log Flask AI)</h4>
            <p>Seluruh hasil jepretan kamera pasien (tes Snellen/Refraksi) direkam di menu ini. Anda dapat memeriksa hasil <b>Visual Acuity</b> (misalnya 20/20, 20/40) dan diagnosa silinder (Astigmatisme). Jika hasil dari mesin dirasa keliru, admin dapat menghubungi pasien secara langsung menggunakan nomor telepon yang tersimpan.</p>

            <h4>Menu "Chat AI" (Log Gemini AI)</h4>
            <p>Buka menu ini untuk mengevaluasi semua konsultasi kesehatan yang dilakukan pasien dengan robot Gemini. Semua isi pesan dapat dibaca oleh Admin untuk keperluan Quality Control (QC).</p>
            <div class="guide-alert warning">
                <strong>⚠️ Privasi Percakapan</strong>
                <p>Meskipun Anda bisa membaca semua pesan, mohon junjung tinggi kerahasiaan medis (Patient Confidentiality) saat meninjau log obrolan AI.</p>
            </div>
        </div>
    </div>

    <!-- 4. KONTEN EDUKASI & RS RUJUKAN -->
    <div class="guide-card">
        <div class="guide-header">
            <i class="ti ti-book"></i>
            <h3>4. Kelola Artikel & Rumah Sakit Rujukan</h3>
        </div>
        <div class="guide-content">
            <p>Fitur interaktif yang bisa dikirimkan langsung (Broadcast) ke layar HP pasien.</p>
            <ul>
                <li><b>Artikel:</b> Buka <span class="guide-badge"><i class="ti ti-news"></i> Artikel Berita</span> lalu buat konten edukasi baru (misalnya "Cara Mengatasi Mata Lelah"). Tambahkan link gambar yang valid agar desain di aplikasi <i>mobile</i> terlihat menarik. Jika artikel dihapus di sini, maka otomatis hilang dari HP pengguna.</li>
                <li><b>RS Rujukan:</b> Berfungsi sebagai <i>Panic Button</i> atau daftar rujukan medis fisik. Tambahkan data fasilitas kesehatan terdekat (Nama, Kota, Alamat, Nomor Telepon) di menu <span class="guide-badge"><i class="ti ti-building-hospital"></i> RS Rujukan</span>.</li>
            </ul>
        </div>
    </div>

    <!-- 5. MONITORING SYSTEM & TRAFFIC API -->
    <div class="guide-card">
        <div class="guide-header">
            <i class="ti ti-server-cog"></i>
            <h3>5. System Panel & Traffic Observers</h3>
        </div>
        <div class="guide-content">
            <p>Menu <b>Sistem</b> memberikan status teknis mendalam tentang <i>backend</i> aplikasi, dirancang agar Administrator tidak perlu membuka akses server Linux.</p>

            <h4>Fitur Pemantauan (Traffic AI)</h4>
            <ul>
                <li><b>Total Token Sanctum:</b> Jumlah sesi masuk (Login) yang pernah terjadi dari HP pengguna.</li>
                <li><b>Token Aktif (24 Jam):</b> Jumlah *user* unik yang benar-benar membuka aplikasi *mobile* hari ini.</li>
                <li><b>Estimasi Token AI (Gemini):</b> Google Cloud mematok harga berdasarkan "Token" per API Call. Karena <i>backend</i> kita tidak bisa mengambil metrik asli Google, panel kami menghitung mundur secara prediktif (Total Karakter Database ÷ 4). Anda bisa merujuk pada estimasi tagihan Google Anda berdasarkan angka metrik 🪙 <code>Tokens Terpakai</code> ini.</li>
            </ul>

            <h4>Clear System Cache</h4>
            <p>Seringkali aplikasi mengalami "nyangkut" atau foto/artikel baru tidak muncul di aplikasi klien. Tekan tombol <span class="guide-badge">Clear Cache & Optimize</span> untuk membersihkan memori sementara <i>Server</i> dan memaksanya memuat ulang *database* yang baru.</p>
        </div>
    </div>

    <!-- 6. BACKUP DATABASE -->
    <div class="guide-card" style="margin-bottom: 0;">
        <div class="guide-header">
            <i class="ti ti-database-export"></i>
            <h3>6. Panduan Backup Database</h3>
        </div>
        <div class="guide-content">
            <p>Penting! Lakukan proses ini setidaknya seminggu sekali untuk mencegah musibah data hilang atau kerusakan peladen.</p>
            <ol>
                <li>Buka menu <span class="guide-badge"><i class="ti ti-database"></i> Backup Database</span> di sisi kiri.</li>
                <li>Panel akan menunjukkan seberapa penuh tabel database Anda (Berapa *row* data di tiap tabel).</li>
                <li>Klik tombol biru besar <span class="guide-badge"><i class="ti ti-download"></i> Unduh Full Backup (.json)</span>.</li>
                <li>File hasil unduhan (contoh: <code>mataceria_backup_2025_01_01.json</code>) bersifat sangat rahasia karena memuat seluruh data medis. Simpan file ini di <i>Harddisk External</i> yang di-<i>password</i> atau Brankas.</li>
            </ol>
            <div class="guide-alert">
                <strong>📝 Format Standar</strong>
                <p>Data diekspor ke dalam format JSON berstruktur karena format ini paling bersahabat untuk dimigrasikan ke arsitektur server tipe apapun (MySQL, PostgreSQL, MongoDB, atau NoSQL) di kemudian hari jika bisnis berkembang.</p>
            </div>
        </div>
    </div>

</div>
@endsection

