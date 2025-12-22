package repository

import (
	"backend/internal/models"
	"time"

	"gorm.io/gorm"
)

type HospitalRepository interface {
	// Medicine
	GetAllMedicines() ([]models.Medicine, error)
	GetMedicineByID(id string) (*models.Medicine, error)
	CreateMedicine(medicine *models.Medicine) error
	UpdateMedicine(medicine *models.Medicine) error
	RestockMedicine(id string, amount int) error

	// Prescription
	GetAllPrescriptions() ([]models.Prescription, error)
	GetPrescriptionByID(id string) (*models.Prescription, error)
	CreatePrescription(prescription *models.Prescription) error
	UpdatePrescriptionStatus(id string, status string) error

	// Patient
	GetAllPatients() ([]models.Patient, error)
	CreatePatient(patient *models.Patient) error
	DeletePatient(id string) error

	// Log
	GetAllLogs() ([]models.Log, error)
	CreateLog(log *models.Log) error
}

type hospitalRepo struct {
	db *gorm.DB
}

func NewHospitalRepo(db *gorm.DB) HospitalRepository {
	return &hospitalRepo{db: db}
}

// ============ MEDICINE ============

func (r *hospitalRepo) GetAllMedicines() ([]models.Medicine, error) {
	var medicines []models.Medicine
	err := r.db.Find(&medicines).Error
	return medicines, err
}

func (r *hospitalRepo) GetMedicineByID(id string) (*models.Medicine, error) {
	var medicine models.Medicine
	err := r.db.First(&medicine, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &medicine, nil
}

func (r *hospitalRepo) CreateMedicine(medicine *models.Medicine) error {
	return r.db.Create(medicine).Error
}

func (r *hospitalRepo) UpdateMedicine(medicine *models.Medicine) error {
	return r.db.Save(medicine).Error
}

func (r *hospitalRepo) RestockMedicine(id string, amount int) error {
	return r.db.Model(&models.Medicine{}).Where("id = ?", id).Update("stock", gorm.Expr("stock + ?", amount)).Error
}

// ============ PRESCRIPTION ============

func (r *hospitalRepo) GetAllPrescriptions() ([]models.Prescription, error) {
	var prescriptions []models.Prescription
	// Don't use Preload to avoid prepared statement caching issues in Railway PostgreSQL
	err := r.db.Find(&prescriptions).Error
	if err != nil {
		return prescriptions, err
	}

	// Manually fetch items for each prescription
	for i := range prescriptions {
		var items []models.PrescriptionItem
		r.db.Where("prescription_id = ?", prescriptions[i].ID).Find(&items)
		prescriptions[i].Items = items
	}

	return prescriptions, nil
}

func (r *hospitalRepo) GetPrescriptionByID(id string) (*models.Prescription, error) {
	var prescription models.Prescription
	err := r.db.First(&prescription, "id = ?", id).Error
	if err != nil {
		return nil, err
	}

	// Manually fetch items
	var items []models.PrescriptionItem
	r.db.Where("prescription_id = ?", id).Find(&items)
	prescription.Items = items

	return &prescription, nil
}

func (r *hospitalRepo) CreatePrescription(prescription *models.Prescription) error {
	return r.db.Create(prescription).Error
}

func (r *hospitalRepo) UpdatePrescriptionStatus(id string, status string) error {
	return r.db.Model(&models.Prescription{}).Where("id = ?", id).Update("status", status).Error
}

// ============ PATIENT ============

func (r *hospitalRepo) GetAllPatients() ([]models.Patient, error) {
	var patients []models.Patient
	err := r.db.Find(&patients).Error
	return patients, err
}

func (r *hospitalRepo) CreatePatient(patient *models.Patient) error {
	return r.db.Create(patient).Error
}

func (r *hospitalRepo) DeletePatient(id string) error {
	return r.db.Delete(&models.Patient{}, "id = ?", id).Error
}

// ============ LOG ============

func (r *hospitalRepo) GetAllLogs() ([]models.Log, error) {
	var logs []models.Log
	err := r.db.Order("created_at DESC").Find(&logs).Error
	return logs, err
}

func (r *hospitalRepo) CreateLog(log *models.Log) error {
	log.Date = time.Now().Format("2006-01-02")
	return r.db.Create(log).Error
}
