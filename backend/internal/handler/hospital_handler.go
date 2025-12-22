package handlers

import (
	"backend/internal/models"
	"backend/internal/service"

	"github.com/gofiber/fiber/v2"
)

type HospitalHandler struct {
	service services.HospitalService
}

func NewHospitalHandler(service services.HospitalService) *HospitalHandler {
	return &HospitalHandler{service: service}
}

// ============ MEDICINE HANDLERS ============

func (h *HospitalHandler) GetAllMedicines(c *fiber.Ctx) error {
	medicines, err := h.service.GetAllMedicines()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(medicines)
}

func (h *HospitalHandler) CreateMedicine(c *fiber.Ctx) error {
	var medicine models.Medicine
	if err := c.BodyParser(&medicine); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if err := h.service.CreateMedicine(&medicine); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(medicine)
}

func (h *HospitalHandler) RestockMedicine(c *fiber.Ctx) error {
	id := c.Params("id")
	
	var req models.RestockRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if err := h.service.RestockMedicine(id, req.Amount, "Staff Gudang"); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Stock updated successfully"})
}

// ============ PRESCRIPTION HANDLERS ============

func (h *HospitalHandler) GetAllPrescriptions(c *fiber.Ctx) error {
	prescriptions, err := h.service.GetAllPrescriptions()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(prescriptions)
}

func (h *HospitalHandler) CreatePrescription(c *fiber.Ctx) error {
	var req models.CreatePrescriptionRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	prescription, err := h.service.CreatePrescription(&req)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(prescription)
}

func (h *HospitalHandler) UpdatePrescriptionStatus(c *fiber.Ctx) error {
	id := c.Params("id")
	action := c.Query("action") // process or finish

	var err error
	if action == "process" {
		err = h.service.ProcessPrescription(id)
	} else if action == "finish" {
		err = h.service.FinishPrescription(id)
	} else {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid action. Use ?action=process or ?action=finish"})
	}

	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Status updated successfully"})
}

// ============ PATIENT HANDLERS ============

func (h *HospitalHandler) GetAllPatients(c *fiber.Ctx) error {
	patients, err := h.service.GetAllPatients()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(patients)
}

func (h *HospitalHandler) AddPatient(c *fiber.Ctx) error {
	var req models.AddPatientRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	patient, err := h.service.AddPatient(&req)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(patient)
}

func (h *HospitalHandler) RemovePatient(c *fiber.Ctx) error {
	id := c.Params("id")

	if err := h.service.RemovePatient(id); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Patient removed successfully"})
}

// ============ LOG HANDLERS ============

func (h *HospitalHandler) GetAllLogs(c *fiber.Ctx) error {
	logs, err := h.service.GetAllLogs()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(logs)
}
