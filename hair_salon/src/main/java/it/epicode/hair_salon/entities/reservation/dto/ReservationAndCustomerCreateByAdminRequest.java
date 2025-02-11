package it.epicode.hair_salon.entities.reservation.dto;


import it.epicode.hair_salon.auth.dto.CustomerCreateRequestForAdmin;
import it.epicode.hair_salon.entities.salon_service.SalonService;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;


@Data
public class ReservationAndCustomerCreateByAdminRequest {
 private CustomerCreateRequestForAdmin customer;
 private ReservationCreateRequest reservation;

}
