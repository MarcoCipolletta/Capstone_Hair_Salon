package it.epicode.hair_salon.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmailForPasswordResetRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    String email;
}
