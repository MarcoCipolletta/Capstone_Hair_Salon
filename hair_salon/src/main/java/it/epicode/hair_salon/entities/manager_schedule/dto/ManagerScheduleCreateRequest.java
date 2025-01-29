package it.epicode.hair_salon.entities.manager_schedule.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ManagerScheduleCreateRequest {
    @NotNull(message = "La data di inizio e' richiesta")
    @FutureOrPresent(message = "La data di inizio deve essere nel futuro")
    private LocalDate startDate;
    private LocalDate endDate;
    private Long startTime;
    private Long endTime;
    private String reason;
}
