package it.epicode.hair_salon.auth.dto;

import it.epicode.hair_salon.auth.AuthUser;
import it.epicode.hair_salon.entities.customer.dto.CustomerMapper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {
    private final ModelMapper modelMapper = new ModelMapper();

    @Autowired
    private CustomerMapper customerMapper;

    public AuthUserResponse toAuthUserResponse(AuthUser authUser) {
        return modelMapper.map(authUser, AuthUserResponse.class);
    }


}
