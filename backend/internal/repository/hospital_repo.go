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
	db *gorm.DB

	// Medicines cache
	medicinesCache      []models.Medicine
	medicinesCacheMutex sync.RWMutex
	medicinesCacheTime  time.Time

	// Prescriptions cache
	prescriptionsCache      []models.Prescription
	prescriptionsCacheMutex sync.RWMutex
	prescriptionsCacheTime  time.Time

	// Patients cache
	patientsCache      []models.Patient
	patientsCacheMutex sync.RWMutex
	patientsCacheTime  time.Time

	// Logs cache
	logsCache      []models.Log
	logsCacheMutex sync.RWMutex
	logsCacheTime  time.Time
}

func NewHospitalRepo(db *gorm.DB) HospitalRepository {
	return &hospitalRepo{
		db: db,
	}
}

// ============ MEDICINE ============

func (r *hospitalRepo) GetAllMedicines() ([]models.Medicine, error) {
	// Check cache first
	r.medicinesCacheMutex.RLock()
	if len(r.medicinesCache) > 0 && time.Since(r.medicinesCacheTime) < 5*time.Minute {
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
	// Check cache first
	r.prescriptionsCacheMutex.RLock()
	if len(r.prescriptionsCache) > 0 && time.Since(r.prescriptionsCacheTime) < 2*time.Minute {
		defer r.prescriptionsCacheMutex.RUnlock()
		return r.prescriptionsCache, nil
	}
	r.prescriptionsCacheMutex.RUnlock()

	// Cache miss, query database
	var prescriptions []models.Prescription
	err := r.db.Preload("Items").Find(&prescriptions).Error
	if err != nil {
		return nil, err
	}

	// Update cache
	r.prescriptionsCacheMutex.Lock()
	r.prescriptionsCache = prescriptions
	r.prescriptionsCacheTime = time.Now()
	r.prescriptionsCacheMutex.Unlock()

	return prescriptions, nil
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
	err := r.db.Create(prescription).Error
	if err == nil {
		// Invalidate cache
		r.prescriptionsCacheMutex.Lock()
		r.prescriptionsCache = nil
		r.prescriptionsCacheMutex.Unlock()
	}
	return err
}

func (r *hospitalRepo) UpdatePrescriptionStatus(id string, status string) error {
	err := r.db.Model(&models.Prescription{}).Where("id = ?", id).Update("status", status).Error
	if err == nil {
		// Invalidate cache
		r.prescriptionsCacheMutex.Lock()
		r.prescriptionsCache = nil
		r.prescriptionsCacheMutex.Unlock()
	}
	return err
}

// ============ PATIENT ============

func (r *hospitalRepo) GetAllPatients() ([]models.Patient, error) {
	// Check cache first
	r.patientsCacheMutex.RLock()
	if len(r.patientsCache) > 0 && time.Since(r.patientsCacheTime) < 1*time.Minute {
		defer r.patientsCacheMutex.RUnlock()
		return r.patientsCache, nil
	}
	r.patientsCacheMutex.RUnlock()

	// Cache miss, query database
	var patients []models.Patient
	err := r.db.Find(&patients).Error
	if err != nil {
		return nil, err
	}

	// Update cache
	r.patientsCacheMutex.Lock()
	r.patientsCache = patients
	r.patientsCacheTime = time.Now()
	r.patientsCacheMutex.Unlock()

	return patients, nil
}

func (r *hospitalRepo) CreatePatient(patient *models.Patient) error {
	err := r.db.Create(patient).Error
	if err == nil {
		// Invalidate cache
		r.patientsCacheMutex.Lock()
		r.patientsCache = nil
		r.patientsCacheMutex.Unlock()
	}
	return err
}

func (r *hospitalRepo) DeletePatient(id string) error {
	err := r.db.Delete(&models.Patient{}, "id = ?", id).Error
	if err == nil {
		// Invalidate cache
		r.patientsCacheMutex.Lock()
		r.patientsCache = nil
		r.patientsCacheMutex.Unlock()
	}
	return err
}

// ============ LOG ============

func (r *hospitalRepo) GetAllLogs() ([]models.Log, error) {
	// Check cache first
	r.logsCacheMutex.RLock()
	if len(r.logsCache) > 0 && time.Since(r.logsCacheTime) < 30*time.Second {
		defer r.logsCacheMutex.RUnlock()
		return r.logsCache, nil
	}
	r.logsCacheMutex.RUnlock()

	// Cache miss, query database
	var logs []models.Log
	err := r.db.Order("created_at DESC").Limit(100).Find(&logs).Error
	if err != nil {
		return nil, err
	}

	// Update cache
	r.logsCacheMutex.Lock()
	r.logsCache = logs
	r.logsCacheTime = time.Now()
	r.logsCacheMutex.Unlock()

	return logs, nil
}

func (r *hospitalRepo) CreateLog(log *models.Log) error {
	log.Date = time.Now().Format("2006-01-02")
	err := r.db.Create(log).Error
	if err == nil {
		// Invalidate cache
		r.logsCacheMutex.Lock()
		r.logsCache = nil
		r.logsCacheMutex.Unlock()
	}
	return err
}
