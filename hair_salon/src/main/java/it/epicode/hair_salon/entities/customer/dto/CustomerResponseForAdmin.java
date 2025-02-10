package it.epicode.hair_salon.entities.customer.dto;

import it.epicode.hair_salon.entities.reservation.dto.ReservationResponseForCustomer;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class CustomerResponseForAdmin {
    private UUID id;

    private String name;
    private String surname;
    private LocalDate dateOfBirth;
    private String phoneNumber;
    private String email;
    private List<ReservationResponseForCustomer> reservations;

}
