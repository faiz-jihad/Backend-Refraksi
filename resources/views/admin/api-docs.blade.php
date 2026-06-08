@extends('layouts.admin')

@section('title', 'API Documentation')

@section('content')
<div class="animate-in">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
        <span>Admin</span>
        <span class="separator"><i class="ti ti-chevron-right"></i></span>
        <span>Developer</span>
        <span class="separator"><i class="ti ti-chevron-right"></i></span>
        <span>API Docs</span>
    </nav>

    <!-- Page Header -->
    <div class="page-title-section" style="margin-bottom: 2rem;">
        <h1 class="page-title">MataCeria API Reference v1</h1>
        <p class="page-description">Dokumentasi komprehensif REST API untuk aplikasi mobile (Flutter) dan integrasi eksternal. Semua respons menggunakan format standar JSON wrapper.</p>
        <div style="margin-top: 1rem; display: flex; gap: 1rem; flex-wrap: wrap;">
            <span class="badge badge-success" style="font-size: 0.875rem; padding: 0.5rem 1rem;">
                <i class="ti ti-server" style="margin-right: 0.5rem;"></i> Base URL: {{ url('/api/v1') }}
            </span>
            <span class="badge badge-warning" style="font-size: 0.875rem; padding: 0.5rem 1rem;">
                <i class="ti ti-lock" style="margin-right: 0.5rem;"></i> Auth: Bearer Token (Sanctum)
            </span>
            <span class="badge badge-info" style="font-size: 0.875rem; padding: 0.5rem 1rem;">
                <i class="ti ti-code" style="margin-right: 0.5rem;"></i> Content-Type: application/json
            </span>
        </div>
    </div>

    <style>
        .api-endpoint {
            background: var(--bg-surface);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-md);
            margin-bottom: 1rem;
            overflow: hidden;
            transition: all var(--duration-fast) var(--ease-out);
            box-shadow: var(--shadow-sm);
        }
        .api-endpoint:hover {
            box-shadow: var(--shadow-md);
            border-color: var(--border-medium);
        }
        .api-header {
            display: flex;
            align-items: center;
            padding: 1rem 1.5rem;
            gap: 1rem;
            cursor: pointer;
            background: var(--bg-canvas);
            border-bottom: 1px solid transparent;
            user-select: none;
        }
        .api-endpoint.open .api-header {
            border-bottom: 1px solid var(--border-light);
            background: var(--bg-surface);
        }
        .method-badge {
            font-weight: 700;
            font-size: 0.75rem;
            padding: 0.35rem 0.75rem;
            border-radius: var(--radius-sm);
            width: 75px;
            text-align: center;
            letter-spacing: 0.05em;
        }
        .method-GET { background: #e0f2fe; color: #0284c7; }
        .method-POST { background: #dcfce7; color: #16a34a; }
        .method-PUT { background: #fef08a; color: #ca8a04; }
        .method-DELETE { background: #fee2e2; color: #dc2626; }
        
        .api-path {
            font-family: 'Montserrat', sans-serif;
            font-size: 0.95rem;
            font-weight: 600;
            color: var(--text-primary);
        }
        .api-desc {
            font-size: 0.875rem;
            color: var(--text-muted);
            margin-left: auto;
            margin-right: 1rem;
        }
        .api-auth {
            font-size: 1.125rem;
            color: var(--accent-500);
        }
        .api-body {
            display: none;
            padding: 1.5rem;
            background: var(--bg-surface);
        }
        .api-endpoint.open .api-body {
            display: block;
        }
        
        .code-block {
            background: #1e1e1e;
            color: #d4d4d4;
            font-family: 'Montserrat', sans-serif;
            padding: 1.25rem;
            border-radius: var(--radius-sm);
            font-size: 0.8125rem;
            overflow-x: auto;
            margin-top: 0.5rem;
            margin-bottom: 1.5rem;
            border: 1px solid #333;
            line-height: 1.5;
        }
        .code-block span.key { color: #9cdcfe; }
        .code-block span.string { color: #ce9178; }
        .code-block span.number { color: #b5cea8; }
        .code-block span.boolean { color: #569cd6; }

        .api-section-title {
            font-size: 0.875rem;
            font-weight: 700;
            color: var(--text-primary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .api-section-title i {
            color: var(--brand-500);
            font-size: 1.125rem;
        }
        .api-section-title:first-child {
            margin-top: 0;
        }
        .param-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1.5rem;
            background: var(--bg-canvas);
            border-radius: var(--radius-sm);
            overflow: hidden;
            border: 1px solid var(--border-light);
        }
        .param-table th, .param-table td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid var(--border-light);
            font-size: 0.875rem;
            text-align: left;
        }
        .param-table th {
            color: var(--text-muted);
            font-weight: 600;
            background: var(--bg-subtle);
        }
        .param-table tr:last-child td { border-bottom: none; }
        .param-name {
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
            color: var(--brand-600);
        }
        .param-type {
            font-size: 0.75rem;
            color: var(--text-secondary);
            font-style: italic;
            background: var(--bg-surface);
            padding: 0.125rem 0.375rem;
            border-radius: 4px;
            border: 1px solid var(--border-light);
        }
        .param-req {
            color: var(--danger-500);
            font-size: 0.75rem;
            font-weight: 600;
        }
        .param-opt {
            color: var(--text-muted);
            font-size: 0.75rem;
            font-weight: 500;
        }
        
        .section-header {
            margin-bottom: 1.25rem; 
            margin-top: 3rem; 
            color: var(--text-primary); 
            font-size: 1.5rem;
            font-weight: 700;
            border-bottom: 2px solid var(--border-light);
            padding-bottom: 0.5rem;
        }
    </style>

    <!-- Standard Response Template Info -->
    <div class="card" style="margin-bottom: 2rem; background: var(--brand-50); border-color: var(--brand-200);">
        <h3 style="color: var(--brand-700); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
            <i class="ti ti-info-circle"></i> Format Respons Standar (JSON Wrapper)
        </h3>
        <p style="font-size: 0.875rem; color: var(--brand-700); margin-bottom: 1rem;">
            Semua respons API (baik sukses maupun gagal) akan dibungkus dalam format yang konsisten:
        </p>
        <div class="code-block" style="margin-bottom: 0;">{
  <span class="key">"success"</span>: <span class="boolean">true</span>|<span class="boolean">false</span>,
  <span class="key">"message"</span>: <span class="string">"Pesan deskriptif dari server"</span>,
  <span class="key">"data"</span>: { ... } <span class="string">// Object, Array, atau null</span>,
  <span class="key">"errors"</span>: { ... } <span class="string">// Detail validasi (hanya muncul saat validasi gagal)</span>
}</div>
    </div>


    <!-- ==========================================
         GROUP 1: AUTHENTICATION
         ========================================== -->
    <h2 class="section-header">1. Authentication</h2>
    
    <div class="api-endpoint">
        <div class="api-header" onclick="this.parentElement.classList.toggle('open')">
            <span class="method-badge method-POST">POST</span>
            <span class="api-path">/register</span>
            <span class="api-desc">Registrasi Pengguna Baru</span>
        </div>
        <div class="api-body">
            <div class="api-section-title"><i class="ti ti-file-text"></i> Request Body (JSON)</div>
            <table class="param-table">
                <tr><th>Field</th><th>Type</th><th>Requirement</th><th>Description</th></tr>
                <tr><td class="param-name">name</td><td class="param-type">string</td><td class="param-req">Required</td><td>Nama lengkap pengguna</td></tr>
                <tr><td class="param-name">email</td><td class="param-type">string</td><td class="param-req">Required</td><td>Alamat email unik dan valid</td></tr>
                <tr><td class="param-name">password</td><td class="param-type">string</td><td class="param-req">Required</td><td>Password akun (min. 8 karakter)</td></tr>
                <tr><td class="param-name">password_confirmation</td><td class="param-type">string</td><td class="param-req">Required</td><td>Ketik ulang password</td></tr>
                <tr><td class="param-name">umur</td><td class="param-type">integer</td><td class="param-opt">Optional</td><td>Umur pengguna (dalam angka)</td></tr>
                <tr><td class="param-name">kelamin</td><td class="param-type">string</td><td class="param-opt">Optional</td><td>"Laki-laki" atau "Perempuan"</td></tr>
                <tr><td class="param-name">jenjang_pendidikan</td><td class="param-type">string</td><td class="param-opt">Optional</td><td>SD, SMP, SMA, Sarjana, dll</td></tr>
                <tr><td class="param-name">status_pekerjaan</td><td class="param-type">string</td><td class="param-opt">Optional</td><td>Pelajar, Karyawan, Wiraswasta, dll</td></tr>
            </table>
            
            <div class="api-section-title"><i class="ti ti-check"></i> Success Response (201 Created)</div>
            <div class="code-block">{
  <span class="key">"success"</span>: <span class="boolean">true</span>,
  <span class="key">"message"</span>: <span class="string">"Registrasi berhasil"</span>,
  <span class="key">"data"</span>: {
    <span class="key">"user"</span>: {
      <span class="key">"id"</span>: <span class="number">12</span>,
      <span class="key">"name"</span>: <span class="string">"Andi Saputra"</span>,
      <span class="key">"email"</span>: <span class="string">"andi@email.com"</span>,
      <span class="key">"role"</span>: <span class="string">"user"</span>
    },
    <span class="key">"token"</span>: <span class="string">"15|KzU..."</span>
  }
}</div>
        </div>
    </div>

    <div class="api-endpoint">
        <div class="api-header" onclick="this.parentElement.classList.toggle('open')">
            <span class="method-badge method-POST">POST</span>
            <span class="api-path">/login</span>
            <span class="api-desc">Login & Dapatkan Token</span>
        </div>
        <div class="api-body">
            <div class="api-section-title"><i class="ti ti-file-text"></i> Request Body (JSON)</div>
            <table class="param-table">
                <tr><th>Field</th><th>Type</th><th>Requirement</th><th>Description</th></tr>
                <tr><td class="param-name">email</td><td class="param-type">string</td><td class="param-req">Required</td><td>Email yang terdaftar</td></tr>
                <tr><td class="param-name">password</td><td class="param-type">string</td><td class="param-req">Required</td><td>Password pengguna</td></tr>
            </table>

            <div class="api-section-title"><i class="ti ti-check"></i> Success Response (200 OK)</div>
            <div class="code-block">{
  <span class="key">"success"</span>: <span class="boolean">true</span>,
  <span class="key">"message"</span>: <span class="string">"Login berhasil"</span>,
  <span class="key">"data"</span>: {
    <span class="key">"user"</span>: {
      <span class="key">"id"</span>: <span class="number">1</span>,
      <span class="key">"name"</span>: <span class="string">"Admin"</span>,
      <span class="key">"email"</span>: <span class="string">"admin@mataceria.com"</span>,
      <span class="key">"role"</span>: <span class="string">"admin"</span>
    },
    <span class="key">"token"</span>: <span class="string">"16|TzX..."</span>
  }
}</div>
            <div class="api-section-title"><i class="ti ti-alert-circle"></i> Error Response (401 Unauthorized)</div>
            <div class="code-block">{
  <span class="key">"success"</span>: <span class="boolean">false</span>,
  <span class="key">"message"</span>: <span class="string">"Email atau password salah"</span>,
  <span class="key">"data"</span>: <span class="boolean">null</span>
}</div>
        </div>
    </div>

    <div class="api-endpoint">
        <div class="api-header" onclick="this.parentElement.classList.toggle('open')">
            <span class="method-badge method-POST">POST</span>
            <span class="api-path">/logout</span>
            <span class="api-desc">Logout Sesi</span>
            <i class="ti ti-lock api-auth" title="Requires Authentication"></i>
        </div>
        <div class="api-body">
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;">
                Menghancurkan Token Akses Sanctum pengguna saat ini. Memerlukan header <code>Authorization: Bearer {token}</code>.
            </p>
            <div class="api-section-title"><i class="ti ti-check"></i> Success Response (200 OK)</div>
            <div class="code-block">{
  <span class="key">"success"</span>: <span class="boolean">true</span>,
  <span class="key">"message"</span>: <span class="string">"Berhasil logout"</span>,
  <span class="key">"data"</span>: <span class="boolean">null</span>
}</div>
        </div>
    </div>


    <!-- ==========================================
         GROUP 2: PROFILE
         ========================================== -->
    <h2 class="section-header">2. Profile</h2>

    <div class="api-endpoint">
        <div class="api-header" onclick="this.parentElement.classList.toggle('open')">
            <span class="method-badge method-GET">GET</span>
            <span class="api-path">/profile</span>
            <span class="api-desc">Ambil Detail Profil</span>
            <i class="ti ti-lock api-auth" title="Requires Authentication"></i>
        </div>
        <div class="api-body">
            <div class="api-section-title"><i class="ti ti-check"></i> Success Response (200 OK)</div>
            <div class="code-block">{
  <span class="key">"success"</span>: <span class="boolean">true</span>,
  <span class="key">"message"</span>: <span class="string">"Profil berhasil diambil"</span>,
  <span class="key">"data"</span>: {
    <span class="key">"id"</span>: <span class="number">12</span>,
    <span class="key">"name"</span>: <span class="string">"Andi Saputra"</span>,
    <span class="key">"email"</span>: <span class="string">"andi@email.com"</span>,
    <span class="key">"umur"</span>: <span class="number">24</span>,
    <span class="key">"kelamin"</span>: <span class="string">"Laki-laki"</span>,
    <span class="key">"jenjang_pendidikan"</span>: <span class="string">"Sarjana"</span>,
    <span class="key">"status_pekerjaan"</span>: <span class="string">"Karyawan"</span>,
    <span class="key">"profile_picture"</span>: <span class="string">"http://127.0.0.1:8000/storage/avatars/abc.jpg"</span>
  }
}</div>
        </div>
    </div>

    <div class="api-endpoint">
        <div class="api-header" onclick="this.parentElement.classList.toggle('open')">
            <span class="method-badge method-PUT">PUT</span>
            <span class="api-path">/profile</span>
            <span class="api-desc">Update Data Profil</span>
            <i class="ti ti-lock api-auth" title="Requires Authentication"></i>
        </div>
        <div class="api-body">
            <div class="api-section-title"><i class="ti ti-file-text"></i> Request Body (JSON)</div>
            <table class="param-table">
                <tr><th>Field</th><th>Type</th><th>Requirement</th><th>Description</th></tr>
                <tr><td class="param-name">name</td><td class="param-type">string</td><td class="param-opt">Optional</td><td>Nama lengkap baru</td></tr>
                <tr><td class="param-name">umur</td><td class="param-type">integer</td><td class="param-opt">Optional</td><td>Umur</td></tr>
                <tr><td class="param-name">kelamin</td><td class="param-type">string</td><td class="param-opt">Optional</td><td>"Laki-laki" / "Perempuan"</td></tr>
                <tr><td class="param-name">jenjang_pendidikan</td><td class="param-type">string</td><td class="param-opt">Optional</td><td>SD, SMP, SMA, Sarjana</td></tr>
                <tr><td class="param-name">status_pekerjaan</td><td class="param-type">string</td><td class="param-opt">Optional</td><td>Status Pekerjaan</td></tr>
            </table>
            <div class="api-section-title"><i class="ti ti-check"></i> Success Response (200 OK)</div>
            <div class="code-block">{
  <span class="key">"success"</span>: <span class="boolean">true</span>,
  <span class="key">"message"</span>: <span class="string">"Profil berhasil diperbarui"</span>,
  <span class="key">"data"</span>: { ...updated_user_object... }
}</div>
        </div>
    </div>

    <div class="api-endpoint">
        <div class="api-header" onclick="this.parentElement.classList.toggle('open')">
            <span class="method-badge method-POST">POST</span>
            <span class="api-path">/profile/avatar</span>
            <span class="api-desc">Update Foto Profil (Avatar)</span>
            <i class="ti ti-lock api-auth" title="Requires Authentication"></i>
        </div>
        <div class="api-body">
            <div class="api-section-title"><i class="ti ti-file-text"></i> Request (Multipart / Form-Data)</div>
            <table class="param-table">
                <tr><th>Field</th><th>Type</th><th>Requirement</th><th>Description</th></tr>
                <tr><td class="param-name">image</td><td class="param-type">file</td><td class="param-req">Required</td><td>Gambar Avatar (JPG, PNG, maks 2MB)</td></tr>
            </table>
            <div class="api-section-title"><i class="ti ti-check"></i> Success Response (200 OK)</div>
            <div class="code-block">{
  <span class="key">"success"</span>: <span class="boolean">true</span>,
  <span class="key">"message"</span>: <span class="string">"Foto profil berhasil diperbarui"</span>,
  <span class="key">"data"</span>: { ...updated_user_object... }
}</div>
        </div>
    </div>


    <!-- ==========================================
         GROUP 3: REFRACTION
         ========================================== -->
    <h2 class="section-header">3. Refraction (Deteksi Mata)</h2>

    <div class="api-endpoint">
        <div class="api-header" onclick="this.parentElement.classList.toggle('open')">
            <span class="method-badge method-POST">POST</span>
            <span class="api-path">/refraction/predict</span>
            <span class="api-desc">Prediksi dengan Model AI Vision (Kamera)</span>
            <i class="ti ti-lock api-auth" title="Requires Authentication"></i>
        </div>
        <div class="api-body">
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;">
                Endpoint ini mengirimkan file gambar kamera ke Python Flask Inference Server. Endpoint backend Laravel bertindak sebagai Proxy dan menyimpan hasil deteksi otomatis ke riwayat Refraksi.
            </p>
            <div class="api-section-title"><i class="ti ti-file-text"></i> Request (Multipart / Form-Data)</div>
            <table class="param-table">
                <tr><th>Field</th><th>Type</th><th>Requirement</th><th>Description</th></tr>
                <tr><td class="param-name">image</td><td class="param-type">file</td><td class="param-req">Required</td><td>Foto retina / mata (PNG/JPG)</td></tr>
            </table>
            
            <div class="api-section-title"><i class="ti ti-check"></i> Success Response (200 OK)</div>
            <div class="code-block">{
  <span class="key">"success"</span>: <span class="boolean">true</span>,
  <span class="key">"message"</span>: <span class="string">"Analisis gambar selesai"</span>,
  <span class="key">"data"</span>: {
    <span class="key">"id"</span>: <span class="number">10</span>,
    <span class="key">"condition"</span>: <span class="string">"Miopia"</span>,
    <span class="key">"confidence"</span>: <span class="number">98.5</span>,
    <span class="key">"recommendation"</span>: <span class="string">"Disarankan memakai kacamata minus"</span>,
    <span class="key">"created_at"</span>: <span class="string">"2026-05-15T10:00:00.000000Z"</span>
  }
}</div>
        </div>
    </div>

    <div class="api-endpoint">
        <div class="api-header" onclick="this.parentElement.classList.toggle('open')">
            <span class="method-badge method-POST">POST</span>
            <span class="api-path">/refraction/analyze</span>
            <span class="api-desc">Simpan Hasil Tes Snellen Manual</span>
            <i class="ti ti-lock api-auth" title="Requires Authentication"></i>
        </div>
        <div class="api-body">
            <div class="api-section-title"><i class="ti ti-file-text"></i> Request Body (JSON)</div>
            <table class="param-table">
                <tr><th>Field</th><th>Type</th><th>Requirement</th><th>Description</th></tr>
                <tr><td class="param-name">right_eye_sphere</td><td class="param-type">float</td><td class="param-req">Required</td><td>Nilai Sphere mata kanan</td></tr>
                <tr><td class="param-name">left_eye_sphere</td><td class="param-type">float</td><td class="param-req">Required</td><td>Nilai Sphere mata kiri</td></tr>
                <tr><td class="param-name">right_eye_cylinder</td><td class="param-type">float</td><td class="param-opt">Optional</td><td>Nilai Silinder mata kanan</td></tr>
                <tr><td class="param-name">left_eye_cylinder</td><td class="param-type">float</td><td class="param-opt">Optional</td><td>Nilai Silinder mata kiri</td></tr>
                <tr><td class="param-name">visual_acuity</td><td class="param-type">string</td><td class="param-req">Required</td><td>Ketajaman penglihatan (misal: "20/40")</td></tr>
            </table>
            
            <div class="api-section-title"><i class="ti ti-check"></i> Success Response (200 OK)</div>
            <div class="code-block">{
  <span class="key">"success"</span>: <span class="boolean">true</span>,
  <span class="key">"message"</span>: <span class="string">"Data Snellen tersimpan"</span>,
  <span class="key">"data"</span>: { ...refraction_result_object... }
}</div>
        </div>
    </div>
    
    <div class="api-endpoint">
        <div class="api-header" onclick="this.parentElement.classList.toggle('open')">
            <span class="method-badge method-GET">GET</span>
            <span class="api-path">/refraction/history</span>
            <span class="api-desc">Riwayat Refraksi User</span>
            <i class="ti ti-lock api-auth" title="Requires Authentication"></i>
        </div>
        <div class="api-body">
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;">
                Mendapatkan daftar lengkap pemeriksaan mata yang pernah dilakukan pengguna (Pagination disediakan).
            </p>
            <div class="api-section-title"><i class="ti ti-check"></i> Success Response (200 OK)</div>
            <div class="code-block">{
  <span class="key">"success"</span>: <span class="boolean">true</span>,
  <span class="key">"message"</span>: <span class="string">"Berhasil"</span>,
  <span class="key">"data"</span>: {
    <span class="key">"data"</span>: [
      {
        <span class="key">"id"</span>: <span class="number">10</span>,
        <span class="key">"vision_type"</span>: <span class="string">"Miopia"</span>,
        <span class="key">"right_eye_sphere"</span>: <span class="number">-1.5</span>,
        <span class="key">"created_at"</span>: <span class="string">"2026-05-15T10:00:00.000000Z"</span>
      }
    ],
    <span class="key">"current_page"</span>: <span class="number">1</span>,
    <span class="key">"total"</span>: <span class="number">1</span>
  }
}</div>
        </div>
    </div>


    <!-- ==========================================
         GROUP 4: CHAT AI CONSULTATION
         ========================================== -->
    <h2 class="section-header">4. Chat Consultation (Gemini AI)</h2>

    <div class="api-endpoint">
        <div class="api-header" onclick="this.parentElement.classList.toggle('open')">
            <span class="method-badge method-POST">POST</span>
            <span class="api-path">/chat/send</span>
            <span class="api-desc">Kirim Pesan ke AI Konsultan</span>
            <i class="ti ti-lock api-auth" title="Requires Authentication"></i>
        </div>
        <div class="api-body">
            <div class="api-section-title"><i class="ti ti-file-text"></i> Request Body (JSON)</div>
            <table class="param-table">
                <tr><th>Field</th><th>Type</th><th>Requirement</th><th>Description</th></tr>
                <tr><td class="param-name">message</td><td class="param-type">string</td><td class="param-req">Required</td><td>Pesan / pertanyaan dari user</td></tr>
                <tr><td class="param-name">session_id</td><td class="param-type">string</td><td class="param-opt">Optional</td><td>ID Sesi. Jika kosong, akan dibuat Sesi baru.</td></tr>
                <tr><td class="param-name">refraction_result</td><td class="param-type">string</td><td class="param-opt">Optional</td><td>Info kondisi medis untuk konteks prompt AI</td></tr>
            </table>
            
            <div class="api-section-title"><i class="ti ti-check"></i> Success Response (200 OK)</div>
            <div class="code-block">{
  <span class="key">"success"</span>: <span class="boolean">true</span>,
  <span class="key">"message"</span>: <span class="string">"Berhasil"</span>,
  <span class="key">"data"</span>: {
    <span class="key">"session_id"</span>: <span class="string">"uuid-abc-123"</span>,
    <span class="key">"ai_response"</span>: <span class="string">"Tentu, berdasarkan hasil tes Miopia Anda, disarankan..."</span>
  }
}</div>
        </div>
    </div>

    <div class="api-endpoint">
        <div class="api-header" onclick="this.parentElement.classList.toggle('open')">
            <span class="method-badge method-GET">GET</span>
            <span class="api-path">/chat/sessions</span>
            <span class="api-desc">Daftar Sesi Chat Terakhir</span>
            <i class="ti ti-lock api-auth" title="Requires Authentication"></i>
        </div>
        <div class="api-body">
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;">
                Mendapatkan daftar sesi percakapan chat historis pengguna.
            </p>
        </div>
    </div>
    
    <div class="api-endpoint">
        <div class="api-header" onclick="this.parentElement.classList.toggle('open')">
            <span class="method-badge method-GET">GET</span>
            <span class="api-path">/chat/messages/{sessionId}</span>
            <span class="api-desc">Isi Percakapan (Pesan) per Sesi</span>
            <i class="ti ti-lock api-auth" title="Requires Authentication"></i>
        </div>
        <div class="api-body">
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;">
                Mendapatkan array message (dari user dan AI) yang tergabung dalam satu <code>sessionId</code>.
            </p>
        </div>
    </div>

    <!-- ==========================================
         GROUP 5: PUBLIC INFO
         ========================================== -->
    <h2 class="section-header">5. Resources (Public / No Auth)</h2>

    <div class="api-endpoint">
        <div class="api-header" onclick="this.parentElement.classList.toggle('open')">
            <span class="method-badge method-GET">GET</span>
            <span class="api-path">/articles</span>
            <span class="api-desc">Daftar Artikel Edukasi</span>
        </div>
        <div class="api-body">
            <div class="api-section-title"><i class="ti ti-search"></i> Query Parameters</div>
            <table class="param-table">
                <tr><th>Query</th><th>Type</th><th>Requirement</th><th>Description</th></tr>
                <tr><td class="param-name">category</td><td class="param-type">string</td><td class="param-opt">Optional</td><td>Filter artikel berdasarkan kategori</td></tr>
            </table>
            
            <div class="api-section-title"><i class="ti ti-check"></i> Success Response (200 OK)</div>
            <div class="code-block">{
  <span class="key">"success"</span>: <span class="boolean">true</span>,
  <span class="key">"message"</span>: <span class="string">""</span>,
  <span class="key">"data"</span>: [
    {
      <span class="key">"id"</span>: <span class="number">1</span>,
      <span class="key">"title"</span>: <span class="string">"Mengenal Katarak Sejak Dini"</span>,
      <span class="key">"content"</span>: <span class="string">"Katarak adalah..."</span>,
      <span class="key">"category"</span>: <span class="string">"Penyakit"</span>,
      <span class="key">"image_url"</span>: <span class="string">"http://..."</span>
    }
  ]
}</div>
        </div>
    </div>

    <div class="api-endpoint">
        <div class="api-header" onclick="this.parentElement.classList.toggle('open')">
            <span class="method-badge method-GET">GET</span>
            <span class="api-path">/hospitals</span>
            <span class="api-desc">Daftar RS & Klinik Rujukan</span>
        </div>
        <div class="api-body">
            <div class="api-section-title"><i class="ti ti-search"></i> Query Parameters</div>
            <table class="param-table">
                <tr><th>Query</th><th>Type</th><th>Requirement</th><th>Description</th></tr>
                <tr><td class="param-name">search</td><td class="param-type">string</td><td class="param-opt">Optional</td><td>Cari berdasarkan nama atau alamat</td></tr>
            </table>
            
            <div class="api-section-title"><i class="ti ti-check"></i> Success Response (200 OK)</div>
            <div class="code-block">{
  <span class="key">"success"</span>: <span class="boolean">true</span>,
  <span class="key">"message"</span>: <span class="string">""</span>,
  <span class="key">"data"</span>: [
    {
      <span class="key">"id"</span>: <span class="number">1</span>,
      <span class="key">"name"</span>: <span class="string">"RS Mata JEC"</span>,
      <span class="key">"address"</span>: <span class="string">"Jl. Teuku Cik Ditiro No.46"</span>,
      <span class="key">"city"</span>: <span class="string">"Jakarta Pusat"</span>,
      <span class="key">"latitude"</span>: <span class="number">-6.195</span>,
      <span class="key">"longitude"</span>: <span class="number">106.840</span>
    }
  ]
}</div>
        </div>
    </div>

    <!-- ==========================================
         GROUP 6: ADMIN ENDPOINTS
         ========================================== -->
    <h2 class="section-header">6. Admin Panel (Role Required)</h2>
    <div style="background: var(--danger-50); border: 1px solid var(--danger-100); border-radius: var(--radius-sm); padding: 1rem; margin-bottom: 1.5rem;">
        <i class="ti ti-alert-triangle" style="color: var(--danger-500); margin-right: 0.5rem;"></i> 
        <span style="color: var(--danger-500); font-size: 0.875rem; font-weight: 500;">Perhatian: Semua rute di bawah ini wajib melampirkan Token dengan Role `admin`. Mengembalikan Error 403 Forbidden jika diakses oleh akun reguler.</span>
    </div>

    <div class="api-endpoint">
        <div class="api-header" onclick="this.parentElement.classList.toggle('open')">
            <span class="method-badge method-GET">GET</span>
            <span class="api-path">/admin/users</span>
            <span class="api-desc">Tarik Semua Data Pengguna</span>
            <i class="ti ti-lock api-auth" title="Admin Auth"></i>
        </div>
        <div class="api-body">
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;">
                Digunakan oleh fitur "Ekspor CSV" di mobile admin dashboard. Mengembalikan List JSON array berisi seluruh akun yang terdaftar.
            </p>
        </div>
    </div>

    <div class="api-endpoint">
        <div class="api-header" onclick="this.parentElement.classList.toggle('open')">
            <span class="method-badge method-POST">POST</span>
            <span class="api-path">/admin/articles</span>
            <span class="api-desc">Buat Artikel Baru</span>
            <i class="ti ti-lock api-auth" title="Admin Auth"></i>
        </div>
        <div class="api-body">
            <div class="api-section-title"><i class="ti ti-file-text"></i> Request Body (JSON)</div>
            <table class="param-table">
                <tr><th>Field</th><th>Type</th><th>Requirement</th><th>Description</th></tr>
                <tr><td class="param-name">title</td><td class="param-type">string</td><td class="param-req">Required</td><td>Judul Artikel (Slug otomatis digenerate)</td></tr>
                <tr><td class="param-name">content</td><td class="param-type">string</td><td class="param-req">Required</td><td>Isi konten / paragraf</td></tr>
                <tr><td class="param-name">category</td><td class="param-type">string</td><td class="param-opt">Optional</td><td>Kategori / Label edukasi</td></tr>
                <tr><td class="param-name">image_url</td><td class="param-type">string</td><td class="param-opt">Optional</td><td>URL cover image artikel</td></tr>
            </table>
        </div>
    </div>
    
    <div class="api-endpoint">
        <div class="api-header" onclick="this.parentElement.classList.toggle('open')">
            <span class="method-badge method-PUT">PUT</span>
            <span class="api-path">/admin/articles/{id}</span>
            <span class="api-desc">Update Artikel Terpilih</span>
            <i class="ti ti-lock api-auth" title="Admin Auth"></i>
        </div>
        <div class="api-body">
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;">
                Sama dengan POST, namun parameter request dikirim untuk memperbarui atribut spesifik (Gunakan ID di Path parameter).
            </p>
        </div>
    </div>

    <div class="api-endpoint">
        <div class="api-header" onclick="this.parentElement.classList.toggle('open')">
            <span class="method-badge method-POST">POST</span>
            <span class="api-path">/admin/emergency-contacts</span>
            <span class="api-desc">Buat RS/Klinik Rujukan Baru</span>
            <i class="ti ti-lock api-auth" title="Admin Auth"></i>
        </div>
        <div class="api-body">
            <div class="api-section-title"><i class="ti ti-file-text"></i> Request Body (JSON)</div>
            <table class="param-table">
                <tr><th>Field</th><th>Type</th><th>Requirement</th><th>Description</th></tr>
                <tr><td class="param-name">name</td><td class="param-type">string</td><td class="param-req">Required</td><td>Nama Instansi Kesehatan</td></tr>
                <tr><td class="param-name">address</td><td class="param-type">string</td><td class="param-req">Required</td><td>Alamat lokasi gedung</td></tr>
                <tr><td class="param-name">city</td><td class="param-type">string</td><td class="param-opt">Optional</td><td>Lokasi kota/kabupaten</td></tr>
                <tr><td class="param-name">phone</td><td class="param-type">string</td><td class="param-opt">Optional</td><td>No telepon UGD</td></tr>
                <tr><td class="param-name">latitude</td><td class="param-type">float</td><td class="param-opt">Optional</td><td>Koordinat Peta (Lat)</td></tr>
                <tr><td class="param-name">longitude</td><td class="param-type">float</td><td class="param-opt">Optional</td><td>Koordinat Peta (Lng)</td></tr>
            </table>
        </div>
    </div>
    
    <div class="api-endpoint">
        <div class="api-header" onclick="this.parentElement.classList.toggle('open')">
            <span class="method-badge method-DELETE">DEL</span>
            <span class="api-path">/admin/emergency-contacts/{id}</span>
            <span class="api-desc">Hapus Kontak Rujukan</span>
            <i class="ti ti-lock api-auth" title="Admin Auth"></i>
        </div>
        <div class="api-body">
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;">
                Menghapus instance RS / Klinik secara permanen dari Database.
            </p>
        </div>
    </div>

</div>

<!-- Auto-open First Item functionality for UX -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Open the first endpoint by default
    const firstEndpoint = document.querySelector('.api-endpoint');
    if (firstEndpoint) {
        firstEndpoint.classList.add('open');
    }
});
</script>
@endsection

