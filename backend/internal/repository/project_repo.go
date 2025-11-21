package repository

import (
	"backend/internal/models"
	"gorm.io/gorm"
)

type ProjectRepository interface {
	FindAll() ([]models.Project, error)
	FindByID(id string) (models.Project, error)
	Create(project *models.Project) error
	Delete(id string) error
	// Tambahan untuk Auth
	GetAdminByUsername(username string) (models.Admin, error)
}

type projectRepo struct {
	db *gorm.DB
}

func NewProjectRepo(db *gorm.DB) ProjectRepository {
	return &projectRepo{db}
}

func (r *projectRepo) FindAll() ([]models.Project, error) {
	var projects []models.Project
	err := r.db.Order("created_at desc").Find(&projects).Error
	return projects, err
}

func (r *projectRepo) FindByID(id string) (models.Project, error) {
	var project models.Project
	err := r.db.First(&project, "id = ?", id).Error
	return project, err
}

func (r *projectRepo) Create(project *models.Project) error {
	return r.db.Create(project).Error
}

func (r *projectRepo) Delete(id string) error {
	return r.db.Delete(&models.Project{}, "id = ?", id).Error
}

// Implementasi Baru
func (r *projectRepo) GetAdminByUsername(username string) (models.Admin, error) {
	var admin models.Admin
	err := r.db.Where("username = ?", username).First(&admin).Error
	return admin, err
}
