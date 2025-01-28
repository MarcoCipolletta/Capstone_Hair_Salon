package it.epicode.hair_salon.entities.reservation;

import it.epicode.hair_salon.entities.customer.Customer;
import it.epicode.hair_salon.entities.operator.Operator;
import it.epicode.hair_salon.entities.salon_service.SalonService;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private LocalDate date;
    private Long startTime;
    private Long endTime;
    @Enumerated(EnumType.STRING)
    private Status status;
    @ManyToMany
    private List<SalonService> salonServices;
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
    @ManyToOne
    @JoinColumn(name = "operator_id")
    private Operator operator;


}
