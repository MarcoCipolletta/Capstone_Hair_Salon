package it.epicode.hair_salon.entities.reservation.dto;

import it.epicode.hair_salon.entities.customer.dto.CustomerMapper;
import it.epicode.hair_salon.entities.reservation.Reservation;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ReservationMapper {
    private final ModelMapper modelMapper = new ModelMapper();
    @Autowired
    @Lazy
    private CustomerMapper customerMapper;


    public ReservationResponse toReservationResponse(Reservation reservation) {
        ReservationResponse response =modelMapper.map(reservation, ReservationResponse.class);
        response.setCustomer(customerMapper.toCustomerResponse(reservation.getCustomer()));
        response.setOperatorId(reservation.getOperator().getId());
        return response;
    }

    public List<ReservationResponse> toReservationResponseList(List<Reservation> reservations) {
        return reservations.stream().map(this::toReservationResponse).toList();
    }

    public ReservationResponseForCustomer toReservationResponseForCustomer(Reservation reservation) {
        ReservationResponseForCustomer response =modelMapper.map(reservation, ReservationResponseForCustomer.class);
        response.setOperatorId(reservation.getOperator().getId());
        return response;
    }

    public List<ReservationResponseForCustomer> toReservationResponseForCustomerList(List<Reservation> reservations) {
        return reservations.stream().map(this::toReservationResponseForCustomer).toList();
    }
}
