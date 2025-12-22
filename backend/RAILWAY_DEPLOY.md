# Railway Deployment Guide - DokterBubung Backend

## Issue Fixed
Railway build command `go build -o main cmd/main.go` hanya compile single file, sedangkan `SeedHospitalData` ada di file terpisah `cmd/seed.go`.

**Solution:** Moved `SeedHospitalData` function ke dalam `cmd/main.go`.

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Fix: Move SeedHospitalData to main.go for Railway deployment"
git push origin main
```

### 2. Railway Configuration

**Environment Variables:**
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your-secret-key
PORT=8080
```

**Build Command:** (Auto-detected)
```
go build -o main cmd/main.go
```

**Start Command:** (Auto-detected)
```
./main
```

### 3. Database Setup
Railway akan auto-migrate tables saat startup:
- medicines
- prescriptions
- prescription_items
- patients
- logs
- projects (portfolio)
- admins (portfolio)

Initial data akan di-seed otomatis jika table medicines masih kosong.

## Testing Deployment

Setelah deploy sukses, test endpoints:
```bash
# Replace dengan Railway URL
curl https://your-app.railway.app/api/hospital/medicines
curl https://your-app.railway.app/api/hospital/patients
curl https://your-app.railway.app/api/hospital/prescriptions
```

## Frontend Configuration

Update `frontend/src/app/dokterbubung/utils/api.ts`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/hospital';
```

Add environment variable di Vercel/deployment platform:
```
NEXT_PUBLIC_API_URL=https://your-app.railway.app/api/hospital
```

## Troubleshooting

**Build Error:** `undefined: SeedHospitalData`
- ✅ Fixed: Function sudah ada di main.go

**Database Connection Error:**
- Check DATABASE_URL environment variable
- Ensure PostgreSQL database ready

**CORS Error:**
- Backend sudah ada CORS middleware
- Verify frontend URL allowed
