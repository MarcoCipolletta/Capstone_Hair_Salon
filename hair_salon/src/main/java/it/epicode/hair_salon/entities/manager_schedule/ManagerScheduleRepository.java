package it.epicode.hair_salon.entities.manager_schedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.UUID;

public interface ManagerScheduleRepository extends JpaRepository<ManagerSchedule, UUID> {

    // Controlla se c'è già un giorno di ferie in un determinato giorno
    @Query("SELECT CASE WHEN COUNT(ms) > 0 THEN TRUE ELSE FALSE END " +
            "FROM ManagerSchedule ms " +
            "WHERE ms.date = :date AND ms.typeSchedule = 'HOLIDAY'")
    boolean existsHolidayByDate(@Param("date") LocalDate date);

    // Controlla se ci sono orari sovrapposti in un determinato giorno
    @Query("SELECT CASE WHEN COUNT(ms) > 0 THEN TRUE ELSE FALSE END " +
            "FROM ManagerSchedule ms " +
            "WHERE ms.date = :date AND ms.typeSchedule = 'BLOCKED' " +
            "AND (ms.startTime < :endTime AND ms.endTime > :startTime)")
    boolean existsOverlappingSchedules(@Param("date") LocalDate date,
                                       @Param("startTime") Long startTime,
                                       @Param("endTime") Long endTime);

    // Trova la schedule per una data specifica
    ManagerSchedule findByDate(LocalDate date);
}
