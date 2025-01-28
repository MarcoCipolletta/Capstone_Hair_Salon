package it.epicode.hair_salon.entities.opening_hours;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.Optional;
import java.util.UUID;


public interface OpeningHoursRepository extends JpaRepository<OpeningHours, UUID> {
    Optional<OpeningHours> findByDay(DayOfWeek day);

}
