package it.epicode.hair_salon.entities.customer.dto;

import java.time.LocalDate;
import java.util.UUID;

public class CustomerResponse {
    private UUID id;

    private String name;
    private String surname;
    private LocalDate dateOfBirth;
    private String phoneNumber;
}
