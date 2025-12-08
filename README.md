# Blog Hub

Blog Hub adalah platform blogging modern berbasis Laravel + Inertia + React yang dirancang untuk memudahkan penulis mempublikasikan artikel, berinteraksi dengan pembaca, serta menampilkan konten populer secara dinamis.

## Gambaran Sistem

-   **Frontend**: React + Tailwind + DaisyUI berjalan via Inertia, memberikan pengalaman SPA dengan performa tinggi.
-   **Backend**: Laravel menangani autentikasi, manajemen blog, komentar, likes, bookmarks, dan statistik.
-   **Editor**: Penulisan konten dilakukan melalui editor Quill/TinyMCE dengan mode pratinjau sebelum publikasi.
-   **Media**: Thumbnail blog disimpan di `storage/app/public/thumbnails`, avatar profil di `storage/app/public/profile` dan diekspos lewat `public/storage`.

## Alur Fungsional Utama

1. **Penulisan & Preview**
    - Penulis membuat artikel di `/blog/create`, mengisi konten, thumbnail, kategori, dan tag.
    - Tombol _Preview & Publish_ mengirim data sementara ke rute `blog.preview` sebelum disimpan.
2. **Publikasi**
    - Pada halaman preview, tombol "Publish Now" men-submit data ke `BlogController@store` yang memvalidasi, menyimpan file, dan membuat relasi tag.
3. **Homepage Aggregation**
    - `HomeController@index` menyiapkan lima blok data:
        - `popularBlogs` (berdasarkan views),
        - `latestBlogs` (berdasarkan tanggal),
        - `popularTags`,
        - `topUsers` (skor gabungan blog/like/komentar),
        - `trendingPosts` (aktivitas 7 hari terakhir).
4. **Interaksi Pembaca**
    - Ketika detail blog dibuka (`BlogController@show`), kolom `views` otomatis bertambah.
    - Pengguna bisa memberikan like, komentar bertingkat, dan bookmark.
5. **Profil Penulis**
    - Penulis mengubah profil di `/profile`, termasuk mengganti avatar yang kini diarahkan ke folder `profile`.

## Teknologi & Dependensi Kunci

-   PHP 8+, Laravel 11, InertiaJS, React 18, TailwindCSS, DaisyUI.
-   Editor: Quill & TinyMCE.
-   Database: PostgreSQL (default di migrasi) dengan dukungan enum custom untuk status blog.

## Rencana Docker (Singkat)

1. **Service**: `app` (php-fpm + composer + npm build), `web` (nginx), `db` (postgres/mysql).
2. **Langkah build**: jalankan `composer install`, `npm install`, `npm run build`, serta `php artisan migrate --seed`.
3. **Volume**: mount `storage` dan `bootstrap/cache` agar persisten.
4. **Setup awal**: setelah container up, jalankan `php artisan storage:link` dan sesuaikan `.env` (APP_URL, DB_HOST, dll).

## Cara Menjalankan (Lokal)

```bash
cp .env.example .env
composer install
npm install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
npm run dev
php artisan serve
```

Setelah langkah di atas, buka `http://127.0.0.1:8000` untuk melihat Blog Hub berfungsi penuh.
