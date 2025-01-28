package it.epicode.hair_salon.booking_service.dto;

import it.epicode.hair_salon.entities.salon_service.SalonService;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class BookingCheckAvaibleTimeRequest {
    private LocalDate date;
    private List<SalonService> services;
}
