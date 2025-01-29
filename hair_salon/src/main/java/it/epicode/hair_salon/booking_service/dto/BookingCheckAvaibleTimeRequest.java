package it.epicode.hair_salon.booking_service.dto;

import it.epicode.hair_salon.entities.salon_service.SalonService;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class BookingCheckAvaibleTimeRequest {
    @FutureOrPresent(message = "La data deve essere nel futuro")
    @NotNull(message = "La data e' richiesta")
    private LocalDate date;
    @NotNull(message = "I servizi sono richiesti")
    private List<SalonService> services;
}
