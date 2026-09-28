# 🔮 Tarot AI Reader

<div align="center">

![GitHub repo size](https://img.shields.io/github/repo-size/Nurfaridamardzyska/tarot-ai-reader?color=a855f7&style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini%20AI-8E75C2?style=for-the-badge&logo=google&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

<p align="center">
  <b>Aplikasi Pembacaan Kartu Tarot Berbasis AI dengan Tema Mystical Celestial</b><br>
  Menggabungkan kearifan arketipe kartu Tarot klasik Rider-Waite dengan kecerdasan buatan Google Gemini untuk interpretasi yang mendalam, intuitif, dan personal.
</p>

</div>

---

## ✨ Fitur Utama

- 🌌 **Desain Mystical Celestial (Dark Purple)**
  - Latar belakang kosmik dengan efek *twinkling starfield* interaktif berbasis HTML5 Canvas.
  - Elemen dekorasi bulan sabit dan konstelasi melayang (*floating animations*).
  - Tipografi elegan menggunakan font **Cinzel** & **Nunito** dari Google Fonts.
  - Efek glassmorphism dan shimmer gradient yang dinamis pada kartu dan tombol.

- 🎴 **Koleksi Kartu Tarot Lengkap (78 Kartu Rider-Waite)**
  - Kartu Major Arcana & Minor Arcana beresolusi tinggi.
  - Animasi kartu 3D flip yang mulus dengan efek mengambang (*card floating physics*).
  - Mendukung posisi **Tegak (Upright)** dan **Terbalik (Reversed)** dengan makna arketipe masing-masing.

- 🔮 **3 Mode Penyebaran Kartu (Spreads)**
  1. **Kartu Tunggal (Single Card):** Jawaban cepat dan pesan utama harian.
  2. **Pembacaan 3 Kartu (Three-Card Spread):** Menjelajahi dinamika *Masa Lalu, Masa Sekarang, dan Masa Depan*.
  3. **Pembacaan Celtic Cross (5 Kartu):** Analisis komprehensif mencakup *Situasi, Hambatan, Akar Masalah, Potensi Hasil, dan Saran Batin*.

- 🤖 **Integrasi Cerdas Google Gemini AI**
  - Menggunakan model `gemini-3.8-flash` untuk menganalisis keterkaitan antara pertanyaan penanya dengan energi kartu.
  - Menghasilkan narasi pembacaan empatik, terstruktur, dan actionable.
  - Modal pengaturan API key mandiri yang aman tersimpan di `localStorage` peramban Anda.
  - Fallback engine berbasis aturan otomatis jika API Key tidak disetel.

---

## 🛠️ Teknologi yang Digunakan

| Komponen | Teknologi |
| --- | --- |
| **Frontend** | HTML5, Vanilla JavaScript (ES6+), Vanilla CSS3 |
| **Styling** | Tailwind CSS (CDN) + Custom Celestial Animations |
| **Fonts** | Google Fonts (*Cinzel* & *Nunito*) |
| **AI Engine** | Google Gemini API (`gemini-3.8-flash`) |
| **Aset Kartu** | 78 Kartu Rider-Waite Tarot Deck |

---

## 🚀 Cara Menjalankan Proyek Secara Lokal

Karena aplikasi ini memuat file aset data JSON dan gambar kartu melalui `fetch()`, jalankan menggunakan web server lokal:

### 1. Clone Repositori
```bash
git clone https://github.com/Nurfaridamardzyska/tarot-ai-reader.git
cd tarot-ai-reader
```

### 2. Jalankan Local Server

**Menggunakan Python:**
```bash
# Python 3
python3 -m http.server 8000
```

**Atau menggunakan Node.js (npx serve / live-server):**
```bash
npx serve .
```

**Atau menggunakan ekstensi VS Code:**
- Pasang ekstensi **Live Server** di VS Code.
- Klik kanan file `index.html` ➔ **Open with Live Server**.

### 3. Buka di Browser
Kunjungi `http://localhost:8000` di browser favorit Anda.

---

## 🔑 Konfigurasi Gemini AI (Opsional tapi Direkomendasikan)

Untuk mendapatkan pembacaan personal yang dianalisis langsung oleh AI:
1. Dapatkan API Key gratis di [Google AI Studio](https://aistudio.google.com/).
2. Buka aplikasi di browser, klik tombol **Atur AI** di pojok kanan atas.
3. Tempel API Key Anda lalu klik **Simpan & Aktifkan**.
4. Status indikator akan berubah menjadi hijau (**AI Aktif ✨**).

---

## 📁 Struktur Direktori

```plaintext
tarot-ai-reader/
├── images/                  # 78 gambar kartu tarot Rider-Waite
│   ├── the_fool.jpg
│   ├── the_magician.jpg
│   └── ...
├── app.js                   # Logika interaksi, flip, Gemini API, dan render
├── index.html               # Halaman utama aplikasi dengan elemen canvas & modal
├── styles.css               # Desain mystical celestial, animasi 3D, dan tema warna
├── tarot.json               # Basis data makna kartu (upright & reversed)
├── tarot.py                 # Skrip data python generator
└── README.md                # Dokumentasi proyek
```

---

## 📜 Disclaimer
> Aplikasi ini dibuat untuk tujuan hiburan, introspeksi, dan refleksi diri. Tarot AI Reader tidak menggantikan nasihat profesional di bidang hukum, medis, atau keuangan.

---

<div align="center">
  Dibuat dengan 💜 oleh <a href="https://github.com/Nurfaridamardzyska"><b>Dyzka (Nurfaridamardzyska)</b></a>
</div>
