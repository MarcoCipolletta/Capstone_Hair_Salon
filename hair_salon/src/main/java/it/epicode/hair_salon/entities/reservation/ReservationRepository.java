package it.epicode.hair_salon.entities.reservation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;


public interface ReservationRepository extends JpaRepository<Reservation, UUID> {

}
