package main

import (
	"log"
	"os"
	"time"

	// IMPORT PATH HARUS SESUAI DENGAN go.mod
	handlers "backend/internal/handler"
	"backend/internal/models"
	"backend/internal/repository"
	services "backend/internal/service"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	jwtware "github.com/gofiber/jwt/v3"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// 1. Setup Env & DB
	godotenv.Load()
	dsn := os.Getenv("DATABASE_URL")

	// Fallback jika DSN kosong agar tidak panic mendadak
	if dsn == "" {
		log.Fatal("DATABASE_URL is not set. Check your .env file")
	}

	// Add parameters to DSN to completely disable statement caching
	// This fixes "prepared statement does not exist" errors in PostgreSQL
	dsn += "?sslmode=require&prefer_simple_protocol=true"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		PrepareStmt: false, // Disable prepared statement caching to avoid PostgreSQL errors
	})
	if err != nil {
		log.Fatal("DB Connection failed: ", err)
	}

	// Configure connection pool to prevent statement caching issues
	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("Failed to get database instance: ", err)
	}
	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetConnMaxLifetime(5 * time.Minute) // 5 minutes

	log.Println("Migrating database...")
	// Pastikan struct Admin dan Project ada di models
	db.AutoMigrate(
		&models.Project{},
		&models.Admin{},
		// DokterBubung Models
		&models.Medicine{},
		&models.Prescription{},
		&models.PrescriptionItem{},
		&models.Patient{},
		&models.Log{},
	)
	log.Println("Database migrated successfully!")

	// Seed initial data for hospital
	SeedHospitalData(db)

	// 2. WIRING DEPENDENCY INJECTION
	// Pastikan urutan: Repo -> Service -> Handler

	// Portfolio
	projectRepo := repository.NewProjectRepo(db)
	projectService := services.NewProjectService(projectRepo)
	projectHandler := handlers.NewProjectHandler(projectService)

	// DokterBubung Hospital
	hospitalRepo := repository.NewHospitalRepo(db)
	hospitalService := services.NewHospitalService(hospitalRepo)
	hospitalHandler := handlers.NewHospitalHandler(hospitalService)

	// 3. Setup Fiber
	app := fiber.New()
	app.Use(logger.New()) // Tambahan logger agar terlihat request di terminal
	app.Use(cors.New())

	// 4. Routes
	api := app.Group("/api")

	// PUBLIC ROUTES
	api.Get("/projects", projectHandler.GetAll)
	api.Post("/auth/login", projectHandler.Login)

	// PROTECTED ROUTES (ADMIN)
	admin := api.Group("/admin")

	// Cek JWT Secret
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET is not set in .env")
	}

	// Middleware JWT
	admin.Use(jwtware.New(jwtware.Config{
		SigningKey: []byte(jwtSecret),
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Unauthorized Access: Token invalid or missing",
			})
		},
	}))

	// Routes yang butuh login
	admin.Post("/projects", projectHandler.Create)
	admin.Delete("/projects/:id", projectHandler.Delete)

	// DOKTERBUBUNG HOSPITAL ROUTES
	hospital := api.Group("/hospital")

	// Medicine routes
	hospital.Get("/medicines", hospitalHandler.GetAllMedicines)
	hospital.Post("/medicines", hospitalHandler.CreateMedicine)
	hospital.Put("/medicines/:id/restock", hospitalHandler.RestockMedicine)

	// Prescription routes
	hospital.Get("/prescriptions", hospitalHandler.GetAllPrescriptions)
	hospital.Post("/prescriptions", hospitalHandler.CreatePrescription)
	hospital.Put("/prescriptions/:id/status", hospitalHandler.UpdatePrescriptionStatus)

	// Patient routes
	hospital.Get("/patients", hospitalHandler.GetAllPatients)
	hospital.Post("/patients", hospitalHandler.AddPatient)
	hospital.Delete("/patients/:id", hospitalHandler.RemovePatient)

	// Log routes
	hospital.Get("/logs", hospitalHandler.GetAllLogs)

	// 5. Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("Server running on port " + port)
	log.Fatal(app.Listen(":" + port))
}

// SeedHospitalData seeds initial data for hospital management system
func SeedHospitalData(db *gorm.DB) {
	log.Println("Seeding hospital initial data...")

	// Check if data already exists
	var count int64
	db.Model(&models.Medicine{}).Count(&count)
	if count > 0 {
		log.Println("Hospital data already seeded, skipping...")
		return
	}

	// Seed Medicines
	medicines := []models.Medicine{
		{ID: "OBT001", Name: "Amoxicillin 500mg", Type: "Tablet", Stock: 50, Price: 15000, Expiry: "2026-05-20", Location: "Rak A1"},
		{ID: "OBT002", Name: "Paracetamol 500mg", Type: "Tablet", Stock: 120, Price: 5000, Expiry: "2027-01-15", Location: "Rak A2"},
		{ID: "OBT003", Name: "OBH Combi Anak", Type: "Sirup", Stock: 8, Price: 25000, Expiry: "2025-08-10", Location: "Rak B1"},
		{ID: "OBT004", Name: "Vitamin C 1000mg", Type: "Tablet", Stock: 80, Price: 45000, Expiry: "2025-07-01", Location: "Rak C1"},
		{ID: "OBT005", Name: "Simvastatin 10mg", Type: "Tablet", Stock: 5, Price: 30000, Expiry: "2025-11-05", Location: "Rak A3"},
	}

	for _, med := range medicines {
		db.Create(&med)
	}

	// Seed Patients
	patients := []models.Patient{
		{ID: "P-001", Name: "Siti Aminah", Dob: "1990-01-01", Status: "Waiting", Allergies: "Seafood"},
		{ID: "P-002", Name: "Rahmat Hidayat", Dob: "1988-05-12", Status: "Waiting", Allergies: "-"},
		{ID: "P-003", Name: "Joko Widodo", Dob: "1975-10-20", Status: "Examining", Allergies: "Penicillin"},
	}

	for _, patient := range patients {
		db.Create(&patient)
	}

	log.Println("Hospital initial data seeded successfully!")
}
