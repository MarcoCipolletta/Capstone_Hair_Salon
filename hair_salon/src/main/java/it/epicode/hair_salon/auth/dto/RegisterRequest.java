package it.epicode.hair_salon.auth.dto;

import it.epicode.hair_salon.entities.customer.dto.CustomerCreateRequest;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Username is required")
    private String username;
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;
    @NotBlank(message = "Password is required")
    private String password;


    private CustomerCreateRequest customer;

    private String avatar;

}
