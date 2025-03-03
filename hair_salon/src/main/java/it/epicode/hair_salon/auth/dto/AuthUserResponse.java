package it.epicode.hair_salon.auth.dto;


import it.epicode.hair_salon.auth.Role;
import it.epicode.hair_salon.entities.customer.dto.CustomerResponseForAuthResponse;
import lombok.Data;

import java.util.UUID;

@Data
public class AuthUserResponse {
    private UUID id;
    private String username;

    private String email;

    private String avatar;

    private Role role;

    private CustomerResponseForAuthResponse customer;

}
