package it.epicode.hair_salon.entities.reservation.dto;

import it.epicode.hair_salon.entities.customer.Customer;
import it.epicode.hair_salon.entities.salon_service.SalonService;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class ReservationCreateRequest {
    private LocalDate date;
    private Long startTime;
    private Long endTime;
    private UUID customerId;
//    private UUID operatorId;
    private List<SalonService> salonServices;

}
