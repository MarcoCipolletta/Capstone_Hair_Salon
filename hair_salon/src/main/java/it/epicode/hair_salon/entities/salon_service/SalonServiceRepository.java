package it.epicode.hair_salon.entities.salon_service;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;


public interface SalonServiceRepository extends JpaRepository<SalonService, UUID> {
}
