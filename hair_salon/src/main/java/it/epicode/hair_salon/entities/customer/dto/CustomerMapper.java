package it.epicode.hair_salon.entities.customer.dto;

import it.epicode.hair_salon.auth.AuthUser;
import it.epicode.hair_salon.entities.customer.Customer;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {
    private final ModelMapper modelMapper = new ModelMapper();

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
}
