package it.epicode.hair_salon.auth.dto;

import lombok.Data;

@Data
public class AuthUpdateResponse {
    private AuthResponse authResponse;
    private AuthUserResponse authUserResponse;
}
