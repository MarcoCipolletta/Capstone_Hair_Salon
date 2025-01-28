package it.epicode.hair_salon.entities.salon_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class SalonServiceResponse {

    @NotNull(message = "L'id é richiesto")
    private UUID id;
    @NotBlank(message = "Il nome é richiesto")
    private String name;
    @NotBlank(message = "La descrizione é richiesta")
    private String description;
    @NotNull(message = "Il prezzo é richiesto")
    private double price;
    @NotNull(message = "La durata é richiesta")
    private long duration;
}
