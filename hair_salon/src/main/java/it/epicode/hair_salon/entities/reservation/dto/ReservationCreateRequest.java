package it.epicode.hair_salon.entities.reservation.dto;

import it.epicode.hair_salon.entities.customer.Customer;
import it.epicode.hair_salon.entities.salon_service.SalonService;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class ReservationCreateRequest {
    @NotNull(message = "La data della prenotazione é richiesta")
    @FutureOrPresent(message = "La data della prenotazione deve essere nel futuro")
    private LocalDate date;
    @NotNull(message = "L'orario di inizio della prenotazione é richiesto")
    @PositiveOrZero(message = "L'orario di inizio della prenotazione deve essere positivo")
    private Long startTime;
    @NotNull(message = "L'orario di fine della prenotazione é richiesto")
    @PositiveOrZero(message = "L'orario di fine della prenotazione deve essere positivo")
    private Long endTime;
    @NotNull(message = "Il cliente é richiesto")
    private UUID customerId;
    @NotEmpty(message = "I servizi sono richiesti")
    private List<SalonService> salonServices;

}
