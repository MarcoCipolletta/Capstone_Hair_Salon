package it.epicode.hair_salon.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PasswordResetRequest {
    @NotBlank(message = "Email is required")
    String password;
    @NotBlank(message = "Token is required")
    String token;
}
