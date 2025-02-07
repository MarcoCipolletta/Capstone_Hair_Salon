package it.epicode.hair_salon.entities.manager_schedule;

import it.epicode.hair_salon.entities.manager_schedule.dto.ManagerScheduleCreateRequest;
import it.epicode.hair_salon.entities.reservation.Reservation;
import it.epicode.hair_salon.entities.reservation.ReservationRepository;
import it.epicode.hair_salon.entities.reservation.Status;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Validated
public class ManagerScheduleSvc {
    private final ManagerScheduleRepository managerScheduleRepo;
    private final ReservationRepository reservationRepo;

    @Transactional
    public String create(@Valid ManagerScheduleCreateRequest managerScheduleCreateRequest) {
        // Controllare se ci sono prenotazioni in quei giorni e nel caso annullare prenotazione e mandare email di scuse al cliente
        // Modificare il ritorno togliendo il .toString()

        //Controllo se ha un range di date o un singolo giorno
        if (managerScheduleCreateRequest.getEndDate() == null || managerScheduleCreateRequest.getStartDate().equals(managerScheduleCreateRequest.getEndDate())) {
            // Se è un singolo giorno controllo se ha un range di orari
            if ((managerScheduleCreateRequest.getStartTime() == null && managerScheduleCreateRequest.getEndTime() == null) ||
                    (managerScheduleCreateRequest.getStartTime() == 0 && managerScheduleCreateRequest.getEndTime() == 0)) {
                // Se non ha un range di orari lo salvo come ferie e blocco tutto il giorno
                if (existsHolidayByDate(managerScheduleCreateRequest.getStartDate())) {
                    throw new IllegalArgumentException("Hai già impostato un giorno di ferie per quella data.");
                }
                if(existsBlockedByDate(managerScheduleCreateRequest.getStartDate())){
                    List<ManagerSchedule> alreadyExist = managerScheduleRepo.findByDate(managerScheduleCreateRequest.getStartDate());
                    alreadyExist.forEach(managerScheduleRepo::delete);
                }

                setCancelledByDate(managerScheduleCreateRequest.getStartDate(), "Ci dispiace per il disagio, abbiamo dovuto annullare la prenotazione: ");

                ManagerSchedule managerSchedule = new ManagerSchedule();
                managerSchedule.setDate(managerScheduleCreateRequest.getStartDate());
                managerSchedule.setTypeSchedule(TypeSchedule.HOLIDAY);
                managerSchedule.setReason(managerScheduleCreateRequest.getReason());


                return managerScheduleRepo.save(managerSchedule).toString();
            } else if (managerScheduleCreateRequest.getEndTime() != null &&
                    managerScheduleCreateRequest.getStartTime() != 0 &&
                    managerScheduleCreateRequest.getEndTime() != 0) {
                if (managerScheduleRepo.existsHolidayByDate(managerScheduleCreateRequest.getStartDate()))
                    throw new IllegalArgumentException("Hai già impostato un giorno di ferie per quella data.");
                if (managerScheduleCreateRequest.getStartTime() > managerScheduleCreateRequest.getEndTime())
                    throw new IllegalArgumentException("L'ora di fine deve essere successiva all'ora di inizio");

                if (managerScheduleRepo.existsOverlappingSchedules(
                        managerScheduleCreateRequest.getStartDate(),
                        managerScheduleCreateRequest.getStartTime(),
                        managerScheduleCreateRequest.getEndTime()
                )) throw new IllegalArgumentException("Hai già bloccato quell'orario");

                // Da modificare, e levare solo gli orari sovrapposti
//                setCancelledByDate(managerScheduleCreateRequest.getStartDate(), "Ci dispiace per il disagio, abbiamo dovuto annullare la prenotazione: ");

                // Se ha un range di orari validi lo salvo come blocco
                ManagerSchedule managerSchedule = new ManagerSchedule();
                managerSchedule.setDate(managerScheduleCreateRequest.getStartDate());
                managerSchedule.setStartTime(managerScheduleCreateRequest.getStartTime());
                managerSchedule.setEndTime(managerScheduleCreateRequest.getEndTime());
                managerSchedule.setTypeSchedule(TypeSchedule.BLOCKED);
                managerSchedule.setReason(managerScheduleCreateRequest.getReason());

                return managerScheduleRepo.save(managerSchedule).toString();
            }
        } else {
            if (managerScheduleCreateRequest.getEndDate().isBefore(managerScheduleCreateRequest.getStartDate()))
                throw new IllegalArgumentException("La data di fine deve essere successiva alla data di inizio");
            long closedDay = ChronoUnit.DAYS.between(
                    managerScheduleCreateRequest.getStartDate(),
                    managerScheduleCreateRequest.getEndDate()
            ) + 1;

            List<ManagerSchedule> closedDays = new ArrayList<>();
            for (int i = 0; i < closedDay; i++) {

                setCancelledByDate(managerScheduleCreateRequest.getStartDate(), "Ci dispiace per il disagio, abbiamo dovuto annullare la prenotazione: ");

                LocalDate date = managerScheduleCreateRequest.getStartDate().plusDays(i);
                if (managerScheduleRepo.existsHolidayByDate(date)) {
                    List<ManagerSchedule> alreadyExist = managerScheduleRepo.findByDate(date);
                    alreadyExist.forEach(managerScheduleRepo::delete);
                }
                ManagerSchedule managerSchedule = new ManagerSchedule();
                managerSchedule.setDate(date);
                managerSchedule.setTypeSchedule(TypeSchedule.HOLIDAY);
                managerSchedule.setReason(managerScheduleCreateRequest.getReason());
                closedDays.add(managerSchedule);
            }
            return managerScheduleRepo.saveAll(closedDays).toString();
        }


        return "";
    }

    public List<ManagerSchedule> findAll() {
        return managerScheduleRepo.findAll();
    }

    public boolean existsHolidayByDate(LocalDate date) {
        return managerScheduleRepo.existsHolidayByDate(date);
    }

    public boolean existsBlockedByDate(LocalDate date) {
        return managerScheduleRepo.existsBlockedByDate(date);
    }

    public boolean existsOverlappingSchedules(LocalDate date, Long startTime, Long endTime) {
        return managerScheduleRepo.existsOverlappingSchedules(date, startTime, endTime);
    }

    public List<ManagerSchedule> findAllByDate(LocalDate date) {
        return managerScheduleRepo.findByDate(date);
    }

    @Transactional
    public void setCancelledByDate(LocalDate date,String motivation) {
        List<Reservation> reservations = reservationRepo.findByDate(date);
        for (Reservation reservation : reservations) {
            reservation.setStatus(Status.CANCELLED);
        //Inviare email di eliminazione
            reservationRepo.save(reservation);
        }
    }
    public ManagerSchedule findById(UUID id) {
        return managerScheduleRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Giorno di chiusura non trovato"));
    }

    public String delete(UUID id) {
        ManagerSchedule managerSchedule = findById(id);
        managerScheduleRepo.delete(managerSchedule);
        return "Giorno di chiusura cancellato con successo";
    }
}
