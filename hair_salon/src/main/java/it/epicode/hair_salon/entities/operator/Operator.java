package it.epicode.hair_salon.entities.operator;

import it.epicode.hair_salon.entities.reservation.Reservation;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "operators")
public class Operator {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @OneToMany(mappedBy = "operator", cascade = CascadeType.ALL)
    private List<Reservation> reservations = new ArrayList<>();


}
