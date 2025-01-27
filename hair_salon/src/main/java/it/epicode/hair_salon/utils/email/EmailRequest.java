package it.epicode.hair_salon.utils.email;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmailRequest {

    @Email(message = "Invalid email address for REPLY TO field")
    private String replyTo;

    @Email(message = "Invalid email address for TO field")
    private String to;

    @NotBlank(message = "SUBJECT is required")
    private String subject;

    @NotBlank(message = "BODY is required")
    private String body;

}
