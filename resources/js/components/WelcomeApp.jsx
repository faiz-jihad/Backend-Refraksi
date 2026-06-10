/**
 * WelcomeApp — MataCeria Landing Page
 * Palette: Calm green (Roader-inspired) + white base
 * Animations: GSAP page-load curtain + staggered hero + scroll-reveal throughout
 * Multi-Language: English, Japanese, Spanish, Indonesian, Chinese (i18n Context)
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import {
    Smartphone,
    Eye,
    Target,
    BarChart3,
    ClipboardList,
    Bot,
    Rocket,
    MessageSquare,
    FileText,
    Star,
    Shield,
    Zap,
    Lightbulb,
    Check,
    Play,
    X
} from 'lucide-react';

/* ═══════════════════════════════════════════════
   DESIGN TOKENS — calm emerald-green palette
   ═══════════════════════════════════════════════ */
export const T = {
    bg:       '#FFFFFF',
    bgAlt:    '#F4FAF6',           // very soft green tint
    bgDark:   '#0A1F12',           // deep forest dark
    text:     '#0F2918',           // dark forest green
    text2:    '#3D6B52',           // medium muted green
    text3:    '#8AAD97',           // light muted green
    brand:    '#16A34A',           // calm medium green
    brandL:   '#22C55E',           // brighter green
    brandD:   '#15803D',           // deeper green
    accent:   '#059669',           // emerald teal
    accentL:  '#34D399',           // light emerald
    grad:     'linear-gradient(135deg, #22C55E 0%, #059669 100%)',
    gradSoft: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(5,150,105,0.1) 100%)',
    gradDark: 'linear-gradient(135deg, #16A34A 0%, #059669 100%)',
    border:   '#E2F0E8',
    borderM:  '#B6D9C2',
    shadow:   '0 4px 24px rgba(22,163,74,0.1)',
    shadowM:  '0 8px 32px rgba(22,163,74,0.18)',
    font:     "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

/* ═══════════════════════════════════════════════
   TRANSLATION DICTIONARY
   ═══════════════════════════════════════════════ */
export const T_DICT = {
    id: {
        nav_home: 'Beranda',
        nav_features: 'Fitur',
        nav_how_it_works: 'Cara Kerja',
        nav_reviews: 'Ulasan',
        nav_download: 'Download',
        nav_login: 'Masuk',
        nav_hello: 'Hai',
        nav_dashboard: 'Dashboard',
        
        hero_badge: 'Aplikasi Kesehatan Mata #1 Indonesia',
        hero_title_1: 'Download App,',
        hero_title_2: 'Uji Mata Kamu,',
        hero_title_3: 'Lihat Lebih Jelas!',
        hero_desc: 'Download MataCeria dari PlayStore atau App Store, buat akun gratis, dan uji kesehatan mata rabun jauh, rabun dekat, dan silinder hanya dalam 3 menit.',
        hero_rating: '4.9/5 Rating',
        hero_reviews_count: '12.000+ ulasan',
        hero_trust_med: 'Terstandarisasi Medis',
        hero_trust_inst: 'Hasil instan',
        hero_diagnostics: 'Diagnostik',
        hero_normal: 'Normal',
        hero_scroll: 'Gulir',
        
        hiw_badge: 'Mudah & Cepat',
        hiw_title: 'Bagaimana MataCeria Bekerja?',
        hiw_desc: 'Dalam 4 langkah sederhana, Anda bisa mengetahui kondisi penglihatan Anda secara akurat dan aman.',
        hiw_step1_title: 'Download Aplikasi',
        hiw_step1_desc: 'Unduh MataCeria gratis dari Play Store atau App Store. Daftar akun hanya 30 detik.',
        hiw_step2_title: 'Pilih Jenis Tes',
        hiw_step2_desc: 'Pilih tes: Rabun Jauh (Myopia), Rabun Dekat (Hyperopia), atau Silinder (Astigmatisme).',
        hiw_step3_title: 'Tes Dipandu AI',
        hiw_step3_desc: 'Ikuti panduan langkah demi langkah. Kalibrasi jarak dilakukan otomatis oleh AI.',
        hiw_step4_title: 'Terima Hasil',
        hiw_step4_desc: 'Dapatkan interpretasi klinis instan & rekomendasi langkah selanjutnya dari AI.',
        
        hdw_title: 'Bagaimana Aplikasi Ini Bekerja?',
        hdw_desc: 'MataCeria dirancang untuk pengguna awam maupun tenaga medis profesional.',
        hdw_tab_patient: 'Pengguna / Pasien',
        hdw_tab_doctor: 'Dokter / Klinik',
        
        hdw_p_feat1_title: 'Pilih Pemeriksaan',
        hdw_p_feat1_desc: 'Pilih tes yang ingin dilakukan — rabun jauh, rabun dekat, atau astigmatisme.',
        hdw_p_feat2_title: 'Panduan AI Real-time',
        hdw_p_feat2_desc: 'AI MataCeria memandu setiap langkah tes secara real-time untuk hasil optimal.',
        hdw_p_feat3_title: 'Tes Mandiri di Mana Saja',
        hdw_p_feat3_desc: 'Tes dilakukan langsung dari smartphone, tanpa peralatan khusus atau kunjungan klinik.',
        
        hdw_d_feat1_title: 'Dashboard Pasien',
        hdw_d_feat1_desc: 'Pantau hasil tes mandiri semua pasien di satu dasbor terintegrasi secara real-time.',
        hdw_d_feat2_title: 'Konsultasi Terenkripsi',
        hdw_d_feat2_desc: 'Hubungi pasien melalui chat aman untuk memberikan interpretasi dan rekomendasi klinis.',
        hdw_d_feat3_title: 'Ekspor Laporan Klinis',
        hdw_d_feat3_desc: 'Cetak atau unduh laporan digital berformat medis yang terstandarisasi kapan saja.',
        
        rev_badge: 'Testimoni Nyata',
        rev_title_1: 'Dipercaya',
        rev_title_2: '50.000+',
        rev_title_3: 'Pengguna',
        
        cta_title: 'Download MataCeria App',
        cta_desc: 'Platform kesehatan mata digital inovatif pertama di Indonesia. Dipercaya oleh {stats} pengguna aktif untuk deteksi dini, tes refraksi, dan konsultasi dokter mata.',
        cta_results: 'Hasil Tes Anda',
        cta_normal: 'Penglihatan Normal',
        cta_retest: 'Tes Ulang',
        cta_astigmatism: 'Silinder',
        cta_myopia: 'Rabun Jauh',
        cta_hyperopia: 'Rabun Dekat',
        cta_detected: 'Terdeteksi',
        
        footer_desc: 'Platform revolusioner kesehatan mata digital di Indonesia. Membantu pengguna memahami kondisi penglihatan dengan teknologi AI terdepan.',
        footer_quick: 'Quick Links',
        footer_about: 'About Us',
        footer_contacts: 'Contacts',
        footer_policy: 'Kebijakan Privasi',
        footer_terms: 'Syarat & Ketentuan',
        footer_team: 'Tim Kami',
        footer_story: 'Kisah Kami',
        footer_blog: 'Blog',
        footer_careers: 'Karir',
        
        modal_soon: 'Segera Hadir',
        modal_android: 'Pengguna Android?',
        modal_android_desc: 'Anda dapat mengunduh berkas APK secara langsung untuk mulai mencoba aplikasi sekarang.',
        modal_download: 'Unduh APK Langsung',
        modal_close: 'Tutup',
        modal_coming_soon: 'Segera Hadir di {platform}!',
        modal_coming_soon_desc: 'Aplikasi MataCeria saat ini sedang dalam proses review di {platform}. Kami akan segera hadir untuk Anda!',
        modal_dev_title: 'Halaman {title} Segera Hadir',
        modal_dev_desc: 'Fitur atau informasi mengenai "{title}" sedang dalam pengembangan oleh tim pengembang kami.',
        
        rev_text_0: 'Bagan Snellen digital MataCeria sangat akurat! Kalibrasi jarak kameranya cerdas. Dokter bilang hasilnya hampir sama persis dengan pemeriksaan klinik.',
        rev_text_1: 'Terdeteksi distorsi 30 derajat di tes silinder. Setelah pakai kacamata dari rekomendasi MataCeria, baca kode di laptop jauh lebih nyaman!',
        rev_text_2: 'Dashboard dokternya sangat membantu memantau pasien. Fitur laporan klinisnya sudah terformat dengan baik dan profesional.',
        rev_text_3: 'Antarmuka tesnya ramah anak! Anak saya yang 8 tahun bisa ikut tes tanpa takut seperti di klinik biasa. Ada rekomendasi AI-nya juga.',
        rev_text_4: 'Sudah 3 kali pakai, hasilnya konsisten. Grafik tren ketajaman visual di dasbor sangat membantu melacak perkembangan kondisi mata.',
        rev_text_5: 'UI-nya clean dan premium. Pengalaman pakainya mulus. Hasil langsung tersimpan di histori. Reminder 20-20-20-nya berguna banget!',
        
        screen_good_morning: 'Selamat Pagi',
        screen_last_status: 'Status Mata Terakhir',
        screen_checked_days_ago: 'Pemeriksaan 3 hari lalu',
        screen_start_new_test: 'Mulai Tes Baru',
        screen_distance_test: 'Tes Rabun Jauh',
        screen_distance: 'Jarak',
        screen_active_row: 'Baris Aktif',
        screen_astigmatism_test: 'Tes Silinder',
        screen_astigmatism_instructions: 'Tutup mata kanan, fokus ke titik tengah',
        screen_distortion: 'DISTORSI',
        screen_yes_thick: 'Ya, Tebal',
        screen_all_same: 'Semua Sama',
        screen_test_results: 'Hasil Pemeriksaan',
        screen_finished: 'Selesai!',
        screen_right_eye: 'Mata Kanan (OD)',
        screen_left_eye: 'Mata Kiri (OS)',
        screen_ai_recommendation: 'Rekomendasi AI',
        screen_ai_desc: 'Konsultasi ke dokter mata untuk koreksi mata kiri. Indeks silinder -0.50D terdeteksi.',
    },
    en: {
        nav_home: 'Home',
        nav_features: 'Features',
        nav_how_it_works: 'How It Works',
        nav_reviews: 'Reviews',
        nav_download: 'Download',
        nav_login: 'Login',
        nav_hello: 'Hi',
        nav_dashboard: 'Dashboard',
        
        hero_badge: '#1 Digital Eye Health App in Indonesia',
        hero_title_1: 'Download App,',
        hero_title_2: 'Test Your Eyes,',
        hero_title_3: 'See Brighter!',
        hero_desc: 'Download MataCeria from the Play Store or App Store, create a free account, and test your eyes for nearsightedness, farsightedness, and astigmatism in just 3 minutes.',
        hero_rating: '4.9/5 Rating',
        hero_reviews_count: '12,000+ reviews',
        hero_trust_med: 'Medically Standardized',
        hero_trust_inst: 'Instant Results',
        hero_diagnostics: 'Diagnostics',
        hero_normal: 'Normal',
        hero_scroll: 'Scroll',
        
        hiw_badge: 'Quick & Easy',
        hiw_title: 'How Does MataCeria Work?',
        hiw_desc: 'In 4 simple steps, you can find out your vision condition accurately and safely.',
        hiw_step1_title: 'Download App',
        hiw_step1_desc: 'Download MataCeria for free from the Play Store or App Store. Register in just 30 seconds.',
        hiw_step2_title: 'Choose Test Type',
        hiw_step2_desc: 'Select a test: Nearsightedness (Myopia), Farsightedness (Hyperopia), or Astigmatism (Cylinder).',
        hiw_step3_title: 'AI Guided Test',
        hiw_step3_desc: 'Follow step-by-step guidance. Distance calibration is performed automatically by AI.',
        hiw_step4_title: 'Get Results',
        hiw_step4_desc: 'Receive instant clinical interpretation and next steps recommendations from the AI.',
        
        hdw_title: 'How Does It Work?',
        hdw_desc: 'MataCeria is designed for both general users and professional medical staff.',
        hdw_tab_patient: 'User / Patient',
        hdw_tab_doctor: 'Doctor / Clinic',
        
        hdw_p_feat1_title: 'Choose Test',
        hdw_p_feat1_desc: 'Select the test you want to perform — nearsightedness, farsightedness, or astigmatism.',
        hdw_p_feat2_title: 'Real-time AI Guide',
        hdw_p_feat2_desc: 'MataCeria AI guides every step of the test in real-time for optimal results.',
        hdw_p_feat3_title: 'Self-Test Anywhere',
        hdw_p_feat3_desc: 'Perform the test directly from your smartphone, no special equipment or clinic visits needed.',
        
        hdw_d_feat1_title: 'Patient Dashboard',
        hdw_d_feat1_desc: 'Monitor self-test results of all patients in one integrated dashboard in real-time.',
        hdw_d_feat2_title: 'Encrypted Consultation',
        hdw_d_feat2_desc: 'Connect with patients via secure chat to provide clinical interpretations and recommendations.',
        hdw_d_feat3_title: 'Export Clinical Reports',
        hdw_d_feat3_desc: 'Print or download medical-standardized digital reports anytime.',
        
        rev_badge: 'Real Testimonials',
        rev_title_1: 'Trusted by',
        rev_title_2: '50,000+',
        rev_title_3: 'Users',
        
        cta_title: 'Download MataCeria App',
        cta_desc: 'Indonesia\'s first innovative digital eye health platform. Trusted by {stats} active users for early detection, refraction testing, and ophthalmologist consultations.',
        cta_results: 'Your Test Results',
        cta_normal: 'Normal Vision',
        cta_retest: 'Retest',
        cta_astigmatism: 'Astigmatism',
        cta_myopia: 'Nearsightedness',
        cta_hyperopia: 'Farsightedness',
        cta_detected: 'Detected',
        
        footer_desc: 'A revolutionary digital eye health platform in Indonesia. Helping users understand their vision conditions with leading AI technology.',
        footer_quick: 'Quick Links',
        footer_about: 'About Us',
        footer_contacts: 'Contacts',
        footer_policy: 'Privacy Policy',
        footer_terms: 'Terms & Conditions',
        footer_team: 'Our Team',
        footer_story: 'Our Story',
        footer_blog: 'Blog',
        footer_careers: 'Careers',
        
        modal_soon: 'Coming Soon',
        modal_android: 'Android User?',
        modal_android_desc: 'You can download the APK file directly to start trying the application now.',
        modal_download: 'Download Direct APK',
        modal_close: 'Close',
        modal_coming_soon: 'Coming Soon to {platform}!',
        modal_coming_soon_desc: 'The MataCeria application is currently in the review process at {platform}. We will be ready for you soon!',
        modal_dev_title: 'Page {title} Coming Soon',
        modal_dev_desc: 'This feature or page is currently under development by our team.',
        
        rev_text_0: 'MataCeria\'s digital Snellen chart is very accurate! The camera distance calibration is smart. The doctor said the results were almost identical to a clinic exam.',
        rev_text_1: 'A 30-degree distortion was detected in the astigmatism test. After getting glasses from MataCeria\'s recommendations, coding on my laptop is much more comfortable!',
        rev_text_2: 'The doctor dashboard is extremely helpful for monitoring patients. The clinical report export feature is well-formatted and professional.',
        rev_text_3: 'The test interface is kid-friendly! My 8-year-old child could take the test without being scared like in a normal clinic. The AI recommendations are helpful too.',
        rev_text_4: 'Used it 3 times, results are consistent. The visual acuity trend chart on the dashboard helps track the changes in my eye condition.',
        rev_text_5: 'The UI is clean and premium. The user experience is seamless. Results are instantly saved to history. The 20-20-20 reminder is super useful!',
        
        screen_good_morning: 'Good Morning',
        screen_last_status: 'Last Eye Status',
        screen_checked_days_ago: 'Checked 3 days ago',
        screen_start_new_test: 'Start New Test',
        screen_distance_test: 'Nearsightedness Test',
        screen_distance: 'Distance',
        screen_active_row: 'Active Row',
        screen_astigmatism_test: 'Astigmatism Test',
        screen_astigmatism_instructions: 'Close right eye, focus on center point',
        screen_distortion: 'DISTORTION',
        screen_yes_thick: 'Yes, Thick',
        screen_all_same: 'All Same',
        screen_test_results: 'Test Results',
        screen_finished: 'Finished!',
        screen_right_eye: 'Right Eye (OD)',
        screen_left_eye: 'Left Eye (OS)',
        screen_ai_recommendation: 'AI Recommendation',
        screen_ai_desc: 'Consult ophthalmologist for left eye correction. Cylinder -0.50D detected.',
    },
    ja: {
        nav_home: 'ホーム',
        nav_features: '機能',
        nav_how_it_works: '使い方',
        nav_reviews: 'レビュー',
        nav_download: 'ダウンロード',
        nav_login: 'ログイン',
        nav_hello: 'こんにちは',
        nav_dashboard: 'ダッシュボード',
        
        hero_badge: 'インドネシア第1位のデジタルアイケアアプリ',
        hero_title_1: 'アプリをダウンロード、',
        hero_title_2: '目をセルフテスト、',
        hero_title_3: 'もっとクリアに見よう！',
        hero_desc: 'PlayストアまたはApp StoreからMataCeriaをダウンロードし、無料アカウントを作成して、近視、遠視、乱視をわずか3分で測定しましょう。',
        hero_rating: '4.9/5 評価',
        hero_reviews_count: '12,000件以上のレビュー',
        hero_trust_med: '医療規格準拠',
        hero_trust_inst: '即時結果表示',
        hero_diagnostics: '診断結果',
        hero_normal: '正常',
        hero_scroll: 'スクロール',
        
        hiw_badge: '簡単＆スピーディ',
        hiw_title: 'MataCeriaの仕組み',
        hiw_desc: '4つの簡単なステップで、あなたの目の状態を正確かつ安全に確認できます。',
        hiw_step1_title: 'アプリダウンロード',
        hiw_step1_desc: 'PlayストアまたはApp Storeから無料でダウンロード。登録はわずか30秒。',
        hiw_step2_title: '検査種類の選択',
        hiw_step2_desc: '検査を選択：近視（Myopia）、遠視（Hyperopia）、または乱視（Cylinder）。',
        hiw_step3_title: 'AIガイド付き測定',
        hiw_step3_desc: 'ステップバイステップのガイドに従います。距離の測定はAIが自動で実行。',
        hiw_step4_title: '結果の確認',
        hiw_step4_desc: '臨床的な診断結果とAIからの次のステップのアドバイスをすぐに受け取れます。',
        
        hdw_title: '具体的な使い方',
        hdw_desc: 'MataCeriaは、一般のユーザーと医療の専門家の両方向けに設計されています。',
        hdw_tab_patient: 'ユーザー / 患者',
        hdw_tab_doctor: '医師 / クリニック',
        
        hdw_p_feat1_title: '検査の選択',
        hdw_p_feat1_desc: '行いたい検査（近視、遠視、乱視）を選択します。',
        hdw_p_feat2_title: 'リアルタイムAIガイド',
        hdw_p_feat2_desc: 'MataCeria AIが測定を最適にするために各ステップをリアルタイムでガイドします。',
        hdw_p_feat3_title: 'どこでもセルフテスト',
        hdw_p_feat3_desc: 'スマートフォンだけで測定可能。特別な機器や通院は不要です。',
        
        hdw_d_feat1_title: '患者ダッシュボード',
        hdw_d_feat1_desc: '全患者의 セルフテスト結果をリアルタイムで一つのダッシュボードで一元管理。',
        hdw_d_feat2_title: '暗号化された相談',
        hdw_d_feat2_desc: '安全なチャットで患者とつながり、臨床的な所見やアドバイスを提供。',
        hdw_d_feat3_title: '臨床報告書の出力',
        hdw_d_feat3_desc: '医療規格に準拠したデジタル報告書をいつでも印刷またはダウンロード。',
        
        rev_badge: '実際の体験談',
        rev_title_1: '信頼のユーザー数',
        rev_title_2: '50,000人以上',
        rev_title_3: '',
        
        cta_title: 'MataCeriaアプリをダウンロード',
        cta_desc: 'インドネシア初の革新的なデジタルアイケアプラットフォーム。早期発見、視力測定、眼科医相談のために、{stats}人のアクティブユーザーに信頼されています。',
        cta_results: '測定結果',
        cta_normal: '正常な視力',
        cta_retest: '再テスト',
        cta_astigmatism: '乱視',
        cta_myopia: '近視',
        cta_hyperopia: '遠視',
        cta_detected: '検出あり',
        
        footer_desc: 'インドネシアで革新的なデジタルアイケアプラットフォーム。最先端のAI技術でユーザーが視力の状態を把握できるようサポートします。',
        footer_quick: 'クイックリンク',
        footer_about: '運営会社',
        footer_contacts: 'お問い合わせ',
        footer_policy: 'プライバシーポリシー',
        footer_terms: '利用規約',
        footer_team: 'チーム紹介',
        footer_story: '私たちのストーリー',
        footer_blog: 'ブログ',
        footer_careers: '採用情報',
        
        modal_soon: '近日公開',
        modal_android: 'Androidをご利用ですか？',
        modal_android_desc: 'ここから直接APKファイルをダウンロードして、すぐにアプリをお試しいただけます。',
        modal_download: 'APKを直接ダウンロード',
        modal_close: '閉じる',
        modal_coming_soon: '{platform}で近日公開！',
        modal_coming_soon_desc: 'MataCeriaアプリは現在{platform}でレビュー審査中です。まもなく公開されます！',
        modal_dev_title: '{title} ページは近日公開',
        modal_dev_desc: 'この機能またはページは現在開発中となっております。',
        
        rev_text_0: 'MataCeriaのデジタルスネルンチャートは非常に正確です！カメラの距離測定機能がスマートです。眼科での検査とほぼ同じ結果でした。',
        rev_text_1: '乱視テストで30度の歪みが検出されました。MataCeriaの推奨に従って眼鏡を作成したところ、パソコンでのコーディングがとても快適になりました！',
        rev_text_2: '医師用ダッシュボードは患者の経過観察に非常に役立ちます。臨床報告書の出力機能も綺麗にフォーマットされておりプロ仕様です。',
        rev_text_3: '検査画面が子供向けで親しみやすいです！8歳の息子も病院のように怖がらずに検査を受けられました。AIの推奨機能も素晴らしいです。',
        rev_text_4: 'すでに3回利用しましたが、結果は常に一貫しています。視力の推移グラフがダッシュボードで見られるので、目の変化を追うのに便利です。',
        rev_text_5: 'UIがクリーンでプレミアム感があります。操作もとてもスムーズです。履歴に結果が即時保存されます。20-20-20ルールのリマインダーが超便利！',
        
        screen_good_morning: 'おはようございます',
        screen_last_status: '前回の測定結果',
        screen_checked_days_ago: '3日前に測定',
        screen_start_new_test: '新規検査を開始',
        screen_distance_test: '近視測定',
        screen_distance: '距離',
        screen_active_row: '現在の行',
        screen_astigmatism_test: '乱視測定',
        screen_astigmatism_instructions: '右目を閉じ、中心点に焦点を合わせる',
        screen_distortion: '歪み',
        screen_yes_thick: 'はい、太い',
        screen_all_same: 'すべて同じ',
        screen_test_results: '測定結果',
        screen_finished: '完了！',
        screen_right_eye: '右目 (OD)',
        screen_left_eye: '左目 (OS)',
        screen_ai_recommendation: 'AI推奨事項',
        screen_ai_desc: '左目の矯正のために眼科医に相談してください。乱視 -0.50Dを検出。',
    },
    es: {
        nav_home: 'Inicio',
        nav_features: 'Características',
        nav_how_it_works: 'Cómo Funciona',
        nav_reviews: 'Opiniones',
        nav_download: 'Descargar',
        nav_login: 'Iniciar Sesión',
        nav_hello: 'Hola',
        nav_dashboard: 'Tablero',
        
        hero_badge: 'Aplicación #1 de Salud Visual Digital en Indonesia',
        hero_title_1: 'Descarga la App,',
        hero_title_2: 'Prueba Tus Ojos,',
        hero_title_3: '¡Mira Más Claro!',
        hero_desc: 'Descarga MataCeria de la Play Store o App Store, crea una cuenta gratuita y prueba tu salud visual para miopía, hipermetropía y astigmatismo en solo 3 minutos.',
        hero_rating: '4.9/5 Calificación',
        hero_reviews_count: '12,000+ opiniones',
        hero_trust_med: 'Médicamente Estandarizado',
        hero_trust_inst: 'Resultados Instántaneos',
        hero_diagnostics: 'Diagnósticos',
        hero_normal: 'Normal',
        hero_scroll: 'Deslizar',
        
        hiw_badge: 'Fácil & Rápido',
        hiw_title: '¿Cómo Funciona MataCeria?',
        hiw_desc: 'En 4 sencillos pasos, puede conocer el estado de su visión de forma precisa y segura.',
        hiw_step1_title: 'Descargar Aplicación',
        hiw_step1_desc: 'Descarga MataCeria gratis de Play Store o App Store. Regístrate en solo 30 segundos.',
        hiw_step2_title: 'Elegir Tipo de Prueba',
        hiw_step2_desc: 'Selecciona una prueba: Miopía (Nearsightedness), Hipermetropía (Farsightedness) o Astigmatismo (Cylinder).',
        hiw_step3_title: 'Prueba Guiada por IA',
        hiw_step3_desc: 'Sigue la guía paso a paso. La calibración de distancia se realiza de forma automática por la IA.',
        hiw_step4_title: 'Recibir Resultados',
        hiw_step4_desc: 'Reciba interpretaciones clínicas instantáneas y recomendaciones de próximos pasos de la IA.',
        
        hdw_title: '¿Cómo Funciona Esta Aplicación?',
        hdw_desc: 'MataCeria está diseñado tanto para usuarios generales como para profesionales médicos.',
        hdw_tab_patient: 'Usuario / Paciente',
        hdw_tab_doctor: 'Médico / Clínica',
        
        hdw_p_feat1_title: 'Elegir Prueba',
        hdw_p_feat1_desc: 'Selecciona la prueba que deseas realizar: miopía, hipermetropía o astigmatismo.',
        hdw_p_feat2_title: 'Guía de IA en Tiempo Real',
        hdw_p_feat2_desc: 'La IA de MataCeria guía cada paso de la prueba en tiempo real para obtener resultados óptimos.',
        hdw_p_feat3_title: 'Auto-Prueba en Cualquier Lugar',
        hdw_p_feat3_desc: 'Realiza la prueba directamente desde tu smartphone, sin equipos especiales ni visitas a clínicas.',
        
        hdw_d_feat1_title: 'Tablero del Paciente',
        hdw_d_feat1_desc: 'Supervise los resultados de las auto-pruebas de todos los pacientes en un tablero integrado en tiempo real.',
        hdw_d_feat2_title: 'Consulta Encriptada',
        hdw_d_feat2_desc: 'Conéctese con los pacientes a través de un chat seguro para proporcionar interpretaciones clínicas y recomendaciones.',
        hdw_d_feat3_title: 'Exportar Informes Clínicos',
        hdw_d_feat3_desc: 'Imprima o descargue informes digitales estandarizados de formato médico en cualquier momento.',
        
        rev_badge: 'Testimonios Reales',
        rev_title_1: 'Con la confianza de',
        rev_title_2: '50,000+',
        rev_title_3: 'Usuarios',
        
        cta_title: 'Descarga la App MataCeria',
        cta_desc: 'La primera plataforma innovadora de salud visual digital en Indonesia. Con la confianza de {stats} usuarios activos para detección temprana, pruebas de refracción y consultas con oftalmólogos.',
        cta_results: 'Resultados de Tu Prueba',
        cta_normal: 'Visión Normal',
        cta_retest: 'Repetir Prueba',
        cta_astigmatism: 'Astigmatismo',
        cta_myopia: 'Miopía',
        cta_hyperopia: 'Hipermetropía',
        cta_detected: 'Detectado',
        
        footer_desc: 'Una plataforma revolucionaria de salud visual digital en Indonesia. Ayuda a los usuarios a comprender sus condiciones de visión con tecnología de IA de vanguardia.',
        footer_quick: 'Enlaces Rápidos',
        footer_about: 'Nosotros',
        footer_contacts: 'Contactos',
        footer_policy: 'Política de Privacidad',
        footer_terms: 'Términos y Condiciones',
        footer_team: 'Nuestro Equipo',
        footer_story: 'Nuestra Historia',
        footer_blog: 'Blog',
        footer_careers: 'Carreras',
        
        modal_soon: 'Próximamente',
        modal_android: '¿Usuario de Android?',
        modal_android_desc: 'Puede descargar el archivo APK directamente para comenzar a probar la aplicación ahora mismo.',
        modal_download: 'Descargar APK Directo',
        modal_close: 'Cerrar',
        modal_coming_soon: '¡Próximamente en {platform}!',
        modal_coming_soon_desc: 'La aplicación MataCeria se encuentra actualmente en proceso de revisión en {platform}. ¡Estaremos listos pronto!',
        modal_dev_title: 'Halaman {title} Próximamente',
        modal_dev_desc: 'Esta característica o página está actualmente en desarrollo por nuestro equipo.',
        
        rev_text_0: '¡El gráfico Snellen digital de MataCeria es muy preciso! La calibración de distancia con la cámara es inteligente. El médico dijo que los resultados fueron casi idénticos.',
        rev_text_1: 'Se detectó una distorsión de 30 grados en la prueba de astigmatismo. ¡Después de usar las gafas recomendadas por MataCeria, programar en mi laptop es mucho más cómodo!',
        rev_text_2: 'El tablero médico es muy útil para monitorear pacientes. La exportación del informe clínico está muy bien formateada y es profesional.',
        rev_text_3: '¡La interfaz de prueba es amigable para los niños! Mi hijo de 8 años pudo hacerse la prueba sin asustarse como en la clínica habitual. También cuenta con recomendaciones de la IA.',
        rev_text_4: 'Lo he usado 3 veces, los resultados son consistentes. El gráfico de tendencia de agudeza visual ayuda a rastrear el cambio de mi condición ocular.',
        rev_text_5: 'La interfaz es limpia y premium. La experiencia de usuario es fluida. Los resultados se guardan al instante. ¡El recordatorio 20-20-20 es muy útil!',
        
        screen_good_morning: 'Buenos Días',
        screen_last_status: 'Último Estado Ocular',
        screen_checked_days_ago: 'Examinado hace 3 días',
        screen_start_new_test: 'Iniciar Nueva Prueba',
        screen_distance_test: 'Prueba de Miopía',
        screen_distance: 'Distancia',
        screen_active_row: 'Fila Activa',
        screen_astigmatism_test: 'Prueba de Astigmatismo',
        screen_astigmatism_instructions: 'Cierre el ojo derecho, enfoque en el centro',
        screen_distortion: 'DISTORSIÓN',
        screen_yes_thick: 'Sí, Grueso',
        screen_all_same: 'Todo Igual',
        screen_test_results: 'Resultados de Prueba',
        screen_finished: '¡Terminado!',
        screen_right_eye: 'Ojo Derecho (OD)',
        screen_left_eye: 'Ojo Izquierdo (OS)',
        screen_ai_recommendation: 'Recomendación de IA',
        screen_ai_desc: 'Consulte al oftalmólogo para corrección del ojo izquierdo. Cilindro -0.50D detectado.',
    },
    zh: {
        nav_home: '首页',
        nav_features: '核心功能',
        nav_how_it_works: '工作原理',
        nav_reviews: '用户评价',
        nav_download: '软件下载',
        nav_login: '登录',
        nav_hello: '您好',
        nav_dashboard: '控制台',
        
        hero_badge: '印尼第一款数字化眼部健康筛查应用',
        hero_title_1: '下载应用，',
        hero_title_2: '测试你的眼睛，',
        hero_title_3: '让视界更清晰！',
        hero_desc: '从 Play 商店或 App Store 下载 MataCeria，免费注册，只需 3 分钟即可测试近视、远视和散光。',
        hero_rating: '4.9/5 评分',
        hero_reviews_count: '12,000+ 条评价',
        hero_trust_med: '符合医疗标准',
        hero_trust_inst: '即时反馈结果',
        hero_diagnostics: '诊断报告',
        hero_normal: '正常',
        hero_scroll: '下滑',
        
        hiw_badge: '简单快捷',
        hiw_title: 'MataCeria 是如何工作的？',
        hiw_desc: '只需简单的 4 个步骤，您就可以准确且安全地了解您的视力状况。',
        hiw_step1_title: '下载客户端',
        hiw_step1_desc: '从应用商店免费下载 MataCeria。30 秒即可注册账号。',
        hiw_step2_title: '选择测试类型',
        hiw_step2_desc: '选择您的测试：近视 (Myopia)、远视 (Hyperopia) 或散光 (Cylinder)。',
        hiw_step3_title: 'AI 引导测试',
        hiw_step3_desc: '跟随向导一步步完成。距离标定由 AI 自动为您完成。',
        hiw_step4_title: '获取诊断报告',
        hiw_step4_desc: '立即获取临床报告分析与 AI 提供的下一步建议。',
        
        hdw_title: '此应用如何运行？',
        hdw_desc: 'MataCeria 既适用于大众用户，也适用于专业的医疗护理人员。',
        hdw_tab_patient: '普通用户 / 患者',
        hdw_tab_doctor: '医生 / 诊所',
        
        hdw_p_feat1_title: '选择检测',
        hdw_p_feat1_desc: '选择您想要进行的测试 —— 近视、远视或散光。',
        hdw_p_feat2_title: '实时 AI 引导',
        hdw_p_feat2_desc: 'MataCeria AI 实时引导每个步骤，确保获取最准确的结果。',
        hdw_p_feat3_title: '随时随地自助测试',
        hdw_p_feat3_desc: '直接通过您的智能手机进行测试，无需额外设备或前往诊所。',
        
        hdw_d_feat1_title: '患者控制面板',
        hdw_d_feat1_desc: '在一个集成的实时控制面板中跟踪与监视所有患者的自助测试结果。',
        hdw_d_feat2_title: '加密在线问诊',
        hdw_d_feat2_desc: '通过安全加密聊天与患者沟通，提供临床解读和诊疗建议。',
        hdw_d_feat3_title: '导出临床报告',
        hdw_d_feat3_desc: '随时打印或下载符合规范的数字化医学诊断报告。',
        
        rev_badge: '真实评价',
        rev_title_1: '深受',
        rev_title_2: '50,000+',
        rev_title_3: '位用户信赖',
        
        cta_title: '下载 MataCeria App',
        cta_desc: '印尼首个创新的数字化眼部健康平台。深受 {stats} 活跃用户的信赖，用于早期筛查、屈光测试和眼科咨询。',
        cta_results: '您的测试结果',
        cta_normal: '视力正常',
        cta_retest: '重新测试',
        cta_astigmatism: '散光',
        cta_myopia: '近视',
        cta_hyperopia: '远视',
        cta_detected: '已检出',
        
        footer_desc: '印尼革命性的数字眼科健康平台。借助先进的 AI 技术，帮助用户了解其视力状况。',
        footer_quick: '快速链接',
        footer_about: '关于我们',
        footer_contacts: '联系我们',
        footer_policy: '隐私政策',
        footer_terms: '服务条款',
        footer_team: '关于团队',
        footer_story: '品牌故事',
        footer_blog: '博客专栏',
        footer_careers: '加入我们',
        
        modal_soon: '即将推出',
        modal_android: 'Android 用户？',
        modal_android_desc: '您可以直接下载 APK 安装文件，即可立即开始体验我们的应用。',
        modal_download: '直接下载 APK',
        modal_close: '关闭',
        modal_coming_soon: '即将登陆 {platform}！',
        modal_coming_soon_desc: 'MataCeria 正在 {platform} 审核中，敬请期待！',
        modal_dev_title: '{title} 页面即将推出',
        modal_dev_desc: '我们的团队目前正在开发该功能或页面。',
        
        rev_text_0: 'MataCeria 的数字化视力表非常精准！摄像头的距离校准很智能。医生说诊断结果几乎跟门诊检查一模一样。',
        rev_text_1: '在散光测试中查出了 30 度的偏轴。戴上 MataCeria 推荐的眼镜后，在电脑上写代码舒服多了！',
        rev_text_2: '医生工作台对管理患者非常有帮助。临床报告导出功能排版精美且非常专业。',
        rev_text_3: '检测界面对儿童非常友好！我8岁的孩子能轻松完成测试，不像在医院那样害怕。AI诊断建议也很好用。',
        rev_text_4: '测试了3次，结果非常一致。控制台的视力变化曲线图对于跟踪眼睛的度数变化非常实用。',
        rev_text_5: '界面非常干净高端。操作体验非常流畅，检测历史即时保存。20-20-20 规则定时护眼提醒超级实用！',
        
        screen_good_morning: '早上好',
        screen_last_status: '上次眼睛状态',
        screen_checked_days_ago: '3天前检测',
        screen_start_new_test: '开始新测试',
        screen_distance_test: '近视测试',
        screen_distance: '距离',
        screen_active_row: '当前行',
        screen_astigmatism_test: '散光测试',
        screen_astigmatism_instructions: '闭上右眼，专注于中心点',
        screen_distortion: '畸变',
        screen_yes_thick: '是的，更粗',
        screen_all_same: '全部相同',
        screen_test_results: '检测报告',
        screen_finished: '检测完成！',
        screen_right_eye: '右眼 (OD)',
        screen_left_eye: '左眼 (OS)',
        screen_ai_recommendation: 'AI 诊断建议',
        screen_ai_desc: '建议就诊眼科纠正左眼。已检测到 -0.50D 的散光度数。',
    }
};

/* ═══════════════════════════════════════════════
   LANGUAGE CONTEXT
   ═══════════════════════════════════════════════ */
export const LanguageContext = React.createContext({
    lang: 'id',
    setLang: () => {},
    t: (key) => key
});

/* ═══════════════════════════════════════════════
   PAGE-LOAD INTRO ANIMATION (Curtain Reveal)
   ═══════════════════════════════════════════════ */
function PageLoadAnimation({ onComplete }) {
    const contentRef  = useRef(null);
    const logoRef     = useRef(null);
    const textRef     = useRef(null);
    const barRef      = useRef(null);
    const progressRef = useRef(null);
    const [pct, setPct] = useState(0);

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                onComplete?.();
            }
        });

        // Logo & text entrance
        tl.from(logoRef.current, { scale: 0, opacity: 0, duration: 0.4, ease: 'back.out(1.7)' })
          .from(textRef.current, { y: 20, opacity: 0, duration: 0.3, ease: 'power2.out' }, '-=0.15')
          .from(barRef.current, { scaleX: 0, duration: 0.2, ease: 'power2.out', transformOrigin: 'left' }, '-=0.1')

        // Progress counter
        let count = { val: 0 };
        tl.to(count, {
            val: 100,
            duration: 0.6,
            ease: 'power2.inOut',
            onUpdate: () => setPct(Math.round(count.val)),
        }, '-=0.3');

        // Fill progress bar
        tl.to(progressRef.current, { scaleX: 1, duration: 0.6, ease: 'power2.inOut', transformOrigin: 'left' }, '-=0.6');

        // Fade out content first
        tl.to(contentRef.current, {
            opacity: 0,
            y: -40,
            duration: 0.3,
            ease: 'power3.in',
            delay: 0
        });

        // Staggered slide up of the 4 vertical panels
        tl.to('.curtain-panel', {
            yPercent: -100,
            duration: 0.55,
            stagger: 0.05,
            ease: 'power4.inOut'
        }, '-=0.15');

        return () => tl.kill();
    }, []);

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 999999,
            background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            {/* Vertical panels */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', zIndex: 1 }}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="curtain-panel" style={{
                        flex: 1,
                        height: '100%',
                        background: T.bgDark,
                    }} />
                ))}
            </div>

            {/* Loader Content */}
            <div ref={contentRef} style={{
                position: 'relative', zIndex: 2,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 24,
            }}>
                {/* Logo */}
                <div style={{
                    width: 72, height: 72, borderRadius: 20,
                    background: T.grad,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 40px rgba(34,197,94,0.4)',
                }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                </div>

                {/* Brand name */}
                <div ref={textRef} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>
                        Mata<span style={{ color: T.brandL }}>Ceria</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: T.text3, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 4 }}>
                        Digital Eye Health
                    </div>
                </div>

                {/* Progress bar */}
                <div style={{ width: 200, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div ref={barRef} style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                        <div ref={progressRef} style={{ height: '100%', background: T.grad, borderRadius: 2, scaleX: 0 }} />
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                        {pct}%
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   PHONE MOCKUP
   ═══════════════════════════════════════════════ */
function PhoneMockup({ screen, size = 'md', float = true, shadow = true }) {
    const dims = size === 'lg' ? { w: 290, h: 580 } : size === 'sm' ? { w: 175, h: 350 } : { w: 235, h: 470 };
    return (
        <motion.div
            animate={float ? { y: [0, -14, 0] } : {}}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'relative', width: dims.w, flexShrink: 0 }}
        >
            {shadow && (
                <div style={{
                    position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)',
                    width: dims.w * 0.65, height: 36, borderRadius: '50%',
                    background: 'radial-gradient(ellipse, rgba(22,163,74,0.3), transparent)',
                    filter: 'blur(14px)'
                }} />
            )}
            <div style={{
                width: dims.w, height: dims.h, borderRadius: 42,
                background: 'linear-gradient(145deg, #1A3025, #0A1A10)',
                border: '2.5px solid rgba(255,255,255,0.15)',
                boxShadow: `0 28px 70px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)`,
                position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', padding: 9,
            }}>
                {/* Notch */}
                <div style={{
                    position: 'absolute', top: 13, left: '50%', transform: 'translateX(-50%)',
                    width: 88, height: 20, borderRadius: 20, background: '#060F0A', zIndex: 10,
                }} />
                {/* Screen */}
                <div style={{
                    flex: 1, background: '#0C1A0F', borderRadius: 33, overflow: 'hidden',
                    padding: '42px 13px 13px', position: 'relative',
                }}>
                    {screen}
                    <div style={{
                        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
                        width: 70, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)'
                    }} />
                </div>
            </div>
        </motion.div>
    );
}

/* ── Screen contents ── */
function ScreenHome() {
    const { t } = React.useContext(LanguageContext);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', opacity: 0.45, padding: '0 2px' }}>
                <span>9:41</span><span>5G 100%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>F</div>
                <div>
                    <div style={{ fontSize: '0.58rem', opacity: 0.45 }}>{t('screen_good_morning')}</div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800 }}>Faiz Jihad</div>
                </div>
            </div>
            <div style={{ background: T.grad, borderRadius: 14, padding: '12px 14px' }}>
                <div style={{ fontSize: '0.5rem', opacity: 0.85, marginBottom: 4 }}>{t('screen_last_status')}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '-0.03em' }}>20/20 {t('hero_normal')}</div>
                <div style={{ fontSize: '0.5rem', opacity: 0.7, marginTop: 2 }}>{t('screen_checked_days_ago')}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {[['SPH', '-0.00', T.accentL], ['CYL', '-0.00', T.accentL], ['VA OD', '20/20', T.brandL], ['VA OS', '20/25', '#FBBF24']].map(([l, v, c]) => (
                    <div key={l} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '8px 10px' }}>
                        <div style={{ fontSize: '0.45rem', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: c, marginTop: 2 }}>{v}</div>
                    </div>
                ))}
            </div>
            <div style={{ background: T.grad, borderRadius: 10, padding: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: '0.62rem', fontWeight: 800, marginTop: 'auto', cursor: 'pointer' }}>
                <Play size={10} color="#fff" fill="#fff" />
                {t('screen_start_new_test')}
            </div>
        </div>
    );
}

function ScreenSnellen() {
    const { t } = React.useContext(LanguageContext);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 800 }}>{t('screen_distance_test')}</span>
                <span style={{ fontSize: '0.5rem', background: 'rgba(34,197,94,0.2)', color: T.brandL, padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>OD</span>
            </div>
            <div style={{ fontSize: '0.5rem', color: '#B2C7B9', background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '5px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                {t('screen_distance')}: <span style={{ color: T.brandL, fontWeight: 700 }}>40 cm</span> <Check size={10} color={T.brandL} strokeWidth={3} />
            </div>
            <div style={{ background: '#fff', borderRadius: 14, padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1, color: '#000' }}>
                <span style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1 }}>E</span>
                <div style={{ display: 'flex', gap: 8, fontSize: '1.1rem', fontWeight: 800 }}><span>F</span><span>P</span></div>
                <div style={{ display: 'flex', gap: 6, fontSize: '0.6rem', fontWeight: 800, opacity: 0.65 }}><span>T</span><span>O</span><span>Z</span></div>
                <div style={{ display: 'flex', gap: 5, fontSize: '0.44rem', fontWeight: 800, opacity: 0.35 }}><span>L</span><span>P</span><span>E</span><span>D</span></div>
                <div style={{ fontSize: '0.45rem', color: '#15803D', fontWeight: 700, marginTop: 4 }}>{t('screen_active_row')}: 20/30</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4 }}>
                {['Kiri','Atas','Kanan','Bawah'].map((d, i) => (
                    <div key={d} style={{ background: i === 1 ? T.grad : 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 6, padding: '5px 0', textAlign: 'center', fontSize: '0.5rem', fontWeight: 700 }}>{d}</div>
                ))}
            </div>
        </div>
    );
}

function ScreenAstigmat() {
    const { t } = React.useContext(LanguageContext);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 800 }}>{t('screen_astigmatism_test')}</span>
                <span style={{ fontSize: '0.5rem', background: 'rgba(5,150,105,0.2)', color: T.accentL, padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>OS</span>
            </div>
            <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '5px 8px', textAlign: 'center' }}>
                {t('screen_astigmatism_instructions')}
            </div>
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: 100 }}>
                <svg width="108" height="108" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8"/>
                    <circle cx="50" cy="50" r="3" fill={T.brandL}/>
                    {[...Array(12)].map((_, i) => {
                        const a = i * 15, r = (a * Math.PI) / 180;
                        const x1 = 50 + 41 * Math.cos(r), y1 = 50 + 41 * Math.sin(r);
                        const x2 = 50 - 41 * Math.cos(r), y2 = 50 - 41 * Math.sin(r);
                        const hi = i === 2 || i === 8;
                        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={hi ? T.brandL : 'rgba(255,255,255,0.45)'} strokeWidth={hi ? 1.8 : 0.6}/>;
                    })}
                </svg>
                <div style={{ position: 'absolute', bottom: 6, right: 6, fontSize: '0.42rem', background: T.brand, color: '#fff', padding: '1px 4px', borderRadius: 3 }}>{t('screen_distortion')} 30°</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <div style={{ background: T.grad, borderRadius: 8, padding: '7px 0', textAlign: 'center', fontSize: '0.52rem', fontWeight: 700 }}>{t('screen_yes_thick')}</div>
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '7px 0', textAlign: 'center', fontSize: '0.52rem', fontWeight: 700 }}>{t('screen_all_same')}</div>
            </div>
        </div>
    );
}

function ScreenResult() {
    const { t } = React.useContext(LanguageContext);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, color: '#fff' }}>
            <div style={{ textAlign: 'center', paddingTop: 4 }}>
                <div style={{ fontSize: '0.52rem', opacity: 0.4, marginBottom: 6 }}>{t('screen_test_results')}</div>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: T.grad, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={22} color="#fff" strokeWidth={3} />
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 900 }}>{t('screen_finished')}</div>
            </div>
            {[[t('screen_right_eye'), 'SPH -0.00 | CYL -0.00', '20/20', T.brandL],
              [t('screen_left_eye'), 'SPH -1.25 | CYL -0.50', '20/40', '#FBBF24']].map(([e, d, va, c]) => (
                <div key={e} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '10px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '0.62rem', fontWeight: 800 }}>{e}</div>
                            <div style={{ fontSize: '0.48rem', opacity: 0.4, marginTop: 2 }}>{d}</div>
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 900, color: c }}>{va}</div>
                    </div>
                </div>
            ))}
            <div style={{ background: 'rgba(5,150,105,0.15)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 12, padding: '10px 12px' }}>
                <div style={{ fontSize: '0.58rem', fontWeight: 700, color: T.accentL, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Lightbulb size={11} color={T.accentL} /> {t('screen_ai_recommendation')}
                </div>
                <div style={{ fontSize: '0.5rem', opacity: 0.65, lineHeight: 1.45 }}>{t('screen_ai_desc')}</div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   STORE BUTTONS
   ═══════════════════════════════════════════════ */
function StoreButtons({ inverted = false, apkRoute, onStoreClick }) {
    const { t } = React.useContext(LanguageContext);
    const btn = {
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '11px 22px', borderRadius: 13,
        background: inverted ? '#fff' : T.bgDark,
        color: inverted ? T.bgDark : '#fff',
        textDecoration: 'none',
        transition: 'all 0.25s ease',
        boxShadow: inverted ? '0 4px 18px rgba(0,0,0,0.15)' : '0 4px 20px rgba(10,31,18,0.45)',
        cursor: 'pointer',
    };
    const stores = [
        {
            label: 'App Store',
            sub: 'Download on the',
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z"/>
                </svg>
            ),
            href: '#',
            action: 'coming_soon'
        },
        {
            label: 'Google Play',
            sub: 'Get it on',
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.37.6 1.23 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z"/>
                </svg>
            ),
            href: '#',
            action: 'coming_soon'
        },
        {
            label: 'Direct APK',
            sub: 'Download Android',
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="2" x2="10" y2="5" stroke="currentColor" />
                    <line x1="16" y1="2" x2="14" y2="5" stroke="currentColor" />
                    <path d="M12 5C7.029 5 3 9.029 3 14h18c0-4.971-4.029-9-9-9z" fill="none" stroke="currentColor" />
                    <path d="M3 14v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" fill="none" stroke="currentColor" />
                    <circle cx="8.5" cy="10.5" r="1.5" fill="currentColor" />
                    <circle cx="15.5" cy="10.5" r="1.5" fill="currentColor" />
                </svg>
            ),
            href: apkRoute || '/downloads/mataceria-latest.apk',
            action: 'download'
        }
    ];
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }} className="mc-store-buttons">
            {stores.map(s => {
                const handleClick = (e) => {
                    if (s.action === 'coming_soon') {
                        e.preventDefault();
                        if (onStoreClick) onStoreClick(s.label);
                    }
                };
                return (
                    <a key={s.label} href={s.href} onClick={handleClick} style={btn}
                       onMouseEnter={e => {
                           e.currentTarget.style.transform = 'translateY(-3px)';
                           e.currentTarget.style.boxShadow = inverted ? '0 8px 28px rgba(0,0,0,0.22)' : `0 8px 30px rgba(10,31,18,0.55)`;
                       }}
                       onMouseLeave={e => {
                           e.currentTarget.style.transform = 'none';
                           e.currentTarget.style.boxShadow = inverted ? '0 4px 18px rgba(0,0,0,0.15)' : '0 4px 20px rgba(10,31,18,0.45)';
                       }}>
                        {s.icon}
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: '0.58rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.sub}</div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, lineHeight: 1.2 }}>{s.label}</div>
                        </div>
                    </a>
                );
            })}
        </div>
    );
}

/* ═══════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════ */
function Navbar({ loginRoute, adminRoute, isAuthenticated, userName, scrolled, showCurtain }) {
    const { lang, setLang, t } = React.useContext(LanguageContext);
    const [open, setOpen] = useState(false);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const navRef = useRef(null);
    const initialShowCurtain = useRef(showCurtain);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        handleResize();
        window.addEventListener('resize', handleResize, { passive: true });
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const delayTime = initialShowCurtain.current ? 2.2 : 0.1;
        const ctx = gsap.context(() => {
            gsap.fromTo(navRef.current,
                { y: -70, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: delayTime }
            );
        });
        return () => ctx.revert();
    }, []);

    const links = [
        { label: t('nav_home'), href: '#beranda' },
        { label: t('nav_features'), href: '#fitur' },
        { label: t('nav_how_it_works'), href: '#cara-kerja' },
        { label: t('nav_reviews'), href: '#ulasan' },
        { label: t('nav_download'), href: '#app' },
    ];

    const languages = [
        { code: 'id', flag: '🇮🇩', label: 'Indonesian' },
        { code: 'en', flag: '🇬🇧', label: 'English' },
        { code: 'ja', flag: '🇯🇵', label: '日本語' },
        { code: 'es', flag: '🇪🇸', label: 'Español' },
        { code: 'zh', flag: '🇨🇳', label: '中文' },
    ];
    const currentLang = languages.find(l => l.code === lang) || languages[0];

    return (
        <>
            <header ref={navRef} style={{
                position: 'fixed',
                top: scrolled ? 16 : 0,
                left: 0,
                right: 0,
                margin: '0 auto',
                width: scrolled ? 'calc(100% - 48px)' : '100%',
                maxWidth: scrolled ? 1200 : '100%',
                zIndex: 99999,
                background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                borderRadius: scrolled ? 24 : 0,
                border: scrolled ? `1px solid ${T.borderM}` : '1px solid transparent',
                boxShadow: scrolled ? '0 12px 40px rgba(22,163,74,0.12)' : 'none',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                fontFamily: T.font,
            }}>
                <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(22,163,74,0.35)' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                            </svg>
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: T.text, letterSpacing: '-0.02em' }}>
                            Mata<span style={{ color: T.brand }}>Ceria</span>
                        </span>
                    </a>

                    <nav style={{ display: isMobile ? 'none' : 'flex', gap: 2 }} className="mc-nav-desktop">
                        {links.map(l => (
                            <a key={l.label} href={l.href} style={{ padding: '7px 14px', borderRadius: 8, fontSize: '0.875rem', fontWeight: 500, color: T.text2, textDecoration: 'none', transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
                               onMouseEnter={e => { e.currentTarget.style.color = T.brand; e.currentTarget.style.background = T.gradSoft; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                               onMouseLeave={e => { e.currentTarget.style.color = T.text2; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'none'; }}>
                                {l.label}
                            </a>
                        ))}
                    </nav>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="mc-nav-cta-desktop" style={{ display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: 10 }}>
                            {/* Premium Glassmorphic Language Selector Dropdown */}
                            <div style={{ position: 'relative' }} className="mc-lang-selector">
                                <button onClick={() => setLangDropdownOpen(v => !v)} style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '6px 12px', borderRadius: 8,
                                    border: `1.5px solid ${T.border}`, background: 'rgba(255,255,255,0.4)',
                                    cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, color: T.text2,
                                    transition: 'all 0.2s'
                                }}>
                                    <span>{currentLang.flag}</span>
                                    <span style={{ textTransform: 'uppercase' }}>{currentLang.code}</span>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: langDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                                        <path d="M6 9l6 6 6-6"/>
                                    </svg>
                                </button>
                                <AnimatePresence>
                                    {langDropdownOpen && (
                                        <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15 }}
                                            style={{
                                                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                                                background: 'rgba(255, 255, 255, 0.92)', backdropFilter: 'blur(20px)',
                                                border: `1.5px solid ${T.borderM}`, borderRadius: 12,
                                                padding: 6, zIndex: 100001, display: 'flex', flexDirection: 'column', gap: 2,
                                                boxShadow: '0 10px 25px rgba(22,163,74,0.12)', minWidth: 120
                                            }}>
                                            {languages.map(l => (
                                                <button key={l.code} onClick={() => { setLang(l.code); setLangDropdownOpen(false); }} style={{
                                                    display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                                                    padding: '8px 12px', borderRadius: 8, border: 'none',
                                                    background: lang === l.code ? T.gradSoft : 'transparent',
                                                    color: lang === l.code ? T.brand : T.text2,
                                                    cursor: 'pointer', fontSize: '0.78rem', fontWeight: lang === l.code ? 700 : 500,
                                                    textAlign: 'left', transition: 'all 0.15s'
                                                }}
                                                onMouseEnter={e => { if(lang !== l.code) e.currentTarget.style.background = 'rgba(22,163,74,0.05)'; }}
                                                onMouseLeave={e => { if(lang !== l.code) e.currentTarget.style.background = 'transparent'; }}>
                                                    <span>{l.flag}</span>
                                                    <span>{l.label}</span>
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {isAuthenticated ? (
                                <>
                                    <span style={{ fontSize: '0.8rem', color: T.text2 }}>{t('nav_hello')}, {userName}</span>
                                    <a href={adminRoute} style={{ padding: '8px 18px', borderRadius: 10, background: T.grad, color: '#fff', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', boxShadow: '0 4px 14px rgba(22,163,74,0.3)' }}>{t('nav_dashboard')} →</a>
                                </>
                            ) : (
                                <a href={loginRoute} style={{ padding: '8px 18px', borderRadius: 10, background: T.grad, color: '#fff', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', boxShadow: '0 4px 14px rgba(22,163,74,0.3)', transition: 'all 0.2s' }}
                                   onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 22px rgba(22,163,74,0.45)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                   onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(22,163,74,0.3)'; e.currentTarget.style.transform = 'none'; }}>
                                    {t('nav_login')}
                                </a>
                            )}
                        </div>
                        <button onClick={() => setOpen(v => !v)} aria-label="Buka menu navigasi" className="mc-nav-mobile-btn" style={{ display: isMobile ? 'flex' : 'none', padding: '8px', borderRadius: 8, border: `1.5px solid ${T.border}`, background: 'transparent', cursor: 'pointer' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth="2">
                                {open ? <path d="M18 6L6 18M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity: 0, y: -10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.97 }} transition={{ duration: 0.25, ease: 'easeOut' }}
                        style={{
                            position: 'fixed',
                            top: scrolled ? 92 : 74,
                            left: 12,
                            right: 12,
                            background: 'rgba(255, 255, 255, 0.94)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: 18,
                            border: `1.5px solid ${T.borderM}`,
                            boxShadow: '0 20px 60px rgba(22,163,74,0.12)',
                            padding: 16,
                            zIndex: 99998,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                            fontFamily: T.font
                        }}>
                        {links.map(l => (
                            <a key={l.label} href={l.href} onClick={() => setOpen(false)} style={{ padding: '11px 14px', borderRadius: 10, color: T.text2, fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', transition: 'all 0.15s' }}
                               onMouseEnter={e => { e.currentTarget.style.background = T.gradSoft; e.currentTarget.style.color = T.brand; }}
                               onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.text2; }}>
                                {l.label}
                            </a>
                        ))}
                        <div style={{ height: 1, background: T.border, margin: '6px 0' }}/>
                        
                        {/* Mobile Language Row */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, margin: '6px 0' }}>
                            {languages.map(l => (
                                <button key={l.code} onClick={() => { setLang(l.code); setOpen(false); }} style={{
                                    padding: '6px 10px', borderRadius: 8,
                                    border: lang === l.code ? `1.5px solid ${T.brand}` : `1.5px solid ${T.border}`,
                                    background: lang === l.code ? T.gradSoft : 'transparent',
                                    color: lang === l.code ? T.brand : T.text2,
                                    cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600
                                }}>
                                    {l.flag} {l.code.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        <a href={isAuthenticated ? adminRoute : loginRoute} style={{ padding: '11px 14px', borderRadius: 10, background: T.grad, color: '#fff', fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>
                            {isAuthenticated ? t('nav_dashboard') : t('nav_login')}
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

/* ═══════════════════════════════════════════════
   HERO SECTION — with GSAP stagger entrance
   ═══════════════════════════════════════════════ */
function HeroSection({ loginRoute, adminRoute, isAuthenticated, apkRoute, onStoreClick, showCurtain }) {
    const { t } = React.useContext(LanguageContext);
    const sectionRef = useRef(null);
    const blob1 = useRef(null);
    const blob2 = useRef(null);
    const blob3 = useRef(null);
    const [screenIdx, setScreenIdx] = useState(0);
    const initialShowCurtain = useRef(showCurtain);

    useEffect(() => {
        // Rotate phone screens
        const iv = setInterval(() => setScreenIdx(s => (s + 1) % 3), 4200);

        // Parallax blobs on mouse move
        let w = window.innerWidth;
        let h = window.innerHeight;
        const onResize = () => {
            w = window.innerWidth;
            h = window.innerHeight;
        };
        window.addEventListener('resize', onResize, { passive: true });

        const onMove = (e) => {
            const nx = (e.clientX / w - 0.5);
            const ny = (e.clientY / h - 0.5);
            gsap.to(blob1.current, { x: nx * 70, y: ny * 50, duration: 2.5, ease: 'power2.out' });
            gsap.to(blob2.current, { x: nx * -90, y: ny * -60, duration: 2.5, ease: 'power2.out' });
            gsap.to(blob3.current, { x: nx * 40, y: ny * 80, duration: 3, ease: 'power2.out' });
        };
        window.addEventListener('mousemove', onMove, { passive: true });

        // GSAP staggered hero entrance after curtain clears
        const delayTime = initialShowCurtain.current ? 2.3 : 0.2;
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ delay: delayTime });
            tl.from('.mc-hero-badge', { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' })
              .from('.mc-hero-h1 .mc-word', { y: 60, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power4.out' }, '-=0.3')
              .from('.mc-hero-body', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
              .from('.mc-hero-store', { y: 16, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
              .from('.mc-hero-trust', { y: 12, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
              .from('.mc-hero-phone', { x: 60, opacity: 0, duration: 1, ease: 'power4.out' }, '-=0.8')
              .from('.mc-hero-chip-1', { x: 40, opacity: 0, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.4')
              .from('.mc-hero-chip-2', { x: -40, opacity: 0, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.3');
        }, sectionRef);

        return () => {
            clearInterval(iv);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMove);
            ctx.revert();
        };
    }, []);

    const screens = [<ScreenHome />, <ScreenSnellen />, <ScreenAstigmat />];

    return (
        <section id="beranda" style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden', background: T.bg, paddingTop: 100, fontFamily: T.font }}>
            {/* Background blobs */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
                <div ref={blob1} style={{ position: 'absolute', top: '5%', right: '-8%', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)', filter: 'blur(56px)' }}/>
                <div ref={blob2} style={{ position: 'absolute', bottom: '-10%', left: '-8%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(5,150,105,0.09) 0%, transparent 70%)', filter: 'blur(50px)' }}/>
                <div ref={blob3} style={{ position: 'absolute', top: '50%', left: '35%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }}/>
                {/* Dot-grid pattern */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, ${T.brand}0A 1px, transparent 1px)`, backgroundSize: '38px 38px', maskImage: 'radial-gradient(ellipse 70% 70% at 60% 40%, black 30%, transparent 80%)' }}/>
                {/* Decorative arc */}
                <svg style={{ position: 'absolute', right: '-60px', top: '10%', opacity: 0.06 }} width="600" height="600" viewBox="0 0 600 600" fill="none">
                    <circle cx="300" cy="300" r="280" stroke={T.brand} strokeWidth="1.5" strokeDasharray="8 12"/>
                    <circle cx="300" cy="300" r="200" stroke={T.accent} strokeWidth="1" strokeDasharray="4 8"/>
                </svg>
            </div>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '80px 24px', width: '100%' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }} className="mc-hero-grid">

                    {/* ── LEFT COLUMN ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                        {/* Badge */}
                        <div className="mc-hero-badge">
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 99, border: `1.5px solid rgba(22,163,74,0.25)`, background: 'rgba(22,163,74,0.07)', fontSize: '0.72rem', fontWeight: 700, color: T.brandD, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                <span style={{ width: 7, height: 7, borderRadius: '50%', background: T.brandD, display: 'inline-block', animation: 'mc-pulse 2s infinite' }}/>
                                {t('hero_badge')}
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="mc-hero-h1" style={{ fontSize: 'clamp(2.4rem, 5vw, 3.9rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.1, margin: 0, color: T.text, overflow: 'hidden' }}>
                            <span style={{ display: 'block' }}>
                                <span className="mc-word" style={{ display: 'inline-block', marginRight: '0.25em' }}>{t('hero_title_1')}</span>
                            </span>
                            <span style={{ display: 'block' }}>
                                <span className="mc-word" style={{ display: 'inline-block', marginRight: '0.25em' }}>{t('hero_title_2')}</span>
                            </span>
                            <span className="mc-word" style={{ display: 'inline-block', background: T.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {t('hero_title_3')}
                            </span>
                        </h1>

                        {/* Body text */}
                        <p className="mc-hero-body" style={{ fontSize: '1.05rem', color: T.text2, lineHeight: 1.75, margin: 0, maxWidth: 490 }}>
                            {t('hero_desc')}
                        </p>

                        {/* Store buttons */}
                        <div className="mc-hero-store">
                            <StoreButtons apkRoute={apkRoute} onStoreClick={onStoreClick} />
                        </div>

                        {/* Trust badges */}
                        <div className="mc-hero-trust" style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                            {[
                                { icon: <Star size={16} color="#FBBF24" fill="#FBBF24" />, title: t('hero_rating'), desc: t('hero_reviews_count') },
                                { icon: <Shield size={16} color={T.brand} />, title: t('hero_trust_med'), desc: t('hero_trust_med') },
                                { icon: <Zap size={16} color={T.brand} fill={T.brand} />, title: '3 Min', desc: t('hero_trust_inst') }
                            ].map((item, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                                    <div>
                                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: T.text }}>{item.title}</div>
                                        <div style={{ fontSize: '0.65rem', color: T.text3 }}>{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN ── */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        {/* Decorative rings */}
                        <div style={{ position: 'absolute', width: 460, height: 460, borderRadius: '50%', border: '1.5px dashed rgba(22,163,74,0.14)', animation: 'mc-spin-slow 35s linear infinite' }}/>
                        <div style={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', border: '1px solid rgba(5,150,105,0.08)' }}/>

                        {/* Floating chips */}
                        <motion.div className="mc-hero-chip-1"
                            animate={{ y: [0, -9, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                            style={{ position: 'absolute', top: '8%', left: '-4%', background: '#fff', borderRadius: 14, padding: '10px 14px', boxShadow: T.shadowM, border: `1px solid ${T.border}`, zIndex: 5 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 28, height: 28, borderRadius: 8, background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.58rem', color: T.text3 }}>{t('hero_diagnostics')}</div>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: T.brand }}>20/20 {t('hero_normal')}</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div className="mc-hero-chip-2"
                            animate={{ y: [0, 9, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                            style={{ position: 'absolute', bottom: '10%', right: '-4%', background: '#fff', borderRadius: 14, padding: '10px 14px', boxShadow: T.shadowM, border: `1px solid ${T.border}`, zIndex: 5 }}>
                            <div style={{ fontSize: '0.58rem', color: T.text3, marginBottom: 3 }}>AI Score</div>
                            <div style={{ fontSize: '1rem', fontWeight: 900, color: T.brand, display: 'flex', alignItems: 'center', gap: 4 }}>
                                9.8/10 <Star size={14} color="#FBBF24" fill="#FBBF24" />
                            </div>
                        </motion.div>

                        {/* Phone mockup */}
                        <div className="mc-hero-phone">
                            <AnimatePresence mode="wait">
                                <motion.div key={screenIdx}
                                    initial={{ opacity: 0, scale: 0.94, y: 14 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.94, y: -14 }}
                                    transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}>
                                    <PhoneMockup screen={screens[screenIdx]} size="lg" />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll cue */}
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
                style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.38 }}>
                <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: T.text3, fontFamily: T.font }}>{t('hero_scroll')}</span>
                <div style={{ width: 1, height: 24, background: `linear-gradient(to bottom, ${T.brand}, transparent)` }}/>
            </motion.div>
        </section>
    );
}

/* ═══════════════════════════════════════════════
   SCROLL-REVEAL HELPER HOOK
   ═══════════════════════════════════════════════ */
function useScrollReveal(selector, options = {}, trigger = true) {
    useEffect(() => {
        if (!trigger) return;
        const { delay = 0, y = 0, x = 0, scale = 1, duration = 0.8, stagger = 0 } = options;
        const els = document.querySelectorAll(selector);
        if (!els.length) return;

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const animParams = { opacity: 0, duration, ease: 'power3.out', delay };
                    if (y !== 0) animParams.y = y;
                    if (x !== 0) animParams.x = x;
                    if (scale !== 1) animParams.scale = scale;
                    
                    if (stagger > 0 && target.children.length > 0) {
                        gsap.from(Array.from(target.children), { ...animParams, stagger });
                    } else {
                        gsap.from(target, animParams);
                    }
                    obs.unobserve(target);
                }
            });
        }, { threshold: 0.15 });

        els.forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, [trigger]);
}

/* ═══════════════════════════════════════════════
   HOW IT WORKS — 4 steps
   ═══════════════════════════════════════════════ */
function HowItWorks() {
    const { t } = React.useContext(LanguageContext);
    const steps = [
        { num: 1, icon: <Smartphone size={20} color={T.brand} />, title: t('hiw_step1_title'), desc: t('hiw_step1_desc') },
        { num: 2, icon: <Eye size={20} color={T.brand} />, title: t('hiw_step2_title'), desc: t('hiw_step2_desc') },
        { num: 3, icon: <Target size={20} color={T.brand} />, title: t('hiw_step3_title'), desc: t('hiw_step3_desc') },
        { num: 4, icon: <BarChart3 size={20} color={T.brand} />, title: t('hiw_step4_title'), desc: t('hiw_step4_desc') },
    ];

    return (
        <section id="cara-kerja" style={{ padding: '100px 0', background: T.bgAlt, position: 'relative', overflow: 'hidden', fontFamily: T.font }}>
            {/* Connector */}
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '80%', height: 2, background: `linear-gradient(90deg, transparent, ${T.borderM}, transparent)` }}/>

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                <div className="sr-up" style={{ textAlign: 'center', marginBottom: 64 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 99, border: `1.5px solid rgba(22,163,74,0.22)`, background: 'rgba(22,163,74,0.07)', fontSize: '0.72rem', fontWeight: 700, color: T.brandD, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 18 }}>
                        {t('hiw_badge')}
                    </span>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.04em', color: T.text, margin: '0 0 14px' }}>
                        {t('hiw_title')}
                    </h2>
                    <p style={{ fontSize: '1rem', color: T.text2, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
                        {t('hiw_desc')}
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="mc-steps-grid sr-stagger-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem 4rem', alignItems: 'start' }}>
                    {steps.map((s, i) => (
                        <div key={s.num} className="mc-step-card" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                                background: s.num % 2 === 1 ? T.grad : 'transparent',
                                border: s.num % 2 === 0 ? `2.5px solid ${T.borderM}` : 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 900, fontSize: '1.25rem',
                                color: s.num % 2 === 1 ? '#fff' : T.brand,
                                boxShadow: s.num % 2 === 1 ? '0 4px 20px rgba(22,163,74,0.3)' : 'none',
                            }}>
                                {s.num}
                            </div>
                            <div style={{ paddingTop: 6 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</span>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: T.text, margin: 0 }}>{s.title}</h3>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: T.text2, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Result Mockup */}
                <div className="sr-scale" style={{ display: 'flex', justifyContent: 'center', marginTop: 72, position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.09), transparent 70%)', filter: 'blur(40px)' }}/>
                    <PhoneMockup screen={<ScreenResult />} size="md" />
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════
   HOW DOES IT WORK — Patient vs Doctor
   ═══════════════════════════════════════════════ */
function HowDoesItWork() {
    const { t } = React.useContext(LanguageContext);
    const [tab, setTab] = useState(0);

    const data = [
        {
            features: [
                { icon: <ClipboardList size={22} color={T.brand} />, title: t('hdw_p_feat1_title'), desc: t('hdw_p_feat1_desc') },
                { icon: <Bot size={22} color={T.brand} />, title: t('hdw_p_feat2_title'), desc: t('hdw_p_feat2_desc') },
                { icon: <Rocket size={22} color={T.brand} />, title: t('hdw_p_feat3_title'), desc: t('hdw_p_feat3_desc') },
            ],
            screens: [<ScreenSnellen />, <ScreenHome />],
        },
        {
            features: [
                { icon: <BarChart3 size={22} color={T.brand} />, title: t('hdw_d_feat1_title'), desc: t('hdw_d_feat1_desc') },
                { icon: <MessageSquare size={22} color={T.brand} />, title: t('hdw_d_feat2_title'), desc: t('hdw_d_feat2_desc') },
                { icon: <FileText size={22} color={T.brand} />, title: t('hdw_d_feat3_title'), desc: t('hdw_d_feat3_desc') },
            ],
            screens: [<ScreenResult />, <ScreenAstigmat />],
        },
    ];

    const active = data[tab];

    return (
        <section id="fitur" style={{ padding: '100px 0', background: T.bg, fontFamily: T.font }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                <div className="sr-up" style={{ textAlign: 'center', marginBottom: 48 }}>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.04em', color: T.text, margin: '0 0 14px' }}>
                        {t('hdw_title')}
                    </h2>
                    <p style={{ fontSize: '1rem', color: T.text2, maxWidth: 520, margin: '0 auto 28px', lineHeight: 1.7 }}>
                        {t('hdw_desc')}
                    </p>
                    
                    {/* Tab switcher */}
                    <div style={{ display: 'inline-flex', background: T.bgAlt, borderRadius: 14, padding: 5, border: `1px solid ${T.border}` }}>
                        {[t('hdw_tab_patient'), t('hdw_tab_doctor')].map((tLabel, i) => (
                            <button key={i} onClick={() => setTab(i)} style={{
                                padding: '10px 26px', borderRadius: 10, border: 'none', cursor: 'pointer',
                                background: tab === i ? T.grad : 'transparent',
                                color: tab === i ? '#fff' : T.text2,
                                fontWeight: tab === i ? 700 : 500,
                                fontSize: '0.875rem', fontFamily: T.font,
                                boxShadow: tab === i ? '0 4px 14px rgba(22,163,74,0.25)' : 'none',
                                transition: 'all 0.28s ease',
                            }}>
                                {tLabel}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="mc-tab-grid">
                    {/* Left: phones */}
                    <div className="sr-scale" style={{ display: 'flex', gap: 14, justifyContent: 'center', alignItems: 'flex-end', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.07), transparent 70%)', filter: 'blur(30px)' }}/>
                        <AnimatePresence mode="wait">
                            <motion.div key={`${tab}-main`}
                                initial={{ opacity: 0, x: -20, scale: 0.94 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 20, scale: 0.94 }}
                                transition={{ duration: 0.38 }}>
                                <PhoneMockup screen={active.screens[0]} size="md" />
                            </motion.div>
                        </AnimatePresence>
                        <AnimatePresence mode="wait">
                            <motion.div key={`${tab}-sub`}
                                initial={{ opacity: 0, x: 20, scale: 0.94 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -20, scale: 0.94 }}
                                transition={{ duration: 0.38, delay: 0.08 }}
                                style={{ marginBottom: -30 }}
                                className="mc-secondary-phone">
                                <PhoneMockup screen={active.screens[1]} size="sm" float={false} />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right: features */}
                    <div className="sr-up" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                        <AnimatePresence mode="wait">
                            <motion.div key={tab}
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -14 }}
                                transition={{ duration: 0.32 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                                {active.features.map((f, i) => (
                                    <motion.div key={f.title}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1, duration: 0.4 }}
                                        style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                                        <div style={{ width: 50, height: 50, borderRadius: 14, background: T.gradSoft, border: `1.5px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                                            {f.icon}
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: T.text, margin: '0 0 6px' }}>{f.title}</h3>
                                            <p style={{ fontSize: '0.875rem', color: T.text2, lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════
   TESTIMONIALS CAROUSEL
   ═══════════════════════════════════════════════ */
const REVIEWS = [
    { name: 'Rina Marlina', role: 'Guru SD, Bandung', rating: 5, type: 'Tes Rabun Jauh' },
    { name: 'Farhan Hidayat', role: 'Mahasiswa, Jakarta', rating: 5, type: 'Tes Silinder' },
    { name: 'dr. Siti Rahma, Sp.M', role: 'Spesialis Mata, Surabaya', rating: 5, type: 'Platform Dokter' },
    { name: 'Dewi Kusuma', role: 'Ibu Rumah Tangga, Yogya', rating: 5, type: 'Tes Anak' },
    { name: 'Budi Santoso', role: 'Karyawan, Medan', rating: 5, type: 'Tes Rabun Dekat' },
    { name: 'Kevin Pratama', role: 'Developer, Bali', rating: 5, type: 'UI/UX Feedback' },
];

function Testimonials() {
    const { t } = React.useContext(LanguageContext);
    const [idx, setIdx] = useState(0);
    const [perView, setPerView] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth < 768 ? 1 : window.innerWidth < 1100 ? 2 : 3;
        }
        return 3;
    });

    useEffect(() => {
        const h = () => setPerView(window.innerWidth < 768 ? 1 : window.innerWidth < 1100 ? 2 : 3);
        h(); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h);
    }, []);

    const max = REVIEWS.length - perView;
    
    // Map reviews with translations
    const translatedReviews = REVIEWS.map((r, i) => ({
        ...r,
        text: t(`rev_text_${i}`)
    }));

    return (
        <section id="ulasan" style={{ padding: '100px 0', background: T.bgAlt, overflow: 'hidden', fontFamily: T.font }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 20 }}>
                    <div className="sr-up">
                        <span style={{ display: 'block', width: 'max-content', marginBottom: 14, padding: '5px 14px', borderRadius: 99, border: `1.5px solid rgba(22,163,74,0.22)`, background: 'rgba(22,163,74,0.07)', fontSize: '0.72rem', fontWeight: 700, color: T.brandD, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            {t('rev_badge')}
                        </span>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.04em', color: T.text, margin: 0 }}>
                            {t('rev_title_1')}{' '}
                            <span style={{ background: T.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {t('rev_title_2')}
                            </span>{' '}
                            {t('rev_title_3')}
                        </h2>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        {[0, 1].map(dir => (
                            <button key={dir}
                                onClick={() => setIdx(p => dir === 0 ? Math.max(p - 1, 0) : Math.min(p + 1, max))}
                                disabled={dir === 0 ? idx === 0 : idx === max}
                                aria-label={dir === 0 ? t('rev_prev') : t('rev_next')}
                                style={{ width: 44, height: 44, borderRadius: '50%', border: `1.5px solid ${T.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (dir === 0 ? idx === 0 : idx === max) ? 0.3 : 1, transition: 'all 0.2s', boxShadow: T.shadow }}
                                onMouseEnter={e => { if (!((dir === 0 ? idx === 0 : idx === max))) { e.currentTarget.style.borderColor = T.brand; e.currentTarget.style.background = T.gradSoft; } }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = '#fff'; }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.text} strokeWidth="2.5">
                                    {dir === 0 ? <path d="M15 18l-6-6 6-6"/> : <path d="M9 18l6-6-6-6"/>}
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ overflow: 'hidden' }}>
                    <motion.div
                        animate={{ x: `calc(-${idx * (100 / perView)}% - ${idx * 20}px)` }}
                        transition={{ type: 'spring', stiffness: 160, damping: 24 }}
                        style={{ display: 'flex', gap: 20 }}>
                        {translatedReviews.map((r, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (i % perView) * 0.1, duration: 0.6 }}
                                style={{ flexShrink: 0, width: `calc((100% - ${(perView - 1) * 20}px) / ${perView})`, background: '#fff', border: `1px solid ${T.border}`, borderRadius: 20, padding: 28, boxShadow: T.shadow, display: 'flex', flexDirection: 'column', gap: 14, transition: 'all 0.2s' }}
                                className="mc-review-card"
                                onMouseEnter={e => { e.currentTarget.style.borderColor = T.brand; e.currentTarget.style.boxShadow = T.shadowM; e.currentTarget.style.transform = 'translateY(-5px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = T.shadow; e.currentTarget.style.transform = 'none'; }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', gap: 2 }}>
                                        {[...Array(r.rating)].map((_, j) => <span key={j} style={{ color: '#FBBF24', fontSize: '0.88rem' }}>★</span>)}
                                    </div>
                                    <span style={{ fontSize: '0.62rem', color: T.brand, background: 'rgba(22,163,74,0.08)', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>{r.type}</span>
                                </div>
                                <p style={{ fontSize: '0.875rem', color: T.text2, lineHeight: 1.7, margin: 0, fontStyle: 'italic', flex: 1 }}>"{r.text}"</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderTop: `1px solid ${T.border}`, paddingTop: 14 }}>
                                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>{r.name[0]}</div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: T.text }}>{r.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: T.text3 }}>{r.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28 }}>
                    {[...Array(max + 1)].map((_, i) => (
                        <div key={i} onClick={() => setIdx(i)} style={{ width: idx === i ? 24 : 8, height: 8, borderRadius: 4, background: idx === i ? T.brand : T.borderM, cursor: 'pointer', transition: 'all 0.3s' }}/>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════
   DOWNLOAD CTA
   ═══════════════════════════════════════════════ */
function DownloadCTA({ statsPatients, apkRoute, onStoreClick }) {
    const { t } = React.useContext(LanguageContext);
    return (
        <section id="app" style={{ padding: '80px 24px', background: T.bg, fontFamily: T.font }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <div
                    className="mc-cta-grid sr-scale"
                    style={{ background: T.grad, borderRadius: 28, padding: '56px 56px', display: 'grid', gridTemplateColumns: '1fr auto', gap: '3rem', alignItems: 'center', overflow: 'hidden', position: 'relative' }}
                >
                    {/* Decorative blobs */}
                    <div style={{ position: 'absolute', top: -80, right: 220, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }}/>
                    <div style={{ position: 'absolute', bottom: -60, right: 90, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }}/>
                    <div style={{ position: 'absolute', top: -50, left: -50, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }}/>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff', margin: '0 0 16px', lineHeight: 1.15 }}>
                            {t('cta_title')}
                        </h2>
                        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.7, margin: '0 0 28px', maxWidth: 480 }}>
                            {t('cta_desc', { stats: statsPatients || '50.000+' })}
                        </p>
                        <StoreButtons inverted={true} apkRoute={apkRoute} onStoreClick={onStoreClick} />
                    </div>

                    <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ position: 'relative', zIndex: 1 }}
                        className="mc-cta-phone-container">
                        <div style={{ width: 195, height: 390, borderRadius: 38, background: 'rgba(0,0,0,0.3)', border: '2px solid rgba(255,255,255,0.22)', boxShadow: '0 20px 60px rgba(0,0,0,0.35)', overflow: 'hidden', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 68, height: 18, borderRadius: 12, background: 'rgba(0,0,0,0.35)', zIndex: 5 }}/>
                            <div style={{ padding: '36px 12px 12px', height: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <div style={{ textAlign: 'center', color: '#fff' }}>
                                    <div style={{ fontSize: '0.52rem', opacity: 0.5, marginBottom: 4 }}>MataCeria App</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 900 }}>{t('cta_results')}</div>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.14)', borderRadius: 14, padding: '12px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>20/20</div>
                                    <div style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                                        {t('cta_normal')} <Check size={10} color="#4ADE80" strokeWidth={3} />
                                    </div>
                                </div>
                                {[[t('cta_myopia'), t('hero_normal'), '#4ADE80'], [t('cta_hyperopia'), t('hero_normal'), '#4ADE80'], [t('cta_astigmatism'), t('cta_detected'), '#FBBF24']].map(([l, v, c]) => (
                                    <div key={l} style={{ background: 'rgba(255,255,255,0.09)', borderRadius: 10, padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.7)' }}>{l}</span>
                                        <span style={{ fontSize: '0.52rem', fontWeight: 700, color: c }}>{v}</span>
                                    </div>
                                ))}
                                <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: 10, padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 'auto', cursor: 'pointer' }}>
                                    <Play size={10} color={T.brand} fill={T.brand} />
                                    <div style={{ fontSize: '0.6rem', fontWeight: 800, color: T.brand }}>{t('cta_retest')}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

/* ═══════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════ */
function Footer({ onGeneralClick }) {
    const { t } = React.useContext(LanguageContext);
    const cols = [
        { 
            title: t('footer_quick'), 
            links: [
                { label: t('nav_home'), href: '#beranda' }, 
                { label: t('nav_features'), href: '#fitur' }, 
                { label: t('nav_how_it_works'), href: '#cara-kerja' }, 
                { label: t('footer_policy'), href: '#', onClick: () => onGeneralClick('Privacy Policy') }, 
                { label: t('footer_terms'), href: '#', onClick: () => onGeneralClick('Terms & Conditions') }
            ] 
        },
        { 
            title: t('footer_about'), 
            links: [
                { label: t('footer_team'), href: '#', onClick: () => onGeneralClick('Our Team') }, 
                { label: t('footer_story'), href: '#', onClick: () => onGeneralClick('Our Story') }, 
                { label: t('footer_blog'), href: '#', onClick: () => onGeneralClick('Blog') }, 
                { label: t('footer_careers'), href: '#', onClick: () => onGeneralClick('Careers') }
            ] 
        },
        { 
            title: t('footer_contacts'), 
            links: [
                { label: 'hello@mataceria.com', href: 'mailto:hello@mataceria.com' }, 
                { label: 'Jl. Sudirman No. 1, Jakarta', href: 'https://maps.google.com/?q=-6.2183,106.8021', target: '_blank', rel: 'noopener noreferrer' }, 
                { label: '+62 812-3456-7890', href: 'tel:+6281234567890' }
            ] 
        },
    ];
    return (
        <footer style={{ background: T.bgDark, color: '#fff', padding: '64px 0 0', fontFamily: T.font }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(3, 1fr)', gap: '3rem', marginBottom: '3rem' }} className="mc-footer-grid">
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: T.grad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>Mata<span style={{ color: T.brandL }}>Ceria</span></span>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: 260, margin: '0 0 24px' }}>
                            {t('footer_desc')}
                        </p>
                        <div style={{ display: 'flex', gap: 10 }}>
                            {['Facebook', 'LinkedIn', 'Instagram'].map(s => {
                                const disp = s === 'Facebook' ? 'f' : s === 'LinkedIn' ? 'in' : 'ig';
                                return (
                                    <a key={s} href="#" onClick={(e) => { e.preventDefault(); onGeneralClick(s); }} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}
                                       onMouseEnter={e => { e.currentTarget.style.background = T.grad; e.currentTarget.style.color = '#fff'; }}
                                       onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}>
                                        {disp}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                    {cols.map(c => (
                        <div key={c.title}>
                            <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', margin: '0 0 16px' }}>{c.title}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {c.links.map(link => {
                                    const linkProps = {
                                        href: link.href,
                                        style: { fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', transition: 'color 0.15s' },
                                        onMouseEnter: e => e.currentTarget.style.color = T.brandL,
                                        onMouseLeave: e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                                    };
                                    if (link.onClick) {
                                        linkProps.onClick = (e) => { e.preventDefault(); link.onClick(); };
                                    }
                                    if (link.target) linkProps.target = link.target;
                                    if (link.rel) linkProps.rel = link.rel;
                                    return (
                                        <a key={link.label} {...linkProps}>
                                            {link.label}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 0', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.48)', margin: 0 }}>
                        Copyright © {new Date().getFullYear()} MataCeria · All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

/* ═══════════════════════════════════════════════
   ROOT APP
   ═══════════════════════════════════════════════ */
export default function WelcomeApp({ loginRoute, adminRoute, isAuthenticated, userName, statsPatients, statsDoctors, apkRoute }) {
    const [lang, setLang] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('mc_lang');
            if (saved && T_DICT[saved]) return saved;
            // Auto detect browser language
            const navLang = navigator.language.split('-')[0];
            if (T_DICT[navLang]) return navLang;
        }
        return 'id';
    });

    const [scrolled, setScrolled] = useState(false);
    const [showCurtain, setShowCurtain] = useState(() => {
        if (typeof window !== 'undefined') {
            const isBot = /Chrome-Lighthouse|Googlebot/i.test(navigator.userAgent);
            const hasSeenInt = sessionStorage.getItem('mc_curtain_shown');
            return !isBot && !hasSeenInt;
        }
        return true;
    });
    const [comingSoon, setComingSoon] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalDesc, setModalDesc] = useState('');
    const [modalType, setModalType] = useState('store'); // 'store' or 'general'
    const [platform, setPlatform] = useState('');

    const t = (key, replacements = {}) => {
        let text = T_DICT[lang]?.[key] ?? T_DICT['id']?.[key] ?? key;
        Object.keys(replacements).forEach(r => {
            text = text.replace(`{${r}}`, replacements[r]);
        });
        return text;
    };

    const changeLang = (newLang) => {
        if (T_DICT[newLang]) {
            setLang(newLang);
            if (typeof window !== 'undefined') {
                localStorage.setItem('mc_lang', newLang);
            }
        }
    };

    useScrollReveal('.sr-up', { y: 45, duration: 0.95 }, !showCurtain);
    useScrollReveal('.sr-down', { y: -45, duration: 0.95 }, !showCurtain);
    useScrollReveal('.sr-scale', { scale: 0.95, duration: 0.95 }, !showCurtain);
    useScrollReveal('.sr-stagger-up', { y: 35, duration: 0.85, stagger: 0.12 }, !showCurtain);

    useEffect(() => {
        const detector = document.getElementById('scroll-detector');
        let observer;
        if (detector) {
            observer = new IntersectionObserver(([entry]) => {
                setScrolled(!entry.isIntersecting);
            }, { threshold: 0 });
            observer.observe(detector);
        }
        if (typeof window.__mcReady === 'function') window.__mcReady();
        return () => {
            if (observer) observer.disconnect();
        };
    }, []);

    const handleStoreClick = (p) => {
        setPlatform(p);
        setModalType('store');
        setModalTitle(t('modal_coming_soon', { platform: p }));
        setModalDesc(t('modal_coming_soon_desc', { platform: p }));
        setComingSoon(true);
    };

    const handleGeneralClick = (title) => {
        setModalType('general');
        setModalTitle(t('modal_dev_title', { title }));
        setModalDesc(t('modal_dev_desc', { title }));
        setComingSoon(true);
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
            <div style={{ background: T.bg, minHeight: '100vh', fontFamily: T.font, overflowX: 'hidden' }}>
                {/* Scroll detector */}
                <div id="scroll-detector" style={{ position: 'absolute', top: 40, left: 0, width: '1px', height: '1px', pointerEvents: 'none', visibility: 'hidden' }} />
                {/* Page-load curtain */}
                {showCurtain && (
                    <PageLoadAnimation onComplete={() => {
                        setShowCurtain(false);
                        if (typeof window !== 'undefined') {
                            sessionStorage.setItem('mc_curtain_shown', 'true');
                        }
                    }} />
                )}

                <Navbar loginRoute={loginRoute} adminRoute={adminRoute} isAuthenticated={isAuthenticated} userName={userName} scrolled={scrolled} showCurtain={showCurtain} />
                <main>
                    <HeroSection loginRoute={loginRoute} adminRoute={adminRoute} isAuthenticated={isAuthenticated} apkRoute={apkRoute} onStoreClick={handleStoreClick} showCurtain={showCurtain} />
                    <HowItWorks />
                    <HowDoesItWork />
                    <Testimonials />
                    <DownloadCTA isAuthenticated={isAuthenticated} statsPatients={statsPatients} apkRoute={apkRoute} onStoreClick={handleStoreClick} />
                </main>
                <Footer onGeneralClick={handleGeneralClick} />

                {/* Coming Soon Modal */}
                <AnimatePresence>
                    {comingSoon && (
                        <div style={{
                            position: 'fixed', inset: 0, zIndex: 1000000,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(15,41,24,0.3)', backdropFilter: 'blur(12px)',
                            padding: 24,
                            fontFamily: T.font
                        }} onClick={() => setComingSoon(false)}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                                onClick={e => e.stopPropagation()}
                                style={{
                                    width: '100%', maxWidth: 440,
                                    background: '#ffffff',
                                    borderRadius: 24, border: `1.5px solid ${T.borderM}`,
                                    boxShadow: '0 24px 60px rgba(15,41,24,0.18)',
                                    padding: 32,
                                    position: 'relative',
                                    textAlign: 'center'
                                }}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setComingSoon(false)}
                                    style={{
                                        position: 'absolute', top: 20, right: 20,
                                        background: 'transparent', border: 'none', cursor: 'pointer',
                                        color: T.text3, transition: 'color 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.color = T.brand}
                                    onMouseLeave={e => e.currentTarget.style.color = T.text3}
                                >
                                    <X size={20} />
                                </button>

                                {/* Icon */}
                                <div style={{
                                    width: 64, height: 64, borderRadius: '50%',
                                    background: T.gradSoft, border: `1.5px solid ${T.border}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 20px', color: T.brand
                                }}>
                                    <Smartphone size={28} />
                                </div>

                                {/* Content */}
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: T.text, margin: '0 0 12px' }}>
                                    {modalTitle}
                                </h3>
                                <p style={{ fontSize: '0.88rem', color: T.text2, lineHeight: 1.6, margin: '0 0 24px' }}>
                                    {modalDesc}
                                </p>

                                {/* Android Callout */}
                                {modalType === 'store' && (
                                    <div style={{
                                        background: T.bgAlt, border: `1px solid ${T.border}`,
                                        borderRadius: 16, padding: '16px 20px', marginBottom: 24,
                                        textAlign: 'left'
                                    }}>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: T.text, marginBottom: 4 }}>
                                            {t('modal_android')}
                                        </div>
                                        <div style={{ fontSize: '0.72rem', color: T.text2, lineHeight: 1.4 }}>
                                            {t('modal_android_desc')}
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {modalType === 'store' && (
                                        <a
                                            href={apkRoute || '/downloads/mataceria-latest.apk'}
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                                padding: '12px 24px', borderRadius: 12,
                                                background: T.grad, color: '#fff',
                                                fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none',
                                                boxShadow: '0 4px 14px rgba(22,163,74,0.3)',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(22,163,74,0.4)'}
                                            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(22,163,74,0.3)'}
                                            onClick={() => setComingSoon(false)}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(0deg)' }}>
                                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                                <polyline points="19 12 12 19 5 12"></polyline>
                                            </svg>
                                            {t('modal_download')}
                                        </a>
                                    )}

                                    <button
                                        onClick={() => setComingSoon(false)}
                                        style={{
                                            padding: '12px 24px', borderRadius: 12,
                                            border: `1.5px solid ${T.borderM}`, background: 'transparent',
                                            color: T.text2, fontSize: '0.9rem', fontWeight: 600,
                                            cursor: 'pointer', transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = T.brand}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = T.borderM}
                                    >
                                        {t('modal_close')}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Global styles */}
                <style>{`
                    *, *::before, *::after { box-sizing: border-box; }
                    html { scroll-behavior: smooth; }
                    body { margin: 0; -webkit-font-smoothing: antialiased; }
                    ::selection { background: rgba(22,163,74,0.2); color: #0F2918; }

                    /* Keyframes */
                    @keyframes mc-pulse {
                        0%, 100% { opacity: 1; transform: scale(1); }
                        50% { opacity: 0.5; transform: scale(0.85); }
                    }
                    @keyframes mc-spin-slow {
                        to { transform: rotate(360deg); }
                    }

                    /* Responsive and Mobile Optimizations */
                    .mc-store-buttons {
                        justify-content: flex-start;
                    }
                    .mc-hero-trust {
                        justify-content: flex-start;
                    }
                    .mc-cta-phone-container {
                        display: flex;
                        justify-content: flex-end;
                    }

                    @media (max-width: 1024px) {
                        .mc-hero-grid  { grid-template-columns: 1fr !important; text-align: center !important; }
                        .mc-hero-grid > div { align-items: center !important; }
                        .mc-store-buttons { justify-content: center !important; }
                        .mc-hero-trust { justify-content: center !important; }
                        .mc-steps-grid { grid-template-columns: 1fr !important; }
                        .mc-tab-grid   { grid-template-columns: 1fr !important; }
                        .mc-cta-grid   { grid-template-columns: 1fr !important; }
                        .mc-footer-grid { grid-template-columns: 1fr 1fr !important; }
                        .mc-cta-phone-container { justify-content: center !important; margin-top: 1.5rem; }
                    }
                    
                    @media (max-width: 768px) {
                        .mc-nav-desktop    { display: none !important; }
                        .mc-nav-cta-desktop { display: none !important; }
                        .mc-nav-mobile-btn { display: flex !important; }
                        .mc-footer-grid    { grid-template-columns: 1fr !important; }
                        .mc-cta-grid {
                            padding: 32px 20px !important;
                            text-align: center !important;
                            gap: 2rem !important;
                        }
                        .mc-cta-grid > div:first-of-type {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                        }
                    }

                    @media (max-width: 480px) {
                        .mc-secondary-phone {
                            display: none !important;
                        }
                        .mc-review-card {
                            padding: 20px !important;
                        }
                    }
                `}</style>
            </div>
        </LanguageContext.Provider>
    );
}
