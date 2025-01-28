package it.epicode.hair_salon.entities.opening_hours;

import jakarta.persistence.*;
import lombok.Data;

import java.time.DayOfWeek;
import java.util.UUID;

@Data
@Entity
@Table(name = "opening_hours")
public class OpeningHours {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "day",unique = true)
    @Enumerated(EnumType.STRING)
    private DayOfWeek day;

    @Column(name = "opening_time")
    private long openingTime;

    @Column(name = "launch_break_start_time")
    private long launchBreakStartTime;

    @Column(name = "launch_break_end_time")
    private long launchBreakEndTime;

    @Column(name = "closing_time")
    private long closingTime;

    @Column(name = "closed")
    private boolean closed;

}
