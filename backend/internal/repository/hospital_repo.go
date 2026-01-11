package repository

import (
	"backend/internal/models"
	"sync"
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
	db                  *gorm.DB
	medicinesCache      []models.Medicine
	medicinesCacheMutex sync.RWMutex
	medicinesCacheTime  time.Time
	cacheDuration       time.Duration
}

func NewHospitalRepo(db *gorm.DB) HospitalRepository {
	return &hospitalRepo{
		db:            db,
		cacheDuration: 5 * time.Minute, // Cache medicines untuk 5 menit
	}
}

// ============ MEDICINE ============

func (r *hospitalRepo) GetAllMedicines() ([]models.Medicine, error) {
	// Check cache first
	r.medicinesCacheMutex.RLock()
	if len(r.medicinesCache) > 0 && time.Since(r.medicinesCacheTime) < r.cacheDuration {
		defer r.medicinesCacheMutex.RUnlock()
		return r.medicinesCache, nil
	}
	r.medicinesCacheMutex.RUnlock()

	// Cache miss, query database
	var medicines []models.Medicine
	err := r.db.Find(&medicines).Error
	if err != nil {
		return nil, err
	}

	// Update cache
	r.medicinesCacheMutex.Lock()
	r.medicinesCache = medicines
	r.medicinesCacheTime = time.Now()
	r.medicinesCacheMutex.Unlock()

	return medicines, nil
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
	err := r.db.Create(medicine).Error
	if err == nil {
		// Invalidate cache
		r.medicinesCacheMutex.Lock()
		r.medicinesCache = nil
		r.medicinesCacheMutex.Unlock()
	}
	return err
}

func (r *hospitalRepo) UpdateMedicine(medicine *models.Medicine) error {
	err := r.db.Save(medicine).Error
	if err == nil {
		// Invalidate cache
		r.medicinesCacheMutex.Lock()
		r.medicinesCache = nil
		r.medicinesCacheMutex.Unlock()
	}
	return err
}

func (r *hospitalRepo) RestockMedicine(id string, amount int) error {
	err := r.db.Model(&models.Medicine{}).Where("id = ?", id).Update("stock", gorm.Expr("stock + ?", amount)).Error
	if err == nil {
		// Invalidate cache
		r.medicinesCacheMutex.Lock()
		r.medicinesCache = nil
		r.medicinesCacheMutex.Unlock()
	}
	return err
}

// ============ PRESCRIPTION ============

func (r *hospitalRepo) GetAllPrescriptions() ([]models.Prescription, error) {
	var prescriptions []models.Prescription
	// Use Preload untuk menghindari N+1 query problem
	err := r.db.Preload("Items").Find(&prescriptions).Error
	return prescriptions, err
}

func (r *hospitalRepo) GetPrescriptionByID(id string) (*models.Prescription, error) {
	var prescription models.Prescription
	// Use Preload untuk fetch items bersamaan
	err := r.db.Preload("Items").First(&prescription, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
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
	// Tambah LIMIT dan index pada created_at untuk performance
	err := r.db.Order("created_at DESC").Limit(100).Find(&logs).Error
	return logs, err
}

func (r *hospitalRepo) CreateLog(log *models.Log) error {
	log.Date = time.Now().Format("2006-01-02")
	return r.db.Create(log).Error
}
