package main

import (
	"backend/internal/models"
	"log"

	"gorm.io/gorm"
)

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
