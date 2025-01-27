package it.epicode.hair_salon.auth.dto;

import lombok.Data;

@Data
public class LoginRequest {

    private String identifier;
    private String password;
}
