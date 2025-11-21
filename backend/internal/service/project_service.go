package services

import (
	"backend/internal/models"
	"backend/internal/repository"
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

type ProjectService interface {
	GetAllProjects() ([]models.Project, error)
	GetProjectByID(id string) (models.Project, error)
	CreateProject(req models.CreateProjectRequest) (models.Project, error)
	RemoveProject(id string) error
	// Tambahan untuk Auth
	Login(username, password string) (string, error)
}

type projectService struct {
	repo repository.ProjectRepository
}

func NewProjectService(repo repository.ProjectRepository) ProjectService {
	return &projectService{repo}
}

func (s *projectService) GetAllProjects() ([]models.Project, error) {
	return s.repo.FindAll()
}

func (s *projectService) GetProjectByID(id string) (models.Project, error) {
	return s.repo.FindByID(id)
}

func (s *projectService) CreateProject(req models.CreateProjectRequest) (models.Project, error) {
	if req.Title == "" {
		return models.Project{}, errors.New("title cannot be empty")
	}
	newProject := models.Project{
		Title:       req.Title,
		Description: req.Description,
		Tags:        req.Tags,
		ImageURL:    req.ImageURL,
	}
	err := s.repo.Create(&newProject)
	return newProject, err
}

func (s *projectService) RemoveProject(id string) error {
	_, err := s.repo.FindByID(id)
	if err != nil {
		return errors.New("project not found")
	}
	return s.repo.Delete(id)
}

// Implementasi Baru: Login & Generate JWT
func (s *projectService) Login(username, password string) (string, error) {
	// 1. Cari user di DB
	admin, err := s.repo.GetAdminByUsername(username)
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	// 2. Cek Password (Simple Compare)
	if admin.Password != password {
		return "", errors.New("invalid credentials")
	}

	// 3. Buat Token JWT
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["username"] = admin.Username
	claims["admin_id"] = admin.ID
	claims["exp"] = time.Now().Add(time.Hour * 72).Unix() // Token valid 72 jam

	t, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", err
	}

	return t, nil
}
