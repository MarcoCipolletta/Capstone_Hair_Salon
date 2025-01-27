package it.epicode.hair_salon.entities.customer;

import it.epicode.hair_salon.auth.AuthUser;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "customers")
@Data
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String surname;
    private LocalDate dateOfBirth;
    private String phoneNumber;
    @OneToOne
    private AuthUser authUser;
    // reservation
    // reviews
    // cart
    // orders
}
