# Database Configuration Guide

Terdapat 2 opsi untuk menjalankan backend:

## Opsi 1: Menggunakan SQLite (Recommended untuk Development)

Edit file `cmd/main.go` line 31:

```go
// Ganti ini:
db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

// Dengan ini:
db, err := gorm.Open(sqlite.Open("./dokterbubung.db"), &gorm.Config{})
```

Jangan lupa tambahkan import di atas:
```go
import (
    // ... imports lain
    "gorm.io/driver/sqlite"  // Tambahkan ini
)
```

## Opsi 2: Fix Supabase Connection

Edit file `.env` dan pastikan `DATABASE_URL` benar:
```
DATABASE_URL=postgresql://username:password@db.xxx.supabase.co:5432/postgres
```

Atau dapatkan connection string baru dari Supabase dashboard.

## Menjalankan Server

Setelah fix database, jalankan:
```bash
cd c:\Users\muhaf\Documents\Kerja\Portofolio\Portofolio\backend
go run cmd/main.go cmd/seed.go
```

Server akan berjalan di `http://localhost:8080`
