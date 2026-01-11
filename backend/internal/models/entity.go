package models

import (
	"github.com/google/uuid"
	"time"
)

type Project struct {
	ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Title       string    `gorm:"not null" json:"title"`
	Description string    `gorm:"type:text" json:"description"`
	ImageURL    string    `json:"image_url"`
	RepoURL     string    `json:"repo_url"`
	DemoURL     string    `json:"demo_url"`
	Tags        string    `json:"tags"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// --- TAMBAHKAN INI ---
type Admin struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	Username string `gorm:"unique;not null" json:"username"`
	Password string `gorm:"not null" json:"-"`
}

// Struct input request (DTO)
type CreateProjectRequest struct {
	Title       string `json:"title" validate:"required"`
	Description string `json:"description"`
	Tags        string `json:"tags"`
	ImageURL    string `json:"image_url"`
}

// ============ DOKTERBUBUNG MODELS ============

type Medicine struct {
	ID        string    `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"not null" json:"name"`
	Type      string    `json:"type"`
	Stock     int       `json:"stock"`
	Price     int       `json:"price"`
	Expiry    string    `json:"expiry"`
	Location  string    `json:"location"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Prescription struct {
	ID          string             `gorm:"primaryKey" json:"id"`
	PatientName string             `json:"patient_name"`
	PatientDob  string             `json:"patient_dob"`
	Allergies   string             `json:"allergies"`
	DoctorName  string             `json:"doctor_name"`
	Date        string             `json:"date"`
	Status      string             `json:"status"` // Pending, Process, Selesai
	TotalPrice  int                `json:"total_price"`
	Items       []PrescriptionItem `gorm:"foreignKey:PrescriptionID;references:ID" json:"items"`
	CreatedAt   time.Time          `json:"created_at"`
	UpdatedAt   time.Time          `json:"updated_at"`
}

type PrescriptionItem struct {
	ID             uint   `gorm:"primaryKey" json:"id"`
	PrescriptionID string `gorm:"index" json:"prescription_id"` // Add index here
	MedicineID     string `json:"medicine_id"`
	Name           string `json:"name"`
	Qty            int    `json:"qty"`
	Price          int    `json:"price"`
	Signa          string `json:"signa"`
}

type Patient struct {
	ID        string    `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"not null" json:"name"`
	Dob       string    `json:"dob"`
	Status    string    `json:"status"` // Waiting, Examining
	Allergies string    `json:"allergies"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Log struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Date         string    `json:"date"`
	Type         string    `json:"type"` // IN, OUT
	MedicineName string    `json:"medicine_name"`
	Qty          int       `json:"qty"`
	Ref          string    `json:"ref"`
	Pic          string    `json:"pic"` // Person in charge
	CreatedAt    time.Time `json:"created_at"`
}

// DTO Requests
type CreatePrescriptionRequest struct {
	PatientName string                       `json:"patient_name"`
	PatientDob  string                       `json:"patient_dob"`
	Allergies   string                       `json:"allergies"`
	DoctorName  string                       `json:"doctor_name"`
	Items       []CreatePrescriptionItemRequest `json:"items"`
}

type CreatePrescriptionItemRequest struct {
	MedicineID string `json:"medicine_id"`
	Name       string `json:"name"`
	Qty        int    `json:"qty"`
	Price      int    `json:"price"`
	Signa      string `json:"signa"`
}

type AddPatientRequest struct {
	Name      string `json:"name"`
	Dob       string `json:"dob"`
	Allergies string `json:"allergies"`
}

type RestockRequest struct {
	Amount int `json:"amount"`
}
