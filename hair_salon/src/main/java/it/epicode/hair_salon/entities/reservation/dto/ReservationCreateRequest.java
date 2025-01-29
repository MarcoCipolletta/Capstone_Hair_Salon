package it.epicode.hair_salon.entities.reservation.dto;


import it.epicode.hair_salon.entities.salon_service.SalonService;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;


@Data
public class ReservationCreateRequest {
    @NotNull(message = "La data della prenotazione é richiesta")
    @FutureOrPresent(message = "La data della prenotazione deve essere nel futuro")
    private LocalDate date;
    @NotNull(message = "L'orario di inizio della prenotazione é richiesto")
    @Positive(message = "L'orario di inizio della prenotazione deve essere positivo")
    private Long startTime;
    @NotNull(message = "L'orario di fine della prenotazione é richiesto")
    @Positive(message = "L'orario di fine della prenotazione deve essere positivo")
    private Long endTime;
    @NotEmpty(message = "I servizi sono richiesti")
    private List<SalonService> salonServices;

}
