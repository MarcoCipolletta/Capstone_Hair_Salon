package it.epicode.hair_salon.entities.customer.dto;

import it.epicode.hair_salon.auth.AuthUser;
import it.epicode.hair_salon.entities.customer.Customer;
import it.epicode.hair_salon.entities.reservation.dto.ReservationMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {
    private final ModelMapper modelMapper = new ModelMapper();
    @Autowired
    @Lazy
    private ReservationMapper reservationMapper;

    public CustomerResponseForAuthResponse toCustomerResponseForAuthResponse(Customer customer) {
        return modelMapper.map(customer, CustomerResponseForAuthResponse.class);
    }

    public CustomerResponse toCustomerResponse(Customer customer) {
        AuthUser authUser = customer.getAuthUser();
        CustomerResponse customerResponse = modelMapper.map(customer, CustomerResponse.class);
        customerResponse.setEmail(authUser.getEmail());
        customerResponse.setAvatar(authUser.getAvatar());
        return customerResponse;
    }

    public CustomerResponseForAdmin toCustomerResponseForAdmin(Customer customer) {
        CustomerResponseForAdmin customerMapped = modelMapper.map(customer, CustomerResponseForAdmin.class);
        customerMapped.setReservations(reservationMapper.toReservationResponseForCustomerList(customer.getReservations()));
        customerMapped.setEmail(customer.getAuthUser().getEmail());
        return customerMapped;
    }


}
