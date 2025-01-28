package it.epicode.hair_salon.entities.salon_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SalonServiceCreateRequest {

    @NotBlank(message = "Il nome è richiesto")
    private String name;
    private String description;
    @NotNull(message = "Il prezzo è richiesto")
    private double price;
    @NotNull(message = "La durata è richiesta")
    private long duration;
}
