package it.epicode.hair_salon.entities.salon_service;

import it.epicode.hair_salon.entities.reservation.Reservation;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "salon_services")
public class SalonService {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true)
    private String name;
    private String description;
    private double price;
    private Long duration;
    private boolean hidden;
    
//    @ManyToMany
//    private List<Reservation> reservations = new ArrayList<>();


}
