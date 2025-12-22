# Quick Fix - Redeploy Backend ke Railway

## Issue
Railway masih running code lama yang belum ada fix `PrepareStmt: false`.

## Solution

### 1. Verify Local Changes
Check `backend/cmd/main.go` line 31-34:
```go
db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
    PrepareStmt: false, // Disable prepared statement caching
})
```

### 2. Push to GitHub
```bash
cd backend
git add cmd/main.go
git commit -m "fix: disable prepared statement caching for PostgreSQL"
git push origin main
```

### 3. Railway Auto-Redeploy
Railway akan detect push dan auto-redeploy (2-3 menit).

### 4. Monitor Deploy
Di Railway dashboard:
- Lihat "Deployments" tab
- Tunggu status "Success"
- Check logs untuk confirm server started

### 5. Test After Deploy
```bash
# Test API
curl https://your-app.railway.app/api/hospital/medicines
curl https://your-app.railway.app/api/hospital/patients
```

Jika masih error, force redeploy:
- Railway dashboard → "Deployments" → "Redeploy"

---

## Alternative: Manual Trigger Redeploy
Jika auto-deploy tidak trigger:
1. Go to Railway dashboard
2. Click "Deployments" tab
3. Click "Redeploy" button on latest deployment

Error "prepared statement already exists" akan hilang setelah redeploy! ✅
