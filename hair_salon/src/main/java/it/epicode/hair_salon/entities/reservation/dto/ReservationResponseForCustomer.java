package it.epicode.hair_salon.entities.reservation.dto;

import it.epicode.hair_salon.entities.customer.dto.CustomerResponse;
import it.epicode.hair_salon.entities.reservation.Status;
import it.epicode.hair_salon.entities.salon_service.SalonService;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class ReservationResponseForCustomer {
    private UUID id;

    private LocalDate date;
    private Long startTime;
    private Long endTime;
    private Status status;
    private List<SalonService> salonServices;
    private UUID operatorId;


}
