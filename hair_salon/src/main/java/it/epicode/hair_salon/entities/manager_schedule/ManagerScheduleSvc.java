package it.epicode.hair_salon.entities.manager_schedule;

import it.epicode.hair_salon.entities.manager_schedule.dto.ManagerScheduleCreateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Validated
public class ManagerScheduleSvc {
    private final ManagerScheduleRepository managerScheduleRepo;

    public String create(@Valid ManagerScheduleCreateRequest managerScheduleCreateRequest) {
        // Controllare se ci sono prenotazioni in quei giorni e nel caso annullare prenotazione e mandare email di scuse al cliente
        // Modificare il ritorno togliendo il .toString()

        //Controllo se ha un range di date o un singolo giorno
        if (managerScheduleCreateRequest.getEndDate() == null) {
            // Se è un singolo giorno controllo se ha un range di orari
            if ((managerScheduleCreateRequest.getStartTime() == null && managerScheduleCreateRequest.getEndTime() == null) ||
                    (managerScheduleCreateRequest.getStartTime() == 0 && managerScheduleCreateRequest.getEndTime() == 0)) {
                // Se non ha un range di orari lo salvo come ferie e blocco tutto il giorno
                if(managerScheduleRepo.existsHolidayByDate(managerScheduleCreateRequest.getStartDate())) throw new IllegalArgumentException("Hai già impostato un giorno di ferie per quella data.");
                ManagerSchedule managerSchedule = new ManagerSchedule();
                managerSchedule.setDate(managerScheduleCreateRequest.getStartDate());
                managerSchedule.setTypeSchedule(TypeSchedule.HOLIDAY);
                managerSchedule.setReason(managerScheduleCreateRequest.getReason());

                return managerScheduleRepo.save(managerSchedule).toString();
            } else if (managerScheduleCreateRequest.getEndTime() != null &&
                    managerScheduleCreateRequest.getStartTime() != 0 &&
                    managerScheduleCreateRequest.getEndTime() != 0) {
                if (managerScheduleCreateRequest.getStartTime() > managerScheduleCreateRequest.getEndTime()) throw new IllegalArgumentException("L'ora di fine deve essere successiva all'ora di inizio");
                if (managerScheduleRepo.existsOverlappingSchedules(
                        managerScheduleCreateRequest.getStartDate(),
                        managerScheduleCreateRequest.getStartTime(),
                        managerScheduleCreateRequest.getEndTime()
                        )) throw new IllegalArgumentException("Hai già bloccato quell'orario");
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
            if (managerScheduleCreateRequest.getEndDate().isBefore(managerScheduleCreateRequest.getStartDate()) ) throw new IllegalArgumentException("La data di fine deve essere successiva alla data di inizio");
            long closedDay = ChronoUnit.DAYS.between(
                    managerScheduleCreateRequest.getStartDate(),
                    managerScheduleCreateRequest.getEndDate()
            ) + 1;

            List<ManagerSchedule> closedDays = new ArrayList<>();
            for (int i = 0; i < closedDay; i++ ){
                LocalDate date = managerScheduleCreateRequest.getStartDate().plusDays(i);
                if (managerScheduleRepo.existsHolidayByDate(date)) {
                ManagerSchedule alreadyExist = managerScheduleRepo.findByDate(date);
                managerScheduleRepo.delete(alreadyExist);
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

    public List<ManagerSchedule> findAll(){
        return managerScheduleRepo.findAll();
    }
}
