package main

import (
	"log"
	"os"
	// IMPORT PATH HARUS SESUAI DENGAN go.mod
	"backend/internal/handler"
	"backend/internal/models"
	"backend/internal/repository"
	"backend/internal/service"

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

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("DB Connection failed: ", err)
	}

	log.Println("Migrating database...")
	// Pastikan struct Admin dan Project ada di models
	db.AutoMigrate(&models.Project{}, &models.Admin{})
	log.Println("Database migrated successfully!")

	// 2. WIRING DEPENDENCY INJECTION
	// Pastikan urutan: Repo -> Service -> Handler
	projectRepo := repository.NewProjectRepo(db)
	projectService := services.NewProjectService(projectRepo)
	projectHandler := handlers.NewProjectHandler(projectService)

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

	// 5. Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("Server running on port " + port)
	log.Fatal(app.Listen(":" + port))
}
