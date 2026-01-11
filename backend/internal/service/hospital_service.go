package services

import (
	"backend/internal/models"
	"backend/internal/repository"
	"fmt"
	"math/rand"
	"time"
)

type HospitalService interface {
	// Medicine
	GetAllMedicines() ([]models.Medicine, error)
	CreateMedicine(medicine *models.Medicine) error
	RestockMedicine(id string, amount int, pic string) error

	// Prescription
	GetAllPrescriptions() ([]models.Prescription, error)
	CreatePrescription(req *models.CreatePrescriptionRequest) (*models.Prescription, error)
	ProcessPrescription(id string) error
	FinishPrescription(id string) error

	// Patient
	GetAllPatients() ([]models.Patient, error)
	AddPatient(req *models.AddPatientRequest) (*models.Patient, error)
	RemovePatient(id string) error

	// Logs
	GetAllLogs() ([]models.Log, error)
}

type hospitalService struct {
	repo repository.HospitalRepository
}

func NewHospitalService(repo repository.HospitalRepository) HospitalService {
	return &hospitalService{repo: repo}
}

// ============ MEDICINE ============

func (s *hospitalService) GetAllMedicines() ([]models.Medicine, error) {
	return s.repo.GetAllMedicines()
}

func (s *hospitalService) CreateMedicine(medicine *models.Medicine) error {
	// Auto-generate ID with prefix OBT- if not provided
	if medicine.ID == "" {
		// Try a few times to avoid collision
		for i := 0; i < 5; i++ {
			newID := fmt.Sprintf("OBT%04d", rand.Intn(9000)+1000)
			// Check if ID exists; if not found, use it
			_, err := s.repo.GetMedicineByID(newID)
			if err != nil {
				medicine.ID = newID
				break
			}
		}
		// Fallback in case all attempts found collision
		if medicine.ID == "" {
			medicine.ID = fmt.Sprintf("OBT%d", time.Now().Unix())
		}
	}

	return s.repo.CreateMedicine(medicine)
}

func (s *hospitalService) RestockMedicine(id string, amount int, pic string) error {
	// Get medicine info for log
	medicine, err := s.repo.GetMedicineByID(id)
	if err != nil {
		return err
	}

	// Update stock
	err = s.repo.RestockMedicine(id, amount)
	if err != nil {
		return err
	}

	// Create log
	log := &models.Log{
		Type:         "IN",
		MedicineName: medicine.Name,
		Qty:          amount,
		Ref:          "Restock",
		Pic:          pic,
	}
	return s.repo.CreateLog(log)
}

// ============ PRESCRIPTION ============

func (s *hospitalService) GetAllPrescriptions() ([]models.Prescription, error) {
	return s.repo.GetAllPrescriptions()
}

func (s *hospitalService) CreatePrescription(req *models.CreatePrescriptionRequest) (*models.Prescription, error) {
	// Generate prescription ID
	prescriptionID := fmt.Sprintf("RSP-%04d", rand.Intn(9000)+1000)

	// Calculate total price
	totalPrice := 0
	items := []models.PrescriptionItem{}
	for _, item := range req.Items {
		totalPrice += item.Price * item.Qty
		items = append(items, models.PrescriptionItem{
			PrescriptionID: prescriptionID,
			MedicineID:     item.MedicineID,
			Name:           item.Name,
			Qty:            item.Qty,
			Price:          item.Price,
			Signa:          item.Signa,
		})
	}

	prescription := &models.Prescription{
		ID:          prescriptionID,
		PatientName: req.PatientName,
		PatientDob:  req.PatientDob,
		Allergies:   req.Allergies,
		DoctorName:  req.DoctorName,
		Date:        time.Now().Format("2006-01-02"),
		Status:      "Pending",
		TotalPrice:  totalPrice,
		Items:       items,
	}

	err := s.repo.CreatePrescription(prescription)
	if err != nil {
		return nil, err
	}

	return prescription, nil
}

func (s *hospitalService) ProcessPrescription(id string) error {
	// Get prescription details
	prescription, err := s.repo.GetPrescriptionByID(id)
	if err != nil {
		return err
	}

	// Reduce stock for each item
	for _, item := range prescription.Items {
		medicine, err := s.repo.GetMedicineByID(item.MedicineID)
		if err != nil {
			return fmt.Errorf("medicine %s not found", item.MedicineID)
		}

		if medicine.Stock < item.Qty {
			return fmt.Errorf("insufficient stock for %s", item.Name)
		}

		// Reduce stock
		err = s.repo.RestockMedicine(item.MedicineID, -item.Qty)
		if err != nil {
			return err
		}

		// Create log
		log := &models.Log{
			Type:         "OUT",
			MedicineName: item.Name,
			Qty:          item.Qty,
			Ref:          id,
			Pic:          "Apoteker",
		}
		s.repo.CreateLog(log)
	}

	// Update status to Process
	return s.repo.UpdatePrescriptionStatus(id, "Process")
}

func (s *hospitalService) FinishPrescription(id string) error {
	return s.repo.UpdatePrescriptionStatus(id, "Selesai")
}

// ============ PATIENT ============

func (s *hospitalService) GetAllPatients() ([]models.Patient, error) {
	return s.repo.GetAllPatients()
}

func (s *hospitalService) AddPatient(req *models.AddPatientRequest) (*models.Patient, error) {
	// Generate patient ID with collision checking
	var patientID string
	patients, _ := s.repo.GetAllPatients()
	
	// Try sequential numbering first
	for i := 1; i <= len(patients)+10; i++ {
		testID := fmt.Sprintf("P-%03d", i)
		// Check if ID exists
		found := false
		for _, p := range patients {
			if p.ID == testID {
				found = true
				break
			}
		}
		if !found {
			patientID = testID
			break
		}
	}
	
	// Fallback if all sequential attempts failed
	if patientID == "" {
		patientID = fmt.Sprintf("P-%d", time.Now().Unix()%10000)
	}

	patient := &models.Patient{
		ID:        patientID,
		Name:      req.Name,
		Dob:       req.Dob,
		Status:    "Waiting",
		Allergies: req.Allergies,
	}

	if patient.Allergies == "" {
		patient.Allergies = "-"
	}

	err := s.repo.CreatePatient(patient)
	if err != nil {
		return nil, err
	}

	return patient, nil
}

func (s *hospitalService) RemovePatient(id string) error {
	return s.repo.DeletePatient(id)
}

// ============ LOGS ============

func (s *hospitalService) GetAllLogs() ([]models.Log, error) {
	return s.repo.GetAllLogs()
}
