package it.epicode.hair_salon.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CustomerCreateRequestForAdmin {

    @NotBlank(message = "Il nome è richiesto")
    private String name;
    @NotBlank(message = "Il cognome é richiesto")
    private String surname;
    @NotNull(message = "La data di nascita é richiesta")
    @Past(message = "La data di nascita deve essere nel passato")
    private LocalDate dateOfBirth;
    @NotBlank(message = "Il numero di telefono é richiesto")
    private String phoneNumber;
    @NotBlank(message = "L'email é richiesta")
    private String email;
}
