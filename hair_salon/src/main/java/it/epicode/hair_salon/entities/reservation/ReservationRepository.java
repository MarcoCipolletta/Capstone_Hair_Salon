package it.epicode.hair_salon.entities.reservation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;


public interface ReservationRepository extends JpaRepository<Reservation, UUID> {
    boolean existsByDate(LocalDate date);
    List<Reservation> findByDate(LocalDate date);

    List<Reservation> findByCustomerId(UUID customerId);

    List<Reservation> findByStatusIn(List<Status> statuses);

    boolean existsBySalonServicesId(UUID salonServicesID);


}
