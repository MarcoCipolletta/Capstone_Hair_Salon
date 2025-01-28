package it.epicode.hair_salon.entities.opening_hours.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.DayOfWeek;

@Data
public class OpeningHoursDTO {
    @NotNull
    private DayOfWeek day;
    private long openingTime;
    private long launchBreakStartTime;
    private long launchBreakEndTime;
    private long closingTime;
    private boolean closed;

}
