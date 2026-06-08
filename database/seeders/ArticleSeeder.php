<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $articles = [
            [
                'title' => 'Mengenal Anatomi Mata: Perjalanan Cahaya Menuju Penglihatan',
                'category' => 'Dasar-dasar Kesehatan Mata',
                'content' => "Mata adalah organ kompleks yang bekerja seperti kamera canggih. Proses penglihatan dimulai ketika cahaya masuk melalui kornea, lapisan transparan di bagian depan mata yang berfungsi sebagai pelindung dan pemfokus awal. Cahaya kemudian melewati pupil, lubang di tengah iris yang mengatur jumlah cahaya yang masuk. Lensa mata selanjutnya memfokuskan cahaya tepat ke retina, lapisan tipis berisi jutaan sel fotoreseptor (sel batang dan kerucut) di bagian belakang mata. Sel-sel ini mengubah cahaya menjadi sinyal listrik yang dikirim ke otak melalui saraf optik. Otak kemudian menerjemahkan sinyal tersebut menjadi gambar yang kita lihat.\n\nMemahami anatomi dasar ini penting karena setiap bagian mata rentan terhadap gangguan spesifik. Kornea bisa mengalami infeksi atau kerusakan akibat trauma, lensa bisa menjadi keruh (katarak), retina bisa rusak akibat diabetes (retinopati diabetik), dan saraf optik bisa terganggu oleh tekanan tinggi (glaukoma).\n\nTips Perawatan Dasar:\n- Lakukan pemeriksaan mata rutin setiap 1-2 tahun\n- Lindungi mata dari sinar UV dengan kacamata hitam berkualitas\n- Jaga kelembaban mata dengan berkedip secara teratur\n- Hindari mengucek mata dengan tangan kotor\n- Gunakan pencahayaan yang cukup saat membaca\n\nSumber: American Academy of Ophthalmology (AAO) - EyeSmart; Matapedia JEC Eye Hospitals.",
            ],
            [
                'title' => 'Pentingnya Pemeriksaan Mata Rutin: Deteksi Dini Selamatkan Penglihatan',
                'category' => 'Dasar-dasar Kesehatan Mata',
                'content' => "Banyak penyakit mata tidak menunjukkan gejala pada tahap awal. Glaukoma, degenerasi makula, dan retinopati diabetik sering disebut sebagai \"pencuri penglihatan diam-diam\" karena berkembang tanpa rasa sakit. Pemeriksaan mata rutin dapat mendeteksi masalah sejak dini, ketika pengobatan masih efektif.\n\nMenurut Kementerian Kesehatan RI, terdapat 3,6 juta anak Indonesia yang mengalami gangguan penglihatan. Tanpa deteksi dini, kondisi ini dapat mengganggu proses belajar dan perkembangan anak. Pemerintah menargetkan skrining mata terhadap 140 juta warga Indonesia pada tahun 2026 melalui integrasi ke dalam Program Cek Kesehatan Gratis (CKG).\n\nFrekuensi Pemeriksaan yang Direkomendasikan:\n- Anak-anak: Setiap 1-2 tahun\n- Dewasa 18-60 tahun: Setiap 2 tahun\n- Dewasa di atas 60 tahun: Setiap tahun\n- Penderita diabetes: Setiap 6-12 bulan\n- Pengguna lensa kontak: Setiap tahun\n\nSumber: Kementerian Kesehatan RI; World Health Organization (WHO); PERDAMI.",
            ],
            [
                'title' => 'Superfood untuk Mata: Nutrisi Penting demi Penglihatan Optimal',
                'category' => 'Nutrisi untuk Mata Sehat',
                'content' => "Nutrisi memainkan peran krusial dalam menjaga kesehatan mata. Beberapa nutrisi penting telah terbukti secara ilmiah dapat mencegah atau memperlambat penyakit mata degeneratif.\n\nVitamin A dan Beta-Karoten\n- Sumber: Wortel, ubi jalar, bayam, labu\n- Manfaat: Mencegah rabun senja dan menjaga kelembaban kornea\n\nLutein dan Zeaxanthin\n- Sumber: Bayam, kale, brokoli, telur, jagung\n- Manfaat: Melindungi retina dari kerusakan akibat cahaya biru dan mengurangi risiko degenerasi makula\n\nOmega-3 Fatty Acids\n- Sumber: Salmon, sarden, makarel, kacang kenari, biji chia\n- Manfaat: Mencegah sindrom mata kering dan mendukung perkembangan retina\n\nVitamin C\n- Sumber: Jeruk, stroberi, paprika, kiwi, jambu biji\n- Manfaat: Antioksidan kuat yang melindungi mata dari kerusakan radikal bebas\n\nVitamin E\n- Sumber: Almond, biji bunga matahari, alpukat, minyak zaitun\n- Manfaat: Melindungi sel-sel mata dari stres oksidatif\n\nZinc\n- Sumber: Daging sapi, tiram, kacang-kacangan, biji labu\n- Manfaat: Membantu vitamin A menciptakan melanin, pigmen pelindung mata\n\nSumber: American Academy of Ophthalmology (AAO); Matapedia JEC.",
            ],
            [
                'title' => 'Resep Smoothie \'Mata Sehat\' untuk Nutrisi Harian',
                'category' => 'Nutrisi untuk Mata Sehat',
                'content' => "Campurkan bahan-bahan berikut untuk smoothie kaya nutrisi mata:\n- 1 cangkir bayam segar\n- 1 buah wortel ukuran sedang\n- 1/2 buah jeruk\n- 1/4 buah alpukat\n- 1 sendok makan biji chia\n- Air secukupnya\n\nBlender hingga halus dan nikmati setiap pagi! Smoothie ini mengandung lutein, zeaxanthin, vitamin A, vitamin C, omega-3, dan zinc yang semuanya penting untuk kesehatan mata.\n\nSumber: American Academy of Ophthalmology (AAO) - EyeSmart.",
            ],
            [
                'title' => 'Katarak: Penyebab Kebutaan Nomor Satu yang Dapat Diobati',
                'category' => 'Penyakit Mata Umum',
                'content' => "Katarak adalah kekeruhan pada lensa mata yang menyebabkan penurunan penglihatan. Menurut WHO, katarak bertanggung jawab atas 51% kebutaan global, atau sekitar 20 juta orang. Kondisi ini umumnya terkait dengan penuaan, namun bisa juga disebabkan oleh diabetes, trauma, atau paparan UV berlebih.\n\nGejala:\n- Penglihatan kabur atau berawan\n- Sensitif terhadap cahaya\n- Melihat lingkaran cahaya (halo) di sekitar lampu\n- Warna terlihat memudar\n- Sering mengganti resep kacamata\n\nPencegahan:\n- Gunakan kacamata hitam anti-UV\n- Konsumsi antioksidan tinggi\n- Kontrol gula darah\n- Hindari merokok\n- Pemeriksaan mata rutin\n\nPengobatan:\nSatu-satunya pengobatan efektif untuk katarak adalah operasi. Prosedur ini melibatkan pengangkatan lensa keruh dan penggantiannya dengan lensa intraokular (IOL) buatan. Operasi katarak adalah salah satu prosedur paling aman dan efektif, dengan tingkat keberhasilan lebih dari 95%.\n\nSumber: World Health Organization (WHO); PERDAMI; Matapedia JEC.",
            ],
            [
                'title' => 'Glaukoma: Si Pencuri Penglihatan yang Bekerja Diam-diam',
                'category' => 'Penyakit Mata Umum',
                'content' => "Glaukoma adalah kerusakan saraf optik akibat tekanan bola mata yang tinggi. Penyakit ini adalah penyebab kebutaan nomor dua di dunia setelah katarak. Yang berbahaya, 50% penderita glaukoma tidak menyadari kondisinya karena gejala sering tidak terasa hingga kerusakan sudah parah.\n\nFakta Penting:\n- Kerusakan akibat glaukoma bersifat permanen dan tidak dapat dipulihkan\n- Faktor risiko: usia >60 tahun, riwayat keluarga, diabetes, hipertensi\n- Glaukoma sudut tertutup akut adalah kedaruratan medis\n\nJenis Glaukoma:\n1. Glaukoma sudut terbuka (paling umum, 90% kasus)\n2. Glaukoma sudut tertutup (darurat medis)\n3. Glaukoma tekanan normal\n4. Glaukoma kongenital (bawaan lahir)\n\nPencegahan dan Deteksi:\nSatu-satunya cara efektif mencegah kebutaan akibat glaukoma adalah deteksi dini melalui pemeriksaan tekanan bola mata dan pemeriksaan saraf optik secara rutin.\n\nSumber: WHO; American Academy of Ophthalmology (AAO); Matapedia JEC.",
            ],
            [
                'title' => 'Degenerasi Makula Terkait Usia: Ancaman Penglihatan di Usia Senja',
                'category' => 'Penyakit Mata Umum',
                'content' => "Degenerasi Makula Terkait Usia (AMD) mempengaruhi makula, bagian retina yang bertanggung jawab untuk penglihatan sentral. Kondisi ini adalah penyebab utama kebutaan pada lansia di atas 65 tahun. Penderita AMD kehilangan kemampuan melihat detail, seperti membaca, mengenali wajah, atau mengemudi.\n\nJenis AMD:\n- AMD Kering (Dry AMD): Mencakup 90% kasus, perkembangan bertahap selama bertahun-tahun\n- AMD Basah (Wet AMD): 10% kasus, perkembangan cepat dan lebih berbahaya, ditandai pertumbuhan pembuluh darah abnormal\n\nFaktor Risiko:\n- Usia >60 tahun\n- Merokok (meningkatkan risiko 2-4 kali lipat)\n- Riwayat keluarga\n- Obesitas dan hipertensi\n\nPengobatan:\nAMD basah dapat diobati dengan injeksi anti-VEGF ke dalam mata untuk menghambat pertumbuhan pembuluh darah abnormal. Untuk AMD kering, saat ini fokus pada pencegahan progresi melalui suplemen formula AREDS2.\n\nSumber: WHO; American Academy of Ophthalmology (AAO).",
            ],
            [
                'title' => 'Retinopati Diabetik: Komplikasi Diabetes yang Mengancam Penglihatan',
                'category' => 'Penyakit Mata Umum',
                'content' => "Retinopati diabetik adalah komplikasi diabetes yang merusak pembuluh darah di retina. Semakin lama seseorang menderita diabetes, semakin tinggi risikonya. Diabetes adalah penyebab utama kebutaan pada usia produktif (20-74 tahun).\n\nStadium Retinopati Diabetik:\n1. Non-proliferatif ringan\n2. Non-proliferatif sedang\n3. Non-proliferatif berat\n4. Proliferatif (paling parah, dengan pertumbuhan pembuluh darah abnormal)\n\nProtokol Perawatan:\n- Kontrol gula darah ketat (HbA1c <7%)\n- Pemeriksaan mata dengan dilatasi pupil setiap tahun\n- Kontrol tekanan darah dan kolesterol\n- Laporkan segera jika ada perubahan penglihatan\n\nSumber: WHO; American Academy of Ophthalmology (AAO); Kemenkes RI.",
            ],
            [
                'title' => 'Sindrom Mata Kering: Masalah Mata yang Semakin Umum di Era Digital',
                'category' => 'Penyakit Mata Umum',
                'content' => "Sindrom mata kering terjadi ketika mata tidak memproduksi cukup air mata atau air mata menguap terlalu cepat. Kondisi ini semakin umum terjadi di era digital karena penggunaan layar yang berkepanjangan mengurangi frekuensi berkedip.\n\nPenyebab:\n- Penggunaan layar digital berlebihan\n- Penuaan\n- Perubahan hormonal (menopause)\n- Obat-obatan tertentu (antihistamin, antidepresan)\n- Kondisi lingkungan (AC, angin, polusi)\n\nGejala:\n- Sensasi berpasir atau terbakar\n- Mata merah\n- Penglihatan buram sementara\n- Sensitif terhadap cahaya\n- Produksi air mata berlebihan (paradoks)\n\nPenanganan:\n- Tetes mata artifisial (tanpa pengawet)\n- Kompres hangat\n- Modifikasi lingkungan (humidifier)\n- Istirahat layar dengan aturan 20-20-20\n\nSumber: American Academy of Ophthalmology (AAO); Matapedia JEC.",
            ],
            [
                'title' => 'Digital Eye Strain: Bagaimana Layar Mengubah Kesehatan Mata Kita',
                'category' => 'Mata di Era Digital',
                'content' => "Rata-rata orang dewasa menghabiskan 7-11 jam per hari menatap layar digital. Akibatnya, 65% populasi mengalami gejala Digital Eye Strain (DES) atau Computer Vision Syndrome. Kondisi ini bukan hanya tentang mata lelah, tetapi juga berdampak pada produktivitas dan kualitas hidup.\n\nGejala DES:\n- Mata lelah dan perih\n- Penglihatan kabur\n- Sakit kepala\n- Nyeri leher dan bahu\n- Mata kering atau berair\n- Kesulitan fokus\n\nCara Mengatasi:\nTerapkan aturan 20-20-20: Setiap 20 menit menatap layar, alihkan pandangan ke objek sejauh 20 kaki (6 meter) selama 20 detik. Teknik sederhana ini terbukti mengurangi kelelahan mata secara signifikan.\n\nSumber: American Academy of Ophthalmology (AAO); Matapedia JEC.",
            ],
            [
                'title' => 'Cahaya Biru: Teman atau Lawan bagi Mata Kita?',
                'category' => 'Mata di Era Digital',
                'content' => "Cahaya biru dari layar digital memiliki panjang gelombang pendek dan energi tinggi. Paparan berlebihan, terutama di malam hari, dapat mengganggu ritme sirkadian (siklus tidur-bangun) dengan menekan produksi melatonin. Namun, belum ada bukti kuat bahwa cahaya biru dari layar menyebabkan kerusakan retina permanen pada tingkat paparan normal.\n\nCara Mengurangi Dampak Cahaya Biru:\n- Aktifkan night mode di perangkat\n- Gunakan kacamata anti blue light jika diperlukan\n- Hindari layar 1-2 jam sebelum tidur\n- Gunakan aplikasi filter cahaya biru (f.lux, Twilight)\n- Atur kecerahan layar sesuai lingkungan\n\nSumber: American Academy of Ophthalmology (AAO) - EyeSmart.",
            ],
            [
                'title' => 'Setting Workstation yang Ramah Mata untuk Pekerja Digital',
                'category' => 'Mata di Era Digital',
                'content' => "Ergonomi workstation yang tepat dapat mencegah digital eye strain and masalah muskuloskeletal terkait.\n\nPosisi Monitor:\n- Jarak: 50-70 cm dari mata\n- Tinggi: Bagian atas layar sejajar atau sedikit di bawah level mata\n- Sudut: Monitor sedikit miring ke atas (10-20 derajat)\n\nPengaturan Lingkungan:\n- Pencahayaan ruangan cukup (tidak terlalu terang/gelap)\n- Hindari silau dari jendela atau lampu\n- Gunakan humidifier untuk menjaga kelembaban\n- Suhu ruangan nyaman (20-24°C)\n- Letakkan tanaman hijau dalam pandangan untuk relaksasi mata\n\nSumber: American Academy of Ophthalmology (AAO).",
            ],
            [
                'title' => 'Kesehatan Mata Anak: Deteksi Dini untuk Masa Depan Cerah',
                'category' => 'Perawatan Mata Berdasarkan Usia',
                'content' => "Masa kanak-kanak adalah periode kritis perkembangan penglihatan. Deteksi dini masalah mata dapat mencegah komplikasi permanen seperti ambliopia (mata malas). Menurut Kemenkes RI, 3,6 juta anak Indonesia mengalami gangguan penglihatan yang dapat mengganggu proses belajar.\n\nTanda Masalah Mata pada Anak:\n- Sering mengucek mata\n- Duduk terlalu dekat dengan TV\n- Menutup satu mata saat membaca\n- Sakit kepala sering\n- Kesulitan membaca atau belajar\n\nJadwal Pemeriksaan:\n- Bayi baru lahir: Skrining refleks merah\n- 6-12 bulan: Pemeriksaan mata pertama\n- 3-5 tahun: Sebelum masuk sekolah\n- 6-12 tahun: Setiap 1-2 tahun\n\nSumber: Kementerian Kesehatan RI; American Academy of Ophthalmology (AAO); PERDAMI.",
            ],
            [
                'title' => 'Menjaga Penglihatan di Usia Senja: Panduan untuk Lansia',
                'category' => 'Perawatan Mata Berdasarkan Usia',
                'content' => "Risiko penyakit mata degeneratif meningkat signifikan setelah usia 60 tahun. Pemeriksaan rutin menjadi semakin penting karena banyak kondisi yang dapat diobati jika terdeteksi dini.\n\nPemeriksaan Penting untuk Lansia:\n- Tekanan bola mata (skrining glaukoma)\n- Pemeriksaan retina dengan dilatasi pupil (AMD, retinopati)\n- Evaluasi katarak\n- Tes lapang pandang\n\nTips Menjaga Kesehatan Mata Lansia:\n- Pemeriksaan mata tahunan\n- Nutrisi kaya lutein, zeaxanthin, dan omega-3\n- Perlindungan UV saat beraktivitas di luar\n- Kontrol penyakit kronis (diabetes, hipertensi)\n- Pencahayaan yang baik di rumah untuk mencegah jatuh\n\nSumber: WHO; American Academy of Ophthalmology (AAO).",
            ],
            [
                'title' => 'Mitos vs Fakta Seputar Kesehatan Mata',
                'category' => 'Mitokondria dan Fakta Seputar Mata',
                'content' => "Mitos 1: Membaca di Tempat Gelap Merusak Mata\nFakta: Membaca dalam cahaya redup menyebabkan kelelahan mata sementara, tapi tidak menyebabkan kerusakan permanen. Mata Anda hanya perlu bekerja lebih keras untuk fokus.\n\nMitos 2: Wortel Menyembuhkan Mata Minus\nFakta: Wortel kaya vitamin A yang penting untuk kesehatan mata, tapi tidak dapat menyembuhkan kelainan refraksi seperti miopia. Kacamata tetap diperlukan.\n\nMitos 3: Duduk Terlalu Dekat dengan TV Merusak Mata\nFakta: Tidak ada bukti ilmiah bahwa menonton TV dari jarak dekat menyebabkan kerusakan mata permanen. Namun, ini bisa menjadi TANDA bahwa anak mungkin sudah mengalami miopia.\n\nMitos 4: Kacamata Membuat Mata \"Ketergantungan\"\nFakta: Kacamata hanya membantu Anda melihat lebih jelas. Tidak memakai kacamata tidak akan memperkuat mata, justru menyebabkan kelelahan dan sakit kepala.\n\nMitos 5: Mata Minus Bisa Sembuh Sendiri\nFakta: Miopia disebabkan oleh bola mata yang terlalu panjang atau kornea terlalu melengkung. Ini adalah kondisi struktural yang tidak bisa berubah tanpa intervensi seperti LASIK.\n\nSumber: American Academy of Ophthalmology (AAO) - EyeSmart; Matapedia JEC.",
            ],
            [
                'title' => '10 Fakta Menarik Tentang Mata Manusia',
                'category' => 'Mitokondria dan Fakta Seputar Mata',
                'content' => "1. Mata adalah otot dengan gerakan tercepat di tubuh\n2. Setiap mata memiliki 107 juta sel sensitif cahaya\n3. Manusia berkedip 15-20 kali per menit (rata-rata 28.800 kali sehari)\n4. Bayi tidak memproduksi air mata hingga usia 1-3 bulan\n5. Sidik jari memiliki 40 karakteristik unik, iris mata memiliki 256\n6. Mata dapat membedakan sekitar 10 juta warna berbeda\n7. Kornea adalah satu-satunya jaringan dalam tubuh manusia tanpa pembuluh darah\n8. 80% dari semua yang kita pelajari berasal dari indera penglihatan\n9. Retina memproses gambar terbalik, dan otak membaliknya kembali\n10. Warna mata biru sebenarnya tidak mengandung pigmen biru, melainkan hasil hamburan cahaya\n\nSumber: American Academy of Ophthalmology (AAO).",
            ],
            [
                'title' => 'Pertolongan Pertama Cedera Mata: Panduan yang Harus Diketahui',
                'category' => 'Pertolongan Pertama pada Mata',
                'content' => "Benda Asing di Mata\nJANGAN: Mengucek mata, menggunakan pinset, menunda penanganan jika benda tajam.\nLAKUKAN: Cuci tangan, bilas mata dengan air bersih mengalir, tarik kelopak mata atas ke bawah untuk merangsang air mata. Jika tidak berhasil, segera ke dokter.\n\nTrauma Tumpul pada Mata\nBenturan keras dapat menyebabkan hifema (darah di bilik mata depan), ablasio retina, atau fraktur orbita. Kompres dingin selama 15 menit, jangan tekan bola mata, segera ke IGD jika ada gangguan penglihatan.\n\nLuka Kimia pada Mata\nIni adalah KEDARURATAN MEDIS. Bilas mata dengan air mengalir MINIMAL 15-20 menit, buka kelopak mata paksa saat membilas, jangan tutup mata, dan segera ke IGD dengan membawa kemasan bahan kimia.\n\nFirst Aid Kit Mata:\n- Botol eyewash steril\n- Obat tetes mata artifisial\n- Penutup mata steril\n- Kacamata pelindung\n\nSumber: American Academy of Ophthalmology (AAO).",
            ],
            [
                'title' => 'LASIK dan Beyond: Teknologi Modern untuk Koreksi Penglihatan',
                'category' => 'Teknologi dan Inovasi Perawatan Mata',
                'content' => "LASIK (Laser-Assisted In Situ Keratomileusis) telah merevolusi koreksi penglihatan. Prosedur ini menggunakan laser untuk membentuk ulang kornea dan mengoreksi miopia, hiperopia, dan astigmatisme.\n\nKandidat Ideal LASIK:\n- Usia >18 tahun\n- Resep stabil minimal 1 tahun\n- Kornea cukup tebal\n- Tidak hamil atau menyusui\n\nProsedur Terbaru:\n- SMILE (Small Incision Lenticule Extraction): Sayatan minimal, pemulihan lebih cepat\n- Femto-LASIK: Flap kornea dengan laser femtosecond, lebih presisi\n- PRK (Photorefractive Keratectomy): Tanpa flap, cocok untuk kornea tipis\n\nSumber: Matapedia JEC Eye Hospitals; American Academy of Ophthalmology (AAO).",
            ],
            [
                'title' => 'Artificial Intelligence dalam Oftalmologi: Revolusi Diagnosis Penyakit Mata',
                'category' => 'Teknologi dan Inovasi Perawatan Mata',
                'content' => "AI mengubah cara diagnosis penyakit mata, memungkinkan deteksi lebih cepat dan akurat:\n- IDx-DR: Sistem AI pertama yang disetujui FDA untuk deteksi retinopati diabetik secara otonom\n- DeepMind (Google Health): Analisis OCT untuk mendeteksi 50+ penyakit retina dalam hitungan detik\n- Algoritma skrining glaukoma: Deteksi dini dari foto fundus dengan akurasi tinggi\n\nTeknologi ini sangat bermanfaat untuk program skrining massal, terutama di daerah dengan keterbatasan dokter spesialis mata.\n\nSumber: American Academy of Ophthalmology (AAO).",
            ],
            [
                'title' => 'Mata dan Pekerja Kantoran: Checklist Ergonomi Digital',
                'category' => 'Kesehatan Mata untuk Pekerja',
                'content' => "Pekerja kantoran menghabiskan rata-rata 1.700 jam per tahun menatap layar komputer. Ini menempatkan mereka pada risiko tinggi digital eye strain.\n\nChecklist Ergonomi Kantor:\n- □ Monitor sejajar atau sedikit di bawah level mata\n- □ Jarak monitor 50-70 cm dari mata\n- □ Tidak ada silau dari jendela atau lampu\n- □ Kecerahan layar sesuai lingkungan\n- □ Tanaman hijau dalam pandangan untuk relaksasi mata\n- □ Pengingat untuk menerapkan aturan 20-20-20\n\nSumber: American Academy of Ophthalmology (AAO).",
            ],
            [
                'title' => 'Perlindungan Mata untuk Pekerja Lapangan: Lindungi dari Sinar UV',
                'category' => 'Kesehatan Mata untuk Pekerja',
                'content' => "Pekerja konstruksi, petani, nelayan, dan pekerja luar ruangan lainnya terpapar radiasi UV 5-10 kali lebih tinggi dari pekerja indoor. Paparan UV kumulatif meningkatkan risiko katarak, degenerasi makula, dan pterigium (pertumbuhan daging di kornea).\n\nRekomendasi Perlindungan:\n- Kacamata hitam wrap-around with proteksi UV400\n- Topi lebar (minimal 7,5 cm)\n- Hindari bekerja di jam puncak UV (10:00-16:00)\n- Gunakan kacamata pelindung (safety goggles) saat bekerja dengan mesin atau bahan berbahaya\n\nSumber: WHO; American Academy of Ophthalmology (AAO).",
            ],
            [
                'title' => 'Perawatan Alami untuk Mata Lelah: Solusi dari Dapur Anda',
                'category' => 'Pengobatan Alami dan Perawatan Mata',
                'content' => "Kompres Air Mawar\nAir mawar memiliki sifat anti-inflamasi alami. Rendam kapas dalam air mawar murni, dinginkan di kulkas 15 menit, lalu letakkan di mata tertutup selama 10 menit.\n\nIrisan Mentimun\nMentimun mengandung antioksidan dan efek mendinginkan. Letakkan irisan mentimun dingin di atas mata tertutup selama 15 menit untuk mengurangi kantung mata dan menyegarkan mata lelah.\n\nTeh Celup Bekas\nKandungan kafein dan antioksidan dalam teh (hijau atau hitam) dapat menyempitkan pembuluh darah dan mengurangi pembengkakan. Dinginkan kantong teh bekas di kulkas, letakkan di mata tertutup 10-15 menit.\n\nPijat Lembut Sekitar Mata\nGunakan jari manis (tekanan paling ringan) untuk memijat melingkar dari pangkal hidung ke pelipis. Lakukan 3-5 menit setiap hari untuk meningkatkan sirkulasi.\n\nCatatan Penting: Pengobatan alami hanya untuk kenyamanan dan tidak menggantikan pengobatan medis. Konsultasikan dengan dokter mata untuk kondisi yang serius.\n\nSumber: American Academy of Ophthalmology (AAO) - EyeSmart.",
            ],
            [
                'title' => 'Merokok dan Kesehatan Mata: Alasan Lagi untuk Berhenti',
                'category' => 'Kesehatan Mata dan Gaya Hidup',
                'content' => "Merokok adalah faktor risiko utama yang dapat dimodifikasi untuk berbagai penyakit mata. Perokok memiliki risiko:\n- Katarak 2-3 kali lebih tinggi\n- Degenerasi makula terkait usia (AMD) 2-4 kali lebih tinggi\n- Sindrom mata kering yang lebih parah\n- Retinopati diabetik progresif\n- Neuropati optik iskemik\n\nKabar baiknya, berhenti merokok dapat mengurangi risiko secara signifikan. Dalam 1-5 tahun setelah berhenti, risiko mulai menurun mendekati level non-perokok.\n\nSumber: WHO; American Academy of Ophthalmology (AAO).",
            ],
            [
                'title' => 'Olahraga dan Kesehatan Mata: Hubungan yang Mengejutkan',
                'category' => 'Kesehatan Mata dan Gaya Hidup',
                'content' => "Olahraga teratur bermanfaat tidak hanya untuk jantung dan otot, tetapi juga untuk mata. Aktivitas fisik meningkatkan sirkulasi darah ke seluruh tubuh, termasuk mata, yang membantu:\n\n- Menurunkan tekanan intraokular (faktor risiko glaukoma)\n- Meningkatkan oksigenasi retina\n- Mengurangi risiko diabetes tipe 2 (faktor risiko retinopati diabetik)\n- Menurunkan tekanan darah (faktor risiko AMD)\n\nOlahraga yang Direkomendasikan:\n- Jalan cepat 30 menit/hari, 5 kali seminggu\n- Renang untuk latihan kardio low-impact\n- Yoga dengan pose yang meningkatkan sirkulasi ke kepala\n- Bersepeda outdoor untuk variasi fokus jarak jauh\n\nPeringatan: Gunakan kacamata pelindung untuk olahraga dengan risiko cedera mata tinggi seperti squash, basket, atau paintball.\n\nSumber: American Academy of Ophthalmology (AAO).",
            ],
            [
                'title' => 'Menjaga Kesehatan Mata Saat Musim Hujan',
                'category' => 'Kesehatan Mata Musiman',
                'content' => "Kelembaban tinggi saat musim hujan meningkatkan risiko infeksi mata. Air hujan dapat membawa polutan, bakteri, dan jamur.\n\nRisiko Musim Hujan:\n- Konjungtivitis (mata merah) viral dan bakterial\n- Infeksi jamur, terutama pada pengguna lensa kontak\n- Alergi mata karena spora jamur dan tungau\n\nProteksi:\n- Cuci tangan lebih sering dengan sabun\n- Jangan berbagi handuk pribadi\n- Ganti lensa kontak sesuai jadwal, jangan diperpanjang\n- Gunakan tetes mata preservative-free\n- Hindari menyentuh atau mengucek mata\n\nSumber: American Academy of Ophthalmology (AAO).",
            ],
            [
                'title' => 'Tips Kesehatan Mata untuk Traveler dan Liburan',
                'category' => 'Kesehatan Mata Musiman',
                'content' => "Bepergian membawa tantangan khusus untuk kesehatan mata. Udara kabin pesawat yang kering dapat memperburuk mata kering. Air di destinasi wisata mungkin tidak steril untuk membilas mata.\n\nTravel Kit Mata Esensial:\n- Tetes mata artifisial tanpa pengawet (travel size)\n- Lensa kontak cadangan dan cairan secukupnya\n- Kacamata cadangan (jika lensa kontak bermasalah)\n- Kacamata hitam dengan proteksi UV400\n- Obat tetes antihistamin (jika memiliki alergi)\n\nTips Tambahan:\n- Gunakan kacamata daripada lensa kontak selama penerbangan panjang\n- Jangan berenang dengan lensa kontak untuk mencegah infeksi Acanthamoeba\n- Bawa salinan resep kacamata/lensa kontak\n\nSumber: American Academy of Ophthalmology (AAO).",
            ],
        ];

        foreach ($articles as $article) {
            Article::updateOrCreate(['title' => $article['title']], $article);
        }
    }
}
