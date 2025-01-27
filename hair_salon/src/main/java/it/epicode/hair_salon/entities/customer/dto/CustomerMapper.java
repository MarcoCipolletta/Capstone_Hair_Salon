package it.epicode.hair_salon.entities.customer.dto;

import it.epicode.hair_salon.entities.customer.Customer;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {
    private final ModelMapper modelMapper = new ModelMapper();

    public CustomerResponseForAuthResponse toCustomerResponseForAuthResponse(Customer customer) {
        return modelMapper.map(customer, CustomerResponseForAuthResponse.class);
    }
}
