package it.epicode.hair_salon.entities.reservation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;


public interface ReservationRepository extends JpaRepository<Reservation, UUID> {
    boolean existsByDate(LocalDate date);
    List<Reservation> findByDate(LocalDate date);

    List<Reservation> findByCustomerIdOrderByDateDesc(UUID customerId);
    Page<Reservation> findByCustomerIdOrderByDateDesc(UUID customerId, Pageable pageable);

    List<Reservation> findByStatusIn(List<Status> statuses);
    Page<Reservation> findByStatusOrderByDateDesc(Status status, Pageable pageable);
    Page<Reservation> findBySalonServicesIdOrderByDateDesc(UUID salonServicesID, Pageable pageable);

    boolean existsBySalonServicesId(UUID salonServicesID);



}
