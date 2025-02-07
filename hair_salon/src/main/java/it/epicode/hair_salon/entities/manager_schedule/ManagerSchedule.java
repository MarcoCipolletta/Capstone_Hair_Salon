package it.epicode.hair_salon.entities.manager_schedule;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Entity
@Table(name = "menager_schedule")
public class ManagerSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private LocalDate date;
    private Long startTime;
    private Long endTime;

    @Enumerated(EnumType.STRING)
    private TypeSchedule typeSchedule;


    private String reason;

}
