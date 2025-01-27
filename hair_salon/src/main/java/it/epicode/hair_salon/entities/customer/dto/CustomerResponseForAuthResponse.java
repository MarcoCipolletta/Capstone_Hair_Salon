package it.epicode.hair_salon.entities.customer.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class CustomerResponseForAuthResponse {
    private UUID id;

    private String name;
    private String surname;
    private LocalDate dateOfBirth;
    private String phoneNumber;

}
