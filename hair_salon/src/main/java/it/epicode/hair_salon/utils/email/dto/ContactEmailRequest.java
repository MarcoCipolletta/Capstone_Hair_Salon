package it.epicode.hair_salon.utils.email.dto;

import lombok.Data;

@Data
public class ContactEmailRequest {
    private String name;
    private String email;
    private String message;
}
