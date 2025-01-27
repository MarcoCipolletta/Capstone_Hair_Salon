package it.epicode.hair_salon.entities.customer;

import it.epicode.hair_salon.auth.AuthUser;
import it.epicode.hair_salon.entities.cart.Cart;
import it.epicode.hair_salon.entities.order.Order;
import it.epicode.hair_salon.entities.reservation.Reservation;
import it.epicode.hair_salon.entities.review.Review;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
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
    @Column(unique = true)
    private String phoneNumber;
    @OneToOne
    private AuthUser authUser;
    @OneToMany
    private List<Reservation> reservations;
    @OneToMany
    private List<Review> reviews;
    @OneToOne
    private Cart cart;
    @OneToMany
    private List<Order> orders;

}
