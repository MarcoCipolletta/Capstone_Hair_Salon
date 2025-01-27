package it.epicode.hair_salon.entities.customer.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class CustomerResponse {
    private UUID id;

    private String name;
    private String surname;
    private LocalDate dateOfBirth;
    private String phoneNumber;
    private String email;
    private String Avatar;
}
